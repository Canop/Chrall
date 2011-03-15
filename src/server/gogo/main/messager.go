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
	out.Nature = "normal"
	out.Title = "Hello ! Cliquez moi !"
	out.Content = "Ceci est un message envoyé par le serveur g0g0chrall.<br>Là, pour l'instant, il n'est pas passionnant mais à l'avenir j'utiliserai ça pour annoncer les nouvelles versions."
	out.Content += "<br>Il y aura dans ce cas un <a target=newwin class=gogo href=http://canop.org/chrall>lien vers le site officiel</a>."
	out.Content += "<br>Si le serveur n'a rien à dire, cette boite bleue n'apparait pas du tout."
	return out
}
