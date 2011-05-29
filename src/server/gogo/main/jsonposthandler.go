package main

/*
Ce service répond aux requètes JSON contenues dans le body (en POST donc)
*/

import (
	"http"
	"fmt"
	"json"
	"strconv"
)


type jsonRequest struct {
	Action string "action"
	Bucket string "bucket"
	Author int    "author"
}

type jsonAnswer struct {
	Result  string
	Text    string
	Message string
}

type JsonPostHandler struct {
	ChrallHandler
	tksManager *TksManager
}


func (h *JsonPostHandler) ServeHTTP(w http.ResponseWriter, hr *http.Request) {
	h.hit()
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "GET")

	fmt.Println("\n=== JsonPostHandler : Requete reçue ====================")
	fmt.Println(" URL : " + hr.RawURL)

	////////////////////////////////////// TEST
	//~ b, e := ioutil.ReadAll(hr.Body)
	//~ if e!=nil {
	//~ fmt.Println("Erreur lecture :")
	//~ fmt.Println(e)
	//~ }
	//~ s := string(b)
	//~ fmt.Print(s)
	////////////////////////////////////// /TEST

	jd := json.NewDecoder(hr.Body)
	jr := new(jsonRequest)
	err := jd.Decode(jr)

	if err != nil {
		sendError(w, "décodage", err)
		return
	}

	bd := new(BucketDecoder)
	bd.Decode(jr.Bucket, h.store)

	db, err := h.store.Connect()
	if err != nil {
		sendError(w, "connexion bd", err)
		return
	}
	defer db.Close()

	inserted := 0
	if len(bd.Cdm) > 0 {
		inserted, err = h.store.WriteCdms(db, bd.Cdm, jr.Author, 0)
		if err != nil {
			sendError(w, "écriture BD", err)
		}
		fmt.Println("Inserted : " + strconv.Itoa(inserted))
	} else {
		fmt.Println("Pas de cdm")
	}
	ja := new(jsonAnswer)
	ja.Result = "OK"
	ja.Message = bd.Message
	ja.Text = "N° d'analyse : " + strconv.Itoa(h.nbHits)
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
		if len(bd.Cdm) == 1 {
			// dans ce cas on fait une analyse de la blessure, en exploitant si possible également les autres cdm de ce monstre
			cdm := bd.Cdm[0]
			be, err := h.store.ComputeMonsterStats(db, cdm.NomComplet, cdm.NumMonstre)
			if err != nil {
				fmt.Println(" Erreur : " + err.String())
			} else {
				html := be.Html(cdm.NumMonstre, jr.Author, h.tksManager, cdm.Blessure)
				ja.Message += html
			}
		}
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
