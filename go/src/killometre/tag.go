package main

import (
	"strings"
)

type tag uint8

const (
	inconnu = tag(iota)
	mk      = tag(iota)
	tk      = tag(iota)
	atk     = tag(iota)
	suicide = tag(iota)
)

func (t tag) string() string {
	switch t {
	case mk:
		return "mk"
	case tk:
		return "tk"
	case atk:
		return "atk"
	case suicide:
		return "suicide"
	}
	return "inconnu"
}

type raceTroll uint8

const (
	race_inconnue = raceTroll(iota)
	darkling      = raceTroll(iota)
	durakuir      = raceTroll(iota)
	kastar        = raceTroll(iota)
	skrim         = raceTroll(iota)
	tomawak       = raceTroll(iota)
)

var RACE_NAMES = [6]string{"inconnu", "darkling", "durakuir", "kastar", "skrim", "tomawak"}

func (r raceTroll) string() string {
	return RACE_NAMES[uint(r)]
}

func race(s string) raceTroll {
	s = strings.ToLower(s)
	for i, name := range RACE_NAMES {
		if s == name {
			return raceTroll(i)
		}
	}
	return race_inconnue
}
