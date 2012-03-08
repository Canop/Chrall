package main

/*
 * gère les destinations pour les Tps et les gowaps. Le concept de destination est juste une vue de l'esprit,
 * une réduction-agrégation de plusieurs sources de données.
 */
import (
	"database/sql"
	"fmt"
	"log"
	"strings"
)

// une destination
type Destination struct {
	Id          int
	X           int
	Y           int
	Z           int
	Description string
}

func (d *Destination) String() string {
	return fmt.Sprint(d.Description, " Id: ", d.Id, " X:", d.X, " Y:", d.Y, " Z:", d.Z)
}

var noDestination = []*Destination{}

//---------------------------------------------------------------------------

func (store *MysqlStore) GetDestinations(amis []int, tksManager *TksManager, db *sql.DB) []*Destination {
	result := make([]*Destination, 0, 100)

	// :-(( On dirait qu'il n'y pas moyen de faire fonctionner un prepared statement avec une valeur qui serait un
	// slice de valeurs
	idList := JoinIds(amis, ",")
	if 0 < len(amis) {
		result = store.getFriendPositionsAsDestinations(idList, tksManager, db, result)
	}

	return result[0:len(result)]
}

func (store *MysqlStore) getFriendPositionsAsDestinations(friendIds string, tksManager *TksManager, db *sql.DB, result []*Destination) []*Destination {
	sqlText := "select id, x, y, z  from compte where id in (" + friendIds + ") "
	statement, _ := db.Prepare(sqlText)
	rows, err := statement.Query()

	if nil != err {
		log.Println("Impossible de récuperer positions des amis: %s", err.Error())
		return result
	}

	for rows.Next() {
		destination := new(Destination)
		rows.Scan(&destination.Id, &destination.X, &destination.Y, &destination.Z)
		nomTroll, _, _ := tksManager.GetNomRaceNiveauTroll(destination.Id)
		destination.Description = fmt.Sprintf("%v (%v) X:%v Y:%v Z:%v",
			nomTroll, destination.Id, destination.X, destination.Y, destination.Z)
		result = append(result, destination)
	}
	return result
}

//-----------------------------------------------------------------------------

func JoinIds(ids []int, sep string) string {
	if 0 == len(ids) {
		return ""
	}
	stringIds := make([]string, len(ids))
	for i, val := range ids {
		stringIds[i] = string(fmt.Sprint(val)) // string.join ne prend pas de slice d'objets quelconques comme paramètres
	}
	return strings.Join(stringIds, ",")
}
