package main

import (
	"fmt"
	"http"
	"time"
)


type VueHandler struct {
	ChrallHandler
}

func (h *VueHandler) getVueHtml(hr *http.Request) string {
	fmt.Println("\n=== SearchPanelHandler : Requete reçue ====================")
	fmt.Println(" URL : " + hr.RawURL)
	hr.ParseForm()

	askerId := GetFormValueAsInt(hr, "asker")
	mdpr := GetFormValue(hr, "mdpr") // mot de passe restreint
	x := GetFormValueAsInt(hr, "x")
	y := GetFormValueAsInt(hr, "y")
	z := GetFormValueAsInt(hr, "z")
	compteOk := false
	var compte *Compte

	db, err := h.store.Connect()
	if err != nil {
		fmt.Printf("Erreur ouverture connexion BD dans makeBestiaryExtractHtml : %s\n", err.String())
		return err.String()
	}
	defer db.Close()

	if askerId > 0 && mdpr != "" {
		compteOk, compte, err = h.store.CheckCompte(db, uint(askerId), mdpr)
	}
	if !compteOk {
		return "Compte non authentifié"
	}
	amis, err := h.store.GetPartageurs(db, askerId)
	if err != nil {
		return fmt.Sprintf("Erreur récupération amis : %s\n", err.String())
	}
	observations, err := h.store.ObservationsAutour(db, x, y, z, 5, askerId, amis)
	if err != nil {
		return fmt.Sprintf("Erreur recherche : %s\n", err.String())
	}
	if len(observations) == 0 {
		return "Rien trouvé"
	}
	html := fmt.Sprintf("%d résultats :", len(observations))
	html += "<table border='0' cellspacing='1' cellpadding='2' class='mh_tdborder' align='center'>"
	html += "<tr class=mh_tdtitre><td class=mh_tdpage><b>Dist.</b></td><td class=mh_tdpage><b>Réf.</b></td><td class=mh_tdpage><b>Nom</b></td>"
	html += "<td class=mh_tdpage><b>Position</b></td>"
	html += "<td class=mh_tdpage><b>Vu par</b></td><td class=mh_tdpage><b>Le</b></td><td class=mh_tdpage></td></tr>"
	for _, o := range observations {
		t := time.SecondsToLocalTime(o.Date)
		var lien string
		if o.Type == "troll" {
			lien = fmt.Sprintf("<a href='javascript:EPV(%d)' class=mh_trolls_1 id=%d>%s</a>", o.Num, o.Num, o.Nom)
		} else if o.Type == "monstre" {
			lien = fmt.Sprintf("<a href='javascript:EMV(%d, 750, 550)' class=mh_monstres id=%d>%s</a>", o.Num, o.Num, o.Nom)
		} else {
			lien = o.Nom
		}
		dist := dist(compte.Troll.X, o.X, compte.Troll.Y, o.Y, compte.Troll.Z, o.Z)
		btnVoir := fmt.Sprintf("<a href='javascript:montre(%d,%d,%d);'>%d  %d  %d</a>", o.X, o.Y, o.Z, o.X, o.Y, o.Z)
		html += fmt.Sprintf("<tr class=mh_tdpage><td>%d</td><td>%d</td><td>%s</td><td>%s</td><td>%d</td><td>%s</td></tr>", dist, o.Num, lien, btnVoir, o.Auteur, t.Format("02/01 à 15h04"))
	}
	html += "</table>"
	return html
}

func (h *VueHandler) ServeHTTP(w http.ResponseWriter, hr *http.Request) {
	h.hit()
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "GET")
	w.Write([]byte(`<div id=searchResult>`))
	w.Write([]byte(h.getVueHtml(hr)))
	w.Write([]byte(`</div>`))
}
