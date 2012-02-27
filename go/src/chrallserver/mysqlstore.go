package main

// accès à la BD

import (
	"database/sql"
	_ "github.com/ziutek/mymysql/godrv"
)

type MysqlStore struct {
	user     string
	password string
	database string
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
	return db, err := sql.Open("mymysql", store.database+"/"+store.user+"/"+store.password)
}
