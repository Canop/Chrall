package main

import (
	"fmt"
	"os"
)

type Troll struct {
	Id              int
	NbKillsTrolls   uint
	NbKillsMonstres uint
}


// une structure permettant de trier un tableau de trolls
//  par leur nombre de kills de trolls
type TrollKillerArray struct {
	trolls []*Troll
}

func (a *TrollKillerArray) Len() int {
	return len(a.trolls)
}
func (a *TrollKillerArray) Less(i int, j int) bool {
	if a.trolls[i] == nil {
		return false
	}
	if a.trolls[j] == nil {
		return true
	}
	return a.trolls[j].NbKillsTrolls < a.trolls[i].NbKillsTrolls
}
func (a *TrollKillerArray) Swap(i int, j int) {
	a.trolls[i], a.trolls[j] = a.trolls[j], a.trolls[i]
}


// imprime un tableau lisible des principales caractéristiques des trolls
func PrintTrolls(trolls []*Troll, max int) {
	fmt.Printf("| %10s | %7s | %15s | %17s |\n", "Classement", "Troll", "Kills de trolls", "Kills de monstres")
	i := 0
	for _, troll := range trolls {
		if troll != nil {
			i++
			fmt.Printf("| %10d | %7d | %15d | %17d |\n", i, troll.Id, troll.NbKillsTrolls, troll.NbKillsMonstres)
			if i == max {
				break
			}
		}
	}
}

// écrit un fichier csv des trolls
func WriteTrolls(w *os.File, trolls []*Troll, includeHeader bool) { // je ne sais pas pourquoi je ne peux pas définir w comme un *io.Writer
	if includeHeader {
		fmt.Fprintf(w, "%s;%s;%s\n", "Troll", "Kills de trolls", "Kills de monstres")
	}
	for _, troll := range trolls {
		if troll != nil {
			fmt.Fprintf(w, "%d;%d;%d\n", troll.Id, troll.NbKillsTrolls, troll.NbKillsMonstres)
		}
	}	
}
