/*
Frontal pour la BD

j'exploite ce connecteur mysql : https://github.com/Philio/GoMySQL

Pour le mettre à jour, je me mets dans son répertoire et je fais
   git fetch origin
   git merge origin/master

*/

package main

import (
	"os"
	"fmt"
	"mysql"
	"strconv"
	"time"
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

func (store *CdmStore) WriteCdms(cdms []*CDM, author int) (nbWrittenCdms int, err os.Error) {

	inserted := 0

	db, err := mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
	if err != nil {
		return 0, err
	}
	defer db.Close()

	sql := "insert ignore into cdm (author, num_monstre, nom_complet, nom, age, " // En go on ne peut pas déclarer une chaine sur plusieurs lignes. J'espère que le compilo combine...
	sql += "sha1, date_adition, "
	sql += " niveau_min, niveau_max,"
	sql += " points_de_vie_min, points_de_vie_max, "
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
	sql += " nombre_attaques,"
	sql += " vitesse_deplacement_text,"
	sql += " voir_le_cache_boolean,"
	sql += " attaque_a_distance_boolean,"
	sql += " dla_text,"
	sql += " duree_tour_min, duree_tour_max,"
	sql += " chargement_text,"
	sql += " bonus_malus_text,"
	sql += " portee_du_pouvoir_text)"

	sql += " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "
	sql += " ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"
	sql += " ?, ?, ?, ?, ?, ?, ?, ?)"

	fmt.Println("SQL: " + sql)
	stmt, err := db.Prepare(sql)
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	time := time.Seconds()

	for _, cdm := range cdms {
		err = stmt.BindParams(
			author,
			cdm.NumMonstre, cdm.NomComplet,
			cdm.Nom, cdm.TagAge,
			cdm.ComputeSHA1(),
			time,
			cdm.Niveau_min, cdm.Niveau_max,
			cdm.PointsDeVie_min, cdm.PointsDeVie_max,
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
			cdm.NombreDAttaques,
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

		inserted += int(stmt.AffectedRows)
	}

	return inserted, nil
}

// renvoie une liste de noms pour un champ d'auto-completion
func (store *CdmStore) getMonsterCompleteNames(partialName string, limit uint) ([]string, os.Error) {
	if limit > 100 {
		limit = 100
	} else if limit < 5 {
		limit = 5
	}
	db, err := mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	sql := "select distinct nom_complet from cdm where nom_complet like " + toMysqlString(partialName+"%") + " or nom_complet like " + toMysqlString("% "+partialName+"%") + " limit " + strconv.Uitoa(limit)
	stmt, err := db.Prepare(sql)
	defer stmt.Close()

	//fmt.Println(sql)

	err = stmt.Execute()
	if err != nil {
		return nil, err
	}

	names := make([]string, limit)
	count := 0
	var name string
	stmt.BindResult(&name)
	for {
		eof, err := stmt.Fetch()
		if err != nil {
			return nil, err
		}
		if eof {
			break
		}
		names[count] = name
		fmt.Println(names[count])
		count++
	}
	return names[0:count], nil
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

func rowToBestiaryExtract(completeName string, row mysql.Row) *BestiaryExtract {
	be := new(BestiaryExtract)
	be.Fusion = new(CDM)
	be.Fusion.NomComplet = completeName
	be.NbCdm = fieldAsInt64(row[0])
	be.NbMonsters = fieldAsInt64(row[1])
	be.Fusion.Niveau_min = fieldAsUint(row[2])
	be.Fusion.Niveau_max = fieldAsUint(row[3])
	be.Fusion.PointsDeVie_min = fieldAsUint(row[4])
	be.Fusion.PointsDeVie_max = fieldAsUint(row[5])
	be.Fusion.Capacite_text = fieldAsString(row[6])
	be.Fusion.DésAttaque_min = fieldAsUint(row[7])
	be.Fusion.DésAttaque_max = fieldAsUint(row[8])
	be.Fusion.DésEsquive_min = fieldAsUint(row[9])
	be.Fusion.DésEsquive_max = fieldAsUint(row[10])
	be.Fusion.DésDégâts_min = fieldAsUint(row[11])
	be.Fusion.DésDégâts_max = fieldAsUint(row[12])
	be.Fusion.DésRégénération_min = fieldAsUint(row[13])
	be.Fusion.DésRégénération_max = fieldAsUint(row[14])
	be.Fusion.Armure_min = fieldAsUint(row[15])
	be.Fusion.Armure_max = fieldAsUint(row[16])
	be.Fusion.Vue_min = fieldAsUint(row[17])
	be.Fusion.Vue_max = fieldAsUint(row[18])
	be.Fusion.MaitriseMagique_min = fieldAsUint(row[19])
	be.Fusion.MaitriseMagique_max = fieldAsUint(row[20])
	be.Fusion.RésistanceMagique_min = fieldAsUint(row[21])
	be.Fusion.RésistanceMagique_max = fieldAsUint(row[22])
	be.Fusion.Famille_text = fieldAsString(row[23])
	be.Fusion.NombreDAttaques = fieldAsUint(row[24])
	be.Fusion.VitesseDeDéplacement_text = fieldAsString(row[25])
	be.Fusion.VoirLeCaché_boolean = fieldAsBoolean(row[26])
	be.Fusion.AttaqueADistance_boolean = fieldAsBoolean(row[27])
	be.Fusion.DuréeTour_min = fieldAsUint(row[28])
	be.Fusion.DuréeTour_max = fieldAsUint(row[29])
	be.Fusion.PortéeDuPouvoir_text = fieldAsString(row[30])
	return be
}

/**
 * estime les caractéristiques du monstre.
 * Si l'id est fourni (i.e. pas 0) et si on a des cdm concernant ce monstre précis, on n'utilise que celles là [EN COURS]
 */
func (store *CdmStore) ComputeMonsterStats(completeName string, monsterId uint) (*BestiaryExtract, os.Error) {
	db, err := mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
	if err != nil {
		return nil, err
	}
	defer db.Close()
	
	// On utilise des max pour les champs de type chaine. C'est sans doute trop lourd (à moins que MySQL ne mette en place un index
	//  spécifique). L'objectif réel est de récupérer la chaine la plus longue.

	if monsterId != 0 {
		sql := "select count(*), count(distinct num_monstre),"
		sql += namaxmin("niveau") + ", "
		sql += namaxmin("points_de_vie") + ", "
		sql += "max(capacite_text), "
		sql += namaxmin("des_attaque") + ", "
		sql += namaxmin("des_esquive") + ", "
		sql += namaxmin("des_degats") + ", "
		sql += namaxmin("des_regeneration") + ", "
		sql += namaxmin("armure") + ", "
		sql += namaxmin("vue") + ", "
		sql += namaxmin("maitrise_magique") + ", "
		sql += namaxmin("resistance_magique") + ", "
		sql += " max(famille_text), "
		sql += " max(nombre_attaques), "
		sql += " max(vitesse_deplacement_text), "
		sql += " max(voir_le_cache_boolean), "
		sql += " max(attaque_a_distance_boolean), "
		sql += namaxmin("duree_tour") + ", "
		sql += " max(portee_du_pouvoir_text)"
		sql += " from cdm where nom_complet=" + toMysqlString(completeName)
		sql += " and num_monstre=" + strconv.Uitoa(monsterId)

		//fmt.Println("SQL :\n" + sql + "\n")

		err = db.Query(sql)
		if err != nil {
			return nil, err
		}
		result, err := db.UseResult()
		if err != nil {
			return nil, err
		}
		row := result.FetchRow()
		db.FreeResult()
		if row != nil {
			be := rowToBestiaryExtract(completeName, row)
			if be.NbCdm > 0 {
				be.PreciseMonster = true
				return be, nil
			}
		}
	}

	sql := "select count(*), count(distinct num_monstre),"
	sql += namaxmin("niveau") + ", " // namaxmin car le niveau d'un monstre est fixe pour un nom complet donné
	sql += naminmax("points_de_vie") + ", "
	sql += "max(capacite_text), "
	sql += naminmax("des_attaque") + ", "
	sql += naminmax("des_esquive") + ", "
	sql += naminmax("des_degats") + ", "
	sql += naminmax("des_regeneration") + ", "
	sql += naminmax("armure") + ", "
	sql += naminmax("vue") + ", "
	sql += naminmax("maitrise_magique") + ", "
	sql += naminmax("resistance_magique") + ", "
	sql += " max(famille_text), "
	sql += " max(nombre_attaques), "
	sql += " max(vitesse_deplacement_text), "
	sql += " max(voir_le_cache_boolean), "
	sql += " max(attaque_a_distance_boolean), "
	sql += naminmax("duree_tour") + ", "
	sql += " max(portee_du_pouvoir_text)"
	sql += " from cdm where nom_complet=" + toMysqlString(completeName)

	//fmt.Println(sql)

	err = db.Query(sql)
	if err != nil {
		return nil, err
	}
	result, err := db.UseResult()
	if err != nil {
		return nil, err
	}

	row := result.FetchRow()
	if row == nil {
		//fmt.Println("ComputeMonsterStats : no result")
		return nil, nil
	}
	db.FreeResult()

	be := rowToBestiaryExtract(completeName, row)
	be.PreciseMonster = false
	return be, nil
}
