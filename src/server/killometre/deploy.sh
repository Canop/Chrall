
# copie vers le répertoire d'exécution local
cp * /home/dys/chrall/killometre/

# copie vers canop.org
rsync -avz --del --stats --exclude="gogo" --exclude="*.8" * dys@canop.org:/home/dys/chrall/killometre
