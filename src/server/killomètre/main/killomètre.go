package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strings"
	"strconv"
	"time"
)

type Killomètre struct {
	NbReadFiles uint
	Kills       []*Kill
	Trolls	[]*Troll
	NbTrolls uint
}

func (km *Killomètre) initTroll(id int) {
	if id>=len(km.Trolls) {
		if id>=cap(km.Trolls) {
			newSlice := make([]*Troll, ((id+1)*5/4)+1000)
			copy(newSlice, km.Trolls)
			km.Trolls = newSlice
		}
		km.Trolls = km.Trolls[0: id+1]
	}
	if km.Trolls[id]==nil {
		km.NbTrolls++
		km.Trolls[id] = &Troll{id, 0, 0}
	}
}

// y a t-il moyen de faire plus rapidement ?
func (km *Killomètre) addKill(kill *Kill) {
	l := len(km.Kills)
	if l == cap(km.Kills) {
		newSlice := make([]*Kill, ((l+1)*5/4)+1000)
		copy(newSlice, km.Kills)
		km.Kills = newSlice
	}
	km.Kills = km.Kills[0 : l+1]
	km.Kills[l] = kill
	if kill.TueurEstTroll {
		km.initTroll(kill.Tueur)
		if kill.TuéEstTroll {
			km.Trolls[kill.Tueur].NbKillsTrolls++
		} else {
			km.Trolls[kill.Tueur].NbKillsMonstres++
		}
	}
	if kill.TuéEstTroll {
		km.initTroll(kill.Tué)
	}
}

func (km *Killomètre) parseLigneKill(line string) {
	tokens := strings.Split(line, ";", 6)
	if len(tokens) < 5 {
		fmt.Printf("Ligne non comprise : %s\n", line)
		return
	}
	kill := new(Kill)
	kill.Tueur, _ = strconv.Atoi(tokens[1])
	kill.TueurEstTroll = tokens[2] == "Troll"
	kill.Tué, _ = strconv.Atoi(tokens[3])
	kill.TuéEstTroll = tokens[4] == "Troll"
	km.addKill(kill)
}

func (km *Killomètre) parseFichierKills(file *os.File) os.Error {
	r := bufio.NewReader(file)
	line, err := r.ReadString('\n')
	for err == nil {
		km.parseLigneKill(line)
		line, err = r.ReadString('\n')
	}
	km.NbReadFiles++
	if err != os.EOF {
		fmt.Println("Error in parsing :")
		fmt.Println(err)
		return err
	}
	return nil
}


func (km *Killomètre) handleFile(f *os.File) os.Error {
	childs, err := f.Readdir(-1)
	if err == nil {		
		fmt.Println("Entering directory " + f.Name())
		for _, fi := range(childs) {
			//fmt.Println("Chidlname : " + fi.Name)
			err := km.handleFilename(f.Name()+"/"+fi.Name)
			if err != nil {
				return err
			}
		}
		fmt.Println("Leaving directory " + f.Name())
	} else {
		return km.parseFichierKills(f)
	}
	return nil
}

func (km *Killomètre) handleFilename(filename string) os.Error {
	f, err := os.Open(filename, os.O_RDONLY, 0)
	if err != nil {
		return err
	}
	defer f.Close()
	return km.handleFile(f)
}
// construit un tableau des trolls triés par leur nombre de kills de trolls
func (km *Killomètre) SortTrollsByKillsOfTrolls() ([]*Troll) {
	sortedTrolls := make([]*Troll, len(km.Trolls))
	copy(sortedTrolls, km.Trolls)
	a := &TrollKillerArray{sortedTrolls}
	sort.Sort(a)
	return sortedTrolls
}
 

func main() {
	const fArg = 1
	if len(os.Args) < fArg+1 {
		fmt.Println(os.EINVAL)
		return
	}
	startTime := time.Seconds()
	km := new(Killomètre)
	err := km.handleFilename(os.Args[fArg])
	if err != nil {
		fmt.Printf("Erreur %v", err)
	} else {
		tt := 0
		tm := 0
		mt := 0
		for _,kill := range(km.Kills) {
			//fmt.Printf("  ==> %v %v %v %v\n", kill.Tueur, kill.TueurEstTroll, kill.Tué, kill.TuéEstTroll)
			if kill.TueurEstTroll {
				if kill.TuéEstTroll {
					tt++
				} else {
					tm++
				}
			} else {
				mt++
			}
		}
		trollsByTrollKills := km.SortTrollsByKillsOfTrolls()
		
		fmt.Printf("Fini en %d secondes\n Fichiers lus : %d\n Kills lus : %d", time.Seconds()-startTime, km.NbReadFiles, len(km.Kills))
		fmt.Printf("\nTroll tue Monstre : %d\n", tm)
		fmt.Printf("Troll tue Troll : %d\n", tt)
		fmt.Printf("Monstre tue Troll : %d\n", mt)
		fmt.Printf("Nombre de trolls : %d\n", km.NbTrolls)
		fmt.Println("Plus grands tueurs de troll : ")		
		PrintTrolls(trollsByTrollKills, 20)
	}
	fmt.Println()
}
