# tue, recompile et relance l'application gogo
# la sortie standard est redirigee vers gogo.out
# la sortie d'erreur est redirigee vers gogo.err
# les anciens fichiers sont renommes en -old
rm -f _go_.6
rm -f _go_.8
killall -q gogo
gomake
mv gogo.out gogo.out-old
mv gogo.err gogo.err-old
nohup ./gogo > gogo.out 2> gogo.err < /dev/null &

