package main

/*
Ce service répond aux requètes JSON et JSONP en GET
*/

import (
	"http"
	"fmt"
	"json"
	"strconv"
)

type BestiaryExtractJson struct {
	RequestId string
	Html      string
}


type JsonGetHandler struct {
	ChrallHandler
}

func (h *JsonGetHandler) serveMessageJsonp(w http.ResponseWriter, hr *http.Request) {
	out := GetMessage(GetFormValue(hr, "TrollId"), GetFormValue(hr, "ChrallVersion"))
	bout, _ := json.Marshal(out)
	fmt.Fprint(w, "chrall_receiveMessage(")
	w.Write(bout)
	fmt.Fprint(w, ")")
}


func (h *JsonGetHandler) makeBestiaryExtractHtml(hr *http.Request) string {
	monsterCompleteNames := hr.Form["name"]
	if len(monsterCompleteNames) < 1 {
		fmt.Println(" no monster complete name in request")
		return "Hein ?"
	}
	var monsterId uint
	var monsterIdAsString string
	monsterIds := hr.Form["monsterId"]
	if len(monsterIds) > 0 {
		monsterIdAsString = monsterIds[0]
		monsterId, _ = strconv.Atoui(monsterIdAsString)
	}
	//fmt.Println(" Request for \"" + monsterCompleteNames[0] + "\"")

	be, err := h.store.ComputeMonsterStats(monsterCompleteNames[0], monsterId)
	if err != nil {
		fmt.Println(" Erreur : " + err.String())
		return "Erreur : " + err.String()
	}
	var html string
	if be == nil || be.NbCdm == 0 {
		html = "g0g0chrall ne connait pas ce monstre"
	} else {
		if be.PreciseMonster && monsterId>0 {
			if be.NbMonsters < 2 {
				html = "Cette estimation est basée sur une CDM unique du monstre " + monsterIdAsString
			} else {
				html = fmt.Sprintf("Cette estimation est basée sur %d CDM du monstre.", be.NbCdm)
			}
		} else {
			if be.NbMonsters < 2 {
				if be.NbCdm == 1 {
					html = "Une seule CDM a été reçue pour cette espèce."
				} else {
					html = fmt.Sprintf("Cette estimation est basée sur %d CDM d'un seul monstre.", be.NbCdm)
				}
			} else {
				html = fmt.Sprintf("Cette estimation est basée sur %d CDM concernant %d monstres.", be.NbCdm, be.NbMonsters)
			}
		}
		html += "<center>"
		html += be.Fusion.HtmlTable()
		html += "</center>"
	}
	//fmt.Println("HTML:\n:" + html)
	return html
}

func (h *JsonGetHandler) serveBestiaryExtractHtml(w http.ResponseWriter, hr *http.Request) {
	html := h.makeBestiaryExtractHtml(hr)
	bhtml, _ := json.Marshal(html)
	w.Write(bhtml)
}

func (h *JsonGetHandler) serveBestiaryExtractHtmlJsonp(w http.ResponseWriter, hr *http.Request) {
	bejs := new(BestiaryExtractJson)
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
	encodedCdms := hr.Form["cdm"]
	if len(encodedCdms) > 0 {
		encodedCdm := encodedCdms[0]
		fmt.Println(w, encodedCdm)

		bd := new(BucketDecoder)
		bd.Decode(encodedCdm, h.store)
		var answerHtml string
		if len(bd.Cdm) > 0 {
			_, err := h.store.WriteCdms(bd.Cdm)
			if err != nil {
				fmt.Println("Erreur au stockage des CDM")
			}
			answerHtml = "Cette CDM ( "
			for _, cdm := range bd.Cdm {
				answerHtml += cdm.NomComplet
			}
			answerHtml += " ) a bien été reçue par gogochrall et stockée dans le bestiaire. Merci."
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
	monsterPartialNames := hr.Form["term"]
	if len(monsterPartialNames) < 1 {
		fmt.Println(" no monster partial name in request")
		return
	}
	fmt.Println(" Request for \"" + monsterPartialNames[0] + "\"")

	list, err := h.store.getMonsterCompleteNames(monsterPartialNames[0])
	if err != nil {
		fmt.Println(" Erreur : " + err.String())
		return
	}
	blist, _ := json.Marshal(list)
	w.Write(blist)
}

func (h *JsonGetHandler) ServeHTTP(w http.ResponseWriter, hr *http.Request) {
	h.hit()
	w.SetHeader("Access-Control-Allow-Origin", "*")
	w.SetHeader("Access-Control-Request-Method", "GET")

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
	} else if action == "get_extract_jsonp" {
		h.serveBestiaryExtractHtmlJsonp(w, hr)
	} else if action == "accept_cdm_jsonp" {
		h.serveAcceptCdmJsonp(w, hr)
	} else if action == "check_messages" {
		h.serveMessageJsonp(w, hr)
	} else {
		fmt.Println(" Requete non comprise")
	}
}
