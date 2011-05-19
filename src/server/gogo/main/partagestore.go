package main
/*
gère la lecture et l'écriture en mysql des partages d'infos entre comptes
*/

import (
	"fmt"
	"mysql"
	"os"
	"strconv"
)


// décrit un partage d'infos dans Chrall entre deux trolls
type Partage struct {
	TrollA  uint // l'id du troll initiateur du partage
	TrollB  uint
	StatutA string
	StatutB string
}


// sauvegarde un nouveau partage (à l'état de proposition de a pour b)
func (store *MysqlStore) InsertPartage(db *mysql.Client, trollA uint, trollB uint) (err os.Error) {
	if db == nil {
		db, err = mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
		if err != nil {
			return
		}
		defer db.Close()
	}

	sql := "insert ignore into"
	sql += " partage (troll_a, troll_b)"
	sql += " values (       ?,       ?)"

	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.Close()

	err = stmt.BindParams(trollA, trollB)
	if err != nil {
		return
	}

	err = stmt.Execute()
	if err != nil {
		return
	}

	return
}


// récupère toutes les infos de partage, acceptés ou non, impliquant un troll
func (store *MysqlStore) GetAllPartages(db *mysql.Client, trollId uint) (partages []*Partage, err os.Error) {
	if db == nil {
		db, err = mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
		if err != nil {
			return
		}
		defer db.Close()
	}

	sql := "select troll_a, troll_b, statut_a, statut_b from partage where troll_a=" + strconv.Uitoa(trollId) + " or troll_b=" + strconv.Uitoa(trollId)

	fmt.Println("SQL: " + sql)

	err = db.Query(sql)
	if err != nil {
		return
	}

	result, err := db.UseResult()
	if err != nil {
		return
	}
	defer result.Free()

	partages = make([]*Partage, 0, 10)
	for {
		row := result.FetchRow()
		if row == nil {
			break
		}
		p := new(Partage)
		p.TrollA = fieldAsUint(row[0])
		p.TrollB = fieldAsUint(row[1])
		p.StatutA = fieldAsString(row[2])
		p.StatutB = fieldAsString(row[3])
		l := len(partages)
		if l == cap(partages) {
			newSlice := make([]*Partage, (l+1)*3/2)
			copy(newSlice, partages)
			partages = newSlice
		}
		partages = partages[0 : l+1]
		partages[l] = p
	}

	return
}
