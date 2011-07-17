package main

import (
	"fmt"
)

type BestiaryExtract struct {
	NbCdm          int64
	NbMonsters     int64
	Fusion         *CDM
	PreciseMonster bool // indique si les CDM concerne exactement le monstre
}

func pxkill(niveauTueur uint, niveauTué uint) int {
	px := 10 + 3*int(niveauTué) - 2*int(niveauTueur)
	if px < 0 {
		px = 0
	}
	return px
}

func (be *BestiaryExtract) getGainPx(niveauTueur uint) string {
	if be.Fusion.Niveau_max == 0 {
		return fmt.Sprintf("> %d px", pxkill(niveauTueur, be.Fusion.Niveau_min))
	}
	pxMin := pxkill(niveauTueur, be.Fusion.Niveau_min)
	pxMax := pxkill(niveauTueur, be.Fusion.Niveau_max)
	if pxMin == pxMax {
		return fmt.Sprintf("%d px", pxMin)
	}
	return fmt.Sprintf("entre %d et %d px", pxMin, pxMax)
}

// renvoie le min et le max de la blessure possible
func (be *BestiaryExtract) getPvRestant(pourcentageBlessure uint) (pvMin, pvMax uint) {
	if pourcentageBlessure >= 95 {
		pvMin = 1
	} else {
		pvMin = (100 - pourcentageBlessure - 5) * be.Fusion.PointsDeVie_min / 100
	}
	if pourcentageBlessure <= 5 {
		pvMax = be.Fusion.PointsDeVie_max
	} else {
		pvMax = (100 - pourcentageBlessure + 5) * be.Fusion.PointsDeVie_max / 100
	}
	return pvMin, pvMax
}
