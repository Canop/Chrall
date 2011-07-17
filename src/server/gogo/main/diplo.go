package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type DiploNode struct {
	IsTroll bool
	Id      uint
	Starts  []*DiploVertice
	Ends    []*DiploVertice
}

type DiploVertice struct {
	Start *DiploNode
	End   *DiploNode
	Foe   bool
	Text  string
}

type DiploGraph struct {
	Trolls   map[uint]*DiploNode
	Guilds   map[uint]*DiploNode
	Vertices map[int64]*DiploVertice
}

func NewDiploGraph() *DiploGraph {
	g := new(DiploGraph)
	g.Trolls = make(map[uint]*DiploNode)
	g.Guilds = make(map[uint]*DiploNode)
	g.Vertices = make(map[int64]*DiploVertice)
	return g
}

func VerticeKey(startIsTroll bool, startId uint, endIsTroll bool, endId uint) int64 {
	var v1 int64
	if startIsTroll {
		v1 = 100000 + int64(startId)
	} else {
		v1 = int64(startId)
	}
	var v2 int64
	if endIsTroll {
		v2 = 100000 + int64(endId)
	} else {
		v2 = int64(endId)
	}
	return v1 + (v2 << 30)
}

func (v *DiploVertice) Key() int64 {
	return VerticeKey(v.Start.IsTroll, v.Start.Id, v.End.IsTroll, v.End.Id)
}

func (v *DiploVertice) ColoredText() string {
	html := " &nbsp; <font color="
	if v.Foe {
		html += "#FF6666>"
	} else {
		html += "lightgreen>"
	}
	if v.Text == "" {
		if v.Foe {
			html += "ENNEMI"
		} else {
			html += "AMI"
		}
	} else {
		html += v.Text
	}
	html += "</font>"
	return html
}

func AddVertice(a []*DiploVertice, v *DiploVertice) []*DiploVertice {
	l := len(a)
	if l == cap(a) {
		newSlice := make([]*DiploVertice, (l+1)*5/4)
		copy(newSlice, a)
		a = newSlice
	}
	a = a[0 : l+1]
	a[l] = v
	return a
}

func getOrCreateNode(m map[uint]*DiploNode, id uint) *DiploNode {
	n, ok := m[id]
	if !ok {
		n = new(DiploNode)
		n.Id = id
		m[id] = n
	}
	return n
}

func (g *DiploGraph) getNode(isTroll bool, id uint) *DiploNode {
	if isTroll {
		return g.Trolls[id]
	}
	return g.Guilds[id]
}

// charge un fichier de diplo (il vaut mieux partir d'un graphe vide avant de charger un jeu de fichiers)
func (g *DiploGraph) ReadDiploGraph(r *bufio.Reader, ascii bool, subjectIsTroll bool) os.Error {
	line, err := r.ReadString('\n') // TODO : utiliser r.ReadLine() plutôt que r.ReadString('\n')
	for err == nil {
		tokens := strings.Split(line, ";", 6)
		if len(tokens) < 5 {
			fmt.Println("Ligne invalide")
			continue
		}
		sid, _ := strconv.Atoui(tokens[0])
		eIsTroll := false
		if tokens[1] == "T" {
			eIsTroll = true
		}
		eid, _ := strconv.Atoui(tokens[2])
		v := new(DiploVertice)
		sn := getOrCreateNode(g.Guilds, sid)
		sn.IsTroll = subjectIsTroll
		var en *DiploNode
		if eIsTroll {
			en = getOrCreateNode(g.Trolls, eid)
			en.IsTroll = true
		} else {
			en = getOrCreateNode(g.Guilds, eid)
		}
		v.Start = sn
		v.End = en
		sn.Starts = AddVertice(sn.Starts, v)
		en.Ends = AddVertice(en.Ends, v)
		v.Text = strings.Trim(tokens[3], " ")
		if ascii {
			v.Text = AsciiToUTF8([]uint8(v.Text))
		}
		if tokens[4] == "ENNEMI" {
			v.Foe = true
		}
		g.Vertices[v.Key()] = v
		line, err = r.ReadString('\n')
		//~ if subjectIsTroll { // DEBUG de la diplo troll
		//~ fmt.Println(v.ColoredText())
		//~ }
	}
	if err != os.EOF {
		fmt.Println("Erreur au parsage de la diplo :")
		fmt.Println(err)
		return err
	}
	return nil
}


func (g *DiploGraph) DescribeYourRelationsWith(yourTroll, yourGuild, hisTroll, hisGuild uint) string {
	if g == nil {
		return "Diplo non disponible" // pb de synchro ?
	}
	html := ""
	v := g.Vertices[VerticeKey(true, yourTroll, true, hisTroll)]
	if v != nil {
		html += "<br>Ce que vous pensez de ce troll :<br>  &nbsp; "
		html += v.ColoredText()
	}
	v = g.Vertices[VerticeKey(true, yourTroll, false, hisGuild)]
	if v != nil {
		html += "<br>Ce que vous pensez de sa guilde :<br>  &nbsp; "
		html += v.ColoredText()
	}
	v = g.Vertices[VerticeKey(true, hisTroll, true, yourTroll)]
	if v != nil {
		html += "<br>Ce que ce troll pense de vous :<br>  &nbsp; "
		html += v.ColoredText()
	}
	if yourGuild > 1 {
		v = g.Vertices[VerticeKey(false, yourGuild, true, hisTroll)]
		if v != nil {
			html += "<br>Ce que votre guilde pense de ce troll :<br>  &nbsp; "
			html += v.ColoredText()
		}
	}
	if yourGuild > 1 && hisGuild > 1 {
		v = g.Vertices[VerticeKey(false, yourGuild, false, hisGuild)]
		if v != nil {
			html += "<br>Ce que votre guilde pense de la sienne :<br>  &nbsp; "
			html += v.ColoredText()
		}
	}
	if hisGuild > 1 {
		v = g.Vertices[VerticeKey(false, hisGuild, true, yourTroll)]
		if v != nil {
			html += "<br>Ce que sa guilde pense de vous :<br>  &nbsp; "
			html += v.ColoredText()
		}
	}
	if yourGuild > 1 && hisGuild > 1 {
		v = g.Vertices[VerticeKey(false, hisGuild, false, yourGuild)]
		if v != nil {
			html += "<br>Ce que sa guilde pense de la votre :<br>  &nbsp; "
			html += v.ColoredText()
		}
	}
	return html
}
