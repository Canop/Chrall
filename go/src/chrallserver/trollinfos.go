package main

import (
	"bufio"
	"chrall"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"
)

var mutexLectures = new(sync.Mutex)

type raceTroll uint8

const (
	race_inconnue = raceTroll(iota)
	darkling      = raceTroll(iota)
	durakuir      = raceTroll(iota)
	kastar        = raceTroll(iota)
	skrim         = raceTroll(iota)
	tomawak       = raceTroll(iota)
)

var RACE_NAMES = [6]string{"inconnu", "darkling", "durakuir", "kastar", "skrim", "tomawak"}
var RACE_SHORT_NAMES = [6]string{"?", "Da", "D", "K", "S", "T"}

func (r raceTroll) string() string {
	return RACE_NAMES[int(r)]
}

func race(s string) raceTroll {
	s = strings.ToLower(s)
	for i, name := range RACE_NAMES {
		if s == name {
			return raceTroll(i)
		}
	}
	return race_inconnue
}

// statistiques concernant un troll
type TrollInfos struct {
	Num                     int
	NbKillsTrolls           int
	NbKillsMonstres         int
	ClassementKills         int
	ClassementKillsTrolls   int
	ClassementKillsMonstres int
	ClassifChrall           string
	Nom                     string
	Race                    raceTroll
	Niveau                  int
	IdGuilde                int
}

type GuildInfos struct {
	Nom string
}

type DiplomaticRelation struct {
	FirstIsGuild  bool
	FirstId       int
	SecondIsGuild bool
	SecondId      int
	foe           bool
	Text          string
}

type KillometreExtract struct {
	Trolls             []*TrollInfos
	StartIndex         int
	SearchedTrollIndex int
	Error              string
}

//===========================================================================================================================================

// l'objet qui contient les stats
// A priori ce sera toujours un singleton.
type TksManager struct {
	cheminDonnées         string
	Trolls                []*TrollInfos // les infos des trolls, indexées par id de troll (certes, avec un table de hash spécifique ce ne serait pas lent et le tableau serait deux fois plus court mais... la flemme...)
	lastTrollFileCheck    int64         // la date, en secondes, à laquelle on a vérifié si le fichier csv source avait changé pour la dernière fois
	lastTrollFileRead     int64         // la date, en secondes, à laquelle on a lu le fichier csv source pour la dernière fois
	Guildes               []*GuildInfos
	lastGuildFileCheck    int64
	lastGuildFileRead     int64
	Diplo                 *DiploGraph
	NbTrolls              int
	lastDiploFileCheck    int64 // timestamp unix (en attendant de lire la doc du nouveau package time)
	lastDiploFileRead     int64 // timestamp unix
	TrollsByKills         []*TrollInfos
	TrollsByKillsMonstres []*TrollInfos
	TrollsByKillsTrolls   []*TrollInfos
	AtkByKillsTrolls      []*TrollInfos
}

func (m *TksManager) GetKillometreExtract(typeExtract string, startIndex int, pageSize int, searched string) (ke *KillometreExtract) {
	// comme il n'y a pas la moindre structure d'index, les recherches, en particulier sur le nom, sont forcément lentes
	ke = new(KillometreExtract)
	ke.SearchedTrollIndex = -1
	m.checkTrollInfosLoaded()
	var source []*TrollInfos
	switch typeExtract {
	case "TrollsByKills":
		source = m.TrollsByKills
	case "TrollsByKillsMonstres":
		source = m.TrollsByKillsMonstres
	case "TrollsByKillsTrolls":
		source = m.TrollsByKillsTrolls
	case "AtkByKillsTrolls":
		source = m.AtkByKillsTrolls
	default:
		ke.Error = "Erreur GetKillometreExtract : type non reconnu : " + typeExtract
		return
	}
	searchedNum, _ := strconv.Atoi(searched)
	if searchedNum > 0 {
		foundIndex := -1
		for i, t := range source {
			if t.Num == searchedNum {
				foundIndex = i
				break
			}
		}
		pageNum := foundIndex / pageSize
		startIndex = pageNum * pageSize
		ke.SearchedTrollIndex = foundIndex - startIndex
	} else if searched != "" {
		upperSearched := strings.ToUpper(searched)
		foundIndex := -1
		for i, t := range source {
			if strings.Index(strings.ToUpper(t.Nom), upperSearched) >= 0 {
				foundIndex = i
				break
			}
		}
		pageNum := foundIndex / pageSize
		startIndex = pageNum * pageSize
		ke.SearchedTrollIndex = foundIndex - startIndex
	} else {
		if startIndex < 0 || startIndex > len(source) {
			ke.Error = fmt.Sprintf("Erreur GetKillometreExtract : index invalide : %d\n", startIndex)
			return
		}
	}
	if pageSize < 0 || pageSize > 100 {
		ke.Error = fmt.Sprintf("Erreur GetKillometreExtract : pageSize invalide : %d\n", pageSize)
		return
	} else if pageSize == 0 {
		pageSize = 20
	}
	//fmt.Printf("startIndex=%d  pageSize=%d\n", startIndex, pageSize)
	ke.Trolls = source[startIndex : pageSize+startIndex]
	ke.StartIndex = startIndex
	return
}

