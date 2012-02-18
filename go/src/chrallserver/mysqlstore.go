package main

// accès à la BD
// Pour l'instant je ne fais pas de déconnexion, on reste connecté en permanence

import (
	"database/sql"
	_ "github.com/ziutek/mymysql/godrv"
)

type MysqlStore struct {
	user     string
	password string
	database string
	db       *sql.DB
}

func NewStore(user string, password string) *MysqlStore {
	store := new(MysqlStore)
	store.user = user
	store.password = password
	store.database = "chrall"
	return store
}

// renvoie une instance de DB connectée. 
func (store *MysqlStore) DB() (*sql.DB, error) {
	var err error
	if store.db == nil {
		store.db, err = sql.Open("mymysql", store.database+"/"+store.user+"/"+store.password)
		if err != nil {
			return nil, err
		}
	}
	return store.db, nil
}
