package main

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

type Version struct {
	Parts []int
}

func (v *Version) String() string {
	s := ""
	for i, p := range v.Parts {
		if i > 0 {
			s += "."
		}
		s += strconv.FormatUint(uint64(p), 10)
	}
	return s
}

func ParseVersion(s string) (v *Version, err error) {
	if len(s) == 0 {
		return nil, errors.New("empty string")
	}
	tokens := strings.Split(strings.Trim(s, " "), ".")
	v = new(Version)
	v.Parts = make([]int, len(tokens))
	for i, t := range tokens {
		if n, pe := strconv.ParseInt(t, 10, 0); pe != nil {
			return nil, pe
		} else {
			v.Parts[i] = int(n)
		}
	}
	return v, nil
}

/**
 * a == b : returns 0
 * a > b  : returns 1
 * a < b  : return -1
 */
func CompareVersions(a *Version, b *Version) int {
	for i := 0; i < 100; i++ {
		if i >= len(a.Parts) {
			if i >= len(b.Parts) {
				return 0
			} else {
				return -1
			}
		}
		if i > len(b.Parts) {
			return 1
		}
		if a.Parts[i] > b.Parts[i] {
			return 1
		} else if a.Parts[i] < b.Parts[i] {
			return -1
		}
	}
	return 0
}

type G2cMessage struct { // on définira peut-être plus tard une structure hiérarchique plus riche
	Nature  string // "empty", "update", "normal", "urgent"
	Title   string
	Content string
}

func GetMessage(TrollId string, ChrallVersion string) (out *G2cMessage) {
	out = new(G2cMessage)
	out.Nature = "empty"

	//> on va regarder si l'utilisateur n'a pas une version ancienne de Chrall
	currentChralVersion := &Version{[]int{2, 24}}
	if userVersion, err := ParseVersion(ChrallVersion); err != nil {
		fmt.Println("user's Chrall Version not understood : " + ChrallVersion)
	} else {
		switch CompareVersions(userVersion, currentChralVersion) {
		case -1:
			out.Nature = "update"
			fmt.Println("User version is old : " + ChrallVersion)
			out.Title = "L'extension Chrall n'est pas à jour"
			out.Content += "Votre version : " + ChrallVersion
			out.Content += "<br>La version actuelle : " + currentChralVersion.String()
			out.Content += "<br>Cette version rétablit l'affichage de la distance horizontale dans les bulles sur la carte."
			out.Content += "<br><br>Vous pouvez mettre à jour l'extension sur <a target=newwin class=gogo href=http://canop.org/chrall>le site officiel de Chrall</a>."
		case 1:
			out.Nature = "normal"
			fmt.Println("User version is younger than current (???) : " + ChrallVersion)
			out.Title = "Votre version de Chrall est plus récente que la version officielle"
			out.Content = "Vous disposez probablement d'une version spéciale de développement. Sinon, il faudrait prévenir Canop."
		}
	}

	//> en deuxième partie, si la version est à jour, on peut se préoccuper éventuellement d'envoyer d'autres messages
	if out.Nature == "empty" {
		// en fait dans ce cas précis je n'ai rien à dire
	}
	return out
}
