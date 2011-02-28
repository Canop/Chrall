/*
Frontal pour la BD

j'exploite ce connecteur mysql : https://github.com/Philio/GoMySQL


TODO
	essayer en encodant les chaines en binaire, ce pilote ne semble pas gérer UTF8...

*/

package main

import (
	"fmt"
	"mysql"
	"strconv"
)


type CdmStore struct {
	user string
	password string
	database string
}

func NewStore(user string, password string) *CdmStore {
	store := new(CdmStore)
	store.user = user
	store.password = password
	store.database = "chrall"
	return store
}


func (store *CdmStore) Test() string {
	fmt.Println("Start Store Test")
	
	fmt.Println("Connexion et dump table cdm")
	db, err := mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)  
	if err != nil {  
		return "Echec à la connexion : " + err.String()
	}
	
	err = db.Query("select id, nom_complet from cdm")  
	if err != nil {
		return "Echec lors du requétage : " + err.String()
	}  

	result, err := db.UseResult()  
	if err != nil {  
		return "Echec lecture résultat : " + err.String()
	}  

	count := 0
	for {  
		row := result.FetchRow()  
		if row == nil {  
			break  
		}
		fmt.Println("  ligne "+strconv.Itoa(count)+" :")
		id := row[0].(int64)
		nomMonstre := string(row[1].([]byte)) // je n'arrive pas à récupérer de l'UTF8 complet ?
		
		fmt.Println("    monstre[" + strconv.Itoa64(id) + "] : " + nomMonstre)
		count ++
	}  
	
	fmt.Println("End Store Test")
	return "no test"
}

