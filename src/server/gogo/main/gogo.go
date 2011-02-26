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

	chrallHandler := new(ChrallHandler)
	chrallHandler.server = server
	http.Handle("/chrall", chrallHandler)

	wellHandler := new(WellHandler)
	wellHandler.server = server
	http.Handle("/chrall/puit", wellHandler)

	jsonHandler := new(JsonHandler)
	jsonHandler.server = server
	http.Handle("/chrall/json", jsonHandler)

	fmt.Printf("gogo démarré sur le port %d", port)
	http.ListenAndServe(":"+strconv.Itoa(port), nil)
}

func main() {
	gogo := new(GogoServer)
	gogo.Start()
}
