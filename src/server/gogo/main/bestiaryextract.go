package main


type BestiaryExtract struct {
	NbCdm          int64
	NbMonsters     int64
	Fusion         *CDM
	PreciseMonster bool // indique si les CDM concerne exactement le monstre
}
