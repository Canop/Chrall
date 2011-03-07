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
	sql += " capacite_text,"
	sql += " des_attaque_min, des_attaque_max,"
	sql += " des_esquive_min, des_esquive_max,"
	sql += " des_degats_min, des_degats_max,"
	sql += " des_regeneration_min, des_regeneration_max,"
	sql += " armure_min, armure_max,"
	sql += " vue_min, vue_max,"
	sql += " maitrise_magique_min, maitrise_magique_max,"
	sql += " resistance_magique_min, resistance_magique_max,"
	sql += " famille_text,"
	sql += " nombre_attaques_min, nombre_attaques_max,"
	sql += " vitesse_deplacement_text,"
	sql += " voir_le_cache_boolean,"
	sql += " attaque_a_distance_boolean,"
	sql += " dla_text,"
	sql += " duree_tour_min, duree_tour_max,"
	sql += " chargement_text,"
	sql += " bonus_malus_text,"
	sql += " portee_du_pouvoir_text)" 
	
	sql += " values (?, ?, ?, ?, ?,"
	sql += " ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"
	sql += " ?, ?, ?, ?, ?, ?, ?, ?)" 

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
			cdm.Capacite_text,
			cdm.DésAttaque_min, cdm.DésAttaque_max,
			cdm.DésEsquive_min, cdm.DésEsquive_max,
			cdm.DésDégâts_min, cdm.DésDégâts_max,
			cdm.DésRégénération_min, cdm.DésRégénération_max,
			cdm.Armure_min, cdm.Armure_max,
			cdm.Vue_min, cdm.Vue_max,
			cdm.MaitriseMagique_min, cdm.MaitriseMagique_max,
			cdm.RésistanceMagique_min, cdm.RésistanceMagique_max,
			cdm.Famille_text,
			cdm.NombreDAttaques_min, cdm.NombreDAttaques_max,
			cdm.VitesseDeDéplacement_text,
			uint8(cdm.VoirLeCaché_boolean),
			uint8(cdm.AttaqueADistance_boolean),
			cdm.DLA_text,
			cdm.DuréeTour_min, cdm.DuréeTour_max,
			cdm.Chargement_text,
			cdm.BonusMalus_text,
			cdm.PortéeDuPouvoir_text)
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

func (store *CdmStore) ReadTotalStats() (*BestiaryExtract, os.Error) {
	db, err := mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	err = db.Query("select count(id), count(distinct num_monstre) from cdm")
	if err != nil {
		return nil, err
	}

	result, err := db.UseResult()
	if err != nil {
		return nil, err
	}
	defer result.Free()

	be := new(BestiaryExtract)
	row := result.FetchRow()
	be.NbCdm = row[0].(int64)
	be.NbMonsters = row[1].(int64)
	
	return be, nil
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
