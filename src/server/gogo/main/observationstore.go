package main

/*
gère le stockage sous MySQL de la vue des trolls.


*/

import (
	"fmt"
	"mysql"
	"os"
	"time"
)

type Observation struct {
	Auteur int    // numéro du troll qui a fait l'observation
	Num    int    // numéro du truc vu
	Type   string // 'troll', 'monstre' ou 'lieu'
	Date   int64  // la date de l'observation (en secondes)
	Nom    string // le nom du truc observé
	X      int
	Y      int
	Z      int
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
	defer stmt.Close()

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

		fmt.Printf("Item à sauver : %+v\n", i)

		err = stmt.BindParams(trollId, i.Numero, seconds, t, i.Nom, i.PositionX, i.PositionY, i.PositionN, seconds, i.Nom, i.PositionX, i.PositionY, i.PositionN)
		if err != nil {
			return
		}
		err = stmt.Execute()
	}

	return
}
