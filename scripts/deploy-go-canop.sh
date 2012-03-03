

# déploiement du code go
rsync -avz --del --stats --exclude="gogo" --exclude="*.8" --exclude="*.out*" --exclude="*.err*" /home/dys/dev/Chrall/go/src/* dys@canop.org:/home/dys/dev/Chrall/go/src
