# tue, recompile et relance l'application gogo
# la sortie standard est redirigee vers gogo.out
# la sortie d'erreur est redirigee vers gogo.err
# les anciens fichiers sont renommes en -old
rm -f _go_.6
rm -f _go_.8
killall -q gogo
gomake
mv gogo.out gogo.out-old

echo "*** Ctrl C stoppe l'affichage de la trace mais pas le serveur ***" > gogo.out

nohup ./gogo >> gogo.out 2>&1 < /dev/null &

tail -f gogo.out

