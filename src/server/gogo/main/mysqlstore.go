package main
/*
Frontal pour la BD

j'exploite ce connecteur mysql : https://github.com/Philio/GoMySQL

Pour le mettre à jour, je me mets dans son répertoire et je fais
   git fetch origin
   git merge origin/master
puis
	make
	make install

Note : on dirait que ce connecteur a des problèmes avec les int64. Il vaut mieux, donc, éviter d'en utiliser.

*/

import "mysql"

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

// renvoie une instance de mysql.Client connectée. Il est impératif de faire suivre
// l'appel à cette méthode d'un defer db.Close()
func (store *MysqlStore) Connect() (db *mysql.Client, err error) {
	return mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
}
