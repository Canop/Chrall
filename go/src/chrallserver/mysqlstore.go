package main

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"os"
)

type MysqlStore struct {
}

func NewStore() *MysqlStore {
	store := new(MysqlStore)
	return store
}

// renvoie une instance de DB connectée.
func (store *MysqlStore) DB() (*sql.DB, error) {
	con := os.Getenv("GOGO_DB_CONNECTION")
	//return sql.Open("mysql", store.user+":"+store.password+"@tcp(mysql:3306)/"+store.database)
	return sql.Open("mysql", con)
}

