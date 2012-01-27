package main

// extrait les cdm présentes dans des fichiers .eml

import (
	"bufio"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"
)


func handleMailFile(filename string, destfile *os.File) error {
	sourcefile, err := os.Open(filename)
	if err!=nil {
		return err 
	}
	defer sourcefile.Close()
	r := bufio.NewReader(sourcefile)
	nbstarlines := 0
	for {
		line, err := r.ReadString('\n')
		if err != nil {
			if err != io.EOF {
				return err
			}
			return nil
		}
		// on renvoie ce qui se trouve entre les deux lignes d'étoiles, en incluant la première qui sert de séparateur
		if strings.HasPrefix(line, "*************") {
			nbstarlines++
		}
		switch nbstarlines {
		case 0:
		case 1:
			fmt.Fprint(destfile, line)
		default:
			return nil	
		}
	}
	return nil
}


func main() {
	path := flag.String("dir", "", "répertoire de travail (entrée et sortie)")
	flag.Parse()
	if *path=="" {
		log.Println("Usage :")
		flag.PrintDefaults()
		return
	}
	dir, err := os.Open(*path)
	if err!=nil {
		log.Fatal("Erreur ouverture répertoire source : ", err)
	}
	defer dir.Close()
	filenames, err := dir.Readdirnames(-1)
	if err!=nil {
		log.Fatal("Erreur listage fichiers sources : ", err)
	}
	destfile, err := os.Create(*path+"/cdm.txt")
	if err != nil {
		log.Fatal("Erreur création fichier cdm.txt : ", err)
	}
	defer destfile.Close()
	for _, filename := range(filenames) {
		if filepath.Ext(filename)==".eml" {
			err = handleMailFile(filepath.Join(*path, filename), destfile)
			if err!=nil {
				log.Println("Erreur traitement fichier ", filename, ":", err)
			}
		}
	}
}
