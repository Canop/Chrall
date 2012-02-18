package main

/*
 * J'ai été un peu paresseux sur certains trucs, on devrait pouvoir faire du go plus élégant...
 * 
 */

import (
	"bufio"
	"chrall"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
	"time"
)

type Killomètre struct {
	NbReadFiles int
	Kills       []*Kill
	Trolls      []*Troll // pour un accès rapide, l'index dans le tableau est l'id du troll
	NbTrolls    int
}

func (km *Killomètre) initTroll(id int) *Troll {
	if id >= len(km.Trolls) {
		if id >= cap(km.Trolls) {
			newSlice := make([]*Troll, ((id+1)*5/4)+1000)
			copy(newSlice, km.Trolls)
			km.Trolls = newSlice
		}
		km.Trolls = km.Trolls[0 : id+1]
	}
	if km.Trolls[id] == nil {
		km.NbTrolls++
		km.Trolls[id] = NewTroll(id)
	}
	return km.Trolls[id]
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
			if kill.Tué != kill.Tueur {
				km.Trolls[kill.Tueur].NbKillsTrolls++
			}
		} else {
			km.Trolls[kill.Tueur].NbKillsMonstres++
		}
	}
	if kill.TuéEstTroll {
		km.initTroll(kill.Tué)
	}
}

func (km *Killomètre) parseLigneTroll(line string) {
	tokens := strings.SplitN(line, ";", 9)
	if len(tokens) < 7 {
		fmt.Printf("Ligne non comprise : %s\n", line)
		return
	}
	trollId, _ := strconv.Atoi(tokens[0])
	troll := km.initTroll(trollId)
	troll.Nom = chrall.Iso88591ToUtf8(tokens[1])
	troll.Race = race(tokens[2])
	n64, _ := strconv.ParseUint(tokens[3], 10, 0)
	troll.Niveau = int(n64)
	var err error
	troll.IdGuilde, err = strconv.Atoi(tokens[6])
	if err != nil {
		fmt.Println("Error in parsing :")
		fmt.Println(err)
	}
}

func (km *Killomètre) parseLigneKill(line string) {
	tokens := strings.SplitN(line, ";", 6)
	if len(tokens) < 5 {
		fmt.Printf("Ligne non comprise : %s\n", line)
		return
	}
	kill := new(Kill)
	killTime, _ := time.Parse("2006-01-02 15:04:05", tokens[0])
	kill.Seconds = killTime.Unix()
	kill.Tueur, _ = strconv.Atoi(tokens[1])
	kill.TueurEstTroll = tokens[2] == "Troll"
	kill.Tué, _ = strconv.Atoi(tokens[3])
	kill.TuéEstTroll = tokens[4] == "Troll"
	km.addKill(kill)
}

func (km *Killomètre) parseFichierTrolls(file *os.File) error {
	r := bufio.NewReader(file)
	line, err := r.ReadString('\n') // TODO : utiliser r.ReadLine() plutôt que r.ReadString('\n')
	for err == nil {
		km.parseLigneTroll(line)
		line, err = r.ReadString('\n')
	}
	if err != io.EOF {
		fmt.Println("Error in parsing (parseFichierTrolls) :")
		fmt.Println(err)
		return err
	}
	return nil
}

func (km *Killomètre) parseFichierKills(file *os.File) error {
	r := bufio.NewReader(file)
	line, err := r.ReadString('\n') // TODO : utiliser r.ReadLine() plutôt que r.ReadString('\n')
	for err == nil {
		km.parseLigneKill(line)
		line, err = r.ReadString('\n')
	}
	km.NbReadFiles++
	if err != io.EOF {
		fmt.Println("Error in parsing (parseFichierKills) :")
		fmt.Println(err)
		return err
	}
	return nil
}

