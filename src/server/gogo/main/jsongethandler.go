package main

/*
Ce service répond aux requètes JSON et JSONP en GET
*/

import (
	"http"
	"fmt"
	"json"
	"os"
	"strconv"
	"time"
)

type BubbleJson struct {
	RequestId string
	Html      string
}

type TrollBubbleJson struct {
	RequestId string
	Html      string
	IdGuilde  uint
}

type JsonGetHandler struct {
	ChrallHandler
	tksManager *TksManager
}

func (h *JsonGetHandler) serveMessageJsonp(w http.ResponseWriter, hr *http.Request) {
	w.Header().Set("Content-Type", "text/javascript;charset=utf-8")
	out := GetMessage(GetFormValue(hr, "TrollId"), GetFormValue(hr, "ChrallVersion"))
	bout, _ := json.Marshal(out)
	fmt.Fprint(w, "chrall_receiveMessage(")
	w.Write(bout)
	fmt.Fprint(w, ")")
}


func (h *JsonGetHandler) makeTrollStats(hr *http.Request) *TrollBubbleJson {
	bejs := new(TrollBubbleJson)
	askerId := GetFormValueAsInt(hr, "asker")
	trollIdStr := GetFormValue(hr, "trollId")
	bejs.RequestId = trollIdStr
	trollId := GetFormValueAsInt(hr, "trollId")
	tks := h.tksManager.getTrollInfos(trollId)
	if tks == nil {
		fmt.Printf("Troll inconnu %d\n: ", trollId)
		bejs.Html = "Troll inconnu ou pacifiste"
	} else {
		html := tks.HtmlTable(trollId, h.tksManager)
		if askerId > 0 {
			ti := h.tksManager.getTrollInfos(askerId)
			if ti != nil {
				h.tksManager.CheckDiploLoaded()
				html += fmt.Sprintf("<br>Tuer ce troll vous rapporterait %d px", pxkill(ti.Niveau, tks.Niveau))
				html += h.tksManager.Diplo.DescribeYourRelationsWith(uint(askerId), ti.IdGuilde, uint(trollId), tks.IdGuilde)
			}
		}
		bejs.Html = html
	}
	return bejs
}

func (h *JsonGetHandler) serveTrollStatsHtmlJsonp(w http.ResponseWriter, hr *http.Request) {
	w.Header().Set("Content-Type", "text/javascript;charset=utf-8")
	bejs := h.makeTrollStats(hr)
	fmt.Fprint(w, "grid_receive(")
	mb, err := json.Marshal(bejs)
	if err != nil {
		fmt.Println("Erreur encodage : " + err.String())
	}
	w.Write(mb)
	fmt.Fprint(w, ")")
}

func (h *JsonGetHandler) makeBestiaryExtractHtml(hr *http.Request) string {
	askerId := GetFormValueAsInt(hr, "asker")
	mdpr := GetFormValue(hr, "mdpr") // mot de passe restreint, optionnel, permet d'authentifier la requête en cas d'existence de compte Chrall
	compteOk := false
	monsterId := GetFormValueAsUint(hr, "monsterId")

	db, err := h.store.Connect()
	if err != nil {
		fmt.Printf("Erreur ouverture connexion BD dans makeBestiaryExtractHtml : %s\n", err.String())
		return err.String()
	}
	defer db.Close()
	html := ""

	var amis []int
	if askerId > 0 && mdpr != "" && monsterId>0 {
		compteOk, _, err = h.store.CheckCompte(db, uint(askerId), mdpr)
		if compteOk {
			amis, err = h.store.GetPartageurs(db, askerId)
			if err != nil {
				fmt.Printf("Erreur récupération amis dans makeBestiaryExtractHtml : %s\n", err.String())
			}
			fmt.Printf("Amis : %v\n", amis)
			blessure, auteurCDM, dateCDM, _ := h.store.GetBlessure(db, monsterId, askerId, amis)
			if auteurCDM!=0 {
				nomAuteur, _, _ := h.tksManager.GetNomRaceNiveauTroll(auteurCDM)
				t := time.SecondsToLocalTime(dateCDM)
				html += fmt.Sprintf("Blessure: <b>%d %%</b> (CDM de %s le %s)<br>", blessure, nomAuteur, t.Format("02/01 à 15h04")) // oui les gars de Google ont fumé lorsqu'ils ont fait leur bibliothèque de formatage de date
			}
		}
	}

	fmt.Println(" demande bestiaire  authentification =", compteOk)

	monsterCompleteName := GetFormValue(hr, "name")
	if monsterCompleteName == "" {
		fmt.Println(" no monster complete name in request")
		return "Hein ?"
	}
	be, err := h.store.ComputeMonsterStats(db, monsterCompleteName, monsterId)
	if err != nil {
		fmt.Println(" Erreur : " + err.String())
		return "Erreur : " + err.String()
	}
	
	html += be.Html(monsterId, askerId, h.tksManager, 0 /* pourcentage blessure */ )
	return html
}

