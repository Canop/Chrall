package main

/*
gère le stockage sous MySQL de la vue des trolls.


*/

import (
	"fmt"
	"mysql"
	"os"
	"strconv"
	"time"
)

type Observation struct {
	Auteur int    // numéro du troll qui a fait l'observation
	Num    int    // numéro du truc vu
	Type   string // 'troll', 'monstre' ou 'lieu'
	Date   int64  // la date de l'observation (en secondes)
	Nom    string // le nom du truc observé
	X      int64  // parce que l'api gomysql ne sait pas gérer les int32
	Y      int64
	Z      int64
}


// sauvegarde des observations reçues par SOAP de MH, observées juste maintenant par trollId
func (store *MysqlStore) SaveSoapItems(db *mysql.Client, trollId uint, items []SoapItem) (err os.Error) {
	seconds := time.Seconds()

	sql := "insert into observation"
	sql += "        (auteur, num, date, type, nom, x, y, z)"
	sql += " values (      ?,  ?,    ?,    ?,   ?, ?, ?, ?)"
	sql += " on duplicate key update date=?, nom=?, x=?, y=?, z=?"

	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.FreeResult()

	for _, i := range items {

		var t string
		if i.Type == "TROLL" {
			t = "troll"
		} else if i.Type == "MONSTRE" {
			t = "monstre"
		} else if i.Type == "LIEU" {
			t = "lieu"
		} else {
			continue // on ne va pas s'amuser à stocker tous les trésors
		}

		err = stmt.BindParams(trollId, i.Numero, seconds, t, i.Nom, i.PositionX, i.PositionY, i.PositionN, seconds, i.Nom, i.PositionX, i.PositionY, i.PositionN)
		if err != nil {
			return
		}
		err = stmt.Execute()
	}

	return
}


// supprime la vue de trollID puis sauvegarde des observations reçues par SOAP de MH, observées juste maintenant par trollId
func (store *MysqlStore) CleanAndSaveSoapItems(db *mysql.Client, trollId uint, items []SoapItem) (err os.Error) {
	seconds := time.Seconds()

	sql := "delete from observation where auteur="+strconv.Uitoa(trollId)
	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	err = stmt.Execute()
	if err != nil {
		return
	}
	stmt.FreeResult() // nécessaire ?

	sql = "insert into observation"
	sql += "        (auteur, num, date, type, nom, x, y, z)"
	sql += " values (      ?,  ?,    ?,    ?,   ?, ?, ?, ?)"

	stmt, err = db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.FreeResult()

	for _, i := range items {

		var t string
		if i.Type == "TROLL" {
			t = "troll"
		} else if i.Type == "MONSTRE" {
			t = "monstre"
		} else if i.Type == "LIEU" {
			t = "lieu"
		} else {
			continue // on ne va pas s'amuser à stocker tous les trésors
		}

		err = stmt.BindParams(trollId, i.Numero, seconds, t, i.Nom, i.PositionX, i.PositionY, i.PositionN)
		if err != nil {
			return
		}
		err = stmt.Execute()
	}

	return
}

func (store *MysqlStore) SearchObservations(db *mysql.Client, tok string, trollId int, amis []int) (observations []*Observation, err os.Error) {
	sql := "select auteur, num, date, type, nom, x, y, z from observation where"
	if num, _ := strconv.Atoi(tok); num != 0 {
		sql += " num=" + tok
	} else {
		sql += " nom like '%" + tok + "%'"
	}
	sql += " and auteur in (" + strconv.Itoa(trollId)
	for _, id := range amis {
		sql += "," + strconv.Itoa(id)
	}
	sql += ") order by num, date desc limit 100"

	fmt.Println("SQL : ", sql)

	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.FreeResult()
	err = stmt.Execute()
	if err != nil {
		return
	}
	r := new(Observation)
	stmt.BindResult(&r.Auteur, &r.Num, &r.Date, &r.Type, &r.Nom, &r.X, &r.Y, &r.Z)
	observations = make([]*Observation, 0, 20)

	for {
		eof, err := stmt.Fetch()
		if err != nil || eof {
			return
		}
		if len(observations) > 0 && r.Num == observations[len(observations)-1].Num { // dédoublonnage
			continue
		}
		o := &Observation{r.Auteur, r.Num, r.Type, r.Date, r.Nom, r.X, r.Y, r.Z}
		observations = append(observations, o)
	}

	return
}


func (store *MysqlStore) ObservationsAutour(db *mysql.Client, x int, y int, z int, dist int, trollId int, amis []int) (observations []*Observation, err os.Error) {

	sql := "select auteur, num, date, type, nom, x, y, z from observation where"
	sql += " abs(x-" + strconv.Itoa(x) + ")<=" + strconv.Itoa(dist)
	sql += " and abs(y-" + strconv.Itoa(y) + ")<=" + strconv.Itoa(dist)
	sql += " and abs(z-" + strconv.Itoa(z) + ")<=" + strconv.Itoa(dist/2)

	sql += " and auteur in (" + strconv.Itoa(trollId)
	for _, id := range amis {
		sql += "," + strconv.Itoa(id)
	}
	sql += ") order by type, num, date desc limit 100"

	fmt.Println("SQL : ", sql)

	stmt, err := db.Prepare(sql)
	defer stmt.FreeResult()
	if err != nil {
		return
	}
	err = stmt.Execute()
	if err != nil {
		return
	}
	r := new(Observation)
	stmt.BindResult(&r.Auteur, &r.Num, &r.Date, &r.Type, &r.Nom, &r.X, &r.Y, &r.Z)
	observations = make([]*Observation, 0, 20)

	for {
		eof, err := stmt.Fetch()
		if err != nil || eof {
			return
		}
		//fmt.Printf("r : %+v\n", r)
		if len(observations) > 0 && r.Num == observations[len(observations)-1].Num {
			continue
		}
		o := &Observation{r.Auteur, r.Num, r.Type, r.Date, r.Nom, r.X, r.Y, r.Z}
		observations = append(observations, o)
	}

	return
}


func (store *MysqlStore) majVue(db *mysql.Client, cible uint, pour uint) string {
	fmt.Printf("MAJ Vue %d\n", cible)
	compteCible, err := store.GetCompte(db, cible)
	if err != nil {
		return fmt.Sprintf("Erreur récupération compte de %d : %s", cible, err.String())
	}
	if compteCible == nil {
		return fmt.Sprintf("Pas de compte pour %d", cible)
	}
	if compteCible.statut != "ok" {
		return fmt.Sprintf("Compte de %d invalide", cible)
	}
	ok, err := store.CheckBeforeSoapCall(db, pour, cible, "Dynamiques", 15)
	if err != nil {
		return fmt.Sprintf("Erreur appel soap : %s", err.String())
	}
	if !ok {
		return "Trop d'appels en 24h, appel soap refusé"
	}
	items, _, _ := FetchVue(cible, compteCible.mdpRestreint) // gérer le cas du mdp qui n'est plus bon et changer en conséquence le statut
	if len(items)==0 {
		return fmt.Sprintf("Vue de %d vide", cible)
	}
	err = store.CleanAndSaveSoapItems(db, cible, items)
	if err != nil {
		return fmt.Sprintf("Erreur sauvegarde vue de %d: %d", cible, err.String())
	}
	return fmt.Sprintf("Vue de %d mise à jour", cible)
}
