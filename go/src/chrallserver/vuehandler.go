package main

import (
	"bytes"
	"fmt"
	//~ "log"
	"net/http"
	"strings"
	"time"
)

type VueHandler struct {
	ChrallHandler
}

func (h *VueHandler) getVueHtml(hr *http.Request) string {
	//~ log.Println("URL :", hr.URL)
	hr.ParseForm()

	askerId := GetFormValueAsId(hr, "asker")
	mdpr := GetFormValue(hr, "mdpr") // mot de passe restreint
	x := GetFormValueAsId(hr, "x")
	y := GetFormValueAsId(hr, "y")
	z := GetFormValueAsId(hr, "z")
	withTresors := GetFormValueAsId(hr, "tresors") == 1

	portée := 8
	var compte *Compte

	db, err := h.store.DB()
	if err != nil {
		fmt.Printf("Erreur ouverture connexion BD dans makeBestiaryExtractHtml : %s\n", err.Error())
		return err.Error()
	}
	defer db.Close()

	if !h.store.IsCompteOK(db, askerId, mdpr) {
		fmt.Println("Compte non authentifié (getVueHtml)")
		return "Compte non authentifié"
	}

	compte, err = h.store.GetCompte(db, askerId)
	if err != nil {
		return fmt.Sprintf("Erreur récupération compte : %s\n", err.Error())
	}

	amis, err := h.store.GetPartageurs(db, askerId)
	if err != nil {
		return fmt.Sprintf("Erreur récupération amis : %s\n", err.Error())
	}
	observations, err := h.store.ObservationsAutour(db, x, y, z, portée, askerId, amis, withTresors)
	if err != nil {
		return fmt.Sprintf("Erreur recherche : %s\n", err.Error())
	}
	if len(observations) == 0 {
		return "Rien trouvé"
	}
	xmin := x - portée
	xmax := x + portée
	ymin := y - portée
	ymax := y + portée

	html := bytes.NewBufferString("")
	nextDivId := time.Now().Unix()
	fmt.Fprint(html, "<table class=grid id=zoom_grid>")
	for cy := ymax; cy >= ymin; cy-- {
		fmt.Fprint(html, "<tr>")
		for cx := xmin; cx <= xmax; cx++ {
			hdcx := cx - x
			if hdcx < 0 {
				hdcx = -hdcx
			}
			hdcy := cy - y
			if hdcy < 0 {
				hdcy = -hdcy
			}
			hdc := hdcx
			if hdcy > hdc {
				hdc = hdcy
			}
			empty := true
			hasNoLine := false
			hasHole := false
			fmt.Fprintf(html, "<td hasContent class=d%d grid_x=%d grid_y=%d>", (hdc-portée+20001)%2, cx, cy)
			cellContent := bytes.NewBufferString("")
			objectsByLevel := map[int32][]string{}
			for _, o := range observations {
				if o.X == int32(cx) && o.Y == int32(cy) {
					dist := dist(compte.Troll.X, o.X, compte.Troll.Y, o.Y, compte.Troll.Z, o.Z) // en attente...
					empty = false
					t := time.Unix(o.Date, 0)

					if o.Type == "tresor" {
						if objectsByLevel[o.Z] == nil {
							objectsByLevel[o.Z] = make([]string, 0, 10)
						}
						objectsByLevel[o.Z] = append(objectsByLevel[o.Z], fmt.Sprintf("<span class=ch_visible_object>%d: %d %s</span>", o.Z, o.Num, o.Nom))
					} else {
						an := o.Z != int32(z)
						if an {
							fmt.Fprintf(cellContent, "<span name=3D>")
						}
						if hasNoLine {
							hasNoLine = false
						} else {
							fmt.Fprint(cellContent, "<br>")
						}
						switch o.Type {
						case "troll":
							fmt.Fprintf(cellContent, "<a name=trolls class=ch_troll href='javascript:EPV(%d);' id=%d message='distance : %d<br>vu par %d le %s'>%d: %s</a>", o.Num, o.Num, dist, o.Auteur, t.Format("02/01 à 15h04"), o.Z, o.Nom)
						case "monstre":
							fmt.Fprintf(cellContent, "<a name=monstres class=ch_monster href='javascript:EMV(%d);' id=%d message='distance : %d<br>vu par %d le %s'>%d: %s</a>", o.Num, o.Num, dist, o.Auteur, t.Format("02/01 à 15h04"), o.Z, o.Nom)
						case "lieu":
							if o.Nom == "Trou de Météorite" {
								hasHole = true
							} else {
								fmt.Fprintf(cellContent, "<a name=lieux class=ch_place id=%d message='distance : %d<br>vu par %d le %s'>%d: %s</a>", o.Num, dist, o.Auteur, t.Format("02/01 à 15h04"), o.Z, o.Nom)
							}
						}
						if an {
							fmt.Fprintf(cellContent, "</span>")
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
				for zo, objects := range objectsByLevel {
					an := zo != int32(z)
					merge := len(objects) > 3
					if an {
						fmt.Fprintf(html, "<span name=3D>")
					}
					if merge {
						fmt.Fprintf(html, "<br>")
						fmt.Fprintf(html, "<span class=ch_visible_object>%d : ", zo)
						fmt.Fprintf(html, "<a class=ch_objects_toggler href=\"javascript:grid_changeDisplayByName('objects_%d');\">", nextDivId)
						fmt.Fprintf(html, "<b>%d trésors</b>", len(objects))
						fmt.Fprintf(html, "</a>")
						fmt.Fprintf(html, "<div name=objects_%d class=hiddenDiv>", nextDivId)
						nextDivId++
					}
					fmt.Fprint(html, "<br>", strings.Join(objects, "<br>"))
					if merge {
						fmt.Fprintf(html, "</div></span>")
					}
					if an {
						fmt.Fprintf(html, "</span>")
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
