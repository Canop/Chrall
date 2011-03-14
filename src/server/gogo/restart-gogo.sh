# tue, recompile et relance l'application gogo
# la sortie standard est redirigée vers gogo.out
# la sortie d'erreur est redirigée vers gogo.err
# les anciens fichiers sont renommés en -old
rm -f _go_.6
rm -f _go_.8
killall -q gogo
gomake
mv gogo.out gogo.out-old
mv gogo.err gogo.err-old
nohup ./gogo > gogo.out 2> gogo.err < /dev/null &

