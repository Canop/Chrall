package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
)

const (
	ALLOW_SP         = true // cette constante permet de désactiver tout accès aux scripts publics de MH
	COUNT_MDP_CHECKS = true // le problème de compter ces appels est qu'on impacte le nombre d'appels
	//  d'un trolls sans avoir pu vérifier qu'il était réellement à l'origine
	//  de l'appel
)

var (
	port = os.Getenv("GOGO_PORT")
)

type GogoServer struct {
	Hitter
}

func (server *GogoServer) Start(tksManager *TksManager) {
	store := NewStore()

	chrallHandler := new(ChrallHandler)
	chrallHandler.store = store
	http.Handle("/", chrallHandler)

	wellHandler := new(WellHandler)
	wellHandler.parent = &chrallHandler.Hitter
	wellHandler.store = store
	http.Handle("/puits", wellHandler)

	searchPanelHandler := new(SearchPanelHandler)
	searchPanelHandler.parent = &chrallHandler.Hitter
	searchPanelHandler.store = store
	http.Handle("/searchpanel", searchPanelHandler)

	vueHandler := new(VueHandler)
	vueHandler.parent = &chrallHandler.Hitter
	vueHandler.store = store
	http.Handle("/vue", vueHandler)

	bestiaryHandler := new(BestiaryHandler)
	bestiaryHandler.parent = &chrallHandler.Hitter
	bestiaryHandler.store = store
	http.Handle("/bestiaire", bestiaryHandler)

	jsonPostHandler := new(JsonPostHandler)
	jsonPostHandler.store = store
	jsonPostHandler.tksManager = tksManager
	jsonPostHandler.parent = &chrallHandler.Hitter
	http.Handle("/jsonp", jsonPostHandler)

	jsonGetHandler := new(JsonGetHandler)
	jsonGetHandler.store = store
	jsonGetHandler.tksManager = tksManager
	jsonGetHandler.parent = &chrallHandler.Hitter
	http.Handle("/json", jsonGetHandler)

	testHandler := new(TestHandler)
	testHandler.parent = &chrallHandler.Hitter
	http.Handle("/test", testHandler)

	fmt.Printf("gogo démarre sur le port %s\n", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil { // notons qu'en principe si on arrive là c'est qu'il y a une erreur...
		fmt.Println("Erreur au lancement : ", err)
	}
}

func main() {
	fmt.Println("START GOGO")
	gogo := new(GogoServer)
	cheminDonnées := flag.String("dir", "", "chemin du répertoire des données")
	flag.Parse()
	if *cheminDonnées == "" {
		log.Fatal("Chemin répertoire des données non fourni. Utilisez -dir.")
	}
	tksManager := new(TksManager)
	tksManager.cheminDonnées = *cheminDonnées
	if !ALLOW_SP {
		log.Println("ALLOW_SP=false ===> Accès aux scripts publics MH désactivé")
	}
	gogo.Start(tksManager)
}
