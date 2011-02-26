package main

import (
	"http"
	"fmt"
)


type JsonHandler struct {
	Handler
}

func (h *JsonHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	h.hit()
	fmt.Fprint(w, "{\"result\":\"NOK\", \"text\": \"sais pas faire\"}")
}
