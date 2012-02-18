# Ce script devrait être lancé une fois par jour.
# Il récupère les fichiers manquants sur le serveur MH
# puis met à jour le tableau kom.csv contenant des stats
# de kill des trolls.

# récupération de la liste des trolls
lftp ftp://ftp.mountyhall.com/ -e "get /Public_Trolls.txt -o /home/dys/chrall/Public_Trolls.txt; quit" > /home/dys/chrall/update-kills.out

# récupération de la liste des guildes
lftp ftp://ftp.mountyhall.com/ -e "get /Public_Guildes.txt -o /home/dys/chrall/Public_Guildes.txt; quit" >> /home/dys/chrall/update-kills.out

# récupération de la liste des relations diplomatiques
lftp ftp://ftp.mountyhall.com/ -e "get /Public_Diplomatie.txt -o /home/dys/chrall/Public_Diplomatie.txt; quit" >> /home/dys/chrall/update-kills.out

# récupération des fichiers d'événements MORTS
lftp ftp://ftp.mountyhall.com/ -e "mirror -c -x test2009 -x 2003 -x 2004 -x 2005 -x 2006 -x 2007 -x 2008 -x 2009 -x 2010 /evenements /home/dys/chrall/morts; quit" >> /home/dys/chrall/update-kills.out
#lftp ftp://ftp.mountyhall.com/ -e "mirror -c -x test2009 /evenements /home/dys/chrall/morts; quit"

# exécution de killomètre
go install killometre
/home/dys/dev/Chrall/go/bin/killometre  /home/dys/chrall/Public_Trolls.txt /home/dys/chrall/morts >> /home/dys/chrall/update-kills.out
