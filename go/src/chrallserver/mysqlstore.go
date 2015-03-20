package main

// accès à la BD
// Voir http://stackoverflow.com/questions/11353679/whats-the-recommended-way-to-connect-to-mysql-from-go/11357116#11357116

import (
	"database/sql"
	//_ "github.com/ziutek/mymysql/godrv"
	_ "github.com/go-sql-driver/mysql"
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
	//return sql.Open("mymysql", store.database+"/"+store.user+"/"+store.password)
	return sql.Open("mysql", store.user+":"+store.password+"@/"+store.database)
}
