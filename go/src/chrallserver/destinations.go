package main
/*
gère les destinations pour les Tps et les gowaps. Le concept de destination est juste une vue de l'esprit,
une réduction-agrégation de plusieurs sources de données.
*/
import (
	"fmt"
	"mysql"
	"strings"
)

// une destination
type Destination struct {
	Auteur    int
	X         int
	Y         int
	Z         int
	Desc      string
}


func JoinIds(ids []int, sep string) string {
	if 0 == len(ids) {
		return ""
	}
	stringIds := make([]string, len(ids))
	for i, val := range ids {
		stringIds[i] = string(val)  // string.join ne prend pas de slice d'objets quelconques comme paramètres
	}

	fmt.Println("Joined Ids: ", strings.Join(stringIds, ","))
	return strings.Join(stringIds, ",")
}

func (store *MysqlStore) GetDestinations(db *mysql.Client, amis []int) (destinations []*Destination) {
	sql := "select id, x, y, z  from compte where id in (?) "
	statement, err := db.Prepare(sql)
	idList := strings.Join(amis, ",")
	return nil
}