func (m *TksManager) ReadDiploCsvFilesIfNew() error {
	standardDiploFilename := filepath.Join(m.cheminDonnées, "Public_Diplomatie.txt")
	trollDiploFilename := filepath.Join(m.cheminDonnées, "Diplodotrolls.csv")
	mustRead := false
	if m.lastDiploFileRead > 0 {
		fi, err := os.Stat(standardDiploFilename)
		if err != nil {
			return err
		}
		if !!fi.IsDir() {
			return errors.New("TksManager : Fichier " + standardDiploFilename + " introuvable ou anormal")
		}
		mustRead = fi.ModTime().Unix() > m.lastDiploFileRead*1000000000
	}
	if !mustRead {
		fi, err := os.Stat(trollDiploFilename)
		if err != nil {
			return err
		}
		if !!fi.IsDir() {
			return errors.New("TksManager : Fichier " + trollDiploFilename + " introuvable ou anormal")
		}
		mustRead = fi.ModTime().Unix() > m.lastDiploFileRead*1000000000
		fmt.Printf("mustRead trollDiploFile = %v \n", mustRead)
	}
	if !mustRead {
		return nil
	}

	g := NewDiploGraph()
	f, err := os.Open(standardDiploFilename)
	if err != nil {
		return err
	}
	defer f.Close()
	r := bufio.NewReader(f)
	err = g.ReadDiploGraph(r, true, false)
	if err != nil {
		return err
	}

	f, err = os.Open(trollDiploFilename)
	if err != nil {
		return err
	}
	defer f.Close()
	r = bufio.NewReader(f)
	err = g.ReadDiploGraph(r, false, true)
	if err != nil {
		return err
	}

	m.lastDiploFileRead = time.Now().Unix()
	fmt.Println("TksManager : Fichiers de diplo lus")
	m.Diplo = g
	return nil
}

func (m *TksManager) ReadGuildCsvFileIfNew() error {
	mutexLectures.Lock()
	defer mutexLectures.Unlock()

	filename := filepath.Join(m.cheminDonnées, "Public_Guildes.txt")
	if m.lastGuildFileRead > 0 {
		fi, err := os.Stat(filename)
		if err != nil {
			return err
		}
		if !!fi.IsDir() {
			return errors.New("TksManager : Fichier " + filename + " introuvable ou anormal")
		}
		if fi.ModTime().Unix() < m.lastGuildFileRead*1000000000 {
			return nil
		}
	}

	f, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer f.Close()
	r := bufio.NewReader(f)
	line, err := r.ReadString('\n')
	for err == nil {
		tokens := strings.SplitN(line, ";", 4)
		if len(tokens) < 2 {
			fmt.Println("Ligne invalide")
		} else {
			gi := new(GuildInfos)
			id, _ := strconv.Atoi(tokens[0])
			gi.Nom = chrall.Iso88591ToUtf8(tokens[1])
			if id >= len(m.Guildes) {
				if id >= cap(m.Guildes) {
					newSlice := make([]*GuildInfos, ((id+1)*5/4)+100)
					copy(newSlice, m.Guildes)
					m.Guildes = newSlice
				}
				m.Guildes = m.Guildes[0 : id+1]
			}
			m.Guildes[id] = gi
		}
		line, err = r.ReadString('\n')
	}
	if err != io.EOF {
		fmt.Println("Erreur au parsage :")
		fmt.Println(err)
		return err
	}
	m.lastTrollFileRead = time.Now().Unix()
	fmt.Println("TksManager : Fichier des guildes lu")
	return nil
}

