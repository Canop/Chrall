package main

/*
gère le stockage sous MySQL de la vue des trolls.


*/

type Observation struct {
	Auteur int    // numéro du troll qui a fait l'observation
	Num    int    // numéro du truc vu
	Type   string // 'troll', 'monstre' ou 'lieu'
	Date   int64  // la date de l'observation (en secondes)
	Nom    string // le nom du truc observé
	X      int
	Y      int
	Z      int
}
