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
	Cdm       []*CDM // les CDM trouvées dans l'input	
	nbResults int
	Message   string
}

func (bd *BucketDecoder) addCdm(cdm *CDM) {
	l := len(bd.Cdm)
	if l == cap(bd.Cdm) {
		newSlice := make([]*CDM, (l+1)*3/2)
		copy(newSlice, bd.Cdm)
		bd.Cdm = newSlice
	}
	bd.Cdm = bd.Cdm[0 : l+1]
	bd.Cdm[l] = cdm
	bd.nbResults++
}


func (bd *BucketDecoder) Decode(input string, store *CdmStore) {
	lines := strings.Split(input, "\n", -1)

	var currentCdm *CDM
	var numLineAtCdmStart int
	for numLine, line := range lines {
		if len(line) < 4 {
			continue
		}
		if strings.Index(line, "chrall:") == 0 {
			fmt.Println("QUOTE: \"" + strconv.Quote(line) + "\"")

			fields := strings.Fields(line)
			if len(fields) > 1 {
				switch fields[1] {
				case "hello":
					bd.Message += "Coucou<br>"
				}
			}
		} else if cdm := NewCdm(lines[numLine:]); cdm != nil { // là on voit les avantages du langage go ! :)
			currentCdm = cdm
			bd.addCdm(currentCdm)
			numLineAtCdmStart = numLine
		} else if currentCdm != nil && numLine-numLineAtCdmStart < 40 { // 40 : nombre de lignes maximal d'une cdm (à déterminer)
			name, char := AnalyseLineAsCdmChar(line)
			if name != "" {
				currentCdm.AddChar(name, char)
			} else {
				fmt.Println("Ligne pas comprise : " + line)
			}
		}
	}

	fmt.Println("Résultats :")
	for _, cdm := range bd.Cdm {
		if cdm == nil {
			fmt.Println("cdm is nil !")
		} else {
			//cdm.Print()
			//fmt.Printf("\n\n SHA1 : %x\n", cdm.ComputeSHA1())
		}
	}
}
