package main

import (
	"http"
	"fmt"
)


type ChrallHandler struct {
	Handler
	store *MysqlStore
}


func (h *ChrallHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	h.hit()
	h.head(w, "gOgOchrall")
	fmt.Fprint(w, "<p>Vous êtes sur <span class=emphase>gOgOchrall</span>, le service <a class=gogo href=http://www.canop.org/chrall>chrall</a> de <a class=gogo href=..>canop.org:gOgO</a></p>")
	if h.nbHits > 1 {
		fmt.Fprintf(w, "<p><span class=emphase>%d</span> requètes chrall servies depuis le dernier lancement</p>", h.nbHits)
	}
	fmt.Fprint(w, "<p>Fonctions disponibles : <ul>")
	fmt.Fprint(w, "<li><a class=gogo href='/chrall/puits'>Le Puits</a> : vous pouvez lui offrir vos CDM</li>")
	fmt.Fprint(w, "<li><a class=gogo href='/chrall/bestiaire'>Le Bestiaire</a> : vous y lirez ce que gogoChrall sait des monstres</li>")
	fmt.Fprint(w, "</ul></p>")
	h.foot(w)
}
