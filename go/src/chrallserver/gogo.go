package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"strconv"
)

const (
	port = 8000
	ALLOW_SP = false // cette constante permet de désactiver tout accès aux scripts publics de MH
)

type GogoServer struct {
	Hitter
}

func (server *GogoServer) Start(tksManager *TksManager) {
	rootHandler := new(RootHandler)
	rootHandler.parent = &server.Hitter
	http.Handle("/", rootHandler)

	store := NewStore("temp_user", "temp_pwd") // TODO mettre user et mdp dans un fichier de config quelque part

	chrallHandler := new(ChrallHandler)
	chrallHandler.parent = &rootHandler.Hitter
	chrallHandler.store = store
	http.Handle("/chrall", chrallHandler)
	http.Handle("/chrall/", chrallHandler)

	wellHandler := new(WellHandler)
	wellHandler.parent = &chrallHandler.Hitter
	wellHandler.store = store
	http.Handle("/chrall/puits", wellHandler)
	http.Handle("/chrall/puit", wellHandler)

	searchPanelHandler := new(SearchPanelHandler)
	searchPanelHandler.parent = &chrallHandler.Hitter
	searchPanelHandler.store = store
	http.Handle("/chrall/searchpanel", searchPanelHandler)

	vueHandler := new(VueHandler)
	vueHandler.parent = &chrallHandler.Hitter
	vueHandler.store = store
	http.Handle("/chrall/vue", vueHandler)

	bestiaryHandler := new(BestiaryHandler)
	bestiaryHandler.parent = &chrallHandler.Hitter
	bestiaryHandler.store = store
	http.Handle("/chrall/bestiaire", bestiaryHandler)

	jsonPostHandler := new(JsonPostHandler)
	jsonPostHandler.store = store
	jsonPostHandler.tksManager = tksManager
	jsonPostHandler.parent = &chrallHandler.Hitter
	http.Handle("/chrall/jsonp", jsonPostHandler)

	jsonGetHandler := new(JsonGetHandler)
	jsonGetHandler.store = store
	jsonGetHandler.tksManager = tksManager
	jsonGetHandler.parent = &chrallHandler.Hitter
	http.Handle("/chrall/json", jsonGetHandler)

	testHandler := new(TestHandler)
	testHandler.parent = &chrallHandler.Hitter
	http.Handle("/test", testHandler)

	fmt.Printf("gogo démarre sur le port %d\n", port)
	err := http.ListenAndServe(":"+strconv.Itoa(port), nil)
	if err != nil { // notons qu'en principe si on arrive là c'est qu'il y a une erreur...
		fmt.Println("Erreur au lancement : ", err)
	}
}

func main() {
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
