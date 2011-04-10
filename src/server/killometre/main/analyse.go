/*
 * J'implémente ici un algo très simple, pas très fiable mais qui semble donner de bons résultats pour la découverte des TK et ATK
 * 
 */

package main

import (
	"fmt"
	"os"
)

func (km *Killomètre) tagKills() int {
	nbChanges := 0
	for _, kill := range km.Kills {
		if kill.Tag == inconnu {
			if kill.TueurEstTroll {
				if kill.TuéEstTroll {
					tueur := km.Trolls[kill.Tueur]
					tué := km.Trolls[kill.Tué]
					if kill.Tueur == kill.Tué {
						kill.Tag = suicide // ne sont pas compris dans troll.NbKillsTrolls
						nbChanges++
					} else if tueur.Tag == tk {
						kill.Tag = tk
						nbChanges++
					} else if tueur.Tag == atk {
						kill.Tag = atk
						nbChanges++
					} else if tué.Tag == mk {
						kill.Tag = tk
						nbChanges++
					} else if tué.Tag == atk {
						kill.Tag = tk
						nbChanges++
					} else if tué.Tag == tk {
						kill.Tag = atk
						nbChanges++
					} else if tué.NbKillsTrolls-tué.NbKillsATK <= (tué.NbKillsMonstres+tué.NbKillsTK)/50 {
						// on ne sait pas si le tué est mk ou atk, mais il n'est pas tk
						kill.Tag = tk
						nbChanges++
					}
				} else {
					kill.Tag = mk
					nbChanges++
				}
			}
		}
	}
	return nbChanges
}

func (km *Killomètre) tagTrolls(trollsByTrollKills []*Troll) (nbTK int, nbATK int) {
	now, _, _ := os.Time()
	oneYearBefore := now - 365*24*60*60
	for _, troll := range trollsByTrollKills {
		troll.NbKillsTK = 0
		troll.NbKillsATK = 0
		troll.NbKilledByATK = 0
		troll.NbKillsTKLastYear = 0
	}
	for _, kill := range km.Kills {
		if kill.TueurEstTroll {
			if kill.Tag == tk {
				km.Trolls[kill.Tueur].NbKillsTK++
				if kill.Seconds > oneYearBefore {
					km.Trolls[kill.Tueur].NbKillsTKLastYear++
				}
			} else if kill.Tag == atk {
				km.Trolls[kill.Tueur].NbKillsATK++
				km.Trolls[kill.Tué].NbKilledByATK++
			}
		}
	}
	for _, troll := range trollsByTrollKills {
		if troll.NbKillsTK > 8 || (troll.NbKillsTK > 3 && troll.NbKillsTK*3 > troll.NbKillsTrolls) {
			troll.Tag = tk
			nbTK++
		} else if troll.NbKillsATK > 2 && (troll.NbKillsATK*15 > 10*troll.NbKillsTrolls) {
			troll.Tag = atk
			nbATK++
		} else if troll.NbKilledByATK > 3 {
			troll.Tag = tk
			nbTK++
		}
	}
	return nbTK, nbATK

}

// analyse les kills pour essayer de déterminer qui est TK, ATK, MK
// on exploite une liste triée car elle est raccourcie
func (km *Killomètre) Analyse(trollsByTrollKills []*Troll) {

	//> premier étiquetage des trolls purs MK
	for _, troll := range trollsByTrollKills {
		if troll.NbKillsTrolls <= troll.NbKillsMonstres/50 {
			troll.Tag = mk
		}
	}

	for {
		nbChanges := km.tagKills()
		fmt.Printf("Changes in tagKills : %d\n", nbChanges)
		nbTK, nbATK := km.tagTrolls(trollsByTrollKills)
		fmt.Printf("TK : %d\nATK : %d\n", nbTK, nbATK)
		if nbChanges == 0 {
			break
		}
	}
}
