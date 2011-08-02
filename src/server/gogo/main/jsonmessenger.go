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
	Troll         *TrollData // les infos du troll du joueur (structure définie dans comptestore.go)
	ChangePartage string
	IdCible       uint // l'id d'un autre troll ou d'un monstre, le sujet optionnel de l'action
	Action        *Action
	Note          *Note
}

type JsonMessageOut struct {
	AnswersTo  int // reprise de l'id de message entrant (celui auquel on répond, donc)
	Error      string
	Text       string
	TextMajVue string
	MiPartages []*MiPartage
	Actions    []*Action
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
	out.AnswersTo = in.MessageNum

	fmt.Printf("Message reçu décodé : \n%+v\n", in)
	if in.Troll != nil {
		fmt.Printf(" in.Troll : \n%+v\n", in.Troll)
	}
	if in.Action != nil {
		fmt.Printf(" in.Action : \n%+v\n", in.Action)
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

	db, err := h.store.Connect()
	if err != nil {
		out.Error = err.String()
		fmt.Printf("Erreur ouverture connexion BD sur action %s : %s\n", action, err.String())
		return
	}
	defer db.Close()

	mdpok, c, err := h.store.CheckCompte(db, in.TrollId, in.MDP)
	if err != nil {
		out.Error = err.String()
		fmt.Printf("Erreur validation compte sur action %s : %s\n", action, err.String())
		return
	}
	if mdpok {
		var amis []int
		out.Text = "Compte connecté et authentifié"
		if in.Troll != nil {
			fmt.Printf("*** Infos troll reçues de %d ***\n", in.TrollId)
			// on regarde si la position a changé
			aBougé := c.Troll.X != in.Troll.X || c.Troll.Y != in.Troll.Y || c.Troll.Z != in.Troll.Z
			c.Troll = in.Troll
			err = h.store.UpdateTroll(db, c)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur sauvegarde troll sur action %s : %s\n", action, err.String())
				return
			}
			fmt.Printf("A bougé : %v\n", aBougé)
			if aBougé {
				h.store.majVue(db, in.TrollId, in.TrollId, h.tksManager)
			}
		}
		if in.Action != nil {
			in.Action.Auteur = int(in.TrollId)
			err = h.store.InsertAction(db, in.Action)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur sauvegarde événement sur action %s : %s\n", action, err.String())
				return
			}
		}
		switch in.ChangePartage {
		case "Proposer":
			fmt.Printf("Demande insertion partage %d -> %d\n", in.TrollId, in.IdCible)
			err = h.store.InsertPartage(db, in.TrollId, in.IdCible)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur sauvegarde proposition partage sur action %s : %s\n", action, err.String())
				return
			}
		case "Accepter":
			fmt.Printf("Demande accept partage %d -> %d\n", in.TrollId, in.IdCible)
			err = h.store.UpdatePartage(db, in.TrollId, in.IdCible, "on")
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur update partage sur action %s : %s\n", action, err.String())
				return
			}
		case "Rompre":
			fmt.Printf("Demande fin partage %d -> %d\n", in.TrollId, in.IdCible)
			err = h.store.UpdatePartage(db, in.TrollId, in.IdCible, "off")
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur update partage sur action %s : %s\n", action, err.String())
				return
			}
		case "Supprimer":
			fmt.Printf("Demande suppression partage %d -> %d\n", in.TrollId, in.IdCible)
			err = h.store.DeletePartage(db, in.TrollId, in.IdCible)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur update partage sur action %s : %s\n", action, err.String())
				return
			}
		}
		if action == "get_partages" {
			partages, err := h.store.GetAllPartages(db, in.TrollId)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur lecture partages sur action %s : %s\n", action, err.String())
				return
			}
			out.MiPartages = h.store.PartagesToMiPartages(db, in.TrollId, partages, h.tksManager)
		} else if action == "getMonsterEvents" {
			amis, err = h.store.GetPartageurs(db, int(in.TrollId))
			if err != nil {
				fmt.Printf("Erreur récupération amis sur action %s : %s\n", action, err.String())
			}
			out.Actions, err = h.store.GetActions(db, "monstre", int(in.IdCible), int(in.TrollId), amis)
		} else if action == "maj_vue" {
			if in.IdCible == 0 { // demande de mise à jour de toutes les vues
				fmt.Printf("MAJ vues des amis de %d\n", in.TrollId)
				amis, err = h.store.GetPartageurs(db, int(in.TrollId))
				if err != nil {
					fmt.Printf("Erreur récupération amis sur action %s : %s\n", action, err.String())
				}
				out.TextMajVue = h.store.majVue(db, in.TrollId, in.TrollId, h.tksManager)
				for _, ami := range amis {
					out.TextMajVue += ". " + h.store.majVue(db, uint(ami), in.TrollId, h.tksManager)
				}
			} else { // demande de mise à jour spécifique			
				fmt.Printf("MAJ Vue %d\n", in.IdCible)
				out.TextMajVue = h.store.majVue(db, in.IdCible, in.TrollId, h.tksManager)
			}
		} else if action == "save_note" && in.Note!=nil {
			in.Note.Auteur = int(in.TrollId)
			fmt.Printf("Stockage note ù+v\n", in.Note)
			err = h.store.SaveNote(db, in.Note)
			if err != nil {
				fmt.Printf("Erreur stockage note : %s\n", err.String())
				out.Error = err.String()
			} else {
				out.Text = "Note sauvegardée"
			}
		}
	} else {
		if c != nil {
			out.Error = c.statut // TODO : détailler l'erreur mieux que ça
		} else {
			out.Error = "bug"
		}
	}
}
