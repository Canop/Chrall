package main

import (
	"bytes"
	"fmt"
	"http"
	"strings"
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
	withTresors := GetFormValueAsInt(hr, "tresors")==1
	
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
	observations, err := h.store.ObservationsAutour(db, x, y, z, portée, askerId, amis, withTresors)
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
	nextDivId := time.Seconds()
	fmt.Fprint(html, "<table class=grid id=zoom_grid>")
	for cy:=ymax; cy>=ymin; cy-- {
		fmt.Fprint(html, "<tr>")
		for cx:=xmin; cx<=xmax; cx++ {
			hdcx := cx-x
			if hdcx<0 {hdcx=-hdcx}
			hdcy := cy-y
			if hdcy<0 {hdcy=-hdcy}
			hdc := hdcx
			if hdcy>hdc {
				hdc=hdcy
			}
			empty := true
			hasNoLine := false
			hasHole := false
			fmt.Fprintf(html, "<td hasContent class=d%d grid_x=%d grid_y=%d>", (hdc-portée+20001)%2, cx, cy)
			cellContent := bytes.NewBufferString("")
			objectsByLevel := map[int64][]string {}
			for _, o := range(observations) {
				if o.X==int64(cx) && o.Y==int64(cy) {
					dist := dist(compte.Troll.X, o.X, compte.Troll.Y, o.Y, compte.Troll.Z, o.Z) // en attente...
					empty = false
					t := time.SecondsToLocalTime(o.Date)
					if o.Type=="troll" {
						if hasNoLine {
							hasNoLine = false
						} else {
							fmt.Fprint(cellContent, "<br>")
						}
						fmt.Fprintf (cellContent, "<a name=trolls class=ch_troll href='javascript:EPV(%d);' id=%d message='distance : %d<br>vu par %d le %s'>%d: %s</a>", o.Num, o.Num, dist, o.Auteur, t.Format("02/01 à 15h04"), o.Z, o.Nom)
					} else if o.Type=="monstre" {
						if hasNoLine {
							hasNoLine = false
						} else {
							fmt.Fprint(cellContent, "<br>")
						}
						fmt.Fprintf (cellContent, "<a name=monstres class=ch_monster href='javascript:EMV(%d);' id=%d message='distance : %d<br>vu par %d le %s'>%d: %s</a>", o.Num, o.Num, dist, o.Auteur, t.Format("02/01 à 15h04"), o.Z, o.Nom)
					} else if o.Type=="tresor" {
						if objectsByLevel[o.Z]==nil {
							objectsByLevel[o.Z] = make([]string, 0, 10)
						}
						objectsByLevel[o.Z] = append(objectsByLevel[o.Z], fmt.Sprintf("<span class=ch_visible_object>%d: %d %s</span>", o.Z, o.Num, o.Nom))
					} else if o.Type=="lieu" {
						if o.Nom=="Trou de Météorite" {
							hasHole = true
						} else {
							if hasNoLine {
								hasNoLine = false
							} else {
								fmt.Fprint(cellContent, "<br>")
							}
							fmt.Fprintf (cellContent, "<a name=lieux class=ch_place id=%d message='distance : %d<br>vu par %d le %s'>%d: %s</a>", o.Num, dist, o.Auteur, t.Format("02/01 à 15h04"), o.Z, o.Nom)
						}
					}
				}
			}
			if empty {
				fmt.Fprint(html, "&nbsp;")
			} else {
				if hasHole {
					fmt.Fprint(html, "Trou de Météorite<br>")					
				}
				fmt.Fprint(html, string(cellContent.Bytes()))
				for z, objects := range (objectsByLevel) {
					merge := len(objects)>3
					if merge {
						fmt.Fprintf (html, "<br>")
						fmt.Fprintf (html, "<span class=ch_visible_object>%d : ", z)
						fmt.Fprintf (html, "<a class=ch_objects_toggler href=\"javascript:grid_changeDisplayByName('objects_%d');\">", nextDivId)
						fmt.Fprintf (html, "<b>%d trésors</b>", len(objects))
						fmt.Fprintf (html, "</a>")
						fmt.Fprintf (html, "<div name=objects_%d class=hiddenDiv>", nextDivId)
						nextDivId++
					}
					fmt.Fprint (html, "<br>", strings.Join(objects, "<br>"))
					if merge {
						fmt.Fprintf (html, "</div></span>")
					}
				}
			}
			fmt.Fprint(html, "</td>")
		}
		fmt.Fprint(html, "</tr>")
	}
	fmt.Fprint(html, "</table>")	
	return string(html.Bytes())
}

func (h *VueHandler) ServeHTTP(w http.ResponseWriter, hr *http.Request) {
	h.hit()
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "GET")
	//~ w.Write([]byte(`<div id=searchResult>`))
	w.Write([]byte(h.getVueHtml(hr)))
	//~ w.Write([]byte(`</div>`))
}
