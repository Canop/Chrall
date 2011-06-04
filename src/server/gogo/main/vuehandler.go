package main

import (
	"bytes"
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
	portée := 8
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
	observations, err := h.store.ObservationsAutour(db, x, y, z, portée, askerId, amis)
	if err != nil {
		return fmt.Sprintf("Erreur recherche : %s\n", err.String())
	}
	if len(observations) == 0 {
		return "Rien trouvé"
	}
	xmin := x-portée
	xmax := x+portée
	ymin := y-portée
	ymax := y+portée
	
	html := bytes.NewBufferString("")
	fmt.Fprint(html, "<table class=grid>")
	for cy:=ymax; cy>=ymin; cy-- {
		fmt.Fprint(html, "<tr>")
		for cx:=xmin; cx<=xmax; cx++ {
			hdcx := cx-x+xmin
			hdcy := cy-y+ymin
			hdc := hdcx
			if hdcy>hdc {
				hdc=hdcy
			}
			empty := true
			fmt.Fprintf(html, "<td class=d%d>", (hdc-portée+20001)%2)
			for _, o := range(observations) {
				if o.X==int64(cx) && o.Y==int64(cy) {
					dist := dist(compte.Troll.X, o.X, compte.Troll.Y, o.Y, compte.Troll.Z, o.Z) // en attente...
					t := time.SecondsToLocalTime(o.Date)
					if empty {
						empty = false
					} else {
						fmt.Fprint(html, "<br>")
					}
					if o.Type=="troll" {
						fmt.Fprintf (html, "<a name=trolls class=ch_troll href='javascript:EPV(%d);' id=%d message='distance : %d<br>vu par %d le %s'>%d: %s</a>", o.Num, o.Num, dist, o.Auteur, t.Format("02/01 à 15h04"), o.Z, o.Nom)
					} else if o.Type=="monstre" {
						fmt.Fprintf (html, "<a name=monstres class=ch_monstre href='javascript:EMV(%d);' id=%d message='distance : %d<br>vu par %d le %s'>%d: %s</a>", o.Num, o.Num, dist, o.Auteur, t.Format("02/01 à 15h04"), o.Z, o.Nom)
					} else if o.Type=="lieu" {
						fmt.Fprintf (html, "<a name=lieux class=ch_place id=%d message='distance : %d<br>vu par %d le %s'>%d: %s</a>", o.Num, dist, o.Auteur, t.Format("02/01 à 15h04"), o.Z, o.Nom)
					}
				}
			}
			fmt.Fprint(html, "</td>")
		}
		fmt.Fprint(html, "</tr>")
	}
	
	return string(html.Bytes())
}

func (h *VueHandler) ServeHTTP(w http.ResponseWriter, hr *http.Request) {
	h.hit()
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "GET")
	w.Write([]byte(`<div id=searchResult>`))
	w.Write([]byte(h.getVueHtml(hr)))
	w.Write([]byte(`</div>`))
}
