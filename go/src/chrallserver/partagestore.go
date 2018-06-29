package main

// gère la lecture et l'écriture en mysql des partages d'infos entre comptes

import (
	"database/sql"
)

// décrit un partage d'infos dans Chrall entre deux trolls
type Partage struct {
	TrollA  int // l'id du troll initiateur du partage
	TrollB  int
	StatutA string
	StatutB string
}

// le partage vu par un troll, pour exploitation dans l'extension
type MiPartage struct {
	IdAutreTroll     int // l'autre troll, qu'il soit initiateur ou pas
	NomAutreTroll    string
	RaceAutreTroll   string
	NiveauAutreTroll int
	Statut           string     // est-ce qu'on a accepté
	StatutAutreTroll string     // est-ce que l'autre a accepté
	AutreTroll       *TrollData // les données du troll. On ne renseigne ça que si le partage est actif (les deux statuts à on) et le compte de l'autre troll actif
}

// transforme des Partage en MiPartage. Une condition implicite est que l'observer soit l'une des parties
// de chacun de ces partages
func (store *MysqlStore) PartagesToMiPartages(db *sql.DB, observer int, partages []*Partage, m *TksManager) (miPartages []*MiPartage) {
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

func (store *MysqlStore) CompteAsMiPartage(c *Compte, m *TksManager) *MiPartage {
	mp := new(MiPartage)
	mp.IdAutreTroll = c.trollId
	mp.NomAutreTroll, mp.RaceAutreTroll, mp.NiveauAutreTroll = m.GetNomRaceNiveauTroll(int(c.trollId))
	mp.AutreTroll = c.Troll
	return mp
}

// sauvegarde un nouveau partage (à l'état de proposition de a pour b)
func (store *MysqlStore) InsertPartage(db *sql.DB, trollA int, trollB int) error {
	sql := "insert ignore into"
	sql += " partage (troll_a, troll_b)"
	sql += " values (       ?,       ?)"
	_, err := db.Exec(sql, trollA, trollB)
	return err
}

// modifie un partage
func (store *MysqlStore) UpdatePartage(db *sql.DB, troll int, autreTroll int, statut string) error {
	_, err := db.Exec("update partage set statut_a=? where troll_a=? and troll_b=?", statut, troll, autreTroll)
	if err != nil {
		return err
	}
	_, err = db.Exec("update partage set statut_b=? where troll_a=? and troll_b=?", statut, autreTroll, troll)
	return err
}

func (store *MysqlStore) DeletePartage(db *sql.DB, troll int, autreTroll int) error {
	_, err := db.Exec("delete from partage where (troll_a=? and troll_b=?) or (troll_b=? and troll_a=?)", troll, autreTroll, troll, autreTroll)
	return err
}

// récupère toutes les infos de partage, acceptés ou non, impliquant un troll
func (store *MysqlStore) GetAllPartages(db *sql.DB, trollId int) ([]*Partage, error) {
	sql := "select troll_a, troll_b, statut_a, statut_b from partage where troll_a=? or troll_b=?"
	rows, err := db.Query(sql, trollId, trollId)
	if err != nil {
		return nil, err
	}
	partages := make([]*Partage, 0, 10)
	for rows.Next() {
		r := new(Partage)
		err = rows.Scan(&r.TrollA, &r.TrollB, &r.StatutA, &r.StatutB)
		if err != nil {
			return nil, err
		}
		partages = append(partages, r)
	}
	return partages, nil
}

// renvoie la liste des trolls avec qui le troll passé a un partage actif
func (store *MysqlStore) GetPartageurs(db *sql.DB, trollId int) ([]int, error) {
	sql := "select troll_a, troll_b from partage where (troll_a=? or troll_b=?) and statut_a='on' and statut_b='on'"
	rows, err := db.Query(sql, trollId, trollId)
	if err != nil {
		return nil, err
	}
	amis := make([]int, 0, 5)
	var r0, r1 int
	for rows.Next() {
		err = rows.Scan(&r0, &r1)
		if err != nil {
			return nil, err
		}
		if r0 == trollId {
			amis = append(amis, r1)
		} else {
			amis = append(amis, r0)
		}
	}
	return amis, nil
}
