package main
/*
Gère les communications json-json authentifiées avec l'extension Chrall
*/

import (
	"http"
	"fmt"
	"json"
)


type JsonMessageIn struct {
	TrollId    uint   // le numéro du troll
	MDP        string // le mot de passe restreint
	MessageNum int    // l'id de message entrant
}

type JsonMessageOut struct {
	AnswersTo int // reprise de l'id de message entrant (celui auquel on répond, donc)
	ErrorCode string
	Text string
}

func (h *JsonGetHandler) writeJsonAnswer(w http.ResponseWriter, out *JsonMessageOut) {
	fmt.Fprint(w, "receiveFromChrallServer(")
	bout, _ := json.Marshal(out)
	w.Write(bout)
	fmt.Fprint(w, ")")
}


func (h *JsonGetHandler) serveAuthenticatedMessage(w http.ResponseWriter, action string, message string) {
	w.Header().Set("Content-Type", "application/json")

	in := new(JsonMessageIn)
	out := new(JsonMessageOut)
	defer h.writeJsonAnswer(w, out)

	err := json.Unmarshal([]byte(message), in)
	if err != nil {
		out.ErrorCode = err.String()
		fmt.Printf("Erreur décodage JSON sur action %s : %s\n", action, err.String())
		return
	}

	fmt.Printf("Message entrant du troll %d\n", in.TrollId)
	if in.TrollId == 0 {
		out.ErrorCode = "TrollAbsent"
		return
	}
	if len(in.MDP)!=32 { // théoriquement ça devrait être géré côté client aussi
		out.ErrorCode = "MdpRestreintInvalide"
		return		
	}

	mdpok, c, err := h.store.CheckCompte(in.TrollId, in.MDP)
	if err!=nil {
		out.ErrorCode = err.String()
		fmt.Printf("Erreur validation compte sur action %s : %s\n", action, err.String())
		return
	}
	if mdpok {
		out.Text = "Compte connecté et authentifié"
	} else {
		if c!=nil {
			out.ErrorCode = c.Statut // TODO
		} else {
			out.ErrorCode = "bug"
		}
	}
}
