package main

/*
quelques fonctions pour le formatage html
*/

import (
	"fmt"
	"strconv"
)

func cdmValuesCell(min uint, max uint) string {
	if min == max {
		return "<td>" + strconv.Uitoa(min) + "</td>"
	}
	if max == 0 {
		return "<td>" + strconv.Uitoa(min) + " - +∞</td>"
	}
	return "<td>" + strconv.Uitoa(min) + " - " + strconv.Uitoa(max) + "</td>"
}
func addCdmValuesLine(c []string, label string, min uint, max uint) string {
	if min == 0 && max == 0 {
		return ""
	}
	return "<th>" + label + "</th>" + cdmValuesCell(min, max)
}
func addCdmValueLine(c []string, label string, v uint) string {
	if v == 0 {
		return ""
	}
	return "<th>" + label + "</th><td>" + strconv.Uitoa(v) + "</td>"
}
func addCdmBooleanLine(c []string, label string, b boolean) string {
	if b == b_unknown {
		return ""
	}
	return "<th>" + label + "</th><td>" + b.String() + "</td>"
}
func addCdmTextLine(c []string, label string, t string) string {
	if t == "" {
		return ""
	}
	return "<th>" + label + "</th><td>" + t + "</td>"
}

type NameValue struct {
	name  string
	value string
}

func (nv NameValue) toCells(colspan string) string {
	html := "<th>" + nv.name + "</th><td colspan=" + colspan
	html += ">" + nv.value + "</td>"
	return html
}

func addUintsNV(c []NameValue, label string, min uint, max uint) []NameValue {
	if min == 0 && max == 0 {
		return c
	}
	n := len(c)
	c = c[0 : n+1]
	if max == 0 {
		c[n] = NameValue{label, strconv.Uitoa(min) + " - ?"}
	} else if min == max {
		c[n] = NameValue{label, strconv.Uitoa(min)}
	} else {
		c[n] = NameValue{label, strconv.Uitoa(min) + " - " + strconv.Uitoa(max)}
	}
	return c
}
func addUintNV(c []NameValue, label string, v uint) []NameValue {
	if v == 0 {
		return c
	}
	n := len(c)
	c = c[0 : n+1]
	c[n] = NameValue{label, strconv.Uitoa(v)}
	return c
}
func addBooleanNV(c []NameValue, label string, b boolean) []NameValue {
	if b == b_unknown {
		return c
	}
	n := len(c)
	c = c[0 : n+1]
	c[n] = NameValue{label, b.String()}
	return c
}
func addTextNV(c []NameValue, label string, t string) []NameValue {
	if t == "" {
		return c
	}
	n := len(c)
	c = c[0 : n+1]
	c[n] = NameValue{label, t}
	return c
}

const CDM_MAX_ITEMS_IN_COL = 10

// construit une description tabulaire d'une CDM (réelle ou estimée)
func (cdm *CDM) HtmlTable() string {
	html := "<table class=cdm cellpadding=2>" // oui, c'est pas bien le cellpadding... j'ai du mal avec le css...
	html += "<tr><th colspan=4 class=title>" + cdm.NomComplet + "</th></tr>"
	//> je répartis en plusieurs colonnes : gauche, droite, dessous en fonction des infos disponibles
	// on pourrait optimiser, ne pas créer ces tableaux, mais c'est pas comme si on avait des problèmes de performances
	lc := make([]NameValue, 0, CDM_MAX_ITEMS_IN_COL)
	rc := make([]NameValue, 0, CDM_MAX_ITEMS_IN_COL)
	bc := make([]NameValue, 0, CDM_MAX_ITEMS_IN_COL)
	lc = addUintsNV(lc, "Niveau", cdm.Niveau_min, cdm.Niveau_max)
	rc = addTextNV(rc, "Famille", cdm.Famille_text)
	lc = addUintsNV(lc, "Dés d'attaque", cdm.DésAttaque_min, cdm.DésAttaque_max)
	lc = addUintsNV(lc, "Dés d'esquive", cdm.DésEsquive_min, cdm.DésEsquive_max)
	lc = addUintsNV(lc, "Dés de dégâts", cdm.DésDégâts_min, cdm.DésDégâts_max)
	rc = addUintsNV(rc, "Points de vie", cdm.PointsDeVie_min, cdm.PointsDeVie_max)
	lc = addUintsNV(lc, "Dés de régénération", cdm.DésRégénération_min, cdm.DésRégénération_max)
	lc = addUintsNV(lc, "Armure", cdm.Armure_min, cdm.Armure_max)
	lc = addUintsNV(lc, "Vue", cdm.Vue_min, cdm.Vue_max)
	rc = addUintsNV(rc, "Maitrise magique", cdm.MaitriseMagique_min, cdm.MaitriseMagique_max)
	rc = addUintsNV(rc, "Résistance magique", cdm.RésistanceMagique_min, cdm.RésistanceMagique_max)
	bc = addTextNV(bc, "Capacité", cdm.Capacite_text)
	rc = addUintNV(rc, "Nombre d'attaques", cdm.NombreDAttaques)
	rc = addTextNV(rc, "Vitesse de déplacement", cdm.VitesseDeDéplacement_text)
	rc = addBooleanNV(rc, "Voit le caché", cdm.VoirLeCaché_boolean)
	lc = addBooleanNV(lc, "Attaque à distance", cdm.AttaqueADistance_boolean)
	lc = addUintsNV(lc, "Durée du tour", cdm.DuréeTour_min, cdm.DuréeTour_max)
	rc = addTextNV(rc, "Portée du pouvoir", cdm.PortéeDuPouvoir_text)
	//> on équilibre éventuellement les colonnes
	lcl := len(lc)
	rcl := len(rc)
	if lcl > rcl+1 {
		d := (lcl - rcl) / 2
		rc = rc[0 : rcl+d]
		lcl -= d
		for i := 0; i < d; i++ {
			rc[rcl+i] = lc[lcl+i]
		}
		lc = lc[0:lcl]
	}
	//> on écrit ensuite le tableau
	n := len(lc)
	if len(rc) > n {
		n = len(rc)
	}
	for i := 0; i < n; i++ {
		html += "<tr>"
		if i >= len(rc) {
			html += lc[i].toCells("3")
		} else if i >= len(lc) {
			html += rc[i].toCells("3")
		} else {
			html += lc[i].toCells("1")
			html += rc[i].toCells("1")
		}
		html += "</tr>"
	}
	for _, c := range bc {
		html += "<tr>" + c.toCells("3") + "</tr>"
	}
	html += "</table>"
	return html
}

