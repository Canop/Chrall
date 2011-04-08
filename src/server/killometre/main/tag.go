package main

type tag uint8

const (
	inconnu = tag(0)
	mk      = tag(1)
	tk      = tag(2)
	atk     = tag(3)
	suicide = tag(4)
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
