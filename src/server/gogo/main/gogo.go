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
	nbRequests int
}

func (server *GogoServer) Start() {
	rootHandler := new(RootHandler)
	rootHandler.server = server
	http.Handle("/", rootHandler)
	
	cdmStore := NewStore("temp_user", "temp_pwd") // TODO mettre user et mdp dans un fichier de config quelque part

	chrallHandler := new(ChrallHandler)
	chrallHandler.server = server
	http.Handle("/chrall", chrallHandler)
	http.Handle("/chrall/", chrallHandler)

	wellHandler := new(WellHandler)
	wellHandler.server = server
	http.Handle("/chrall/puits", wellHandler)
	http.Handle("/chrall/puit", wellHandler)

	bestiaryHandler := NewBestiaryHandler(cdmStore)
	bestiaryHandler.server = server
	http.Handle("/chrall/bestiaire", bestiaryHandler)

	jsonPostHandler := NewJsonPostHandler(cdmStore)
	jsonPostHandler.server = server
	http.Handle("/chrall/json", jsonPostHandler)

	fmt.Printf("gogo démarré sur le port %d", port)
	http.ListenAndServe(":"+strconv.Itoa(port), nil)
}

func main() {
	gogo := new(GogoServer)
	gogo.Start()
}
