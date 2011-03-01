package main

/*
une CDM représente une "connaissance des monstres" de Mounty Hall
*/

import (
	"fmt"
	"strconv"
	"strings"
)

type boolean uint8 // il faut que je fasse des progrés dans la compréhension des énums et constantes...
const (
	b_unknown = boolean(0)
	b_false   = boolean(1)
	b_true    = boolean(2)
)

func (b boolean) String() string {
	switch b {
	case b_unknown:
		return "unknown"
	case b_false:
		return "false"
	case b_true:
		return "true"
	}
	return "invalid_value"
}

func (b boolean) GenderString() string {
	switch b {
	case b_unknown:
		return "inconnu"
	case b_false:
		return "femelle"
	case b_true:
		return "mâle"
	}
	return "bug!"
}

type CdmChar struct {
	Min  uint   // 0 si pas défini
	Max  uint   // 0 si pas défini
	Text string // on ne conservera probablement pas indéfiniment ça mais pour l'instant ça permettra d'améliorer l'algo
}


func AnalyseLineAsCdmChar(line string) (name string, char *CdmChar) {
	fields := strings.Split(line, ":", 4)
	if len(fields) < 2 || len(fields) > 3 {
		return "", nil
	}
	char = new(CdmChar)
	name = strings.Trim(fields[0], " ")
	if name == "Le Monstre ciblé fait partie des" {
		name = "Famille"
	} else if name == "Blessure" {
		return "", nil // pour l'instant on n'analyse pas la blessure (qui est sur 2 lignes)
	} else if name == "Points de Vie restants (Approximatif)" {
		return "", nil // ceci provient de MountyZilla ou ZoryaZilla
	}
	char.Text = strings.Trim(strings.Join(fields[1:len(fields)], ":"), " ")
	indexPar := strings.Index(char.Text, "(")
	if indexPar >= 0 {
		valuesText := char.Text[indexPar+1 : len(char.Text)]
		if valuesText[len(valuesText)-1] == ')' {
			valuesText = valuesText[0 : len(valuesText)-1]
		}
		//fmt.Println("***valuesText=\""+valuesText+"\"")
		fields = strings.Fields(valuesText)
		if len(fields) == 4 && fields[0] == "entre" && fields[2] == "et" {
			char.Min, _ = strconv.Atoui(fields[1])
			char.Max, _ = strconv.Atoui(fields[3])
		} else if len(fields) == 3 && fields[0] == "inférieur" && fields[1] == "à" {
			char.Max, _ = strconv.Atoui(fields[2])
		} else if len(fields) == 3 && fields[0] == "supérieur" && fields[1] == "à" {
			char.Min, _ = strconv.Atoui(fields[2])
		}
	}
	return name, char
}

func (char *CdmChar) Print(name string) {
	fmt.Println("  " + name + " :")
	fmt.Println("    text : \"" + char.Text + "\"")
	if char.Min != 0 {
		fmt.Println("    min  : " + strconv.Uitoa(char.Min))
	}
	if char.Max != 0 {
		fmt.Println("    max  : " + strconv.Uitoa(char.Max))
	}
}

type CDM struct {
	NumMonstre  uint 
	Nom        string // exemple : "Mouch'oo Majestueux Sauvage Frénétique"
	Male       boolean
	TagAge     string // exemple : "Doyen"
	NomComplet string // exemple : "Mouch'oo Majestueux Sauvage Frénétique [Doyen]"
	
	Niveau_min uint
	Niveau_max uint
	Capacite_text string
	Chars      map[string]*CdmChar // il s'agit de la version non hardcodée des paramètres qui apparaissent sous la forme "Nom : Valeur"
}

/*
 transforme tous les paramètres de type CdmChar en des paramètres hardcodés, pour des
 traitements plus rapides et surtout un mapping bd compatible avec le seul driver mysql que j'ai trouvé à avoir l'air pas trop naze
*/
func (cdm *CDM) Compile() {
	if c:=cdm.Chars["Niveau"]; c!=nil {
		cdm.Niveau_min = c.Min
		cdm.Niveau_max = c.Max
	}
	if c:=cdm.Chars["Capacité spéciale"]; c!=nil {
		cdm.Capacite_text = c.Text
	}
	
}

// renvoie une nouvelle CDM si cette ligne est l'entame d'une CDM
func NewCdm(line string) *CDM {
	var fields []string
	var numField string
	var nomComplet string
	var male boolean
	if strings.Contains(line, "CONNAISSANCE DES MONSTRES") {
		fields = strings.Fields(line)
		fieldUn := -1
		for i, f := range fields {
			if f == "un" {
				fieldUn = i
				male = b_true
				break
			} else if f == "une" {
				fieldUn = i
				male = b_false
				break
			}
		}
		if fieldUn == -1 || fieldUn >= len(fields)-2 {
			fmt.Println("Impossible de trouver le début du nom")
			return nil
		}
		nomComplet = strings.Join(fields[fieldUn+1:len(fields)-1], " ")
	} else if strings.Contains(line, "Le Monstre Ciblé fait partie") {
		fields = strings.Fields(line)
		firstFieldWithOpeningBrace := -1
		for i, f := range fields {
			if f[0] == '(' {
				firstFieldWithOpeningBrace = i
				break
			}
		}
		if firstFieldWithOpeningBrace == -1 || firstFieldWithOpeningBrace >= len(fields)-2 {
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
	num, err := strconv.Atoui(numField)
	if err != nil {
		fmt.Println("Error trying to parse '" + numField + "' as an int : not a CDM")
		return nil
	}
	cdm := new(CDM)
	cdm.NumMonstre = num
	cdm.SetNomComplet(nomComplet)
	cdm.Chars = make(map[string]*CdmChar)
	cdm.Male = male
	return cdm
}


func (cdm *CDM) SetNomComplet(nc string) {
	cdm.NomComplet = nc
	// on cherche pour voir si on trouve la mention de l'age
	fields := strings.Fields(nc)
	lastField := fields[len(fields)-1]
	if lastField[0] == '[' && lastField[len(lastField)-1] == ']' {
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
	fmt.Println("  ID : " + strconv.Uitoa(cdm.NumMonstre))
	fmt.Println("  Nom : " + cdm.NomComplet)
	fmt.Println("  Sexe : " + cdm.Male.GenderString())
	for name, char := range cdm.Chars {
		char.Print(name)
	}
}
