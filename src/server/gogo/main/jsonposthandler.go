package main

/*
Ce service répond aux requètes JSON contenues dans le body (en POST donc)
*/

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

type JsonPostHandler struct {
	Handler
	store *CdmStore
}

func NewJsonPostHandler(store *CdmStore) *JsonPostHandler {
	h := new(JsonPostHandler)
	h.store = store
	return h
}

func sendError(w http.ResponseWriter, title string, err os.Error) {
	fmt.Printf("\nErreur %s : %s", title, err.String())
	fmt.Fprintf(w, "{\"result\":\"NOK\", \"text\": \"Erreur %s : %s\"}", title, err.String())
}

func (h *JsonPostHandler) ServeHTTP(w http.ResponseWriter, hr *http.Request) {
	h.hit()

	fmt.Println("\n=== JsonPostHandler : Requete reçue ====================")

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
	nbIgnored := len(bd.Cdm) - inserted
	if inserted == 1 {
		ja.Text += "<br>Une CDM a été enregistrée."
		if nbIgnored > 0 {
			ja.Text += "<br>Les CDM déjà en base ne sont pas enregistrées."
		}
	} else if inserted > 1 {
		ja.Text += "<br>" + strconv.Itoa(inserted) + " CDM ont été enregistrées."
		if nbIgnored > 0 {
			ja.Text += "<br>Les CDM déjà en base ne sont pas enregistrées."
		}
	} else {
		if len(bd.Cdm) == 1 {
			ja.Text += "<br>Cette CDM était déjà en base et a donc été ignorée."
		} else if len(bd.Cdm) > 1 {
			ja.Text += "<br>Ces CDM étaient déjà en base et ont donc été ignorées."
		}
	}

	ba, err := json.Marshal(ja)
	if err != nil {
		sendError(w, "encodage réponse", err)
		return
	}
	w.Write(ba)
}
