package main

import (
	"fmt"
	"net/http"
	"strconv"
)

const (
	port = 8000
)

type GogoServer struct {
	Hitter
}

func (server *GogoServer) Start() {
	rootHandler := new(RootHandler)
	rootHandler.parent = &server.Hitter
	http.Handle("/", rootHandler)

	store := NewStore("temp_user", "temp_pwd") // TODO mettre user et mdp dans un fichier de config quelque part

	tksManager := new(TksManager)

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
	gogo.Start()
}
