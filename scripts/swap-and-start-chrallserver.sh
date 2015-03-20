
cd /home/dys/dev/Chrall

rm go/bin/chrallserver-old
mv go/bin/chrallserver go/bin/chrallserver-old
killall -q chrallserver
mv go/bin/new-chrallserver go/bin/chrallserver


mkdir -p log
mv log/chrallserver.log log/chrallserver.old.log

echo "lancement chrallserver depuis restart-chrallserver.sh" > log/chrallserver.log

nohup go/bin/chrallserver -dir /home/dys/chrall/ >> log/chrallserver.log 2>&1 0</dev/null &

echo tail -f log/chrallserver.log
