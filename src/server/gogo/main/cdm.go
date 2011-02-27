package main

/*
une CDM représente une "connaissance des monstres" de Mounty Hall
*/

import(
	"fmt"
	"strconv"
	"strings"
)

type CdmChar struct {
	Name string
	Min int			// 0 si pas défini
	Max int			// 0 si pas défini
	Text string		// on ne conservera probablement pas indéfiniment ça mais pour l'instant ça permettra d'améliorer l'algo
}

func AnalyseLineAsCdmChar(line string) (char *CdmChar) {
	fields := strings.Split(line, ":", 4)
	if len(fields)!=2 {
		return nil
	}
	char = new(CdmChar)
	char.Name = strings.Trim(fields[0], " ")
	char.Text = strings.Trim(fields[1], " ")
	return char
}

func (char *CdmChar) Print() {
	fmt.Println("  " + char.Name + " :")
	fmt.Println("    text : \"" + char.Text + "\"");
	fmt.Println("    min  : " + strconv.Itoa(char.Min));
	fmt.Println("    max  : " + strconv.Itoa(char.Max));
}


type CDM struct {
	IdMonstre int		// TODO comment utiliser uint32 (et faire les conversions depuis et vers des chaines) ?
	Nom string 			// exemple : "Mouch'oo Majestueux Sauvage Frénétique"
	TagAge string 		// exemple : "Doyen"
	NomComplet string 	// exemple : "Mouch'oo Majestueux Sauvage Frénétique [Doyen]"
	Chars []*CdmChar
}

func (cdm *CDM) AddChar(char *CdmChar) {
	l := len(cdm.Chars)
	if l==cap(cdm.Chars) {
		newSlice := make([]*CdmChar, (l+1)*3/2)
		copy(newSlice, cdm.Chars)
		cdm.Chars = newSlice
    }
    cdm.Chars = cdm.Chars[0:l+1]
	cdm.Chars[l]=char
}

func (cdm *CDM) SetNomComplet(nc string) {
	cdm.NomComplet = nc;
	// on cherche pour voir si on trouve la mention de l'age
	fields := strings.Fields(nc)
	lastField := fields[len(fields)-1]
	if lastField[0]=='[' && lastField[len(lastField)-1]==']' {
		cdm.Nom = strings.Join(fields[0:len(fields)-1], " ")
		cdm.TagAge = strings.Trim(lastField[1:len(lastField)-1], " ")
		//fmt.Print("Age : " + cdm.TagAge)
	} else {
		cdm.Nom = nc
		fmt.Print("Pas d'âge")
	}
}

func (cdm *CDM) Print() {
	fmt.Println(" CDM-------")
	fmt.Println("  ID : " + strconv.Itoa(cdm.IdMonstre))
	fmt.Println("  Nom : " + cdm.NomComplet)
	for _, char := range cdm.Chars {
		char.Print()
	}
}
