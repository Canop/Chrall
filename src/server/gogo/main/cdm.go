package main

/*
une CDM représente une "connaissance des monstres" de Mounty Hall
*/

import (
	"fmt"
	"strconv"
	"strings"
	"hash"
	"crypto/sha1"
)

type boolean uint8 // il faut que je fasse des progrés dans la compréhension des énums et constantes...
const (
	b_unknown = boolean(iota)
	b_false   = boolean(iota)
	b_true    = boolean(iota)
)

func (b boolean) String() string {
	switch b {
	case b_unknown:
		return "inconnu"
	case b_false:
		return "non"
	case b_true:
		return "oui"
	}
	return "valeur_invalide"
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
	Min     uint    // 0 si pas défini
	Max     uint    // 0 si pas défini
	Value   uint    // 0 si pas défini
	Text    string  // on ne conservera probablement pas indéfiniment tout là dedans mais pour l'instant ça permettra d'améliorer l'algo sur les valeurs énumérées
	Boolean boolean // inconnu si pas défini
}


func AnalyseLineAsCdmChar(line string) (name string, char *CdmChar) {
	fields := strings.Split(line, ":", 4)
	if len(fields) < 2 || len(fields) > 3 {
		return "", nil
	}
	char = new(CdmChar)
	name = strings.Trim(fields[0], " ")
	char.Text = strings.Trim(strings.Join(fields[1:len(fields)], ":"), " ")
	indexPar := strings.Index(char.Text, "(")
	//fmt.Println("name:"+name)
	//fmt.Println(" char.Text:"+char.Text)
	if indexPar >= 0 {
		valuesText := char.Text[indexPar+1 : len(char.Text)]
		if valuesText[len(valuesText)-1] == ')' {
			valuesText = valuesText[0 : len(valuesText)-1]
		}
		//fmt.Println(" valuesText=\""+valuesText+"\"")
		fields = strings.Fields(valuesText)
		if len(fields) == 4 && fields[0] == "entre" && fields[2] == "et" {
			char.Min, _ = strconv.Atoui(fields[1])
			char.Max, _ = strconv.Atoui(fields[3])
		} else if len(fields) == 3 && fields[0] == "inférieur" && fields[1] == "à" {
			char.Max, _ = strconv.Atoui(fields[2])
		} else if len(fields) == 3 && fields[0] == "supérieur" && fields[1] == "à" {
			char.Min, _ = strconv.Atoui(fields[2])
		} else if len(fields) == 3 && fields[0] == "égal" && fields[1] == "à" {
			char.Min, _ = strconv.Atoui(fields[2])
			char.Max = char.Min
		}
	} else {
		fields = strings.Fields(char.Text)
		if len(fields) > 0 {
			value, valueErr := strconv.Atoui(fields[0])
			if valueErr == nil {
				char.Value = value
			}
			if len(fields) == 1 && fields[0] == "Oui" {
				char.Boolean = b_true
			} else if len(fields) == 1 && fields[0] == "Non" {
				char.Boolean = b_false
			}
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
	if char.Value != 0 {
		fmt.Println("    value  : " + strconv.Uitoa(char.Value))
	}
}

type CDM struct {
	NumMonstre                uint
	Nom                       string // exemple : "Mouch'oo Majestueux Sauvage Frénétique"
	Mâle                      boolean
	TagAge                    string // exemple : "Doyen"
	NomComplet                string // exemple : "Mouch'oo Majestueux Sauvage Frénétique [Doyen]"
	Niveau_min                uint
	Niveau_max                uint
	Capacite_text             string
	PointsDeVie_min           uint
	PointsDeVie_max           uint
	DésAttaque_min            uint
	DésAttaque_max            uint
	DésEsquive_min            uint
	DésEsquive_max            uint
	DésDégâts_min             uint
	DésDégâts_max             uint
	DésRégénération_min       uint
	DésRégénération_max       uint
	Armure_min                uint
	Armure_max                uint
	Vue_min                   uint
	Vue_max                   uint
	MaitriseMagique_min       uint
	MaitriseMagique_max       uint
	RésistanceMagique_min     uint
	RésistanceMagique_max     uint
	Famille_text              string
	NombreDAttaques           uint
	VitesseDeDéplacement_text string
	VoirLeCaché_boolean       boolean
	AttaqueADistance_boolean  boolean
	DLA_text                  string // dépend de l'individu et du moment ?
	DuréeTour_min             uint
	DuréeTour_max             uint
	Chargement_text           string // dépend de l'individu et du moment ?
	BonusMalus_text           string // dépend de l'individu et du moment ?
	PortéeDuPouvoir_text      string

	Chars map[string]*CdmChar // il s'agit de la version non hardcodée des paramètres qui apparaissent sous la forme "Nom : Valeur"
}


func (cdm *CDM) ComputeSHA1() []byte {
	unhash := "cdm"
	unhash += strconv.Uitoa(cdm.NumMonstre)
	unhash += cdm.NomComplet
	unhash += cdm.Mâle.GenderString()
	unhash += cdm.Famille_text // parce qu'elle n'est pas toujours dans les Chars...
	for key, value := range cdm.Chars {
		unhash += key + value.Text
	}
	//fmt.Println(" UNHASH : " + unhash)
	var h hash.Hash = sha1.New()
	h.Write([]byte(unhash))
	return h.Sum()
}

/**
 * utilise le nom de la caractéristique pour renseigner les champs.
 *  Remarques : 
 *   - attention, suivant l'origine des cdm des labels différents peuvent être utilisés
 *   - J'avais fait un switch initialement mais ça ne marchait pas pour tous les labels (au runtime), il semble y avoir des bugs sur les switch en go
 */
func (cdm *CDM) AddChar(name string, c *CdmChar) {
	if name == "Niveau" {
		cdm.Niveau_min = c.Min
		cdm.Niveau_max = c.Max
	} else if name == "Capacité spéciale" {
		cdm.Capacite_text = c.Text
	} else if name == "Points de Vie" {
		cdm.PointsDeVie_min = c.Min
		cdm.PointsDeVie_max = c.Max
	} else if name == "Dés d'Attaque" {
		cdm.DésAttaque_min = c.Min
		cdm.DésAttaque_max = c.Max
	} else if name == "Dés d'Esquive" {
		cdm.DésEsquive_min = c.Min
		cdm.DésEsquive_max = c.Max
	} else if name == "Dés de Dégât" || name == "Dés de Dégat" {
		cdm.DésDégâts_min = c.Min
		cdm.DésDégâts_max = c.Max
	} else if name == "Dés de Régénération" || name == "Dés de Régén." {
		cdm.DésRégénération_min = c.Min
		cdm.DésRégénération_max = c.Max
	} else if name == "Armure" {
		cdm.Armure_min = c.Min
		cdm.Armure_max = c.Max
	} else if name == "Vue" {
		cdm.Vue_min = c.Min
		cdm.Vue_max = c.Max
	} else if name == "Maitrise Magique" {
		cdm.MaitriseMagique_min = c.Min
		cdm.MaitriseMagique_max = c.Max
	} else if name == "Résistance Magique" {
		cdm.RésistanceMagique_min = c.Min
		cdm.RésistanceMagique_max = c.Max
	} else if name == "Famille" {
		cdm.Famille_text = c.Text
	} else if name == "Le Monstre ciblé fait partie des" {
		cdm.Famille_text = c.Text
	} else if name == "Nombre d'attaques" {
		cdm.NombreDAttaques = c.Value
	} else if name == "Vitesse de Déplacement" {
		cdm.VitesseDeDéplacement_text = c.Text
	} else if name == "Voir le Caché" {
		cdm.VoirLeCaché_boolean = c.Boolean
	} else if name == "Attaque à distance" {
		cdm.AttaqueADistance_boolean = c.Boolean
	} else if name == "DLA" {
		cdm.DLA_text = c.Text
	} else if name == "Durée Tour" || name == "Durée tour" {
		cdm.DuréeTour_min = c.Min
		cdm.DuréeTour_max = c.Max
	} else if name == "Chargement" {
		cdm.Chargement_text = c.Text
	} else if name == "Bonus Malus" {
		cdm.BonusMalus_text = c.Text
	} else if name == "Portée du Pouvoir" {
		cdm.PortéeDuPouvoir_text = c.Text
	} else if name == "Blessure" || name == "Blessure (Approximatif)" {
		// on ne met pas de message, on ignore ça volontairement
	} else if name == "Points de Vie restants (Approximatif)" {
		// ça vient de MountyZilla : on ignore
	} else {
		fmt.Println("Caractéristique inconnue : \"" + name + "\"")
		return // on n'ajoute pas à la map
	}

	cdm.Chars[name] = c
}


// renvoie une nouvelle CDM si cette ligne est l'entame d'une CDM
func NewCdm(lines []string) *CDM {
	if len(lines) < 4 {
		return nil
	}
	// on commence par faire du recollage/découpage pour gérer le cas des mails où la première ligne de la cdm est souvent coupée
	// PB : on va afficher ensuite un "ligne pas comprise" erroné en essayant de lire la ligne d'après
	// on pourrait optimiser aussi en évitant ce recollage bizarre mais c'est déjà bien compliqué de gérer tous les cas...
	var line string
	if len(lines[1]) > 4 && (lines[1][0] == '(' || lines[1][0] == '[') {
		line = lines[0] + " " + lines[1] // parce que l'espace est souvent perdu s'il coincide avec un changement de ligne
	} else {
		line = lines[0] + lines[1]
	}

	if index := strings.Index(line, ")"); index >= 0 {
		line = line[0:index]
	}

	var fields []string
	var numField string
	var nomComplet string
	var male boolean
	var famille string
	if strings.Contains(lines[0], "CONNAISSANCE DES MONSTRES") {
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
	} else if strings.Contains(lines[0], "Monstre Ciblé fait partie") {
		fields = strings.Fields(line)
		ip := strings.LastIndex(line, ":")
		ia := strings.Index(line, "(")
		ib := strings.Index(line, "]")
		if ip >= 0 && ia >= ip && ib > ia {
			famille = strings.Trim(line[ip+2:ia-1], " ")
			fmt.Println("Fam : '" + famille + "'")
			nomComplet = line[ia+1 : ib+1]
		} else {
			fmt.Println("Impossible de trouver le nom")
			return nil
		}
	} else {
		return nil
	}
	fmt.Println("nomComplet=\"" + nomComplet + "\"")
	numField = fields[len(fields)-1] // attention : le "fields" est d'une fiabilité relative (en cas de coupure sur l'espace, celui ci est viré)
	if indexParLeft := strings.Index(numField, "("); indexParLeft >= 0 {
		numField = numField[indexParLeft+1:]
	}
	numField = strings.TrimRight(numField, ")")
	if indexNo := strings.Index(numField, "N°"); indexNo >= 0 {
		numField = numField[indexNo+len("N°"):]
	}
	num, err := strconv.Atoui(numField)
	if err != nil {
		fmt.Println("Error trying to parse '" + numField + "' as an int : not a CDM")
		return nil
	}
	cdm := new(CDM)
	cdm.NumMonstre = num
	cdm.Famille_text = famille
	cdm.SetNomComplet(nomComplet)
	cdm.Chars = make(map[string]*CdmChar)
	cdm.Mâle = male
	return cdm
}


func (cdm *CDM) SetNomComplet(nc string) {
	cdm.NomComplet = nc
	// on cherche pour voir si on trouve la mention de l'age
	//fmt.Println("*****")
	i1 := strings.Index(nc, "[")
	i2 := strings.Index(nc, "]")
	if i1 > 0 && i2 > i1 {
		cdm.Nom = strings.Trim(nc[0:i1], " ")
		cdm.TagAge = nc[i1+1 : i2]
		cdm.NomComplet = cdm.Nom + " [" + cdm.TagAge + "]" // on reconstruit car parfois l'espace avant le '[' est manquant
	} else {
		cdm.NomComplet = nc
	}
	//fmt.Println("Nom : *" + cdm.Nom + "*")
	//fmt.Println("Age : *" + cdm.TagAge + "*")	
}

func (cdm *CDM) Print() {
	fmt.Println(" CDM-------------------------------")
	fmt.Println("  ID : " + strconv.Uitoa(cdm.NumMonstre))
	fmt.Println("  Nom : " + cdm.NomComplet)
	fmt.Println("  Sexe : " + cdm.Mâle.GenderString())
	for name, char := range cdm.Chars {
		char.Print(name)
	}
}
