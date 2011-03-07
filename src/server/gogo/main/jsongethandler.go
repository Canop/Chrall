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
	monsterPartialNames := hr.Form["term"]
	if len(monsterPartialNames)<1 {
		fmt.Println(" no monster partial name in request")
		return
	}
	fmt.Println(" Request for \""+monsterPartialNames[0]+"\"")
	
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
	
	//action := hr.Form["action"] (inutile de tester l'action pour l'instant)
	h.serveBestiaryExtractHtml(w, hr)
}
