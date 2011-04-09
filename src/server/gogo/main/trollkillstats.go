package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"strconv"
)

// statistiques concernant un troll
type TrollKillStats struct {
	NbKillsTrolls           uint
	NbKillsMonstres         uint
	ClassementKillsTrolls   uint
	ClassementKillsMonstres uint
	ClassifChrall           string
}

// l'objet qui contient les stats
// A priori ce sera toujours un singleton.
type TksManager struct {
	Trolls        []*TrollKillStats // les infos des trolls, indexées par id de troll (certes, avec un table de hash spécifique ce ne serait pas lent et le tableau serait deux fois plus court mais... la flemme...)
	lastFileCheck int64             // la date, en secondes, à laquelle on a vérifié si le fichier csv source avait changé pour la dernière fois
	lastFileRead  int64             // la date, en secondes, à laquelle on a lu le fichier csv source pour la dernière fois
}


// Lit un fichier csv contenant, triés par nombre de kills de trolls, une ligne pour
//  chaque troll connu (voir troll.go)
func (m *TksManager) ReadCsvFileIfNew() os.Error {
	filename := "../killometre/kom.csv"
	if m.lastFileRead > 0 {
		fi, err := os.Stat(filename)
		if err != nil {
			return err
		}
		if !fi.IsRegular() {
			return os.NewError("TksManager : Fichier de stats " + filename + " introuvable ou anormal")
		}
		if fi.Mtime_ns < m.lastFileRead*1000000000 { // conversion secondes - nanosecondes...
			fmt.Println("TksManager : le fichier n'a pas changé")
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
		tokens := strings.Split(line, ";", 9)
		//fmt.Printf("%s - %s - '%s'\n", tokens[0], tokens[1], tokens[2])
		tks := new(TrollKillStats)
		trollId, _ := strconv.Atoi(tokens[0])
		tks.NbKillsTrolls, _ = strconv.Atoui(tokens[1])
		tks.NbKillsMonstres, _ = strconv.Atoui(tokens[2])
		tks.ClassementKillsTrolls, _ = strconv.Atoui(tokens[3])
		tks.ClassementKillsMonstres, _ = strconv.Atoui(tokens[4])
		tks.ClassifChrall = strings.Trim(tokens[8], " \n")
		if trollId >= len(m.Trolls) {
			if trollId >= cap(m.Trolls) {
				newSlice := make([]*TrollKillStats, ((trollId+1)*5/4)+100)
				copy(newSlice, m.Trolls)
				m.Trolls = newSlice
			}
			m.Trolls = m.Trolls[0 : trollId+1]
		}
		m.Trolls[trollId] = tks
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

func (m *TksManager) getTrollKillStats(trollId int) *TrollKillStats {
	now, _, _ := os.Time()
	if now-m.lastFileCheck > 180 {
		m.lastFileCheck = now
		err := m.ReadCsvFileIfNew()
		if err != nil {
			fmt.Println("Unable to load kill stats file :")
			fmt.Println(err)
		}
	}
	if trollId <= len(m.Trolls) {
		return m.Trolls[trollId]
	}
	return nil
}
