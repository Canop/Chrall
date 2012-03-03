
La variable d'environnement GOPATH doit pointer vers ce répertoire qui suit l'architecture Go1
(cette variable d'environnement peut typiquement pointer vers plusieurs répertoires).

L'application chrallserver nécessite le driver mymysql ( https://github.com/ziutek/mymysql )
On l'obtient via la commande
    go get github.com/ziutek/mymysql/godrv
    
Le serveur est (re)compilé, installé et exécuté via
	../scripts/restart-chrallserver.sh
