package main
/*
gère la lecture et l'écriture en mysql des comptes de troll
*/


import (
	"fmt"
	"mysql"
	"os"
	"strconv"
)


type TrollData struct {
	PV_max     uint
	PV_actuels uint
	X          int64
	Y          int64
	Z          int64
}

type Compte struct { // les infos privées sont celles qui ne sont pas décodables telles quelles depuis les structures json
	trollId      uint
	statut       string // ok,  bad_pwd, off, soap_error
	mdpRestreint string // md5, donc 32 caractères
	Troll        *TrollData
}


func rowToCompte(trollId uint, row mysql.Row) (c *Compte) {
	c = new(Compte)
	c.trollId = trollId
	c.statut = fieldAsString(row[0])
	c.mdpRestreint = fieldAsString(row[1])
	c.Troll = new(TrollData)
	c.Troll.PV_max = fieldAsUint(row[2])
	c.Troll.PV_actuels = fieldAsUint(row[3])
	c.Troll.X = fieldAsInt64(row[4])
	c.Troll.Y = fieldAsInt64(row[5])
	c.Troll.Z = fieldAsInt64(row[6])
	return
}


// lit un compte en base. Renvoie nil si le compte n'existe pas en base.
// db peu être null. Sinon l'appelant est responsable de l'ouverture et de la fermeture de la connexion qu'il fournit
func (store *MysqlStore) GetCompte(db *mysql.Client, trollId uint) (c *Compte, err os.Error) {
	if db == nil {
		db, err = mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
		if err != nil {
			return
		}
		defer db.Close()
	}

	if trollId == 0 {
		fmt.Println("GetCompte> trollId invalide")
		return
	}

	sql := "select statut, mdp_restreint, pv_max, pv_actuels, x, y, z"
	sql += " from compte where id=" + strconv.Uitoa(trollId)

	fmt.Println("SQL: " + sql)

	err = db.Query(sql)
	if err != nil {
		return
	}

	result, err := db.UseResult()
	if err != nil {
		return
	}
	defer result.Free()

	row := result.FetchRow()
	if row == nil {
		return
	}
	c = rowToCompte(trollId, row)

	return
}

// sauvegarde un nouveau compte.
// L'appelant est responsable de l'ouverture et de la fermeture de la connexion.
func (store *MysqlStore) InsertCompte(db *mysql.Client, c *Compte) (err os.Error) {

	sql := "insert into"
	sql += " compte (id, statut, mdp_restreint)"
	sql += " values ( ?,      ?,             ?)"

	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.Close()

	err = stmt.BindParams(c.trollId, c.statut, c.mdpRestreint)
	if err != nil {
		return
	}

	err = stmt.Execute()
	if err != nil {
		return
	}

	return
}

// met à jour les champs de gestion d'un compte en BD
// L'appelant est responsable de l'ouverture et de la fermeture de la connexion.
func (store *MysqlStore) UpdateInfosGestionCompte(db *mysql.Client, c *Compte) (err os.Error) {

	sql := "update compte set"
	sql += " statut=?,"
	sql += " mdp_restreint=?"
	sql += " where id=?"

	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.Close()

	err = stmt.BindParams(c.statut, c.mdpRestreint, c.trollId)
	if err != nil {
		return
	}

	err = stmt.Execute()
	return
}

// met à jour un compte en BD, sans les infos de gestion
func (store *MysqlStore) UpdateTroll(c *Compte) (err os.Error) {

	db, err := mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
	if err != nil {
		return
	}
	defer db.Close()

	t := c.Troll
	if t == nil {
		fmt.Println("Compte sans données de troll")
		return
	}

	sql := "update compte set"
	sql += " pv_max=?,"
	sql += " pv_actuels=?,"
	sql += " x=?, y=?, z=?"
	sql += " where id=?"

	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.Close()

	err = stmt.BindParams(t.PV_max, t.PV_actuels, t.X, t.Y, t.Z, c.trollId)
	if err != nil {
		return
	}

	err = stmt.Execute()
	return
}


// vérifie que le compte existe et que le mot de passe restreint est validé par MH
func (store *MysqlStore) CheckCompte(trollId uint, mdpr string) (ok bool, c *Compte, err os.Error) {

	db, err := mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
	if err != nil {
		return
	}
	defer db.Close()
	c, err = store.GetCompte(db, trollId)

	if err != nil {
		return
	}

	if c == nil {
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
