package main
/*
gère la persistance en BD des notes
*/
import (
	"fmt"
	"mysql"
	"os"
	"time"
)

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
	Diplo string // neutre, ami, ennemi
}

// stocke une note en BD 
func (store *MysqlStore) SaveNote(db *mysql.Client, note *Note) (err os.Error) {
	if note.Id > 0 {
		// update
		// TODO utiliser comme clef l'id ET l'auteur, par sécurité (qu'on ne puisse pas effacer une note de quelqu'un d'autre) (pareil pour le delete)
		fmt.Println("update de note")
	} else {
		// insert
		sql := "insert into note (auteur, type_sujet, id_sujet, x_sujet, y_sujet, z_sujet, partage, date_changement, contenu, diplo)"
		sql += "          values (     ?,          ?,        ?,       ?,       ?,       ?,       ?,               ?,       ?,     ?)"

		stmt, err := db.Prepare(sql)
		if err != nil {
			return
		}
		defer stmt.FreeResult()

		seconds := time.Seconds()

		err = stmt.BindParams(note.Auteur, note.TypeSujet, note.IdSujet, note.XSujet, note.YSujet, note.ZSujet, note.Partage, seconds, note.Contenu, note.Diplo)
		if err != nil {
			fmt.Printf("Erreur stockage (in) note : %s\n", err.String()) // FIXME l'erreur ne semble pas retransmise ???
			return
		}

		err = stmt.Execute()
		if err != nil {
			return
		}

	}
	return
}

// typeSujet : "" si on ne veut pas filtrer par type
// idSujet : "" si on ne veut pas filtrer par id
// auteur : "" si on ne veut pas filtrer par auteur
// 
func (store *MysqlStore) GetNotes(typeSujet string, idSujet string, auteur string, trollId int, amis []int) (notes []*Note) {
	return // not yet implemented !
}
