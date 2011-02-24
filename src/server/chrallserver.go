package main

import (
	"http"
	"fmt"
)


type Handler struct {
	nbRequests int
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	h.nbRequests++
	fmt.Fprint(w, "<html><head><title>canop.org:gogo</title></head>")
	fmt.Fprint(w, "<center><br>Vous êtes sur <b>canop.org:gogo</b>, un serveur écrit en go.<br>")
	fmt.Fprintf(w, "<br>Nombre de requètes servies depuis le dernier lancement : %d</center></body></html>\n", h.nbRequests)
}

func main() {
	h := new (Handler)
	fmt.Print("Lancement du serveur à gogo")
	http.ListenAndServe(":9090", h)
}
