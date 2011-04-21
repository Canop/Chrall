package main

/*
Ce service répond aux requètes JSON et JSONP en GET
*/

import (
	"http"
	"fmt"
	"json"
	"strconv"
	"os"
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
	monsterCompleteName := GetFormValue(hr, "name")
	if monsterCompleteName == "" {
		fmt.Println(" no monster complete name in request")
		return "Hein ?"
	}
	monsterId := GetFormValueAsUint(hr, "monsterId")
	be, err := h.store.ComputeMonsterStats(monsterCompleteName, monsterId)
	if err != nil {
		fmt.Println(" Erreur : " + err.String())
		return "Erreur : " + err.String()
	}
	var html string
	if be == nil || be.NbCdm == 0 {
		html = "g0g0chrall ne connait pas ce monstre"
	} else {
		if be.PreciseMonster && monsterId > 0 {
			if be.NbMonsters < 2 {
				html = "Cette estimation est basée sur une CDM unique de ce monstre"
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
		if askerId > 0 {
			ti := h.tksManager.getTrollInfos(askerId)
			if ti != nil {
				html += "Tuer ce monstre vous rapporterait " + be.getGainPx(ti.Niveau)
			}
		}
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
			author := GetFormValue(hr, "author")
			authorId, _ := strconv.Atoi(author)
			_, err := h.store.WriteCdms(bd.Cdm, authorId)
			if err != nil {
				fmt.Println("Erreur au stockage des CDM")
			}
			answerHtml = "Cette CDM ( "
			answerHtml += bd.Cdm[0].NomComplet
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
		fmt.Println(" Requete non comprise")
	}
	endSeconds, endNanosecs, _ := os.Time()
	durationMillis := 1e3*(endSeconds-startSeconds) + (endNanosecs-startNanosecs)/1e6
	fmt.Printf(" Duration : %d ms\n", durationMillis)
}