func (h *JsonGetHandler) serveBestiaryExtractHtml(w http.ResponseWriter, hr *http.Request) {
	html := h.makeBestiaryExtractHtml(hr)
	bhtml, _ := json.Marshal(html)
	w.Write(bhtml)
}

func (h *JsonGetHandler) serveBestiaryExtractHtmlJsonp(w http.ResponseWriter, hr *http.Request) {
	w.Header().Set("Content-Type", "text/javascript;charset=utf-8")
	bejs := new(BubbleJson)
	requestId := hr.Form["name"]
	if len(requestId) > 0 {
		bejs.RequestId = requestId[0]
	}
	bejs.Html = h.makeBestiaryExtractHtml(hr)
	fmt.Fprint(w, "grid_receive(")
	mb, _ := json.Marshal(bejs)
	w.Write(mb)
	fmt.Fprint(w, ")")
}

// traite les cdm envoyées par l'extension chrall
func (h *JsonGetHandler) serveAcceptCdmJsonp(w http.ResponseWriter, hr *http.Request) {
	w.Header().Set("Content-Type", "text/javascript;charset=utf-8")
	encodedCdms := hr.Form["cdm"]
	if len(encodedCdms) > 0 {
		encodedCdm := encodedCdms[0]
		fmt.Println(w, encodedCdm)

		bd := new(BucketDecoder)
		bd.Decode(encodedCdm, h.store)
		var answerHtml string
		if len(bd.Cdm) > 0 {

			db, err := h.store.Connect()
			if err != nil {
				fmt.Printf("Erreur ouverture connexion BD dans serveAcceptCdmJsonp : %s\n", err.String())
				return
			}
			defer db.Close()

			cdm := bd.Cdm[0]
			author := GetFormValue(hr, "author")
			authorId, _ := strconv.Atoi(author)
			_, err = h.store.WriteCdms(db, bd.Cdm, authorId) // FIXME réutiliser la BD
			if err != nil {
				fmt.Println("Erreur au stockage des CDM")
			}
			answerHtml = "Cette CDM ( "
			answerHtml += cdm.NomComplet
			answerHtml += " ) a bien été reçue par gogochrall et stockée dans le bestiaire. Merci."
			be, err := h.store.ComputeMonsterStats(db, cdm.NomComplet, cdm.NumMonstre)
			if err != nil {
				fmt.Println(" Erreur : " + err.String())
			} else {
				answerHtml += "Estimation :<br>"
				answerHtml += be.Html(cdm.NumMonstre, authorId, h.tksManager, cdm.Blessure)
			}

		} else {
			fmt.Println("Pas de CDM ou pas compris.")
			answerHtml += "Oups... Le serveur gogochrall n'a pas compris la requete :("
		}
		fmt.Fprint(w, "cdm_receive(")
		mhtml, _ := json.Marshal(answerHtml)
		w.Write(mhtml)
		fmt.Fprint(w, ")")
	} else {
		fmt.Println("Pas de CDM dans la requete!")
	}
}

func (h *JsonGetHandler) serveAutocompleteMonsterNames(w http.ResponseWriter, hr *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	monsterPartialName := GetFormValue(hr, "term")
	if monsterPartialName == "" {
		fmt.Println(" no monster partial name in request")
		return
	}
	limit, _ := strconv.Atoui(GetFormValue(hr, "limit"))
	list, err := h.store.getMonsterCompleteNames(monsterPartialName, limit)
	if err != nil {
		fmt.Println(" Erreur : " + err.String())
		return
	}
	blist, _ := json.Marshal(list)
	w.Write(blist)
}


func (h *JsonGetHandler) ServeHTTP(w http.ResponseWriter, hr *http.Request) {
	h.hit()
	startSeconds, startNanosecs, _ := os.Time()
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "GET")

	fmt.Println("\n=== JsonGetHandler : Requete reçue ====================")
	fmt.Println(" URL : " + hr.RawURL)
	hr.ParseForm()

	actions := hr.Form["action"]
	var action string
	if len(actions) > 0 {
		action = actions[0]
	} else {
		action = ""
	}
	if action == "get_monster_names" {
		h.serveAutocompleteMonsterNames(w, hr)
	} else if action == "get_extract" {
		h.serveBestiaryExtractHtml(w, hr)
	} else if action == "get_troll_info" {
		h.serveTrollStatsHtmlJsonp(w, hr)
	} else if action == "get_extract_jsonp" {
		h.serveBestiaryExtractHtmlJsonp(w, hr)
	} else if action == "accept_cdm_jsonp" {
		h.serveAcceptCdmJsonp(w, hr)
	} else if action == "check_messages" {
		h.serveMessageJsonp(w, hr)
	} else {
		h.serveAuthenticatedMessage(w, action, GetFormValue(hr, "message")) // par défaut on considère qu'il s'agit d'un message authentifié
	}
	endSeconds, endNanosecs, _ := os.Time()
	durationMillis := 1e3*(endSeconds-startSeconds) + (endNanosecs-startNanosecs)/1e6
	fmt.Printf(" Duration : %d ms\n", durationMillis)
}
