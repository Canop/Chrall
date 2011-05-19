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
	TrollId             uint       // le numéro du troll
	MDP                 string     // le mot de passe restreint
	MessageNum          int        // l'id de message entrant
	Troll               *TrollData // les infos du troll du joueur
	NouvelleProposition uint       // l'id du troll avec qui le joueur veut initier un partage
}

type JsonMessageOut struct {
	AnswersTo int // reprise de l'id de message entrant (celui auquel on répond, donc)
	Error     string
	Text      string
	Partages  []*Partage
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
		out.Error = err.String()
		fmt.Printf("Erreur décodage JSON sur action %s : %s\n", action, err.String())
		return
	}

	fmt.Printf("Message entrant du troll %d avec l'action %s\n", in.TrollId, action)
	if in.TrollId == 0 {
		out.Error = "Troll Absent"
		return
	}
	if len(in.MDP) != 32 { // théoriquement ça devrait être géré côté client aussi
		out.Error = "Mot de passe restreint invalide"
		return
	}

	mdpok, c, err := h.store.CheckCompte(in.TrollId, in.MDP)
	if err != nil {
		out.Error = err.String()
		fmt.Printf("Erreur validation compte sur action %s : %s\n", action, err.String())
		return
	}
	if mdpok {
		out.Text = "Compte connect&eacute; et authentifi&eacute;" // transmis en UTF-8 en json mais reçu par une page en ISOTRUC...
		if in.Troll != nil {
			fmt.Println("Infos troll reçues")
			c.Troll = in.Troll
			err = h.store.UpdateTroll(c)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur sauvegarde troll sur action %s : %s\n", action, err.String())
				return
			}
		}
		if in.NouvelleProposition != 0 && in.NouvelleProposition != in.TrollId {
			fmt.Printf("Demande insertion partage %d -> %d\n", in.TrollId, in.NouvelleProposition)
			err = h.store.InsertPartage(nil, in.TrollId, in.NouvelleProposition)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur sauvegarde proposition partage sur action %s : %s\n", action, err.String())
				return
			}
		}
		if action=="get_partages" {
			out.Partages, err = h.store.GetAllPartages(nil, in.TrollId)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur lecture partages sur action %s : %s\n", action, err.String())
				return
			}
		}
	} else {
		if c != nil {
			out.Error = c.statut // TODO
		} else {
			out.Error = "bug"
		}
	}
}
