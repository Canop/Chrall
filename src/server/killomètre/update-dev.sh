# ce script devrait être lancé une fois par jour 
lftp ftp://ftp.mountyhall.com/ -e "mirror -c -x test2009 -x 2003 -x 2004 -x 2005 /evenements ~/dev/Chrall/trav/morts/events; quit"

./killomètre ~/dev/Chrall/trav/morts
