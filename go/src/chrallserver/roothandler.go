package main

import (
	"fmt"
	"net/http"
)

type RootHandler struct {
	Handler
}

func (h *RootHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	h.hit()
	h.head(w, "")
	fmt.Fprint(w, "<p>Vous êtes sur <span class=emphase>chrall.dystroy.org/gogo</span>, un serveur écrit en go</p>")
	fmt.Fprintf(w, "<p>Nombre de requètes servies depuis le dernier lancement : <span class=emphase>%d</span></p>", h.nbHits)
	h.foot(w)
}
