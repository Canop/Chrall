package main

/*
Ce service répond aux requètes JSON en GET
*/

import (
	"http"
	"fmt"
	"json"
)


type JsonGetHandler struct {
	Handler
	store *CdmStore
}

func NewJsonGetHandler(store *CdmStore) *JsonGetHandler {
	h := new(JsonGetHandler)
	h.store = store
	return h
}


func (h *JsonGetHandler) serveBestiaryExtractHtml(w http.ResponseWriter, hr *http.Request) {
	monsterCompleteNames := hr.Form["name"]
	if len(monsterCompleteNames) < 1 {
		fmt.Println(" no monster complete name in request")
		return
	}
	fmt.Println(" Request for \"" + monsterCompleteNames[0] + "\"")

	be, err := h.store.ComputeMonsterStats(monsterCompleteNames[0])
	if err != nil {
		fmt.Println(" Erreur : " + err.String())
		return
	}
	var html string
	if be == nil {
		html = "g0g0chrall ne connait pas ce monstre"
	} else {
		if be.NbMonsters < 2 {
			if be.NbCdm == 1 {
				html = "Une seule CDM a été reçue pour cette espèce."
			} else {
				html = fmt.Sprintf("Cette estimation est basée sur %d CDM d'un seul monstre.", be.NbCdm)
			}
		} else {
			html = fmt.Sprintf("Cette estimation est basée sur %d CDM concernant %d monstres.", be.NbCdm, be.NbMonsters)
		}
		html += "<br><br><center>"
		html += be.Fusion.HtmlTable()
		html += "</center>"
	}
	fmt.Println("HTML:\n:" + html)
	bhtml, _ := json.Marshal(html)
	w.Write(bhtml)
}

func (h *JsonGetHandler) serveAutocompleteMonsterNames(w http.ResponseWriter, hr *http.Request) {
	monsterPartialNames := hr.Form["term"]
	if len(monsterPartialNames) < 1 {
		fmt.Println(" no monster partial name in request")
		return
	}
	fmt.Println(" Request for \"" + monsterPartialNames[0] + "\"")

	list, err := h.store.getMonsterCompleteNames(monsterPartialNames[0])
	if err != nil {
		fmt.Println(" Erreur : " + err.String())
		return
	}
	blist, _ := json.Marshal(list)
	w.Write(blist)
}

func (h *JsonGetHandler) ServeHTTP(w http.ResponseWriter, hr *http.Request) {
	h.hit()

	fmt.Println("\n=== JsonGetHandler : Requete reçue ====================")
	fmt.Println(" URL : " + hr.RawURL)
	hr.ParseForm()

	actions := hr.Form["action"]
	var action string
	if len(actions) > 0 {
		action = actions[0]
	} else {
		action = ""
	}
	if action == "get_monster_names" {
		h.serveAutocompleteMonsterNames(w, hr)
	} else if action == "get_extract" {
		h.serveBestiaryExtractHtml(w, hr)
	} else {
		fmt.Println(" Requete non comprise")
	}
}
