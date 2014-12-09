package main

// gère la lecture et l'écriture en mysql des CDM

import (
	"database/sql"
	"log"
	"strconv"
	"time"
)

func (store *MysqlStore) WriteCdms(db *sql.DB, cdms []*CDM, author int, seconds int64) (int, error) {
	inserted := 0

	sql := "insert ignore into cdm (author, num_monstre, nom_complet, nom, age, "
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
	sql += " portee_du_pouvoir_text,"
	sql += " blessure,"
	sql += " armure_physique_min, armure_physique_max,"
	sql += " armure_magique_min, armure_magique_max,"
	sql += " vole_boolean,"
	sql += " sang_froid_text)"

	sql += " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "
	sql += " ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"
	sql += " ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

	if seconds == 0 {
		seconds = time.Now().Unix()
	}

	for _, cdm := range cdms {
		result, err := db.Exec(
			sql,
			author,
			cdm.NumMonstre, cdm.NomComplet,
			cdm.Nom, cdm.TagAge,
			cdm.ComputeSHA1(),
			seconds,
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
			cdm.PortéeDuPouvoir_text,
			cdm.Blessure,
			cdm.ArmurePhysique_min,
			cdm.ArmurePhysique_max,
			cdm.ArmureMagique_min,
			cdm.ArmureMagique_max,
			uint8(cdm.Vole_boolean),
			cdm.SangFroid_text)
		if err != nil {
			return inserted, err
		}
		ri, _ := result.RowsAffected()
		inserted += int(ri)
	}

	return inserted, nil
}

// renvoie une liste de noms pour un champ d'auto-completion
// Ne cherche pas parmi les monstres antérieurs aux numéros 4M
func (store *MysqlStore) getMonsterCompleteNames(db *sql.DB, partialName string, limit int) ([]string, error) {
	if limit > 100 {
		limit = 100
	} else if limit < 5 {
		limit = 5
	}
	names := make([]string, limit)
	count := 0
	sql := "select distinct nom_complet from cdm where (nom_complet like ? or nom_complet like ?) and num_monstre>3999999 limit ?"
	rows, err := db.Query(sql, partialName+"%", "% "+partialName+"%", limit)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var name string
		err = rows.Scan(&name)
		if err != nil {
			return nil, err
		}
		names[count] = name
		count++
	}
	rows.Close()
	return names[0:count], nil
}

func (store *MysqlStore) ReadTotalStats(db *sql.DB) (*BestiaryExtract, error) {
	row := db.QueryRow("select count(id), count(distinct num_monstre) from cdm")
	be := new(BestiaryExtract)
	err := row.Scan(&be.NbCdm, &be.NbMonsters)
	return be, err
}

func rowToBestiaryExtract(completeName string, row *sql.Row) (*BestiaryExtract, error) {
	be := new(BestiaryExtract)
	be.Fusion = new(CDM)
	be.Fusion.NomComplet = completeName
	err := row.Scan(
		&be.NbCdm,
		&be.NbMonsters,
		&be.Fusion.Niveau_min,
		&be.Fusion.Niveau_max,
		&be.Fusion.PointsDeVie_min,
		&be.Fusion.PointsDeVie_max,
		&be.Fusion.Capacite_text,
		&be.Fusion.DésAttaque_min,
		&be.Fusion.DésAttaque_max,
		&be.Fusion.DésEsquive_min,
		&be.Fusion.DésEsquive_max,
		&be.Fusion.DésDégâts_min,
		&be.Fusion.DésDégâts_max,
		&be.Fusion.DésRégénération_min,
		&be.Fusion.DésRégénération_max,
		&be.Fusion.Armure_min,
		&be.Fusion.Armure_max,
		&be.Fusion.Vue_min,
		&be.Fusion.Vue_max,
		&be.Fusion.MaitriseMagique_min,
		&be.Fusion.MaitriseMagique_max,
		&be.Fusion.RésistanceMagique_min,
		&be.Fusion.RésistanceMagique_max,
		&be.Fusion.Famille_text,
		&be.Fusion.NombreDAttaques,
		&be.Fusion.VitesseDeDéplacement_text,
		&be.Fusion.VoirLeCaché_boolean,
		&be.Fusion.AttaqueADistance_boolean,
		&be.Fusion.DuréeTour_min,
		&be.Fusion.DuréeTour_max,
		&be.Fusion.PortéeDuPouvoir_text,
		&be.Fusion.ArmurePhysique_min,
		&be.Fusion.ArmurePhysique_max,
		&be.Fusion.ArmureMagique_min,
		&be.Fusion.ArmureMagique_max,
		&be.Fusion.Vole_boolean,
		&be.Fusion.SangFroid_text)
	return be, err
}

/**
 * estime les caractéristiques du monstre.
 * Si l'id est fourni (i.e. pas 0) et si on a des cdm concernant ce monstre précis, on n'utilise que celles là
 */
