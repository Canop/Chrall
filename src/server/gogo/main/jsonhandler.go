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

	fmt.Println("\n=== Requete reçue ====================");

	jd := json.NewDecoder(hr.Body)
	jr := new(jsonRequest)
	err := jd.Decode(jr)
	
	if err != nil {
		sendError(w, "décodage", err)
		return
	}
	
	fmt.Println("Analyse :");

	bd := new(BucketDecoder)
	bd.Decode(jr.Bucket)
	
	// là ce serait plus propre d'utiliser la fonction json.Marshal mais j'ai perdu une heure sans réussir...
	answer := "N° d'analyse : " + strconv.Itoa(h.nbRequests)
	answer += "<br>" + strconv.Itoa(bd.nbResults) + " Objets trouvés :<ul>"
	answer += "<li>  " + strconv.Itoa(len(bd.Cdm)) + " CDM"
	if (len(bd.Cdm)>0) {
		answer += " ("
		for i, cdm := range bd.Cdm {
			if i>0 {
				answer += ", "
			}
			answer += cdm.Nom
		}
		answer += ")"
	}
	answer += "</li>"
	answer += "</ul>"
	if (bd.nbResults>0) {
		answer += "<br>Les résultats ne sont pas encore mis en BD. Pour l'instant je teste le décodage."
	}
	fmt.Fprint(w, "{\"result\":\"OK\", \"text\": \""+answer+"\"}")
}
