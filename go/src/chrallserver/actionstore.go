package main

// gère la lecture et l'écriture en mysql des actions (événements).
// Les CDM utilisent, dans le sens gogochrall->extension uniquement, la même structure json (Action), mais sont reçues
// différemment et sont écrites différemment en BD.

import (
	"chrall"
	"database/sql"
	"strconv"
)

type Action struct { // addition des structure reçues en json (RésultatCombat, RésultatInsulte)
	Date                int64 // secondes
	Type                string
	Auteur              int
	TypeCible           string // "monstre" ou "troll"
	NumCible            int
	Succes              bool // comme tout ce qui est urlencodé, on laisse tomber les accents
	Degats              int
	PV                  int
	Esquive             int
	PourcentageBlessure int
}

// ne doit être appelée qu'une fois, lors de l'import de données encodées en ISO 88591
func (a *Action) Sanitize() {
	if a.Degats > 0 && a.PV == 0 {
		a.PV = a.Degats
	}
	a.Type = chrall.Iso88591ToUtf8(a.Type)
}

// stocke une action en BD (résultat de sort ou de frappe ou compétence, à l'exclusion des CDM)
func (store *MysqlStore) InsertAction(db *sql.DB, a *Action) error {
	sql := "insert into action"
	sql += "        (date_action, type_action, auteur, type_cible, num_cible, succes, degats, pv, esquive)"
	sql += " values (          ?,           ?,      ?,          ?,         ?,      ?,      ?,  ?,       ?)"

	succès := "non"
	if a.Succes {
		succès = "oui"
	}

	_, err := db.Exec(sql, a.Date, a.Type, a.Auteur, a.TypeCible, a.NumCible, succès, a.Degats, a.PV, a.Esquive)
	return err
}

// renvoie les actions, en incluant les résumés de CDM
func (store *MysqlStore) Actions(db *sql.DB, typeCible string, numCible int, trollId int, amis []int) ([]*Action, error) {
	strnum := strconv.Itoa(numCible)
	actions := make([]*Action, 0)
	//> d'abord les vraies "actions"
	sql := "select date_action, type_action, auteur, succes, degats, pv, esquive from action where type_cible='" + typeCible + "' and num_cible=" + strnum
	sql += " and auteur in (" + strconv.Itoa(trollId)
	for _, id := range amis {
		sql += "," + strconv.Itoa(id)
	}
	sql += ")"
	rows, err := db.Query(sql)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		a := new(Action)
		var sb string
		err = rows.Scan(&a.Date, &a.Type, &a.Auteur, &sb, &a.Degats, &a.PV, &a.Esquive)
		if err == nil {
			a.TypeCible = typeCible
			a.NumCible = numCible
			if sb == "oui" {
				a.Succes = true
			} else {
				a.Succes = false
			}
			actions = append(actions, a)
		}
	}
	rows.Close()
	//> ensuite les cdm
	if typeCible != "monstre" {
		return actions, nil
	}
	sql = "select date_adition, author , blessure from cdm where num_monstre=" + strnum
	sql += " and author in (" + strconv.Itoa(trollId)
	for _, id := range amis {
		sql += "," + strconv.Itoa(id)
	}
	sql += ")"
	rows, err = db.Query(sql)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		a := new(Action)
		err = rows.Scan(&a.Date, &a.Auteur, &a.PourcentageBlessure)
		if err == nil {
			a.Type = "CDM"
			a.TypeCible = typeCible
			a.NumCible = numCible
			a.Succes = true
			actions = append(actions, a)
		}
	}
	rows.Close()
	return actions, nil
}
