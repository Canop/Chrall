package main

import (
	"fmt"
)

type G2cMessage struct { // on définira peut-être plus tard une structure hiérarchique plus riche
	Nature string // "empty", "update", "normal", "urgent"
	Title  string
	Content   string
}



func GetMessage(TrollId string, ChrallVersion string) (out *G2cMessage) {
	fmt.Println("Input message : version="+ChrallVersion)
	out = new(G2cMessage)
	out.Nature = "empty"
	out.Title = ""
	out.Content = ""
	//out.Content += "<br>Il y aura dans ce cas un <a target=newwin class=gogo href=http://canop.org/chrall>lien vers le site officiel</a>."
	out.Content += ""
	return out
}
