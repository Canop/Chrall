package main

import (
	"http"
	"fmt"
	"json"
	"os"
	"strconv"
)


type jsonRequest struct {
	Action  string	"action"
	Bucket  string  "bucket"
}

type JsonHandler struct {
	Handler
}

func sendError(w http.ResponseWriter, title string, err os.Error) {
	fmt.Printf("\nErreur %s : %s", title, err.String())
	fmt.Fprintf(w, "{\"result\":\"NOK\", \"text\": \"Erreur %s : %s\"}", title, err.String())
}

func (h *JsonHandler) ServeHTTP(w http.ResponseWriter, hr *http.Request) {
	h.hit()

	fmt.Print("\n=== Requete reçue ====================");

	jd := json.NewDecoder(hr.Body)
	jr := new(jsonRequest)
	err := jd.Decode(jr)
	
	if err != nil {
		sendError(w, "décodage", err)
		return
	}
	
	fmt.Print("\nAnalyse :");

	bd := new(BucketDecoder)
	bd.Decode(jr.Bucket)

	fmt.Print("\nCDM trouvées : " + strconv.Itoa(bd.nbCdm));
	
	// là ce serait plus propre d'utiliser la fonction json.Marshal mais j'ai perdu une heure sans réussir...
	answer := "Objets trouvés :<br>"
	answer += "  " + strconv.Itoa(bd.nbCdm) + " CDM"
	fmt.Fprint(w, "{\"result\":\"OK\", \"text\": \""+answer+"\"}")
}
