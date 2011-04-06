# Ce script devrait être lancé une fois par jour.
# Il récupère les fichiers manquants sur le serveur MH
# puis met à jour le tableau kom.csv contenant des stats
# de kill des trolls.

lftp ftp://ftp.mountyhall.com/ -e "mirror -c -x test2009 -x 2003 -x 2004 -x 2005 -x 2006 -x 2007 -x 2008 -x 2009 -x 2010 /evenements ~/dev/Chrall/trav/morts/events; quit"

./killomètre ~/dev/Chrall/trav/morts/events > killomètre.out
