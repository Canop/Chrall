package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"strconv"
)

type Killomètre struct {
	NbReadFiles uint
	Kills       []*Kill
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
}

func (km *Killomètre) parseLigneKill(line string) {
	tokens := strings.Split(line, ";", 6)
	if len(tokens) < 5 {
		fmt.Printf("Ligne non comprise : %s\n", line)
		return
	}
	kill := new(Kill)
	kill.Tueur, _ = strconv.Atoui(tokens[1])
	kill.TueurEstTroll = tokens[2] == "Troll"
	kill.Tué, _ = strconv.Atoui(tokens[3])
	kill.TuéEstTroll = tokens[4] == "Troll"
	km.addKill(kill)
}

func (km *Killomètre) parseFichierKills(filename string) os.Error {
	f, err := os.Open(filename, os.O_RDONLY, 0)
	if err != nil {
		return err
	}
	defer f.Close()

	r := bufio.NewReader(f)
	line, err := r.ReadString('\n')
	for err == nil {
		km.parseLigneKill(line)
		line, err = r.ReadString('\n')
	}
	km.NbReadFiles++
	if err != os.EOF {
		fmt.Println(err)
		return err
	}
	return nil
}

/*
func (km *Killomètre handleFileOrDirectory(filename string) os.Error {
	fi, err := os.Stat(filename)
	
}*/


func main() {
	const fArg = 1
	if len(os.Args) < fArg+1 {
		fmt.Println(os.EINVAL)
		return
	}
	km := new(Killomètre)
	km.parseFichierKills(os.Args[fArg])
	fmt.Printf("Fini\n Fichiers lus : %d\n Kills lus : %d", km.NbReadFiles, len(km.Kills))
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
	fmt.Printf("\nTroll tue Monstre : %d\n", tm)
	fmt.Printf("Troll tue Troll : %d\n", tt)
	fmt.Printf("Monstre tue Troll : %d\n", mt)
	fmt.Println()
}
