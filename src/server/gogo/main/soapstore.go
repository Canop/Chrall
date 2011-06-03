package main

/*
gère la persistence en bd des appels soap (pour vérifier qu'on ne dépasse pas le nombre maximal autorisé)

*/

import (
	"mysql"
	"os"
	"strconv"
	"time"
)

// pour : le troll qui demande
// troll : celui dont le compte est incrémenté
// si ok est true, alors il faut faire l'appel (on le compte)
func (store *MysqlStore) CheckBeforeSoapCall(db *mysql.Client, pour uint, troll uint, cat string, limite int64) (ok bool, err os.Error) {
	seconds := time.Seconds()
	// on commence par compter
	hier := seconds - 24*60*60
	sql := "select count(*) from appel_soap where troll=? and type=? and date>" + strconv.Itoa64(hier)
	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.Close()
	err = stmt.Execute()
	if err != nil {
		return
	}
	var r int64
	stmt.BindResult(&r)
	_, err = stmt.Fetch()
	if err != nil {
		stmt.Close()
		return
	}
	if r >= limite {
		stmt.Close()
		return
	}

	// c'est bon, donc on va noter l'appel qui va suivre
	sql = "insert into appel_soap (troll, pour, date, type) values (?, ?, ?, ?)"
	stmt, err = db.Prepare(sql)
	if err != nil {
		return
	}
	err = stmt.BindParams(troll, pour, seconds, cat)
	if err != nil {
		return
	}
	defer stmt.Close()
	err = stmt.Execute()
	ok = true
	return
}
