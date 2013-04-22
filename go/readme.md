
La variable d'environnement GOPATH doit pointer vers ce répertoire qui suit l'architecture Go1
(cette variable d'environnement peut typiquement pointer vers plusieurs répertoires).

L'application chrallserver nécessite les drivers mymysql 

mymysql ( https://github.com/ziutek/mymysql ) :
    go get github.com/ziutek/mymysql/godrv
go-sql :
    go get github.com/go-sql-driver/mysql

Le serveur est (re)compilé, installé et exécuté via
	../scripts/restart-chrallserver.sh
