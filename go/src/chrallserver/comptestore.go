package main

// gère la lecture et l'écriture en mysql des comptes de troll

import (
	"database/sql"
	"errors"
	"strconv"
	"time"
)

type TrollData struct {
	PV_max       int
	PV_actuels   int
	X            int32
	Y            int32
	Z            int32
	Fatigue      int
	PA           int
	Vue          int
	ProchainTour int64 // timestamp (stocké en secondes dans la BD)
	DureeTour    int64 // durée du tour en secondes
	MiseAJour    int64 // timestamp (stocké en secondes dans la BD)
}

type Compte struct { // les infos privées sont celles qui ne sont pas décodables telles quelles depuis les structures json
	trollId      int
	statut       string // ok,  bad_pwd, off, soap_error
	mdpRestreint string // md5, donc 32 caractères
	Troll        *TrollData
}

func rowToCompte(trollId int, row *sql.Row) (*Compte, error) {
	c := new(Compte)
	c.trollId = trollId
	c.Troll = new(TrollData)
	err := row.Scan(
		&c.statut,
		&c.mdpRestreint,
		&c.Troll.PV_max,
		&c.Troll.PV_actuels,
		&c.Troll.X,
		&c.Troll.Y,
		&c.Troll.Z,
		&c.Troll.Fatigue,
		&c.Troll.PA,
		&c.Troll.Vue,
		&c.Troll.ProchainTour,
		&c.Troll.DureeTour,
		&c.Troll.MiseAJour)
	c.Troll.ProchainTour *= 1000
	c.Troll.MiseAJour *= 1000
	return c, err
}

// lit un compte en base. Renvoie nil si le compte n'existe pas en base.
func (store *MysqlStore) GetCompte(db *sql.DB, trollId int) (*Compte, error) {
	sql := "select statut, mdp_restreint, pv_max, pv_actuels, x, y, z, fatigue, pa, vue, prochain_tour, duree_tour, mise_a_jour"
	sql += " from compte where id=" + strconv.FormatUint(uint64(trollId), 10)
	row := db.QueryRow(sql)
	c, err := rowToCompte(trollId, row)
	return c, err
}

// sauvegarde un nouveau compte.
func (store *MysqlStore) InsertCompte(db *sql.DB, c *Compte) error {
	sql := "insert into"
	sql += " compte (id, statut, mdp_restreint)"
	sql += " values ( ?,      ?,             ?)"
	_, err := db.Exec(sql, c.trollId, c.statut, c.mdpRestreint)
	return err
}

// met à jour les champs de gestion d'un compte en BD
func (store *MysqlStore) UpdateInfosGestionCompte(db *sql.DB, c *Compte) error {
	sql := "update compte set"
	sql += " statut=?,"
	sql += " mdp_restreint=?"
	sql += " where id=?"
	_, err := db.Exec(sql, c.trollId, c.statut, c.mdpRestreint)
	return err
}

// met à jour un compte en BD, sans les infos de gestion (comme le mdp)
func (store *MysqlStore) UpdateTroll(db *sql.DB, c *Compte) (err error) {
	t := c.Troll
	if t == nil {
		return errors.New("Compte sans données de troll")
	}
	updateProfil := t.ProchainTour > 0
	sql := "update compte set x=?, y=?, z=?"
	if updateProfil {
		sql += ", pv_max=?, pv_actuels=?, fatigue=?, pa=?, vue=?, prochain_tour=?, duree_tour=?, mise_a_jour=?"
	}
	sql += " where id=?"
	if updateProfil {
		_, err = db.Exec(sql, t.X, t.Y, t.Z, t.PV_max, t.PV_actuels, t.Fatigue, t.PA, t.Vue, (t.ProchainTour / 1000), t.DureeTour, time.Now(), c.trollId)
	} else {
		_, err = db.Exec(sql, t.X, t.Y, t.Z, c.trollId)
	}
	return err
}

// vérifie que le compte existe et que le mot de passe restreint est validé par MH
func (store *MysqlStore) CheckCompte(db *sql.DB, trollId int, mdpr string) (ok bool, c *Compte, err error) {
	c, err = store.GetCompte(db, trollId)
	if c == nil {
		if !ALLOW_SP {
			return false, nil, errors.New("Impossible de créer le compte car ALLOW_SP==false")
		}
		// nouveau compte
		c = new(Compte)
		c.trollId = trollId
		c.mdpRestreint = mdpr
		// on va regarder si le mdp restreint est correct
		ok = true
		ok, _, _ := CheckPassword(trollId, mdpr)
		if ok {
			c.statut = "ok"
		} else {
			c.statut = "soap_error" // TODO
		}
		// on sauvegarde
		err = store.InsertCompte(db, c)
	} else if c.mdpRestreint != mdpr {
		if !ALLOW_SP {
			return false, nil, errors.New("Impossible de vérifier le nouveau mot de passe car ALLOW_SP==false")
		}
		// nouveau mot de passe, il faut le vérifier aussi
		// mais on ne fait pas de remplacement en bd si le compte était ok et
		// que le nouveau mot de passe est invalide, pour ne pas pénaliser un joueur
		// si quelqu'un d'autre essaye de se connecter sur son compte (par contre
		// on renvoie ok=false).
		// ---> il faut une fonction explicite de désactivation de compte...
		ok, _, _ := CheckPassword(trollId, mdpr)
		if c.statut == "ok" {
			if ok {
				c.mdpRestreint = mdpr
				store.UpdateInfosGestionCompte(db, c)
			}
		} else {
			if ok {
				c.statut = "ok"
			} else {
				c.statut = "soap_error" // TODO
			}
			c.mdpRestreint = mdpr
			store.UpdateInfosGestionCompte(db, c)
		}
	} else {
		ok = (c.statut == "ok")
	}
	return
}
