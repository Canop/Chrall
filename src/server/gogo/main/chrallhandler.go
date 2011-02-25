package main

import (
	"http"
	"fmt"
)


type ChrallHandler struct {
	Handler
}

func (h *ChrallHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	h.hit()
	h.head(w)
	fmt.Fprint(w, "<p>Vous êtes sur <span class=emphase>gogochrall</span>, le service <a href=http://www.canop.org/chrall>chrall</a> de <a href=..>canop.org:gOgO</a></p>")
	if h.nbRequests>1 {
		fmt.Fprintf(w, "<p><span class=emphase>%d</span> requètes chrall servies depuis le dernier lancement</p>", h.nbRequests)
	}
	h.foot(w)
}
