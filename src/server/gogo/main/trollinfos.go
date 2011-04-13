package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"strconv"
)


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
	return RACE_NAMES[uint(r)]
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
	NbKillsTrolls           uint
	NbKillsMonstres         uint
	ClassementKillsTrolls   uint
	ClassementKillsMonstres uint
	ClassifChrall           string
	Nom                     string
	Race                    raceTroll
	Niveau                  uint
	IdGuilde                uint
}

// l'objet qui contient les stats
// A priori ce sera toujours un singleton.
type TksManager struct {
	Trolls        []*TrollInfos // les infos des trolls, indexées par id de troll (certes, avec un table de hash spécifique ce ne serait pas lent et le tableau serait deux fois plus court mais... la flemme...)
	lastFileCheck int64         // la date, en secondes, à laquelle on a vérifié si le fichier csv source avait changé pour la dernière fois
	lastFileRead  int64         // la date, en secondes, à laquelle on a lu le fichier csv source pour la dernière fois
}


// Lit un fichier csv contenant, triés par nombre de kills de trolls, une ligne pour
//  chaque troll connu (voir troll.go)
func (m *TksManager) ReadCsvFileIfNew() os.Error {
	// TODO comment assurer en go qu'il n'y a pas plusieurs exécutions en parallèle ?
	filename := "/home/dys/chrall/killometre/kom.csv" // oui, c'est pas bien... mais proposez de l'aide au lieu de critiquer ;)
	if m.lastFileRead > 0 {
		fi, err := os.Stat(filename)
		if err != nil {
			return err
		}
		if !fi.IsRegular() {
			return os.NewError("TksManager : Fichier de stats " + filename + " introuvable ou anormal")
		}
		if fi.Mtime_ns < m.lastFileRead*1000000000 { // conversion secondes - nanosecondes...
			//fmt.Println("TksManager : le fichier n'a pas changé")
			return nil
		}
	}

	f, err := os.Open(filename, os.O_RDONLY, 0)
	if err != nil {
		return err
	}
	defer f.Close()
	r := bufio.NewReader(f)
	line, err := r.ReadString('\n')
	// notons qu'on ne supprime pas les anciennes stats avant, on remplace directement
	// Et au final on ne devrait pas souvent redimensionner la table
	for err == nil {
		tokens := strings.Split(line, ";", 13)
		if len(tokens)<13 {
			fmt.Println("Ligne invalide")
		} else {
			tks := new(TrollInfos)
			trollId, _ := strconv.Atoi(tokens[0])
			tks.NbKillsTrolls, _ = strconv.Atoui(tokens[1])
			tks.NbKillsMonstres, _ = strconv.Atoui(tokens[2])
			tks.ClassementKillsTrolls, _ = strconv.Atoui(tokens[3])
			tks.ClassementKillsMonstres, _ = strconv.Atoui(tokens[4])
			tks.ClassifChrall = strings.Trim(tokens[8], " \n")
			tks.Nom = tokens[9]
			tks.Race = race(tokens[10])
			tks.Niveau, _ = strconv.Atoui(tokens[11])
			tks.IdGuilde, _ = strconv.Atoui(strings.Trim(tokens[12], " \n"))
			if trollId >= len(m.Trolls) {
				if trollId >= cap(m.Trolls) {
					newSlice := make([]*TrollInfos, ((trollId+1)*5/4)+100)
					copy(newSlice, m.Trolls)
					m.Trolls = newSlice
				}
				m.Trolls = m.Trolls[0 : trollId+1]
			}
			m.Trolls[trollId] = tks
		}
		line, err = r.ReadString('\n')
	}
	if err != os.EOF {
		fmt.Println("Error in parsing :")
		fmt.Println(err)
		return err
	}
	m.lastFileRead, _, _ = os.Time()
	fmt.Println("TksManager : Fichier de stats lu")
	return nil
}

func (m *TksManager) getTrollInfos(trollId int) *TrollInfos {
	if trollId <= 0 {
		return nil
	}
	now, _, _ := os.Time()
	if now-m.lastFileCheck > 300 {
		m.lastFileCheck = now
		err := m.ReadCsvFileIfNew()
		if err != nil {
			fmt.Println("Unable to load kill stats file :")
			fmt.Println(err)
		}
	}
	if trollId < len(m.Trolls) {
		return m.Trolls[trollId]
	}
	return nil
}