func (be *BestiaryExtract) Html(monsterId uint, askerId int, m *TksManager, pourcentageBlessure uint) (html string) {
	if be == nil || be.NbCdm == 0 {
		html = "g0g0chrall ne connait pas ce monstre"
	} else {
		html = ""
		html += "<center>"
		html += be.Fusion.HtmlTable()
		html += "</center>"
		if be.PreciseMonster && monsterId > 0 {
			if be.NbCdm < 2 {
				html += "Cette estimation est basée sur une CDM unique de ce monstre"
			} else {
				html += fmt.Sprintf("Cette estimation est basée sur %d CDM du monstre %d.", be.NbCdm, monsterId)
			}
		} else {
			if be.NbMonsters < 2 {
				if be.NbCdm == 1 {
					html += "Une seule CDM a été reçue pour cette espèce."
				} else {
					html += fmt.Sprintf("Cette estimation est basée sur %d CDM d'un seul monstre.", be.NbCdm)
				}
			} else {
				html += fmt.Sprintf("Cette estimation est basée sur %d CDM concernant %d monstres.", be.NbCdm, be.NbMonsters)
				if be.Ante4M {
					html += fmt.Sprintf("<br>Seules les cdm de monstres de numéro inférieur à 4000000 sont prises en compte")
				} else {
					html += fmt.Sprintf("<br>Seules les cdm de monstres de numéro supérieur à 4000000 sont prises en compte")
				}
			}
		}
		if pourcentageBlessure > 0 {
			pvMin, pvMax := be.getPvRestant(pourcentageBlessure)
			html += fmt.Sprintf("Blessure : %d %%<br>Points de Vie restant : entre %d et %d<br>", pourcentageBlessure, pvMin, pvMax)
		}
		if askerId > 0 {
			ti := m.getTrollInfos(askerId)
			if ti != nil {
				html += "<br>Tuer ce monstre vous rapporterait " + be.getGainPx(ti.Niveau)
			}
		}
	}
	return html
}

// construit une description tabulaire d'un troll
func (tks *TrollInfos) HtmlTable(id int, m *TksManager) string {
	sum := tks.NbKillsTrolls + tks.NbKillsMonstres
	if sum == 0 {
		return "Ce troll n'a jamais tué"
	}
	guildStr := ""
	guilde := m.getGuildInfos(int(tks.IdGuilde))
	if guilde != nil {
		guildStr = "<br>Guilde : " + guilde.Nom
	}
	html := fmt.Sprintf(
		"%s %s %d ( %d )%s<table class=tks><tr><td>Victimes</td><td>Nombre</td><td>Part</td><td>Classement</td></tr><tr><th>Trolls</th><td>%d</td><td>%3.1f %%</td><td>%d</td></tr><tr><th>Monstres</th><td>%d</td><td>%3.1f %%</td><td>%d</td></tr></table>Classification Chrall : %s",
		tks.Nom, tks.Race.string(), tks.Niveau, id, guildStr,
		tks.NbKillsTrolls, (float32(tks.NbKillsTrolls) * 100 / float32(sum)), tks.ClassementKillsTrolls,
		tks.NbKillsMonstres, float32(tks.NbKillsMonstres)*100/float32(sum), tks.ClassementKillsMonstres, tks.ClassifChrall)
	return html
}
