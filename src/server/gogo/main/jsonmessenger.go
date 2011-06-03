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
}

type JsonMessageOut struct {
	AnswersTo  int // reprise de l'id de message entrant (celui auquel on répond, donc)
	Error      string
	Text       string
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
			fmt.Printf("*** Infos troll reçues de %d ***", in.TrollId)
			c.Troll = in.Troll
			err = h.store.UpdateTroll(db, c)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur sauvegarde troll sur action %s : %s\n", action, err.String())
				return
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
			db, err = h.store.Connect() // contournement de bug. J'ai sinon une erreur lors du listage qui suit.
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur réouverture connexion BD sur action %s : %s\n", action, err.String())
				return
			}
			defer db.Close()
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
			fmt.Printf("MAJ Vue %d\n", in.IdCible)
			compteCible, err := h.store.GetCompte(db, in.IdCible)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur récupération compte cible sur action %s : %s\n", action, err.String())
				return
			}
			if compteCible == nil {
				out.Error = err.String()
				fmt.Printf("Pas de compte cible sur action %s\n", action)
				return
			}
			if compteCible.statut != "ok" {
				fmt.Printf("Compte cible invalide sur action %s\n", action)
				return
			}
			ok, err := h.store.CheckBeforeSoapCall(db, in.TrollId, in.IdCible, "Dynamiques", 24)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur sur action %s : %s\n", action, err.String())
				return
			}
			if !ok {
				fmt.Println("Déjà trop d'appels, appel soap refusé")
				return
			}
			items, _, _ := FetchVue(in.IdCible, compteCible.mdpRestreint) // gérer le cas du mdp qui n'est plus bon et changer en conséquence le statut
			err = h.store.SaveSoapItems(db, in.IdCible, items)
			if err != nil {
				out.Error = err.String()
				fmt.Printf("Erreur sauvegarde vue sur action %s : %s\n", action, err.String())
				return
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
