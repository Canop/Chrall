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
	TrollId       uint       // le numéro du troll
	MDP           string     // le mot de passe restreint
	MessageNum    int        // l'id de message entrant
	Troll         *TrollData // les infos du troll du joueur
	ChangePartage string
	IdAutreTroll  uint // l'id d'un autre troll
}

type JsonMessageOut struct {
	AnswersTo  int // reprise de l'id de message entrant (celui auquel on répond, donc)
	Error      string
	Text       string
	MiPartages []*MiPartage
}

func (h *JsonGetHandler) writeJsonAnswer(w http.ResponseWriter, out *JsonMessageOut) {
	fmt.Fprint(w, "receiveFromChrallServer(")
	bout, _ := json.Marshal(out)
	w.Write(bout)
	fmt.Fprint(w, ")")
}


func (h *JsonGetHandler) serveAuthenticatedMessage(w http.ResponseWriter, action string, message string) {
	w.Header().Set("Content-Type", "application/json ;charset=utf-8")

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
		out.Text = "Compte connecté et authentifié"
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
		switch in.ChangePartage {
		case "Proposer":
			fmt.Printf("Demande insertion partage %d -> %d\n", in.TrollId, in.IdAutreTroll)
			err = h.store.InsertPartage(nil, in.TrollId, in.IdAutreTroll)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur sauvegarde proposition partage sur action %s : %s\n", action, err.String())
				return
			}
		case "Accepter":
			fmt.Printf("Demande accept partage %d -> %d\n", in.TrollId, in.IdAutreTroll)
			err = h.store.UpdatePartage(nil, in.TrollId, in.IdAutreTroll, "on")
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur update partage sur action %s : %s\n", action, err.String())
				return
			}
		case "Rompre":
			fmt.Printf("Demande fin partage %d -> %d\n", in.TrollId, in.IdAutreTroll)
			err = h.store.UpdatePartage(nil, in.TrollId, in.IdAutreTroll, "off")
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur update partage sur action %s : %s\n", action, err.String())
				return
			}
		case "Supprimer":
			fmt.Printf("Demande suppression partage %d -> %d\n", in.TrollId, in.IdAutreTroll)
			err = h.store.DeletePartage(nil, in.TrollId, in.IdAutreTroll)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur update partage sur action %s : %s\n", action, err.String())
				return
			}
		}
		if action == "get_partages" {
			partages, err := h.store.GetAllPartages(nil, in.TrollId)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur lecture partages sur action %s : %s\n", action, err.String())
				return
			}
			out.MiPartages = h.store.PartagesToMiPartages(in.TrollId, partages, h.tksManager)
		}
	} else {
		if c != nil {
			out.Error = c.statut // TODO
		} else {
			out.Error = "bug"
		}
	}
}