func (store *MysqlStore) ComputeMonsterStats(db *sql.DB, completeName string, monsterId int) (*BestiaryExtract, error) {

	// les monstres ont changé de catégorie à partir du numéro 4M
	Ante4M := monsterId > 0 && monsterId < 4320000

	// On utilise des max pour les champs de type chaine. C'est sans doute trop lourd (à moins que MySQL ne mette en place un index
	//  spécifique). L'objectif réel est de récupérer la chaine la plus longue.

	if monsterId != 0 {
		sql := "select count(*), count(distinct num_monstre),"
		sql += namaxmin("niveau") + ", "
		sql += namaxmin("points_de_vie") + ", "
		sql += maxtext("capacite_text") + ", "
		sql += namaxmin("des_attaque") + ", "
		sql += namaxmin("des_esquive") + ", "
		sql += namaxmin("des_degats") + ", "
		sql += namaxmin("des_regeneration") + ", "
		sql += namaxmin("armure") + ", "
		sql += namaxmin("vue") + ", "
		sql += namaxmin("maitrise_magique") + ", "
		sql += namaxmin("resistance_magique") + ", "
		sql += maxtext("famille_text") + ", "
		sql += " ifnull(max(nombre_attaques),0), "
		sql += maxtext("vitesse_deplacement_text") + ", "
		sql += " ifnull(max(voir_le_cache_boolean),0), "
		sql += " ifnull(max(attaque_a_distance_boolean),0), "
		sql += namaxmin("duree_tour") + ", "
		sql += maxtext("portee_du_pouvoir_text") + ", "
		sql += namaxmin("armure_physique") + ", "
		sql += namaxmin("armure_magique") + ", "
		sql += " ifnull(max(vole_boolean),0), "
		sql += maxtext("sang_froid_text")
		sql += " from cdm where nom_complet=?"
		sql += " and num_monstre=?"

		row := db.QueryRow(sql, completeName, monsterId)
		be, err := rowToBestiaryExtract(completeName, row)
		if err != nil {
			log.Println("Erreur à la première requète de ComputeMonsterStats:", err) // à analyser sans bloquer la suite
		} else if be != nil {
			if be.NbCdm > 0 {
				be.PreciseMonster = true
				be.Ante4M = Ante4M
				return be, nil
			}
		}
	}

	sql := "select count(*), count(distinct num_monstre),"
	sql += namaxmin("niveau") + ", " // namaxmin car le niveau d'un monstre est fixe pour un nom complet donné
	sql += naminmax("points_de_vie") + ", "
	sql += maxtext("capacite_text") + ", "
	sql += naminmax("des_attaque") + ", "
	sql += naminmax("des_esquive") + ", "
	sql += naminmax("des_degats") + ", "
	sql += naminmax("des_regeneration") + ", "
	sql += naminmax("armure") + ", "
	sql += naminmax("vue") + ", "
	sql += naminmax("maitrise_magique") + ", "
	sql += naminmax("resistance_magique") + ", "
	sql += maxtext("famille_text") + ", "
	sql += " ifnull(max(nombre_attaques),0), "
	sql += maxtext("vitesse_deplacement_text") + ", "
	sql += " ifnull(max(voir_le_cache_boolean),0), "
	sql += " ifnull(max(attaque_a_distance_boolean),0), "
	sql += naminmax("duree_tour") + ", "
	sql += maxtext("portee_du_pouvoir_text") + ", "
	sql += namaxmin("armure_physique") + ", "
	sql += namaxmin("armure_magique") + ", "
	sql += " ifnull(max(vole_boolean),0), "
	sql += maxtext("sang_froid_text")
	sql += " from cdm where nom_complet=?"
	if Ante4M {
		sql += " and num_monstre<4000000"
	} else {
		sql += " and num_monstre>4320000"
	}

	row := db.QueryRow(sql, completeName)
	be, err := rowToBestiaryExtract(completeName, row)
	be.PreciseMonster = false
	be.Ante4M = Ante4M
	return be, err
}

// un résultat sans auteur (0) ni dateCdm (valeur 0) signifie qu'on n'a pas la réponse à la question
func (store *MysqlStore) GetBlessure(db *sql.DB, numMonstre int, trollId int, amis []int) (blessure int, auteurCDM int, dateCDM int64, err error) {
	sql := "select blessure, author, date_adition from cdm where"
	sql += " num_monstre=" + strconv.FormatUint(uint64(numMonstre), 10) + " and"
	sql += " author in (" + strconv.Itoa(trollId)
	for _, id := range amis {
		sql += "," + strconv.Itoa(id)
	}
	sql += ") order by date_adition desc limit 1"
	row := db.QueryRow(sql)
	err = row.Scan(&blessure, &auteurCDM, &dateCDM)
	return
}
