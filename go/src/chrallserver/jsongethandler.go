package main

// Ce service répond aux requètes JSON et JSONP en GET

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
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
	IdGuilde  int
}

type JsonGetHandler struct {
	ChrallHandler
	tksManager *TksManager
}

func (h *JsonGetHandler) servePageKillometre(w http.ResponseWriter, hr *http.Request) {
	w.Header().Set("Content-Type", "text/javascript;charset=utf-8")
	out := h.tksManager.GetKillometreExtract(GetFormValue(hr, "cat"), GetFormValueAsId(hr, "startIndex"), GetFormValueAsId(hr, "pageSize"), GetFormValue(hr, "searched"))
	bout, _ := json.Marshal(out)
	fmt.Fprint(w, "chrall_receiveKillometreExtract(")
	w.Write(bout)
	fmt.Fprint(w, ")")
}

func (h *JsonGetHandler) serveNotes(w http.ResponseWriter, hr *http.Request) {
	w.Header().Set("Content-Type", "text/javascript;charset=utf-8")
	db, err := h.store.DB()
	if err != nil {
		fmt.Printf("Erreur ouverture connexion BD dans serveAcceptCdmJsonp : %s\n", err.Error())
		return
	}
	askerId := GetFormValueAsId(hr, "asker")
	mdpr := GetFormValue(hr, "mdpr") // mot de passe restreint
	compteOk := false
	if (askerId <= 0 || mdpr == "") {
		//fmt.Println("askerId présent")
		compteOk, _, err = h.store.CheckCompte(db, int(askerId), mdpr)
		//fmt.Printf("compteOk : %+v\n", compteOk)

	if compteOk {
		amis, err := h.store.GetPartageurs(db, askerId)
		if err != nil {
				log.Printf("Erreur récupération amis dans serveNotes : %s\n", err.Error())
		}
			out, err := h.store.GetNotes(db, GetFormValue(hr, "cat"), GetFormValueAsId(hr, "idSujet"), askerId, amis, true)
			if err != nil {
				log.Println("Erreur dans GetNotes :", err)
			} else {
				for i, n := range out {
					log.Printf("Note %d : %+v\n", i, n)
				}
		}
		bout, _ := json.Marshal(out)
		fmt.Fprint(w, "receiveNotes(")
		w.Write(bout)
		fmt.Fprint(w, ")")
		return
	}
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
	askerId := GetFormValueAsId(hr, "asker")
	trollIdStr := GetFormValue(hr, "trollId")
	bejs.RequestId = trollIdStr
	trollId := GetFormValueAsId(hr, "trollId")
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
				html += h.tksManager.Diplo.DescribeYourRelationsWith(askerId, ti.IdGuilde, trollId, tks.IdGuilde)
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
		log.Println("Erreur encodage : " + err.Error())
	}
	w.Write(mb)
	fmt.Fprint(w, ")")
}

func (h *JsonGetHandler) makeBestiaryExtractHtml(hr *http.Request) string {
	askerId := GetFormValueAsId(hr, "asker")
	mdpr := GetFormValue(hr, "mdpr") // mot de passe restreint, optionnel, permet d'authentifier la requête en cas d'existence de compte Chrall
	compteOk := false
	monsterId := GetFormValueAsId(hr, "monsterId")
	db, err := h.store.DB()
	if err != nil {
		log.Printf("Erreur ouverture connexion BD dans makeBestiaryExtractHtml : %s\n", err.Error())
		return err.Error()
	}
	html := ""
	var amis []int
	if askerId > 0 && mdpr != "" && monsterId > 0 {
		compteOk, _, err = h.store.CheckCompte(db, askerId, mdpr)
		if compteOk {
			amis, err = h.store.GetPartageurs(db, askerId)
			if err != nil {
				log.Printf("Erreur récupération amis dans makeBestiaryExtractHtml : %s\n", err.Error())
			}
			blessure, auteurCDM, dateCDM, _ := h.store.GetBlessure(db, monsterId, askerId, amis)
			if auteurCDM != 0 {
				nomAuteur, _, _ := h.tksManager.GetNomRaceNiveauTroll(auteurCDM)
				t := time.Unix(dateCDM, 0)
				html += fmt.Sprintf("Blessure: <b>%d %%</b> (CDM de %s le %s)<br>", blessure, nomAuteur, t.Format("02/01 à 15h04")) // oui les gars de Google ont fumé lorsqu'ils ont fait leur bibliothèque de formatage de date
			}
		}
	}

	monsterCompleteName := GetFormValue(hr, "name")
	if monsterCompleteName == "" {
		log.Println(" no monster complete name in request")
		return "Hein ?"
	}
	be, err := h.store.ComputeMonsterStats(db, monsterCompleteName, monsterId)
	if err != nil {
		log.Println(" Erreur ComputeMonsterStats :", err.Error())
		return "Erreur : " + err.Error()
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
		bd := new(BucketDecoder)
		bd.Decode(encodedCdm, h.store)
		var answerHtml string
		if len(bd.Cdm) > 0 {
			db, err := h.store.DB()
			if err != nil {
				fmt.Printf("Erreur ouverture connexion BD dans serveAcceptCdmJsonp : %s\n", err.Error())
				return
			}
			cdm := bd.Cdm[0]
			authorId := GetFormValueAsId(hr, "author")
			seconds := GetFormValueAsInt64(hr, "seconds")
			_, err = h.store.WriteCdms(db, bd.Cdm, authorId, seconds)
			if err != nil {
				fmt.Println("Erreur au stockage des CDM")
			}
			answerHtml = "Cette CDM ( "
			answerHtml += cdm.NomComplet
			answerHtml += " ) a bien été reçue par gogochrall et stockée dans le bestiaire. Merci."
			be, err := h.store.ComputeMonsterStats(db, cdm.NomComplet, cdm.NumMonstre)
			if err != nil {
				fmt.Println(" Erreur : " + err.Error())
			} else {
				answerHtml += "Estimation :<br>"
				answerHtml += be.Html(cdm.NumMonstre, authorId, h.tksManager, cdm.Blessure)
			}
		} else {
			log.Println("Pas de CDM ou pas compris.")
			answerHtml += "Oups... Le serveur gogochrall n'a pas compris la requete :("
		}
		fmt.Fprint(w, "cdm_receive(")
		mhtml, _ := json.Marshal(answerHtml)
		w.Write(mhtml)
		fmt.Fprint(w, ")")
	} else {
		log.Println("Pas de CDM dans la requete!")
	}
}

func (h *JsonGetHandler) serveAutocompleteMonsterNames(w http.ResponseWriter, hr *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	monsterPartialName := GetFormValue(hr, "term")
	if monsterPartialName == "" {
		log.Println(" no monster partial name in request")
		return
	}
	db, err := h.store.DB()
	if err != nil {
		log.Println(" Erreur : " + err.Error())
		return
	}
	limit, _ := strconv.ParseInt(GetFormValue(hr, "limit"), 10, 0)
	if limit < 1 {
		limit = 10
	}
	list, err := h.store.getMonsterCompleteNames(db, monsterPartialName, int(limit))
	if err != nil {
		log.Println(" Erreur : " + err.Error())
		return
	}
	blist, _ := json.Marshal(list)
	w.Write(blist)
}

func (h *JsonGetHandler) ServeHTTP(w http.ResponseWriter, hr *http.Request) {
	h.hit()
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "GET")
	log.Printf("URL %v\n", hr.URL)
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
	} else if action == "get_page_killometre" {
		h.servePageKillometre(w, hr)
	} else if action == "get_notes" {
		h.serveNotes(w, hr)
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
}
