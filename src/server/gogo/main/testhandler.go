package main

/*
Ce service répond aux requètes JSON contenues dans le body (en POST donc)
*/

import (
	"http"
	"fmt"
	"io/ioutil"
)

type TestHandler struct {
	ChrallHandler
}

func (h *TestHandler) ServeHTTP(w http.ResponseWriter, hr *http.Request) {
	h.hit()
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "GET")

	fmt.Println("\n=== TestHandler : Requete reçue ====================")
	fmt.Println(" Method : " + hr.Method)
	fmt.Println(" URL : " + hr.RawURL)
	fmt.Println(" Proto : " + hr.Proto)
	fmt.Printf(" ContentLength : %d\n", hr.ContentLength)
	fmt.Println(" UserAgent : " + hr.UserAgent())
	fmt.Println(" Header :")
	for key, value := range hr.Header {
		fmt.Printf("  %s=%v\n", key, value)
	}

	b, e := ioutil.ReadAll(hr.Body)
	if e != nil {
		fmt.Println("Erreur lecture :")
		fmt.Println(e)
	}
	s := string(b)
	fmt.Print(s)

	fmt.Fprint(w, "Bien reçu")
}
