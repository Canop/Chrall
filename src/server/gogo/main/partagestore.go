package main
/*
gère la lecture et l'écriture en mysql des partages d'infos entre comptes
*/

import (
	"container/vector"
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

// le partage vu par un troll, pour exploitation dans l'extension
type MiPartage struct {
	IdAutreTroll     uint // l'autre troll, qu'il soit initiateur ou pas
	NomAutreTroll    string
	RaceAutreTroll   string
	NiveauAutreTroll uint
	Statut           string     // est-ce qu'on a accepté
	StatutAutreTroll string     // est-ce que l'autre a accepté
	AutreTroll       *TrollData // les données du troll. On ne renseigne ça que si le partage est actif (les deux statuts à on) et le compte de l'autre troll actif
}

// transforme des Partage en MiPartage. Une condition implicite est que l'observer soit l'une des parties
// de chacun de ces partages
func (store *MysqlStore) PartagesToMiPartages(db *mysql.Client, observer uint, partages []*Partage, m *TksManager) (miPartages []*MiPartage) {
	miPartages = make([]*MiPartage, len(partages))
	for i, p := range partages {
		mp := new(MiPartage)
		if p.TrollA == observer {
			mp.IdAutreTroll = p.TrollB
			mp.NomAutreTroll, mp.RaceAutreTroll, mp.NiveauAutreTroll = m.GetNomRaceNiveauTroll(int(p.TrollB))
			mp.Statut = p.StatutA
			mp.StatutAutreTroll = p.StatutB
		} else {
			mp.IdAutreTroll = p.TrollA
			mp.NomAutreTroll, mp.RaceAutreTroll, mp.NiveauAutreTroll = m.GetNomRaceNiveauTroll(int(p.TrollA))
			mp.Statut = p.StatutB
			mp.StatutAutreTroll = p.StatutA
		}
		if mp.Statut == "on" && mp.StatutAutreTroll == "on" {
			c, _ := store.GetCompte(db, mp.IdAutreTroll) // réutiliser la db
			if c != nil {
				mp.AutreTroll = c.Troll
			}
		}

		miPartages[i] = mp
	}
	return
}

// sauvegarde un nouveau partage (à l'état de proposition de a pour b)
func (store *MysqlStore) InsertPartage(db *mysql.Client, trollA uint, trollB uint) (err os.Error) {
	sql := "insert ignore into"
	sql += " partage (troll_a, troll_b)"
	sql += " values (       ?,       ?)"

	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.FreeResult()

	err = stmt.BindParams(trollA, trollB)
	if err != nil {
		return
	}

	err = stmt.Execute()

	return
}

// modifie un partage
// est-ce qu'on pourrait faire ça en une seule requête ?
func (store *MysqlStore) UpdatePartage(db *mysql.Client, troll uint, autreTroll uint, statut string) (err os.Error) {

	sql := "update partage set statut_a=? where troll_a=? and troll_b=?"
	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.FreeResult()
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
	defer stmt.FreeResult()
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


func (store *MysqlStore) DeletePartage(db *mysql.Client, troll uint, autreTroll uint) (err os.Error) {
	sql := "delete from partage where (troll_a=? and troll_b=?) or (troll_b=? and troll_a=?)"
	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.FreeResult()
	err = stmt.BindParams(troll, autreTroll, troll, autreTroll)
	if err != nil {
		return
	}
	err = stmt.Execute()
	return
}

// récupère toutes les infos de partage, acceptés ou non, impliquant un troll
func (store *MysqlStore) GetAllPartages(db *mysql.Client, trollId uint) (partages []*Partage, err os.Error) {

	sql := "select troll_a, troll_b, statut_a, statut_b from partage where troll_a=? or troll_b=?"
	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.FreeResult()
	err = stmt.BindParams(trollId, trollId)
	if err != nil {
		return
	}

	err = stmt.Execute()
	if err != nil {
		return
	}
	r := new(Partage)
	stmt.BindResult(&r.TrollA, &r.TrollB, &r.StatutA, &r.StatutB)
	partages = make([]*Partage, 0, 10)
	for {
		eof, err := stmt.Fetch()
		if err != nil || eof {
			return
		}
		p := &Partage{r.TrollA, r.TrollB, r.StatutA, r.StatutB} // on dirait qu'on ne peut pas dupliquer l'objet plus simplement
		partages = append(partages, p)
	}

	return
}
func (store *MysqlStore) GetAllPartages_old(db *mysql.Client, trollId uint) (partages []*Partage, err os.Error) {

	sql := "select troll_a, troll_b, statut_a, statut_b from partage where troll_a=" + strconv.Uitoa(trollId) + " or troll_b=" + strconv.Uitoa(trollId)
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

// renvoie la liste des trolls avec qui le troll passé a un partage actif
func (store *MysqlStore) GetPartageurs(db *mysql.Client, trollId int) ([]int, os.Error) {
	st := strconv.Itoa(trollId)
	sql := "select troll_a, troll_b from partage where (troll_a=" + st + " or troll_b=" + st + ") and statut_a='on' and statut_b='on'"
	err := db.Query(sql)
	if err != nil {
		return nil, err
	}
	result, err := db.UseResult()
	if err != nil {
		return nil, err
	}
	defer result.Free()

	amis := new(vector.IntVector)
	for {
		row := result.FetchRow()
		if row == nil {
			break
		}
		r0 := fieldAsInt(row[0])
		r1 := fieldAsInt(row[1])
		if r0 == trollId {
			amis.Push(r1)
		} else {
			amis.Push(r0)
		}
	}

	return *amis, nil

}
