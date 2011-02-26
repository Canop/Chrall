package main

import (
	"http"
	"fmt"
)


type RootHandler struct {
	Handler
}

func (h *RootHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	h.hit()
	h.head(w, "")
	fmt.Fprint(w, "<p>Vous êtes sur <span class=emphase>canop.org:gOgO</span>, un serveur écrit en go</p>")
	fmt.Fprintf(w, "<p>Nombre de requètes servies depuis le dernier lancement : <span class=emphase>%d</span></p>", h.server.nbRequests)
	h.foot(w)

}
