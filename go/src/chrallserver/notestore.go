package main

// gère la persistance en BD des notes

import (
	"database/sql"
	"log"
	"strconv"
	"time"
)

// une note
type Note struct {
	Id        int64 // autoincrément BD, 0 si pas en provenance de la BD
	Auteur    int
	TypeSujet string // rien, monstre, grotte,  guilde ou troll
	IdSujet   int    // si monstre ou troll
	XSujet    int
	YSujet    int
	ZSujet    int
	Partage   int   // 0 (auteur uniquement), 1 (partageux) ou 2 (tout le monde)
	Date      int64 // secondes
	Contenu   string
	Diplo     string // neutre, ami, ennemi
}

// les éléments (reçevables en json) d'une demande de notes
type NoteRequest struct {
	XMin      int
	XMax      int
	YMin      int
	YMax      int
	ZMin      int
	ZMax      int
	NumTrolls []int
}

// stocke une note en BD
func (store *MysqlStore) SaveNote(db *sql.DB, note *Note) error {
	if note.Id > 0 {
		// update
		// TODO utiliser comme clef l'id ET l'auteur, par sécurité (qu'on ne puisse pas effacer une note de quelqu'un d'autre) (pareil pour le delete)
		log.Println("update de note")
	} else {
		// insert
		sql := "insert into note (auteur, type_sujet, id_sujet, x_sujet, y_sujet, z_sujet, partage, date_changement, contenu, diplo)"
		sql += "          values (     ?,          ?,        ?,       ?,       ?,       ?,       ?,               ?,       ?,     ?)"
		seconds := time.Now()
		_, err := db.Exec(sql, note.Auteur, note.TypeSujet, note.IdSujet, note.XSujet, note.YSujet, note.ZSujet, note.Partage, seconds, note.Contenu, note.Diplo)
		if err != nil {
			log.Printf("Erreur stockage (in) note : %s\n", err.Error())
			return err
		}
	}
	return nil
}

// les paramètres passés sont des filtres optionnels
// TODO ajouter filtres position
func (store *MysqlStore) GetNotes(db *sql.DB, typeSujet string, idSujet int, asker int, amis []int, showOnlyFromThisAuthor bool) ([]*Note, error) {
	sql := "select id, auteur, type_sujet, id_sujet, x_sujet, y_sujet, z_sujet, partage, date_changement, contenu, diplo" +
		" from note "
	hasWhere := false
	if typeSujet != "" {
		sql += " where type_sujet='" + typeSujet + "'" // TODO vérifier le type avant...
		hasWhere = true
	}
	if idSujet != 0 {
		if hasWhere {
			sql += " and"
		} else {
			sql += " where"
		}
		sql += " id_sujet=" + strconv.Itoa(idSujet)
		hasWhere = true
	}
	if showOnlyFromThisAuthor {
		if hasWhere {
			sql += " and"
		} else {
			sql += " where"
		}
		sql += " auteur=" + strconv.Itoa(asker)
	} else {
		if hasWhere {
			sql += " and"
		} else {
			sql += " where"
		}
		sql += " (auteur=" + strconv.Itoa(asker)
		sql += " or (auteur in ("
		for i, id := range amis {
			if i > 0 {
				sql += ","
			}
			sql += strconv.Itoa(id)
		}
		sql += ") and partage>0) or partage>1)"
	}
	rows, err := db.Query(sql)
	if err != nil {
		return nil, err
	}
	notes := make([]*Note, 0, 20)
	for rows.Next() {
		r := new(Note)
		err = rows.Scan(&r.Id, &r.Auteur, &r.TypeSujet, &r.IdSujet, &r.XSujet, &r.YSujet, &r.ZSujet, &r.Partage, &r.Date, &r.Contenu, &r.Diplo)
		if err != nil {
			log.Println("Error while iterating in GetNotes", err)
		}
		notes = append(notes, r)
	}
	rows.Close()
	return notes, nil
}
