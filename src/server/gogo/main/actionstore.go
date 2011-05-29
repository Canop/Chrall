package main
/*
gère la lecture et l'écriture en mysql des actions (événements).
Les CDM utilisent, dans le sens gogochrall->extension uniquement, la même structure json (Action), mais sont reçues
différemment et sont écrites différemment en BD.
*/

import (
	"fmt"
	"mysql"
	"os"
	"strconv"
)

type Action struct { // addition des structure reçues en json (RésultatCombat, RésultatInsulte)
	Date int64 // secondes
	Type string
	Auteur int
	TypeCible string // "monstre" ou "troll"
	NumCible int
	Succes bool // comme tout ce qui est urlencodé, on laisse tomber les accents
	Degats int
	PV int
	Esquive int
	PourcentageBlessure int
}

// stocke une action en BD (résultat de sort ou de frappe ou compétence, à l'exclusion des CDM)
func (store *MysqlStore) InsertAction(db *mysql.Client, a *Action) (err os.Error) {
	
	// on corrige
	if a.Degats>0 && a.PV==0 {
		a.PV = a.Degats
	}
	
	sql := "insert into action"
	sql += "        (date_action, type_action, auteur, type_cible, num_cible, succes, degats, pv, esquive)"
	sql += " values (          ?,           ?,      ?,          ?,         ?,      ?,      ?,  ?,       ?)"

	stmt, err := db.Prepare(sql)
	if err != nil {	return }
	defer stmt.Close()

	succès := "non"
	if a.Succes {succès = "oui"}

	err = stmt.BindParams(a.Date, a.Type, a.Auteur, a.TypeCible, a.NumCible, succès, a.Degats, a.PV, a.Esquive)
	if err != nil { return }

	err = stmt.Execute()
	if err != nil { return }

	return
}

// renvoie les actions, en incluant les résumés de CDM
func (store *MysqlStore) GetActions(db *mysql.Client, typeCible string, numCible int, trollId int, amis []int) (actions []*Action, err os.Error) {
	strnum :=strconv.Itoa(numCible)
	//> d'abord les vraies "actions"
	sql := "select date_action, type_action, auteur, succes, degats, pv, esquive from action where type_cible='"+typeCible+"' and num_cible="+strnum
	sql += " and auteur in ("+strconv.Itoa(trollId)
	for _, id := range(amis) {
		sql += ","+strconv.Itoa(id)
	}
	sql += ")"
	fmt.Println(sql)
	err = db.Query(sql)
	if err != nil { return }
	result, err := db.UseResult()
	if err != nil {	return }
	actions = make([]*Action, 0, 10)
	for {
		row := result.FetchRow()
		fmt.Printf("row : %v\n", row)
		if row == nil {	break }
		a := new(Action)	
		a.Date = fieldAsInt64(row[0])
		a.Type = fieldAsString(row[1])
		a.Auteur = fieldAsInt(row[2])
		a.TypeCible = typeCible
		a.NumCible = numCible
		if fieldAsString(row[3])=="oui" {
			a.Succes = true
		} else {
			a.Succes = false
		}
		a.Degats = fieldAsInt(row[4])
		a.PV = fieldAsInt(row[5])
		a.Esquive = fieldAsInt(row[6])
		actions = append(actions, a)
	}
	db.FreeResult()
	//> ensuite les cdm
	if typeCible!="monstre" { return }
	sql = "select date_adition, author , blessure from cdm where num_monstre="+strnum
	sql += " and author in ("+strconv.Itoa(trollId)
	for _, id := range(amis) {
		sql += ","+strconv.Itoa(id)
	}
	sql += ")"
	fmt.Println(sql)
	err = db.Query(sql)
	if err != nil { return }
	result, err = db.UseResult()
	if err != nil {	return }
	for {
		row := result.FetchRow()
		fmt.Printf("row : %v\n", row)
		if row == nil {	break }
		a := new(Action)	
		a.Date = fieldAsInt64(row[0])
		a.Auteur = fieldAsInt(row[1])
		a.PourcentageBlessure = fieldAsInt(row[2])
		a.Type = "CDM"
		a.TypeCible = typeCible
		a.NumCible = numCible
		a.Succes = true
		actions = append(actions, a)
	}
	db.FreeResult()
	
	return 
}
