package main

// gère la persistence en bd des appels soap (pour vérifier qu'on ne dépasse pas le nombre maximal autorisé)

import (
	"database/sql"
	"errors"
	"log"
	"time"
)

var MAX_SP_CALLS_PER_DAY = map[string]int{"Dynamiques": 20} // max d'après http://sp.mountyhall.com/ : 24

// Vérifie qu'on n'a pas fait trop d'appels aux scripts publics
// pour : le troll qui demande
// troll : celui dont le compte est incrémenté
// si ok est true, alors il faut faire l'appel (on le compte)
func (store *MysqlStore) CheckBeforeSoapCall(db *sql.DB, pour int, troll int, cat string) (bool, error) {
	limite, ok := MAX_SP_CALLS_PER_DAY[cat]
	if !ok {
		return false, errors.New("unknown SP category : " + cat)
	}
	seconds := time.Now().Unix()
	// on commence par compter
	yesterday := seconds - (24 * 60 * 60)
	row := db.QueryRow("select count(*) from appel_soap where troll=? and type=? and date>?", troll, cat, yesterday)
	var r int
	err := row.Scan(&r)
	if err != nil {
		return false, err
	}
	log.Printf("Appels aux SP pour le troll %d : %d / %d\n", troll, r, limite)
	if r >= limite {
		return false, nil
	}

	// c'est bon, donc on va noter l'appel qui va suivre
	sql := "insert into appel_soap (troll, pour, date, type) values (?, ?, ?, ?)"
	_, err = db.Exec(sql, troll, pour, seconds, cat)
	if err != nil {
		return false, err
	}
	return true, nil
}
