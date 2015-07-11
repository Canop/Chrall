package main

import (
	"fmt"
	"net/http"
	"time"
)

// ça, c'est l'exemple type de cas où le Go est lourd...
func dist(x1 int32, x2 int32, y1 int32, y2 int32, z1 int32, z2 int32) int32 {
	dx := x1 - x2
	if dx < 0 {
		dx = -dx
	}
	dy := y1 - y2
	if dy < 0 {
		dy = -dy
	}
	dz := z1 - z2
	if dz < 0 {
		dz = -dz
	}
	d := dx
	if dy > d {
		d = dy
	}
	if dz > d {
		d = dz
	}
	return d
}

type SearchPanelHandler struct {
	ChrallHandler
}

func (h *SearchPanelHandler) getSearchPanelHtml(hr *http.Request) string {
	//~ fmt.Println("\n=== SearchPanelHandler : Requete reçue ====================")
	//~ fmt.Println(" URL : " + hr.RawURL)
	hr.ParseForm()

	askerId := GetFormValueAsId(hr, "asker")
	mdpr := GetFormValue(hr, "mdpr") // mot de passe restreint
	tok := GetFormValue(hr, "tok")
	var compte *Compte

	db, err := h.store.DB()
	if err != nil {
		fmt.Printf("Erreur ouverture connexion BD dans makeBestiaryExtractHtml : %s\n", err.Error())
		return err.Error()
	}
	defer db.Close()

	if !h.store.IsCompteOK(db, askerId, mdpr) {
		return "Compte non authentifié"
	}
	if tok == "" {
		return "Demande non comprise"
	}
	amis, err := h.store.GetPartageurs(db, askerId)
	if err != nil {
		return fmt.Sprintf("Erreur récupération amis : %s\n", err.Error())
	}
	observations, err := h.store.SearchObservations(db, tok, askerId, amis)
	if err != nil {
		return fmt.Sprintf("Erreur recherche : %s\n", err.Error())
	}
	if len(observations) == 0 {
		return "Rien trouvé"
	}
	html := fmt.Sprintf("%d résultats :", len(observations))
	html += "<table border='0' cellspacing='1' cellpadding='2' class='mh_tdborder' align='center'>"
	html += "<tr class=mh_tdtitre><td class=mh_tdpage><b>Dist.</b></td><td class=mh_tdpage><b>Réf.</b></td><td class=mh_tdpage><b>Nom</b></td>"
	html += "<td class=mh_tdpage><b>Position</b></td>"
	html += "<td class=mh_tdpage><b>Vu par</b></td><td class=mh_tdpage><b>Le</b></td></tr>"
	for _, o := range observations {
		t := time.Unix(o.Date, 0)
		var lien string
		if o.Type == "troll" {
			lien = fmt.Sprintf("<a href='javascript:EPV(%d)' class=mh_trolls_1 id=%d>%s</a>", o.Num, o.Num, o.Nom)
		} else if o.Type == "monstre" {
			lien = fmt.Sprintf("<a href='javascript:EMV(%d, 750, 550)' class=mh_monstres id=%d>%s</a>", o.Num, o.Num, o.Nom)
		} else {
			lien = o.Nom
		}
		dist := dist(compte.Troll.X, o.X, compte.Troll.Y, o.Y, compte.Troll.Z, o.Z)
		btnVoir := fmt.Sprintf("<a x=%d y=%d z=%d class=gogo name=zoom>%d  %d  %d</a>", o.X, o.Y, o.Z, o.X, o.Y, o.Z)
		html += fmt.Sprintf("<tr class=mh_tdpage><td>%d</td><td>%d</td><td>%s</td><td>%s</td><td>%d</td><td>%s</td></tr>", dist, o.Num, lien, btnVoir, o.Auteur, t.Format("02/01 à 15h04"))
	}
	html += "</table>"
	return html
}

func (h *SearchPanelHandler) ServeHTTP(w http.ResponseWriter, hr *http.Request) {
	h.hit()
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "GET")
	w.Write([]byte(`<div id=searchResult>`))
	w.Write([]byte(h.getSearchPanelHtml(hr)))
	w.Write([]byte(`</div>`))
}
