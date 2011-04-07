package main

import (
	"http"
	"fmt"
	"strconv"
)

const (
	port = 9090
)


type GogoServer struct {
	Hitter
}

func (server *GogoServer) Start() {
	rootHandler := new(RootHandler)
	rootHandler.parent = &server.Hitter
	http.Handle("/", rootHandler)

	cdmStore := NewStore("temp_user", "temp_pwd") // TODO mettre user et mdp dans un fichier de config quelque part

	tksManager := new(TksManager)

	chrallHandler := new(ChrallHandler)
	chrallHandler.parent = &rootHandler.Hitter
	chrallHandler.store = cdmStore
	http.Handle("/chrall", chrallHandler)
	http.Handle("/chrall/", chrallHandler)

	wellHandler := new(WellHandler)
	wellHandler.parent = &chrallHandler.Hitter
	wellHandler.store = cdmStore
	http.Handle("/chrall/puits", wellHandler)
	http.Handle("/chrall/puit", wellHandler)

	bestiaryHandler := new(BestiaryHandler)
	bestiaryHandler.parent = &chrallHandler.Hitter
	bestiaryHandler.store = cdmStore
	http.Handle("/chrall/bestiaire", bestiaryHandler)

	jsonPostHandler := new(JsonPostHandler)
	jsonPostHandler.store = cdmStore
	jsonPostHandler.parent = &chrallHandler.Hitter
	http.Handle("/chrall/jsonp", jsonPostHandler)

	jsonGetHandler := new(JsonGetHandler)
	jsonGetHandler.store = cdmStore
	jsonGetHandler.tksManager = tksManager
	jsonGetHandler.parent = &chrallHandler.Hitter
	http.Handle("/chrall/json", jsonGetHandler)

	fmt.Printf("gogo démarré sur le port %d", port)
	http.ListenAndServe(":"+strconv.Itoa(port), nil)
}

func main() {
	gogo := new(GogoServer)
	gogo.Start()
}
