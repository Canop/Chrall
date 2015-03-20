package main

// Interrogations des Scripts Publics MH (la version non SOAP)

import (
	"bufio"
	"chrall"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

func CheckPasswordSp(numero int, mdp_restreint string) (ok bool, errorDetails string) {
	fmt.Printf("CheckPasswordSp %d / %s\n", numero, mdp_restreint)
	httpClient := new(http.Client)
	request := fmt.Sprintf("http://sp.mountyhall.com/SP_Profil2.php?Numero=%d&Motdepasse=%s", numero, mdp_restreint)
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

/*
récupère la vue d'un troll.
Renvoie des SoapItem pour la compatibilité avec la fonction FetchVueSoap.
Utilise le TksManager pour renseigner le nom du troll qui n'est pas renvoyé par le sp.
Paramètres avecTresors, avecLieux : 0 ou 1
*/
func FetchVueSp(numero int, mdp_restreint string, avecTresors int, avecLieux int, tksManager *TksManager) (items []*SoapItem, errorDetails string) {
	httpClient := new(http.Client)
	request := fmt.Sprintf("http://sp.mountyhall.com/SP_Vue2.php?Numero=%d&Motdepasse=%s&Tresors=%d&Lieux=%d", numero, mdp_restreint, avecTresors, avecLieux)
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
