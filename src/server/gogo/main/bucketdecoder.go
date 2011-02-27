package main

/*
Décodeur du seau versé dans le Puit de chrall.

Ce seau est une chaine qui peut contenir des CDM, et peut-être un jour autre chose
*/

import (
	"strings"
	"fmt"
	"strconv"
)

type BucketDecoder struct {
	Cdm []*CDM // les CDM trouvées dans l'input	
	nbResults int
}

func (bd *BucketDecoder) addCdm(cdm *CDM) {
	l := len(bd.Cdm)
	if l==cap(bd.Cdm) {
		newSlice := make([]*CDM, (l+1)*3/2)
		copy(newSlice, bd.Cdm)
		bd.Cdm = newSlice
    }
    bd.Cdm = bd.Cdm[0:l+1]
	bd.Cdm[l]=cdm
}


func (bd *BucketDecoder) Decode(input string) {
	lines := strings.Split(input, "\n", -1)
	
	var currentCdm *CDM
	var numLineAtCdmStart int
	for numLine, line := range lines {
		//fmt.Println(line)
		if strings.Contains(line, "CONNAISSANCE DES MONSTRES") {
			fmt.Println("Start CDM")
			fields := strings.Fields(line)
			// on regarde si le dernier champ est bien un numéro
			numField := fields[len(fields)-1]
			numField = strings.TrimLeft(numField, "(N°")
			numField = strings.TrimRight(numField, ")")
			num, err := strconv.Atoi(numField)
			if (err!=nil) {
				fmt.Println("Error trying to parse '" + numField + "' as an int : not a CDM")
				continue
			}
			fieldUn := -1
			for i, f := range fields {
				if f=="un" {
					fieldUn = i
					break;
				}
			}
			if fieldUn==-1 || fieldUn>=len(fields)-2 {
				fmt.Println("Impossible de trouver le début du nom")
				continue
			}
			fmt.Println("C'est une CDM !")
			currentCdm = new(CDM)
			currentCdm.IdMonstre = num
			currentCdm.SetNomComplet(strings.Join(fields[fieldUn+1:len(fields)-1], " "))
			bd.addCdm(currentCdm)
			numLineAtCdmStart = numLine
		} else if strings.Contains(line, "Le Monstre Ciblé fait partie") {
			fmt.Println("Start CDM")
			fields := strings.Fields(line)
			// on regarde si le dernier champ est bien un numéro
			numField := fields[len(fields)-1]
			numField = strings.TrimLeft(numField, "(N°")
			numField = strings.TrimRight(numField, ")")
			num, err := strconv.Atoi(numField)
			if (err!=nil) {
				fmt.Println("Error trying to parse '" + numField + "' as an int : not a CDM")
				continue
			}
			firstFieldWithOpeningBrace := -1
			for i, f := range fields {
				if f[0]=='(' {
					firstFieldWithOpeningBrace = i
					break;
				}
				//fmt.Println(f)
			}
			if firstFieldWithOpeningBrace==-1 || firstFieldWithOpeningBrace>=len(fields)-2 {
				fmt.Println("Impossible de trouver le début du nom")
				continue
			}
			fmt.Println("C'est une CDM !")
			currentCdm = new(CDM)
			currentCdm.IdMonstre = num
			currentCdm.SetNomComplet(strings.TrimLeft(strings.Join(fields[firstFieldWithOpeningBrace:len(fields)-2], " "), "("))
			bd.addCdm(currentCdm)
			numLineAtCdmStart = numLine
		} else if currentCdm!=nil && numLine-numLineAtCdmStart<40 { // 40 : nombre de lignes maximal d'une cdm (à déterminer)
			char := AnalyseLineAsCdmChar(line)
			if char!=nil {
				currentCdm.AddChar(char)
			} else {
				fmt.Println("Ligne pas comprise : " + line);
			}
		}
	}
	
	fmt.Println("Résultats :")
	for _, cdm := range bd.Cdm {
		if cdm==nil {
			fmt.Println("cdm is nil !")
		} else {
			cdm.Print()
		}
	}
}
