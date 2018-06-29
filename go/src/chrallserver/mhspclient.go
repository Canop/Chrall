package main

// Interrogations des Scripts Publics MH (la version non SOAP)

import (
	"bufio"
	"chrall"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

const (
	SP_VUE    = "http://sp.mountyhall.com/SP_Vue2.php?Numero=%d&Motdepasse=%s&Tresors=%d&Lieux=%d"
	SP_PROFIL = "http://sp.mountyhall.com/SP_Profil2.php?Numero=%d&Motdepasse=%s"
)

func Atoi32(s string) int32 {
	i64, _ := strconv.ParseInt(s, 10, 32)
	return int32(i64)
}

func CheckPasswordSp(numero int, mdp_restreint string) (ok bool, errorDetails string) {
	fmt.Printf("CheckPasswordSp %d / %s\n", numero, mdp_restreint)
	httpClient := new(http.Client)
	request := fmt.Sprintf(SP_PROFIL, numero, mdp_restreint)
	fmt.Println("Fetching", request)
	resp, err := httpClient.Get(request)
	if err != nil {
		return false, err.Error()
	}
	defer resp.Body.Close()
	r := bufio.NewReader(resp.Body)
	bline, _, _ := r.ReadLine()
	line := string(bline)
	fmt.Println("Answer:", line)
	if strings.HasPrefix(line, fmt.Sprintf("%d;", numero)) {
		return true, ""
	} else {
		return false, "Unexpected answer, probably a wrong password"
	}
}

// interroge le serveur pour récupérer le profil
// td est optionnel. Passer nil permet de vérifier que le mdp est correct
func FillTrollDataSp(numero int, mdp_restreint string, td *TrollData) (ok bool, errorDetails string) {
	fmt.Printf("FillTrollDataSp %d / %s\n", numero, mdp_restreint)
	httpClient := new(http.Client)
	request := fmt.Sprintf(SP_PROFIL, numero, mdp_restreint)
	fmt.Println("Fetching", request)
	resp, err := httpClient.Get(request)
	if err != nil {
		return false, err.Error()
	}
	defer resp.Body.Close()
	r := bufio.NewReader(resp.Body)
	bline, _, _ := r.ReadLine()
	line := string(bline)
	log.Println("Answer:", line)
	if strings.HasPrefix(line, fmt.Sprintf("%d;", numero)) {
		if td != nil {
			// SP_Profil2.php?Numero=XXX&Motdepasse=YYY :
			// Ordre des champs --> ID, Position X ; Position Y ; Position N ; PV Actuels; PV Max ; PA Restant;
			//  					DLA ; Nb Dés d'Attaque ; Nb Dés d'Esquive ; Nb Dés de Dégat ; Nb Dés de Régénération ;
			//                       Vue ; Armure ; MM ; RM ; attaques subies ; fatigue ; camouflage ? ; invisible ? ; intangible ? ;
			//						 Nb parades programmées ; Nb contre-attaques programmées ; durée du tour ; bonus de durée (hors équipement) ;
			//						Armure naturelle ; Nombre de dés d'armure en moins

			tokens := strings.SplitN(line, ";", 25)
			td.PV_max, _ = strconv.Atoi(tokens[5])
			td.PV_actuels, _ = strconv.Atoi(tokens[4])
			td.X = Atoi32(tokens[1])
			td.Y = Atoi32(tokens[2])
			td.Z = Atoi32(tokens[3])
			td.Fatigue, _ = strconv.Atoi(tokens[17])
			td.PA, _ = strconv.Atoi(tokens[6])
			td.Vue, _ = strconv.Atoi(tokens[12])
			fmt.Printf("tokens[7]: %s\n", tokens[7])
			loc, _ := time.LoadLocation("Europe/Paris")
			timeProchainTour, _ := time.ParseInLocation("2006-01-02 15:04:05", tokens[7], loc) // exemple: 2015-09-17 00:35:35
			td.ProchainTour = timeProchainTour.Unix()
			fmt.Printf("td.ProchainTour (secondes): %d\n", timeProchainTour.Unix())
			dureeTourMin, _ := strconv.ParseInt(tokens[23], 10, 64) // reçu en minutes
			td.DureeTour = dureeTourMin * 60
		}
		log.Printf("filled TrollData: %+v\n", td)
		return true, ""
	} else {
		return false, "Unexpected answer, probably a wrong password"
	}
}

/*
récupère la vue d'un troll.
Renvoie des SoapItem pour la compatibilité avec la fonction FetchVueSoap.
Utilise le TksManager pour renseigner le nom du troll qui n'est pas renvoyé par le sp.
Paramètres avecTresors, avecLieux : 0 ou 1
*/
func FetchVueSp(numero int, mdp_restreint string, avecTresors int, avecLieux int, tksManager *TksManager) (items []*SoapItem, errorDetails string) {
	httpClient := new(http.Client)
	request := fmt.Sprintf(SP_VUE, numero, mdp_restreint, avecTresors, avecLieux)
	resp, err := httpClient.Get(request)
	if err != nil {
		errorDetails = err.Error()
		return
	}
	defer resp.Body.Close()
	r := bufio.NewReader(resp.Body)
	bline, _, _ := r.ReadLine()
	line := string(bline)
	currentType := ""
	for line != "" {
		if line[0] == '#' {
			tokens := strings.SplitN(line, " ", 2)
			if tokens[0] == "#DEBUT" && len(tokens) > 1 {
				currentType = (tokens[1])[0 : len(tokens[1])-1]
			}
		} else {
			tokens := strings.SplitN(line, ";", 5)
			//fmt.Printf(" %s %+v\n", currentType, tokens)
			item := new(SoapItem)
			item.Numero, _ = strconv.Atoi(tokens[0])
			if item.Numero > 0 {
				if currentType == "TROLL" && len(tokens) > 3 {
					item.Nom, _, _ = tksManager.GetNomRaceNiveauTroll(item.Numero)
					item.PositionX, _ = strconv.Atoi(tokens[1])
					item.PositionY, _ = strconv.Atoi(tokens[2])
					item.PositionN, _ = strconv.Atoi(tokens[3])
				} else if len(tokens) > 4 {
					item.Nom = chrall.Iso88591ToUtf8(tokens[1])
					item.PositionX, _ = strconv.Atoi(tokens[2])
					item.PositionY, _ = strconv.Atoi(tokens[3])
					item.PositionN, _ = strconv.Atoi(tokens[4])
				}
				if item.Nom != "" && currentType != "" {
					item.Type = currentType
					items = append(items, item)
				}
			}
		}
		bline, _, _ = r.ReadLine()
		line = string(bline)
	}
	return
}