// fichier ou répertoire
func (km *Killomètre) traiteFichierKills(f *os.File) error {
	childs, err := f.Readdir(-1)
	if err == nil {
		fmt.Println("Entering directory " + f.Name())
		for _, fi := range childs {
			//fmt.Println("Chidlname : " + fi.Name)
			err := km.traiteNomFichierKills(f.Name() + "/" + fi.Name())
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

// fichier ou répertoire
func (km *Killomètre) traiteNomFichierKills(filename string) error {
	f, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer f.Close()
	return km.traiteFichierKills(f)
}

func (km *Killomètre) CalculeClassements(trollsByTrollKills []*Troll, trollsByMonsterKills []*Troll) {
	//> calcul du classement par kills de trolls
	classement := 0
	lastKillTrolls := int(654321) // la flemme...
	for i, troll := range trollsByTrollKills {
		if troll.NbKillsTrolls != lastKillTrolls {
			classement = i + 1
			lastKillTrolls = troll.NbKillsTrolls
		}
		troll.ClassementKillsTrolls = classement
	}
	//> calcul du classement par kills de monstres
	classement = 0
	lastKillMonstres := int(654321)
	for i, troll := range trollsByMonsterKills {
		if troll.NbKillsMonstres != lastKillMonstres {
			classement = i + 1
			lastKillMonstres = troll.NbKillsMonstres
		}
		troll.ClassementKillsMonstres = classement
	}

}

func WriteTrollsToFile(filename string, trolls []*Troll) error {
	f, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer f.Close()
	WriteTrolls(f, trolls, false)
	return nil
}

/*
 * Paramètres :
 *  - chemin du fichier de définition des trolls
 *  - chemin d'un répertoire contenant (éventuellement dans des sous répertoires) les événements que le serveur FPT de MH propose
 */
func main() {
	if len(os.Args) < 3 {
		fmt.Println(os.EINVAL)
		return
	}
	cheminFichierTrolls := os.Args[1]
	cheminRacineRepertoireEvenements := os.Args[2]
	startTime := time.Now()

	km := new(Killomètre)

	//> lecture du fichier des trolls
	f, err := os.Open(cheminFichierTrolls)
	if err != nil {
		fmt.Printf("Erreur à l'ouverture du fichier des trolls : %v", err)
		return
	}
	err = km.parseFichierTrolls(f)
	if err != nil {
		fmt.Printf("Erreur à la lecture du fichier des trolls : %v", err)
		return
	}
	fmt.Printf("Fichier des trolls lu. Nombre de trolls : %d\n", km.NbTrolls)

	//> lecture des événements
	err = km.traiteNomFichierKills(cheminRacineRepertoireEvenements)
	if err != nil {
		fmt.Printf("Erreur à la lecture des événements : %v", err)
		return
	}

	//> construction de tableaux triés
	//trollsByTrollKills := km.SortTrollsByKillsOfTrolls()
	trollsByTrollKills := SortTrolls(km.Trolls, km.NbTrolls, func(troll *Troll) int { return troll.NbKillsTrolls })
	trollsByMonsterKills := SortTrolls(trollsByTrollKills, km.NbTrolls, func(troll *Troll) int { return troll.NbKillsMonstres })
	//trollsByMonsterKills := km.SortTrollsByKillsOfMonsters() // notons que ça irait sans doute plus rapidement de partir du tableau des trolls triés, plus court...

	//> calcul des classements
	km.CalculeClassements(trollsByTrollKills, trollsByMonsterKills)

	//> analyse
	km.Analyse(trollsByTrollKills)

	//> export du tableau complet
	err = WriteTrollsToFile("/home/dys/chrall/killometre/kom.csv", trollsByTrollKills)
	if err != nil {
		fmt.Printf("Erreur while writing output file : %v\n", err)
	}

	//> quelques stats
	nbTK := 0
	nbATK := 0
	nbMK := 0
	nbInconnus := 0
	for _, troll := range trollsByTrollKills {
		if troll.Tag == tk {
			nbTK++
		} else if troll.Tag == atk {
			nbATK++
		} else if troll.Tag == mk {
			nbMK++
		} else {
			nbInconnus++
		}
	}

	//> affichage d'un petit bilan
	fmt.Printf("Fini en %d secondes\n Fichiers lus : %d\n Kills lus : %d\n", time.Now().Sub(startTime), km.NbReadFiles, len(km.Kills))
	fmt.Printf("Nombre de trolls : %d\n", km.NbTrolls)
	fmt.Printf("\nTK : %d\nATK : %d\nMK : %d\nInconnus : %d\n", nbTK, nbATK, nbMK, nbInconnus)
	fmt.Println("Plus grands tueurs de troll : ")
	PrintTrolls(trollsByTrollKills, 100)
	fmt.Println("Plus grands tueurs de monstres : ")
	PrintTrolls(trollsByMonsterKills, 100)
	fmt.Println()
}
