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
	Min uint		// 0 si pas défini
	Max uint		// 0 si pas défini
	Text string		// on ne conservera probablement pas indéfiniment ça mais pour l'instant ça permettra d'améliorer l'algo
}

func AnalyseLineAsCdmChar(line string) (name string, char *CdmChar) {
	fields := strings.Split(line, ":", 4)
	if len(fields)<2 || len(fields)>3 {
		return "", nil
	}
	char = new(CdmChar)
	name = strings.Trim(fields[0], " ")
	if name=="Le Monstre ciblé fait partie des" {
		name = "Famille"
	} else if name=="Blessure" {
		return "", nil // pour l'instant on n'analyse pas la blessure (qui est sur 2 lignes)
	} else if name=="Points de Vie restants (Approximatif)" {
		return "", nil // ceci provient de MountyZilla ou ZoryaZilla
	}
	char.Text = strings.Trim(strings.Join(fields[1:len(fields)], ":"), " ")
	indexPar := strings.Index(char.Text, "(")
	if (indexPar>=0) {
		valuesText := char.Text[indexPar+1:len(char.Text)]
		if valuesText[len(valuesText)-1]==')' {
			valuesText = valuesText[0:len(valuesText)-1]
		}
		//fmt.Println("***valuesText=\""+valuesText+"\"")
		fields = strings.Fields(valuesText)
		if len(fields)==4 && fields[0]=="entre" && fields[2]=="et" {
			char.Min, _ = strconv.Atoui(fields[1])
			char.Max, _ = strconv.Atoui(fields[3])
		} else if len(fields)==3 && fields[0]=="inférieur" && fields[1]=="à" {
			char.Max, _ = strconv.Atoui(fields[2])
		} else if len(fields)==3 && fields[0]=="supérieur" && fields[1]=="à" {
			char.Min, _ = strconv.Atoui(fields[2])
		} 
	}
	return name, char
}

func (char *CdmChar) Print(name string) {
	fmt.Println("  " + name + " :")
	fmt.Println("    text : \"" + char.Text + "\"");
	if (char.Min!=0) {
		fmt.Println("    min  : " + strconv.Uitoa(char.Min));
	}
	if (char.Max!=0) {
		fmt.Println("    max  : " + strconv.Uitoa(char.Max));
	}
}

type CDM struct {
	IdMonstre int		// TODO comment utiliser uint32 (et faire les conversions depuis et vers des chaines) ?
	Nom string 			// exemple : "Mouch'oo Majestueux Sauvage Frénétique"
	TagAge string 		// exemple : "Doyen"
	NomComplet string 	// exemple : "Mouch'oo Majestueux Sauvage Frénétique [Doyen]"
	Chars map[string] *CdmChar
}

// renvoie une nouvelle CDM si cette ligne est l'entame d'une CDM
func NewCdm(line string) *CDM {
	var fields []string
	var numField string
	var nomComplet string
	if strings.Contains(line, "CONNAISSANCE DES MONSTRES") {
		fields = strings.Fields(line)
		fieldUn := -1
		for i, f := range fields {
			if f=="un" {
				fieldUn = i
				break;
			}
		}
		if fieldUn==-1 || fieldUn>=len(fields)-2 {
			fmt.Println("Impossible de trouver le début du nom")
			return nil
		}
		nomComplet = strings.Join(fields[fieldUn+1:len(fields)-1], " ")
	} else if strings.Contains(line, "Le Monstre Ciblé fait partie") {
		fields = strings.Fields(line)
		firstFieldWithOpeningBrace := -1
		for i, f := range fields {
			if f[0]=='(' {
				firstFieldWithOpeningBrace = i
				break;
			}
		}
		if firstFieldWithOpeningBrace==-1 || firstFieldWithOpeningBrace>=len(fields)-2 {
			fmt.Println("Impossible de trouver le début du nom")
			return nil
		}
		nomComplet = strings.TrimLeft(strings.Join(fields[firstFieldWithOpeningBrace:len(fields)-2], " "), "(")
	} else {
		return nil
	}
	numField = fields[len(fields)-1]
	numField = strings.TrimLeft(numField, "(N°")
	numField = strings.TrimRight(numField, ")")
	num, err := strconv.Atoi(numField)
	if (err!=nil) {
		fmt.Println("Error trying to parse '" + numField + "' as an int : not a CDM")
		return nil
	}
	cdm := new(CDM)
	cdm.IdMonstre = num
	cdm.SetNomComplet(nomComplet)
	cdm.Chars = make(map[string] *CdmChar)
	return cdm
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
	fmt.Println(" CDM-------------------------------")
	fmt.Println("  ID : " + strconv.Itoa(cdm.IdMonstre))
	fmt.Println("  Nom : " + cdm.NomComplet)
	for name, char := range cdm.Chars {
		char.Print(name)
	}
}
