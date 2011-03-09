package main

/*
quelques petites fonctions utilitaires pour le requétage fait par Chrall 
*/

import (
	"strings"
)

// TODO trouver mieux, plus fiable, et standard...
func toMysqlString(s string) string {
	s = strings.Replace(s, "\"", "\\\"", -1)
	return "\"" + s + "\""
	//s = strings.Replace(s, "'", "\\'", -1)
	//return "'"+s+"'"
}

// renvoie une expression de calcul d'un minimum de colonne tel que les 0 ne soient pas pris en compte.
// le nullif autour contourne un bug (présumé) de la librairie GoMySQL
func namin(col string) string {
	return "ifnull(min(nullif(" + col + ", 0)), 0)"
}
func namax(col string) string {
	return "ifnull(max(nullif(" + col + ", 0)), 0)"
}
// à utiliser pour élargir : quand la valeur ciblée est variable, on prend le min des min et le max des max
func naminmax(colp string) string {
	return namin(colp+"_min") + ", " + namax(colp+"_max")
}
// à utiliser pour rétrécir : quand la valeur ciblée est fixe, on prend le max des min et le min des max
func namaxmin(colp string) string {
	return namax(colp+"_min") + ", " + namin(colp+"_max")
}
