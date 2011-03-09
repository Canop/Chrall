/*
Frontal pour la BD

j'exploite ce connecteur mysql : https://github.com/Philio/GoMySQL
*/

package main

import (
	"os"
	"fmt"
	"mysql"
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

func (store *CdmStore) WriteCdms(cdms []*CDM) (nbWrittenCdms int, err os.Error) {

	inserted := 0

	db, err := mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
	if err != nil {
		return 0, err
	}
	defer db.Close()

	sql := "insert ignore into cdm (num_monstre, nom_complet, nom, age, " // a priori en go on ne peut pas déclarer une chaine sur plusieurs lignes. Je suppose que le compilo combine...
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

	sql += " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "
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
func (store *CdmStore) getMonsterCompleteNames(partialName string) ([]string, os.Error) {
	db, err := mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	sql := "select distinct nom_complet from cdm where nom_complet like '" + partialName + "%' or nom_complet like '% " + partialName + "%' limit 20"
	stmt, err := db.Prepare(sql)
	defer stmt.Close()

	err = stmt.Execute()
	if err != nil {
		return nil, err
	}

	names := make([]string, 20)
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
		//fmt.Println(names[count])
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

func fieldAsUint(o interface{}) uint {
	if o == nil {
		return 0
	}
	return uint(o.(int64))
}
func fieldAsBoolean(o interface{}) boolean {
	if o == nil {
		return b_unknown
	}
	return boolean(o.(int64))
}
// ceci est en particulier nécessaire parce que je n'ai pas le même type sur le serveur debian (64 bits) et mon petit ubuntu (32 bits)
func fieldAsString(o interface{}) string {
	if o!=nil {
		switch t := o.(type) {
		case string:
			fmt.Println("input is string")
			return o.(string)
		case []uint8:
			fmt.Println("input is []uint8")
			return string(o.([]uint8))
		}
	}
	return ""
}

func (store *CdmStore) ComputeMonsterStats(completeName string) (*BestiaryExtract, os.Error) {
	db, err := mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
	if err != nil {
		return nil, err
	}
	defer db.Close()

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
	sql += " max(dla_text), "
	sql += naminmax("duree_tour") + ", "
	sql += " max(chargement_text), "
	sql += " max(bonus_malus_text), "
	sql += " max(portee_du_pouvoir_text)"
	sql += " from cdm where nom_complet=" + toMysqlString(completeName)

	fmt.Println(sql)

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
		fmt.Println("ComputeMonsterStats : no result")
		return nil, nil
	}

	be := new(BestiaryExtract)
	be.Fusion = new(CDM)

	be.Fusion.NomComplet = completeName
	be.NbCdm = row[0].(int64)
	be.NbMonsters = row[1].(int64)
	be.Fusion.Niveau_min = uint(row[2].(int64))
	be.Fusion.Niveau_max = uint(row[3].(int64))
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
	be.Fusion.Capacite_text = fieldAsString(row[25])
	be.Fusion.VoirLeCaché_boolean = fieldAsBoolean(row[26])

	return be, nil
}
