/*
Frontal pour la BD

j'exploite ce connecteur mysql : https://github.com/Philio/GoMySQL


TODO
	essayer en encodant les chaines en binaire, ce pilote ne semble pas gérer UTF8...

*/

package main

import (
	"os"
	"fmt"
	"mysql"
	//"strconv"
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


type CdmRow struct {
	Id int64
	NumMonstre int64
	NomComplet string
}

/*
Notons qu'il faudra protéger tout ça par un Mutex (et donc regarder comment ça marche en go...)
*/
func (store *CdmStore) WriteCdms(cdms []*CDM) (nbWrittenCdms int, err os.Error) {

	inserted := 0

	db, err := mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)  
	if err != nil {  
		return 0, err
	}
	defer db.Close()
	
	
	stmt, err := db.Prepare("insert into cdm (num_monstre, nom_complet) values (?, ?)")  
	if err != nil {  
		return 0, err
	}
	defer stmt.Close()
	
	var cdmRow CdmRow
	for _, cdm := range cdms {
		cdmRow.NumMonstre = int64(cdm.IdMonstre)
		cdmRow.NomComplet = cdm.NomComplet
		err = stmt.BindParams(cdmRow.NumMonstre, cdmRow.NomComplet)  
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

	Message := "CDM lues en BD : <ul>"
	count := 0
	var cdmRow CdmRow
	stmt.BindResult(&cdmRow.NumMonstre, &cdmRow.NomComplet)
	for {
		eof, err := stmt.Fetch()  
		if err != nil {
			return "Echec à la lecture : " + err.String()  
		}
		if eof {  
			break  
		}
		Message += "<li>" + cdmRow.NomComplet + "</li>"
		count ++
	}  
		
	fmt.Println("Message : " + Message)
	return Message + "</ul>"
}

