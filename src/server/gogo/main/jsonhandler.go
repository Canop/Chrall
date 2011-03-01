package main

import (
	"http"
	"fmt"
	"json"
	"os"
	"strconv"
)


type jsonRequest struct {
	Action string "action"
	Bucket string "bucket"
}

type jsonAnswer struct {
	Result  string
	Text    string
	Message string
}

type JsonHandler struct {
	Handler
	store *CdmStore // je suppose que je remplacerai à terme par un store global
}

func NewJsonHandler() *JsonHandler {
	h := new(JsonHandler)
	h.store = NewStore("temp_user", "temp_pwd") // TODO mettre user et mdp dans un fichier de config quelque part
	return h
}

func sendError(w http.ResponseWriter, title string, err os.Error) {
	fmt.Printf("\nErreur %s : %s", title, err.String())
	fmt.Fprintf(w, "{\"result\":\"NOK\", \"text\": \"Erreur %s : %s\"}", title, err.String())
}

func (h *JsonHandler) ServeHTTP(w http.ResponseWriter, hr *http.Request) {
	h.hit()

	fmt.Println("\n=== JsonHandler : Requete reçue ====================")

	jd := json.NewDecoder(hr.Body)
	jr := new(jsonRequest)
	err := jd.Decode(jr)

	if err != nil {
		sendError(w, "décodage", err)
		return
	}

	bd := new(BucketDecoder)
	bd.Decode(jr.Bucket, h.store)

	inserted, err := h.store.WriteCdms(bd.Cdm)
	if err != nil {
		sendError(w, "écriture BD", err)
	}
	fmt.Println("Inserted : " + strconv.Itoa(inserted))

	ja := new(jsonAnswer)
	ja.Result = "OK"
	ja.Message = bd.Message
	ja.Text = "N° d'analyse : " + strconv.Itoa(h.nbRequests)
	ja.Text += "<br>" + strconv.Itoa(bd.nbResults) + " Objets trouvés :<ul>"
	ja.Text += "<li>  " + strconv.Itoa(len(bd.Cdm)) + " CDM"
	if len(bd.Cdm) > 0 {
		ja.Text += " ("
		for i, cdm := range bd.Cdm {
			if i > 0 {
				ja.Text += ", "
			}
			ja.Text += cdm.Nom
		}
		ja.Text += ")"
	}
	ja.Text += "</li>"
	ja.Text += "</ul>"
	if bd.nbResults > 0 {
		ja.Text += "<br>Le stockage en base de données n'est pas encore fini. Patience..."
	}

	ba, err := json.Marshal(ja)
	if err != nil {
		sendError(w, "encodage réponse", err)
		return
	}
	w.Write(ba)
}
