package main

import (
	"strconv"
	"strings"
)

//  petites fonctions utilitaires pour le requétage fait par Chrall

// renvoie une expression de calcul d'un minimum de colonne tel que les 0 ne soient pas pris en compte.
// le ifnull autour contourne l'incapacité du driver go à mettre u null dans un int
func namin(col string) string {
	return "ifnull(min(nullif(" + col + ", 0)), 0)"
}
func namax(col string) string {
	return "ifnull(max(nullif(" + col + ", 0)), 0)"
}

// le ifnull autour contourne l'incapacité du driver go à mettre u null dans une string
func maxtext(col string) string {
	return "ifnull(max(" + col + "),'')"
}

// à utiliser pour élargir : quand la valeur ciblée est variable, on prend le min des min et le max des max
func naminmax(colp string) string {
	return namin(colp+"_min") + ", " + namax(colp+"_max")
}

// à utiliser pour rétrécir : quand la valeur ciblée est fixe, on prend le max des min et le min des max
func namaxmin(colp string) string {
	return namax(colp+"_min") + ", " + namin(colp+"_max")
}

func JoinIds(ids []int, sep string) string {
	stringIds := make([]string, len(ids))
	for i, val := range ids {
		stringIds[i] = strconv.Itoa(val) // string.join ne prend pas de slice d'objets quelconques comme paramètres
	}
	return strings.Join(stringIds, ",")
}
