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

*/


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

