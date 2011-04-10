package main

import (
	"fmt"
	"os"
)

type Troll struct {
	Id                      int
	NbKillsTrolls           uint // suicides non compris
	NbKillsMonstres         uint
	ClassementKillsTrolls   int
	ClassementKillsMonstres int
	Tag                     tag
	NbKillsTK               uint
	NbKillsATK              uint
	NbKilledByATK           uint
	NbKillsTKLastYear	uint
}

func NewTroll(id int) *Troll {
	t := new(Troll)
	t.Id = id
	return t
}

// bâtit une classification textuelle qualitative pour un affichage dans l'extension Chrall
func (troll *Troll) ChrallClassifHtml() string {
	if troll.NbKillsTrolls==0 {
		if troll.NbKillsMonstres==0 {
			return "<b>NK</b>"
		}
		return "pur <b>MK</b>"
	}
	if troll.Tag == mk {
		if troll.NbKillsTrolls<2 && troll.NbKillsMonstres>200 {
			return "pur <b>MK</b>"
		}
		return "<b>MK</b>"
	}
	if troll.Tag == tk {
		s := ""
		if troll.NbKillsTKLastYear==0 {
			s = "Ancien "
		}
		if troll.NbKillsTrolls<=5 {
			if troll.NbKillsMonstres>30*troll.NbKillsTrolls {
				return s + "<b>TK</b> occasionnel"
			}
			return s + "<b>TK</b> probable"
		}
		if troll.NbKillsTrolls>30 && troll.NbKillsMonstres<40 {
			return s + "pur <b>TK</b>"
		}
		if troll.NbKillsTrolls >= 2*troll.NbKillsTK {
			return s + "<b>TK</b> probable"
		}
		return s + "<b>TK</b>" 
	}
	if troll.Tag == atk {
		if troll.NbKillsMonstres > 10*troll.NbKillsTrolls {
			return "<b>MK</b> et <b>ATK</b>"
		}
		return "<b>ATK</b>"
	}
	return "indéterminé"
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

// une structure permettant de trier un tableau de trolls
//  par leur nombre de kills de monstres
type MonsterKillerArray struct {
	trolls []*Troll
}

func (a *MonsterKillerArray) Len() int {
	return len(a.trolls)
}
func (a *MonsterKillerArray) Less(i int, j int) bool {
	if a.trolls[i] == nil {
		return false
	}
	if a.trolls[j] == nil {
		return true
	}
	return a.trolls[j].NbKillsMonstres < a.trolls[i].NbKillsMonstres
}
func (a *MonsterKillerArray) Swap(i int, j int) {
	a.trolls[i], a.trolls[j] = a.trolls[j], a.trolls[i]
}


// imprime un tableau lisible des principales caractéristiques des trolls
func PrintTrolls(trolls []*Troll, max int) {
	fmt.Printf("| %10s | %7s | %15s | %17s | %20s | %21s | %7s | %9s | %9s | %20s |\n", "Classement", "Troll", "Kills de trolls", "Kills de monstres", "Class. kills trolls", "Class. kills monstres", "Classif", "Kills TK", "Kills ATK", "Classif HTML")
	i := 0
	for _, troll := range trolls {
		if troll != nil {
			i++
			fmt.Printf("| %10d | %7d | %15d | %17d | %20d | %21d | %7s | %9d | %9d | %20s |\n", i, troll.Id, troll.NbKillsTrolls, troll.NbKillsMonstres, troll.ClassementKillsTrolls, troll.ClassementKillsMonstres, troll.Tag.string(), troll.NbKillsTK, troll.NbKillsATK, troll.ChrallClassifHtml())
			if i == max {
				break
			}
		}
	}
}

// écrit un fichier csv des trolls
func WriteTrolls(w *os.File, trolls []*Troll, includeHeader bool) { // je ne sais pas pourquoi je ne peux pas définir w comme un *io.Writer
	if includeHeader {
		fmt.Fprintf(w, "%s;%s;%s;%s;%s;%s\n", "Troll", "Kills de trolls", "Kills de monstres", "Classement kills trolls", "Classement kills monstres", "Classif", "Kills TK", "Kills ATK", "Classif HTML")
	}
	for _, troll := range trolls {
		if troll != nil {
			fmt.Fprintf(w, "%d;%d;%d;%d;%d;%s;%d;%d;%s\n", troll.Id, troll.NbKillsTrolls, troll.NbKillsMonstres, troll.ClassementKillsTrolls, troll.ClassementKillsMonstres, troll.Tag.string(), troll.NbKillsTK, troll.NbKillsATK, troll.ChrallClassifHtml())
		}
	}
}
