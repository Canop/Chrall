package main

// Gère les communications json-json authentifiées avec l'extension Chrall

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type JsonMessageIn struct {
	TrollId       int        // le numéro du troll
	MDP           string     // le mot de passe restreint
	MessageNum    int        // l'id de message entrant
	Troll         *TrollData // les infos du troll du joueur (structure définie dans comptestore.go)
	ChangePartage string
	IdCible       int // l'id d'un autre troll ou d'un monstre, le sujet optionnel de l'action
	Action        *Action
	Note          *Note
	NoteRequest   *NoteRequest
}

type JsonMessageOut struct {
	AnswersTo  int // reprise de l'id de message entrant (celui auquel on répond, donc)
	Error      string
	Text       string
	TextMaj    string
	MiPartages []*MiPartage
	Actions    []*Action
	Notes      []*Note
}

func (h *JsonGetHandler) writeJsonAnswer(w http.ResponseWriter, out *JsonMessageOut) {
	fmt.Fprint(w, "chrall.receiveFromChrallServer(")
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
		out.Error = err.Error()
		log.Printf("Erreur décodage JSON sur action %s : %s\n", action, err.Error())
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

	db, err := h.store.DB()
	if err != nil {
		out.Error = err.Error()
		log.Printf("Erreur ouverture connexion BD sur action %s : %s\n", action, err.Error())
		return
	}
	defer db.Close()

	var c *Compte
	if action == "check_account" {
		fmt.Println("check_account")
		var mdpok bool
		mdpok, c, err = h.store.CheckCompte(db, in.TrollId, in.MDP)
		if err != nil {
			out.Error = err.Error()
			log.Printf("Erreur validation compte %d sur action %s : %s\n", in.TrollId, action, err.Error())
		} else if !mdpok {
			if c != nil {
				out.Error = c.statut // TODO : détailler l'erreur mieux que ça
			} else {
				out.Error = "bug"
			}
		}
		out.Text = "Compte connecté et authentifié"
		return
	}

	c, err = h.store.GetCompteIfOK(db, in.TrollId, in.MDP)
	if err != nil {
		out.Error = err.Error()
		log.Printf("Erreur authentification compte %d sur action %s : %s\n", in.TrollId, action, err.Error())
		return
	}
	if c == nil {
		out.Error = "Pas de compte"
		log.Printf("Compte non authentifié %d / %s sur action %s : %s\n", in.TrollId, in.MDP, action)
		return
	}
	log.Printf("Compte OK for %d\n", in.TrollId)

	var amis []int
	out.Text = "Compte connecté et authentifié"
	if in.Troll != nil {
		//~ fmt.Printf("*** Infos troll reçues de %d ***\n", in.TrollId)
		// on regarde si la position a changé
		aBougé := c.Troll.X != in.Troll.X || c.Troll.Y != in.Troll.Y || c.Troll.Z != in.Troll.Z
		c.Troll = in.Troll
		err = h.store.UpdateTroll(db, c)
		if err != nil {
			out.Error = err.Error()
			log.Printf("Erreur sauvegarde troll sur action %s : %s\n", action, err.Error())
			return
		}
		//~ fmt.Printf("A bougé : %v\n", aBougé)
		if aBougé {
			h.store.majVue(db, in.TrollId, in.TrollId, h.tksManager)
		}
	}
	if in.Action != nil {
		in.Action.Auteur = int(in.TrollId)
		in.Action.Sanitize()
		err = h.store.InsertAction(db, in.Action)
		if err != nil {
			out.Error = err.Error()
			log.Printf("Erreur sauvegarde événement sur action %s : %s\n", action, err.Error())
			return
		}
	}
	switch in.ChangePartage {
	case "Proposer":
		log.Printf("Demande insertion partage %d -> %d\n", in.TrollId, in.IdCible)
		err = h.store.InsertPartage(db, in.TrollId, in.IdCible)
		if err != nil {
			out.Error = err.Error()
			log.Printf("Erreur sauvegarde proposition partage sur action %s : %s\n", action, err.Error())
			return
		}
		h.computePartages(db, in, action, out)
	case "Accepter":
		log.Printf("Demande accept partage %d -> %d\n", in.TrollId, in.IdCible)
		err = h.store.UpdatePartage(db, in.TrollId, in.IdCible, "on")
		if err != nil {
			out.Error = err.Error()
			log.Printf("Erreur update partage sur action %s : %s\n", action, err.Error())
			return
		}
		h.computePartages(db, in, action, out)
	case "Rompre":
		log.Printf("Demande fin partage %d -> %d\n", in.TrollId, in.IdCible)
		err = h.store.UpdatePartage(db, in.TrollId, in.IdCible, "off")
		if err != nil {
			out.Error = err.Error()
			fmt.Printf("Erreur update partage sur action %s : %s\n", action, err.Error())
			return
		}
		h.computePartages(db, in, action, out)
	case "Supprimer":
		log.Printf("Demande suppression partage %d -> %d\n", in.TrollId, in.IdCible)
		err = h.store.DeletePartage(db, in.TrollId, in.IdCible)
		if err != nil {
			out.Error = err.Error()
			log.Printf("Erreur update partage sur action %s : %s\n", action, err.Error())
			return
		}
		h.computePartages(db, in, action, out)
	}
	if action == "get_partages" {
		partages, err := h.store.GetAllPartages(db, in.TrollId)
		if err != nil {
			out.Error = err.Error()
			log.Printf("Erreur lecture partages sur action %s : %s\n", action, err.Error())
			return
		}
		out.MiPartages = h.store.PartagesToMiPartages(db, in.TrollId, partages, h.tksManager)

		log.Printf("Compte/Troll: %+v\n", c.Troll)
		out.MiPartages = append(out.MiPartages, h.store.CompteAsMiPartage(c, h.tksManager))

	} else if action == "getMonsterEvents" {
		amis, err = h.store.GetPartageurs(db, int(in.TrollId))
		if err != nil {
			log.Printf("Erreur récupération amis sur action %s : %s\n", action, err.Error())
		}
		out.Actions, err = h.store.Actions(db, "monstre", int(in.IdCible), int(in.TrollId), amis)
	} else if action == "maj_profil" {
		log.Printf("MAJ profil, cible=%d\n", in.IdCible)
		if in.IdCible == 0 { // demande de mise à jour des profils de tous les copains
			log.Printf("MAJ profils des amis de %d\n", in.TrollId)
			amis, err = h.store.GetPartageurs(db, int(in.TrollId))
			if err != nil {
				log.Printf("Erreur récupération amis sur action %s : %s\n", action, err.Error())
			}
			out.TextMaj = h.store.majProfil(db, c, in.TrollId)
			for _, ami := range amis {
				// récupérer les comptes des amis
				compteAmi, err := h.store.GetCompte(db, int(ami))
				if err != nil {
					log.Printf("Erreur récupération compte ami %d : %s\n", int(ami), err.Error())
					continue
				}
				out.TextMaj += ". " + h.store.majProfil(db, compteAmi, in.TrollId)
			}
			log.Printf("MAJ profil troll demandeur (%d)\n", in.TrollId)
			out.TextMaj += ". " + h.store.majProfil(db, c, in.TrollId)
		} else { // demande de mise à jour spécifique
			log.Printf("MAJ profil %d\n", in.IdCible)
			compteAmi, err := h.store.GetCompte(db, int(in.IdCible))
			if err != nil {
				log.Printf("Erreur maj profil sur cible %d : %s\n", in.IdCible, err.Error())
			}
			out.TextMaj = h.store.majProfil(db, compteAmi, in.TrollId)
		}
	} else if action == "maj_vue" {
		if in.IdCible == 0 { // demande de mise à jour de toutes les vues
			log.Printf("MAJ vues des amis de %d\n", in.TrollId)
			amis, err = h.store.GetPartageurs(db, int(in.TrollId))
			if err != nil {
				log.Printf("Erreur récupération amis sur action %s : %s\n", action, err.Error())
			}
			out.TextMaj = h.store.majVue(db, in.TrollId, in.TrollId, h.tksManager)
			for _, ami := range amis {
				out.TextMaj += ". " + h.store.majVue(db, int(ami), in.TrollId, h.tksManager)
			}
		} else { // demande de mise à jour spécifique
			log.Printf("MAJ Vue %d\n", in.IdCible)
			out.TextMaj = h.store.majVue(db, in.IdCible, in.TrollId, h.tksManager)
		}
	} else if action == "save_note" && in.Note != nil {
		in.Note.Auteur = int(in.TrollId)
		log.Printf("Stockage note ù+v\n", in.Note)
		err = h.store.SaveNote(db, in.Note)
		if err != nil {
			log.Printf("Erreur stockage note : %s\n", err.Error())
			out.Error = err.Error()
		} else {
			out.Text = "Note sauvegardée"
		}
	}

}

func (h *JsonGetHandler) computePartages(db *sql.DB, in *JsonMessageIn, action string, out *JsonMessageOut) {
	partages, err := h.store.GetAllPartages(db, in.TrollId)
	if err != nil {
		out.Error = err.Error()
		log.Printf("Erreur lecture partages sur action %s : %s\n", action, err.Error())
		return
	}
	out.MiPartages = h.store.PartagesToMiPartages(db, in.TrollId, partages, h.tksManager)
}
