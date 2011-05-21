package main
/*
gère la lecture et l'écriture en mysql des partages d'infos entre comptes
*/

import (
	"fmt"
	"mysql"
	"os"
	"strconv"
)


// décrit un partage d'infos dans Chrall entre deux trolls
type Partage struct {
	TrollA  uint // l'id du troll initiateur du partage
	TrollB  uint
	StatutA string
	StatutB string
}

// le partage vu par un troll, pour exploitation dans l'extension uniquement
type MiPartage struct {
	IdAutreTroll       uint // l'autre troll, qu'il soit initiateur ou pas
	NomAutreTroll    string
	Statut           string // est-ce qu'on a accepté
	StatutAutreTroll string // est-ce que l'autre a accepté
	AutreTroll *TrollData // les données du troll. On ne renseigne ça que si le partage est actif (les deux statuts à on) et le compte de l'autre troll actif
}

// transforme des Partage en MiPartage. Une condition implicite est que l'observer soit l'une des parties
// de chacun de ces partages
func (store *MysqlStore) PartagesToMiPartages(observer uint, partages []*Partage, m *TksManager) (miPartages []*MiPartage) {
	miPartages = make([]*MiPartage, len(partages))
	for i, p := range partages {
		mp := new(MiPartage)
		if p.TrollA == observer {
			mp.IdAutreTroll = p.TrollB
			mp.NomAutreTroll = m.GetNomTroll(int(p.TrollB))
			mp.Statut = p.StatutA
			mp.StatutAutreTroll = p.StatutB
		} else {
			mp.IdAutreTroll = p.TrollA
			mp.NomAutreTroll = m.GetNomTroll(int(p.TrollA))
			mp.Statut = p.StatutB
			mp.StatutAutreTroll = p.StatutA
		}
		if (mp.Statut=="on" && mp.StatutAutreTroll=="on") {
			c, _ := store.GetCompte(nil, mp.IdAutreTroll) // réutiliser la db
			if c!=nil {
				mp.AutreTroll = c.Troll
			}
		}
		
		miPartages[i] = mp
	}
	return
}

// sauvegarde un nouveau partage (à l'état de proposition de a pour b)
func (store *MysqlStore) InsertPartage(db *mysql.Client, trollA uint, trollB uint) (err os.Error) {
	if db == nil {
		db, err = mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
		if err != nil {
			return
		}
		defer db.Close()
	}

	sql := "insert ignore into"
	sql += " partage (troll_a, troll_b)"
	sql += " values (       ?,       ?)"

	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.Close()

	err = stmt.BindParams(trollA, trollB)
	if err != nil {
		return
	}

	err = stmt.Execute()
	if err != nil {
		return
	}

	return
}

// modifie un partage
// est-ce qu'on pourrait faire ça en une seule requête ?
func (store *MysqlStore) UpdatePartage(db *mysql.Client, troll uint, autreTroll uint, statut string) (err os.Error) {
	if db == nil {
		db, err = mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
		if err != nil {
			return
		}
		defer db.Close()
	}

	sql := "update partage set statut_a=? where troll_a=? and troll_b=?"
	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.Close()
	err = stmt.BindParams(statut, troll, autreTroll)
	if err != nil {
		return
	}
	err = stmt.Execute()
	if err != nil {
		return
	}

	sql = "update partage set statut_b=? where troll_a=? and troll_b=?"
	stmt2, err := db.Prepare(sql)
	defer stmt2.Close()
	if err != nil {
		return
	}
	err = stmt2.BindParams(statut, autreTroll, troll)
	if err != nil {
		return
	}
	err = stmt2.Execute()

	return
}


// modifie un partage
// est-ce qu'on pourrait faire ça en une seule requête ?
func (store *MysqlStore) DeletePartage(db *mysql.Client, troll uint, autreTroll uint) (err os.Error) {
	if db == nil {
		db, err = mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
		if err != nil {
			return
		}
		defer db.Close()
	}

	sql := "delete from partage where (troll_a=? and troll_b=?) or (troll_b=? and troll_a=?)"
	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.Close()
	err = stmt.BindParams(troll, autreTroll, troll, autreTroll)
	if err != nil {
		return
	}
	err = stmt.Execute()
	return
}

// récupère toutes les infos de partage, acceptés ou non, impliquant un troll
func (store *MysqlStore) GetAllPartages(db *mysql.Client, trollId uint) (partages []*Partage, err os.Error) {
	if db == nil {
		db, err = mysql.DialUnix(mysql.DEFAULT_SOCKET, store.user, store.password, store.database)
		if err != nil {
			return
		}
		defer db.Close()
	}

	sql := "select troll_a, troll_b, statut_a, statut_b from partage where troll_a=" + strconv.Uitoa(trollId) + " or troll_b=" + strconv.Uitoa(trollId)

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

	partages = make([]*Partage, 0, 10)
	for {
		row := result.FetchRow()
		if row == nil {
			break
		}
		p := new(Partage)
		p.TrollA = fieldAsUint(row[0])
		p.TrollB = fieldAsUint(row[1])
		p.StatutA = fieldAsString(row[2])
		p.StatutB = fieldAsString(row[3])
		l := len(partages)
		if l == cap(partages) {
			newSlice := make([]*Partage, (l+1)*3/2)
			copy(newSlice, partages)
			partages = newSlice
		}
		partages = partages[0 : l+1]
		partages[l] = p
	}

	return
}