// Lit un fichier csv contenant, triés par nombre de kills de trolls, une ligne pour
//  chaque troll connu (voir troll.go).
// Calcule les tableaux triés en fin de chargement
func (m *TksManager) ReadTrollCsvFileIfNew() error {
	mutexLectures.Lock()
	defer mutexLectures.Unlock()

	filename := filepath.Join(m.cheminDonnées, "trollstats.csv")
	if m.lastTrollFileRead > 0 {
		fi, err := os.Stat(filename)
		if err != nil {
			return err
		}
		if !!fi.IsDir() {
			return errors.New("TksManager : Fichier de stats " + filename + " introuvable ou anormal")
		}
		if fi.ModTime().Unix() < m.lastTrollFileRead*1000000000 { // conversion secondes - nanosecondes...
			//fmt.Println("TksManager : le fichier n'a pas changé")
			return nil
		}
	}

	f, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer f.Close()
	m.NbTrolls = 0
	r := bufio.NewReader(f)
	line, err := r.ReadString('\n')
	// notons qu'on ne supprime pas les anciennes stats avant, on remplace directement
	// Et au final on ne devrait pas souvent redimensionner la table
	for err == nil {
		tokens := strings.SplitN(line, ";", 13)
		if len(tokens) < 13 {
			fmt.Println("Ligne invalide")
		} else {
			tks := new(TrollInfos)
			trollId, _ := strconv.Atoi(tokens[0])
			tks.NbKillsTrolls = chrall.AtoId(tokens[1])
			tks.NbKillsMonstres = chrall.AtoId(tokens[2])
			tks.ClassementKillsTrolls = chrall.AtoId(tokens[3])
			tks.ClassementKillsMonstres = chrall.AtoId(tokens[4])
			tks.ClassifChrall = strings.Trim(tokens[8], " \n")
			tks.Nom = tokens[9]
			tks.Race = race(tokens[10])
			tks.Niveau = chrall.AtoId(tokens[11])
			tks.IdGuilde = chrall.AtoId(strings.Trim(tokens[12], " \n"))
			tks.Num = trollId
			if trollId >= len(m.Trolls) {
				if trollId >= cap(m.Trolls) {
					newSlice := make([]*TrollInfos, ((trollId+1)*5/4)+100)
					copy(newSlice, m.Trolls)
					m.Trolls = newSlice
				}
				m.Trolls = m.Trolls[0 : trollId+1]
			}
			m.Trolls[trollId] = tks
			m.NbTrolls++
		}
		line, err = r.ReadString('\n')
	}
	if err != io.EOF {
		fmt.Println("Erreur au parsage :")
		fmt.Println(err)
		return err
	}
	m.lastTrollFileRead = time.Now().Unix()
	fmt.Println("TksManager : Fichier des trolls lu")
	m.TrollsByKills = SortTrollInfos(m.Trolls, m.NbTrolls, func(troll *TrollInfos) int { return troll.NbKillsTrolls + troll.NbKillsMonstres })
	// on remplit le classement par kill, que l'on ne connait pas avant
	classement := -1
	nbKills := int(0)
	for i, t := range m.TrollsByKills {
		if t == nil {
			break
		}
		if t.NbKillsTrolls+t.NbKillsMonstres != nbKills {
			classement = i + 1
			nbKills = t.NbKillsTrolls + t.NbKillsMonstres
		}
		t.ClassementKills = int(classement)
	}
	//~ fmt.Println("\nTrollsByKills :")
	//~ for i, t := range(m.TrollsByKills) {
	//~ fmt.Printf(" #%d %s NbKillsTrolls=%d NbKillsMonstres=%d tag : %s \n", i+1, t.Nom, t.NbKillsTrolls, t.NbKillsMonstres, t.ClassifChrall)
	//~ if i==40 {
	//~ break
	//~ }
	//~ }
	m.TrollsByKillsMonstres = SortTrollInfos(m.Trolls, m.NbTrolls, func(troll *TrollInfos) int { return troll.NbKillsMonstres })
	m.TrollsByKillsTrolls = SortTrollInfos(m.Trolls, m.NbTrolls, func(troll *TrollInfos) int { return troll.NbKillsTrolls })
	m.AtkByKillsTrolls = SortTrollInfos(m.Trolls, m.NbTrolls, func(troll *TrollInfos) int {
		if strings.Index(troll.ClassifChrall, "ATK") >= 0 {
			return troll.NbKillsTrolls
		}
		return 0
	})
	return nil
}

func (m *TksManager) GetNomRaceNiveauTroll(trollId int) (string, string, int) {
	ti := m.getTrollInfos(trollId)
	if ti == nil {
		return "Troll Inconnu", "", 0
	}
	return ti.Nom, ti.Race.string(), ti.Niveau
}

func (m *TksManager) checkTrollInfosLoaded() {
	now := time.Now().Unix()
	if now-m.lastTrollFileCheck > 300 {
		m.lastTrollFileCheck = now
		err := m.ReadTrollCsvFileIfNew()
		if err != nil {
			fmt.Println("Unable to load kill stats file :")
			fmt.Println(err)
		}
	}
}

func (m *TksManager) getTrollInfos(trollId int) *TrollInfos {
	if trollId <= 0 {
		return nil
	}
	m.checkTrollInfosLoaded()
	if trollId < len(m.Trolls) {
		return m.Trolls[trollId]
	}
	return nil
}

func (m *TksManager) getGuildInfos(id int) *GuildInfos {
	if id <= 0 {
		return nil
	}
	now := time.Now().Unix()
	if now-m.lastGuildFileCheck > 300 {
		m.lastGuildFileCheck = now
		err := m.ReadGuildCsvFileIfNew()
		if err != nil {
			fmt.Println("Unable to load guild file :")
			fmt.Println(err)
		}
	}
	if id < len(m.Guildes) {
		return m.Guildes[id]
	}
	return nil
}

func (m *TksManager) CheckDiploLoaded() {
	now := time.Now().Unix()
	if now-m.lastDiploFileCheck > 100 {
		m.lastDiploFileCheck = now
		err := m.ReadDiploCsvFilesIfNew()
		if err != nil {
			fmt.Println("Unable to load diplo files :")
			fmt.Println(err)
		}
	}
}
