package main

/*
une CDM représente une "connaissance de monstres" de Mounty Hall
*/

import(
	"fmt"
	"strconv"
)

type CDM struct {
	IdMonstre int
	NomComplet string
}

func (cdm *CDM) Print() {
	fmt.Println(" CDM-------")
	fmt.Println("  ID : " + strconv.Itoa(cdm.IdMonstre))
	fmt.Println("  Nom : " + cdm.NomComplet)
}
