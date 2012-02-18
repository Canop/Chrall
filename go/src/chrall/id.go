package chrall

import (
	"strconv"
)

// renvoie 0 si la chaine a ne contient pas un id non signé. Utiliser strconv.ParseUint si l'erreur est nécessaire.
func AtoId(a string) int {
	id64, _ := strconv.ParseInt(a, 10, 0)
	return int(id64)
}
