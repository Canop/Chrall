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
	NbKillsTrolls         uint
	ClassementKillsTrolls uint
	NbKillsMonstres       uint
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

	// <- tester ici si le fichier est plus récent que lastFileRead

	f, err := os.Open("../killomètre/kom.csv", os.O_RDONLY, 0)
	if err != nil {
		return err
	}
	defer f.Close()
	r := bufio.NewReader(f)
	line, err := r.ReadString('\n')
	classement := uint(0)
	lastKillTrolls := uint(654321) // la flemme...
	i := uint(0)
	for err == nil {
		i++
		tokens := strings.Split(line, ";", 3)
		tks := new(TrollKillStats)
		trollId, _ := strconv.Atoi(tokens[0])
		tks.NbKillsTrolls, _ = strconv.Atoui(tokens[1])
		tks.NbKillsMonstres, _ = strconv.Atoui(tokens[2])
		if tks.NbKillsTrolls != lastKillTrolls {
			classement = i
		}
		tks.ClassementKillsTrolls = classement
		if trollId >= len(m.Trolls) {
			if trollId >= cap(m.Trolls) {
				newSlice := make([]*TrollKillStats, ((trollId+1)*5/4)+1000)
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
	if (now-m.lastFileCheck>180) {
		m.lastFileCheck = now
		err := m.ReadCsvFileIfNew()
		if err!=nil {
			fmt.Println("Unable to load kill stats file :")
			fmt.Println(err)
		}
	}
	if trollId <= len(m.Trolls) {
		return m.Trolls[trollId]
	}
	return nil
}
