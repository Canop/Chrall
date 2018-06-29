package main

// gère le stockage sous MySQL de la vue des trolls.

import (
	"database/sql"
	"fmt"
	"log"
	"strconv"
	"time"
)

type Observation struct {
	Auteur int    // numéro du troll qui a fait l'observation
	Num    int    // numéro du truc vu
	Type   string // 'troll', 'monstre' ou 'lieu'
	Date   int64  // la date de l'observation (en secondes)
	Nom    string // le nom du truc observé
	X      int32
	Y      int32
	Z      int32
}

// sauvegarde des observations reçues par SOAP de MH, observées juste maintenant par trollId
func (store *MysqlStore) SaveSoapItems(db *sql.DB, trollId int, items []SoapItem) error {
	seconds := time.Now()
	sql := "insert into observation"
	sql += "        (auteur, num, date, type, nom, x, y, z)"
	sql += " values (      ?,  ?,    ?,    ?,   ?, ?, ?, ?)"
	sql += " on duplicate key update date=?, nom=?, x=?, y=?, z=?"
	for _, i := range items {
		var t string
		if i.Type == "TROLL" {
			t = "troll"
		} else if i.Type == "MONSTRE" {
			t = "monstre"
		} else if i.Type == "TRESOR" {
			t = "tresor"
		} else if i.Type == "LIEU" {
			t = "lieu"
		} else {
			continue
		}
		_, err := db.Exec(sql, trollId, i.Numero, seconds, t, i.Nom, i.PositionX, i.PositionY, i.PositionN, seconds, i.Nom, i.PositionX, i.PositionY, i.PositionN)
		if err != nil {
			return err
		}
	}
	return nil
}

// supprime la vue de trollID puis sauvegarde des observations reçues par SOAP de MH, observées juste maintenant par trollId
func (store *MysqlStore) CleanAndSaveSoapItems(db *sql.DB, trollId int, items []*SoapItem) error {
	seconds := time.Now()
	sql := "delete from observation where auteur=?"
	_, err := db.Exec(sql, trollId)
	if err != nil {
		return err
	}
	sql = "insert into observation"
	sql += "        (auteur, num, date, type, nom, x, y, z)"
	sql += " values (      ?,  ?,    ?,    ?,   ?, ?, ?, ?)"
	for _, i := range items {
		var t string
		if i.Type == "TROLL" {
			t = "troll"
		} else if i.Type == "MONSTRE" {
			t = "monstre"
		} else if i.Type == "LIEU" {
			t = "lieu"
		} else if i.Type == "TRESOR" {
			t = "tresor"
		} else {
			continue
		}
		_, err = db.Exec(sql, trollId, i.Numero, seconds, t, i.Nom, i.PositionX, i.PositionY, i.PositionN)
		if err != nil {
			return err
		}
	}
	return nil
}

func (store *MysqlStore) SearchObservations(db *sql.DB, tok string, trollId int, amis []int) ([]*Observation, error) {
	sql := "select auteur, num, date, type, nom, x, y, z from observation where"
	if num, _ := strconv.Atoi(tok); num != 0 {
		sql += " num=" + tok
	} else {
		sql += " nom like '%" + tok + "%'"
	}
	sql += " and auteur in (" + strconv.Itoa(trollId)
	for _, id := range amis {
		sql += "," + strconv.Itoa(id)
	}
	sql += ") order by num, date desc limit 100"
	rows, err := db.Query(sql)
	observations := make([]*Observation, 0, 20)
	for rows.Next() {
		r := new(Observation)
		err = rows.Scan(&r.Auteur, &r.Num, &r.Date, &r.Type, &r.Nom, &r.X, &r.Y, &r.Z)
		if err != nil {
			return nil, err
		}
		if len(observations) > 0 && r.Num == observations[len(observations)-1].Num { // dédoublonnage
			continue
		}
		observations = append(observations, r)

	}
	rows.Close()
	return observations, nil
}

