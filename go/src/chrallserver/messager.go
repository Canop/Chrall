package main

import (
	"errors"
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

// permet éventuellement d'envoyer un message à l'utilisateur
func GetMessage(TrollId string, ChrallVersion string) (out *G2cMessage) {
	out = new(G2cMessage)
	out.Nature = "empty"

	// out.Title = "quelque chose qu'on veut dire"
	// out.Content = "bla bla"

	return out
}
