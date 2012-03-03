
# déploiement des scripts
rsync -avz --del --stats --exclude="gogo" --exclude="*.8" --exclude="*.out*" --exclude="*.err*" /home/dys/dev/Chrall/scripts/* dys@canop.org:/home/dys/dev/Chrall/scripts
