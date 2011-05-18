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


type Compte struct {
	TrollId uint
	Statut string // ok,  bad_pwd, off, soap_error
	MdpRestreint string // md5, donc 32 caractères
}


func rowToCompte(trollId uint, row mysql.Row) (c *Compte) {
	c = new(Compte)
	c.TrollId = trollId
	c.Statut = fieldAsString(row[1])
	c.MdpRestreint = fieldAsString(row[2])
	return
}


// lit un compte en base. Renvoie nil si le compte n'existe pas en base
// L'appelant est responsable de l'ouverture et de la fermeture de la connexion.
func (store *MysqlStore) GetCompte(db *mysql.Client, trollId uint) (c *Compte, err os.Error) {
	
	if trollId==0 {
		fmt.Println("GetCompte> trollId invalide")
		return
	}
	
	sql := "select statut, mdp_restreint, pv_max, pv_actuels, x, y, z"
	sql += " from compte where id="+strconv.Uitoa(trollId)
	
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
	if row==nil {
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
	
	err = stmt.BindParams(c.TrollId, c.Statut, c.MdpRestreint)
	if err != nil {
		return
	}
	
	err = stmt.Execute()
	if err != nil {
		return
	}
	
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
		
	if c==nil {
		// nouveau compte
		c = new(Compte)
		c.TrollId = trollId
		c.MdpRestreint = mdpr
		// on va regarder si le mdp restreint est correct
		ok = true
		//~ ok, errorCode, errorDetails := CheckPassword(trollId, mdpr)
		if ok {
			c.Statut = "ok"
		} else {
			c.Statut = "soap_error" // TODO
		}
		// on sauvegarde
		err = store.InsertCompte(db, c)
		
	} else if c.MdpRestreint != mdpr {
		// nouveau mot de passe, il faut le vérifier aussi
		// mais on ne fait pas de remplacement en bd si le compte était ok et
		// que le nouveau mot de passe est invalide, pour ne pas pénaliser un joueur
		// si quelqu'un d'autre essaye de se connecter sur son compte (par contre
		// on renvoie ok=false).
		
		ok = true
		//~ ok, errorCode, errorDetails := CheckPassword(trollId, mdpr)
		
		// TODO
	} else {
		ok = (c.Statut=="ok")
	}

	return
}