func (store *MysqlStore) ObservationsAutour(db *sql.DB, x int, y int, z int, dist int, trollId int, amis []int, withTresors bool) ([]*Observation, error) {
	sql := "select auteur, num, date, type, nom, x, y, z from observation where"
	sql += " x>" + strconv.Itoa(x-dist-1) + " and x<" + strconv.Itoa(x+dist+1)
	sql += " and y>" + strconv.Itoa(y-dist-1) + " and y<" + strconv.Itoa(y+dist+1)
	sql += " and z>" + strconv.Itoa(z-dist/2-1) + " and z<" + strconv.Itoa(z+dist/2+1)
	if !withTresors {
		sql += " and type<>'tresor'"
	}
	sql += " and auteur in (" + strconv.Itoa(trollId)
	for _, id := range amis {
		sql += "," + strconv.Itoa(id)
	}
	sql += ") order by type, num, date desc"
	rows, err := db.Query(sql)
	observations := make([]*Observation, 0, 20)
	for rows.Next() {
		r := new(Observation)
		err = rows.Scan(&r.Auteur, &r.Num, &r.Date, &r.Type, &r.Nom, &r.X, &r.Y, &r.Z)
		if err != nil {
			return nil, err
		}
		if len(observations) > 0 && r.Num == observations[len(observations)-1].Num { // dédoublonnage
			continue
		}
		observations = append(observations, r)

	}
	rows.Close()
	return observations, nil
}

func (store *MysqlStore) majProfil(db *sql.DB, compteCible *Compte, pour int) string {
	log.Printf("MAJ Profil %d\n", compteCible.trollId)
	if !ALLOW_SP {
		return "Impossible de mettre à jour le profil car ALLOW_SP==false"
	}
	if compteCible.statut != "ok" {
		return fmt.Sprintf("Compte de %d invalide", compteCible.trollId)
	}
	ok, err := store.CheckBeforeSoapCall(db, pour, compteCible.trollId, "Dynamiques")
	if err != nil {
		return fmt.Sprintf("Erreur vérification nombres appels soap : %s", err.Error())
	}
	if !ok {
		return "Trop d'appels en 24h, appel soap refusé"
	}
	ok, strerr := FillTrollDataSp(compteCible.trollId, compteCible.mdpRestreint, compteCible.Troll)
	if strerr != "" {
		return strerr
	}
	if !ok {
		return fmt.Sprintf("profil fetching failed for %d", compteCible.trollId)
	}
	err = store.UpdateTroll(db, compteCible)
	if err != nil {
		return fmt.Sprintf("Erreur sauvegarde vue de %d: %d", compteCible.trollId, err.Error())
	}
	return fmt.Sprintf("Profil de %d mis à jour", compteCible.trollId)
}

func (store *MysqlStore) majVue(db *sql.DB, cible int, pour int, tksManager *TksManager) string {
	log.Printf("MAJ Vue %d\n", cible)
	if !ALLOW_SP {
		return "Impossible de mettre à jour la vue car ALLOW_SP==false"
	}
	compteCible, err := store.GetCompte(db, cible)
	if err != nil {
		return fmt.Sprintf("Erreur récupération compte de %d : %s", cible, err.Error())
	}
	if compteCible == nil {
		return fmt.Sprintf("Pas de compte pour %d", cible)
	}
	if compteCible.statut != "ok" {
		return fmt.Sprintf("Compte de %d invalide", cible)
	}
	ok, err := store.CheckBeforeSoapCall(db, pour, cible, "Dynamiques")
	if err != nil {
		return fmt.Sprintf("Erreur vérification nombres appels soap : %s", err.Error())
	}
	if !ok {
		return "Trop d'appels en 24h, appel soap refusé"
	}
	items, _ := FetchVueSp(cible, compteCible.mdpRestreint, 1, 1, tksManager) // gérer le cas du mdp qui n'est plus bon et changer en conséquence le statut
	if len(items) == 0 {
		return fmt.Sprintf("Vue de %d vide", cible)
	} else {
		fmt.Printf("%d trucs dans la vue de %d\n", len(items), cible)
	}
	err = store.CleanAndSaveSoapItems(db, cible, items)
	if err != nil {
		return fmt.Sprintf("Erreur sauvegarde vue de %d: %d", cible, err.Error())
	}
	return fmt.Sprintf("Vue de %d mise à jour", cible)
}
