/*
Frontal pour la BD

j'exploite ce connecteur mysql : https://github.com/Philio/GoMySQL
*/

package main

import (
	"os"
	"fmt"
	"mysql"
)

type CdmStore struct {
	user     string
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

func (store *CdmStore) WriteCdms(cdms []*CDM) (nbWrittenCdms int, err os.Error) {

	inserted := 0

	db, err := mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
	if err != nil {
		return 0, err
	}
	defer db.Close()	

	sql := "insert into cdm (num_monstre, nom_complet," // a priori en go on ne peut pas déclarer une chaine sur plusieurs lignes. Je suppose que le compilo combine...
	sql += " niveau_min, niveau_max,"
	sql += " capacite_text)"
	sql += " values (?, ?, ?, ?, ?)"
	
	
	fmt.Println("SQL: " + sql)
	stmt, err := db.Prepare(sql)
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	for _, cdm := range cdms {
		err = stmt.BindParams(
			cdm.NumMonstre, cdm.NomComplet,
			cdm.Niveau_min, cdm.Niveau_max,
			cdm.Capacite_text)
		if err != nil {
			return inserted, err
		}
		err = stmt.Execute()
		if err != nil {
			return inserted, err
		}

		inserted++
	}

	return inserted, nil
}


func (store *CdmStore) Test() string {
	fmt.Println("Start Store Test")

	fmt.Println("Connexion et dump table cdm")
	db, err := mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
	if err != nil {
		return "Echec à la connexion : " + err.String()
	}
	defer db.Close()

	stmt, err := db.Prepare("select num_monstre, nom_complet from cdm")
	if err != nil {
		return "Echec à la la préparation du PreparedStatement : " + err.String()
	}
	defer stmt.Close()

	err = stmt.Execute()
	if err != nil {
		return "Echec lors du requétage : " + err.String()
	}
	
	/*
	Message := "CDM lues en BD : <ul>"
	count := 0
	var cdmRow CdmRow
	stmt.BindResult(&cdmRow.numMonstre, &cdmRow.nomComplet)
	for {
		eof, err := stmt.Fetch()
		if err != nil {
			return "Echec à la lecture : " + err.String()
		}
		if eof {
			break
		}
		Message += "<li>" + cdmRow.nomComplet + "</li>"
		count++
	}

	fmt.Println("Message : " + Message)
	return Message + "</ul>"
	*/
	return "test incomplet"
}
