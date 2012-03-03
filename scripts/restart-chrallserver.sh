# tue, recompile et relance l'application chrallserver
# la sortie standard est redirigee vers log/chrallserver.log
# les anciens fichiers sont renommes en -old
killall -q chrallserver

go clean chrall
go install chrall
go clean chrallserver
go install chrallserver

# TODO : installer ceci dans un script de config comme pour braldop
cd /home/dys/dev/Chrall

mkdir -p log
mv log/chrallserver.log log/chrallserver.old.log

echo "lancement chrallserver depuis restart-chrallserver.sh" > log/chrallserver.log

nohup go/bin/chrallserver -dir /home/dys/chrall/ >> log/chrallserver.log 2>&1 0</dev/null &

echo tail -f log/chrallserver.log

