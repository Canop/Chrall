RECENTS / A TESTER :
====================
* site web : détection browser (indiquer qu'il faut Chrome, si nécessaire)
* site web : détecter si l'extension est installée
* améliorer les couleurs de la grille
* fatigue et récupération, cout en pv des accélérations
* condenser la page d'accueil pour épargner le scroll sur petit écran
* login : décocher "activer la DLA"
* moyenne des caractéristiques
* profil : moyenne de dégâts en critique
* détection des gowaps malades
* alarmes automatique 2 minutes avant fin de DLA détection de fin de DLA (pas besoin que MH soit encore ouvert, juste Chrome)
* grille : quand une case contient beaucoup d'objets, afficher simplement un truc comme "2343 trésors" avec un lien pour ouvrir (ne pas mélanger les niveaux)
* grille : ne pas afficher tous les trous de météorite (ceux de chaque niveau) mais simplement un seul
* grille : ne jamais masquer les trous de météorite
* vue : toujours garder visibles les onglets et le filtre de vue

<- v0.7

* vue : accélération du changement d'onglet
* grille : afficher différemment les trolls intangibles (italique ?)
* grille/filtre : permettre le (dé)cochage par un clic sur le mot (ex : "trolls") et pas seulement la case à cocher elle-même
* ajouter au tableau de récupération les colonnes suivantes : malus de charge, gain en minutes par PV de l'AM
* fatigue & am : calcul du cout en pv pour rejouer de suite, et suggestion d'attente
* profil : récupération du nombre de PA restant

<- v0.8

* BUG : les champignons n'étaient jamais affichés (ces curieuses choses n'ont pas d'ID affiché dans la table reçue de MH)
* fatigue optimale : rejeter si après la fin de DLA
* options : séparer via des onglets en "Options standard" et "Options Chrall" (bon... c'est pas beau...)
* structure du Puit (déversoir à CDM), tant côté client que pour l'analyse côté serveur
* Bug sur la page d'options

<- v0.9

* gestion des forks et contributions dans github
* choisir une librairie go/mysql
* serveur gogochrall (entre autres pour le bestiaire)
* Puit : bouton "nettoyer" (pour effacer le contenu du seau)
* gogoChrall : encodage plus propre de la réponse en JSON
* analyseur de cdm accessible (le Puit)
* Bug Puits : les monstres féminins (expression "une ...") ne sont pas reconnus
* cdmstore : écriture d'un hash sha1 pour éviter les doublons
* stockage en BD des CDM
* Puits : pb avec les lignes coupées (mail)
* cdmstore : pb avec les min et max s'il y a des zéros. L'astuce "max(nullif(maitrise_magique_max, 0))" ne marche pas avec la librairie GoMySQL
* puits : mettre les dates d'insertion sur les CDM
* puits : résolution du problème de l'espace aléatoire entre le nom et le tagAge
* Puits : dédoublonnage des CDM (par hash sha1)
* grille : affichage des caractéristiques des monstres au hover
* grille : il n'y a plus de bulle sur toutes les cases mais juste sur les monstres et les trolls

<- v0.10

* profil : virer la colonne de l'AM pour les non-kastars => vérifier que c'est OK pour les kastars
* options : lien vers le bestiaire
* forum
* ajouter quelque part (sur la page d'accueil?) la mention que les pages sont modifiées par chrall et un lien vers le site web (et un mode d'emploi de désinstallation ?)

<- v0.11

* script de lancement de gogo en nohup (reste ouvert après fermeture session)
* Puits : correction de quelques problèmes d'analyse (touchant environ 2% des CDM)
* grille : afficher au hover le numéro des trésors (utile pour le pilotage des gowaps)

<- v0.12

* virer la boite de dialogue d'alarme : elle peut bloquer tout Chrome...
* abandon de la logique d'auto-update de l'extension, remplacée par l'affichage d'un discret message proposant d'aller mettre à jour l'extension
* calcul du nombre d'entrainements avant le changement de niveau et du nombre de px manquants pour entrainement
* grille/bestiaire : mise en place d'un système de bulle maison (plus adapté, bulles plus précisément placées, bien plus rapide)

<- v0.13

* test sur le serveur de la version de l'extension pour afficher un message proposant une mise à jour
* grille/bulles : (ré)afficher la distance horizontale des monstres et leur position dans la bulle
* test sur le site web de la version de l'extension pour afficher un message proposant une mise à jour
* correction bug Puits : la présence de "???" dans le texte faisait déconner jquery.ajax (aucune idée du pourquoi, je remplace maintenant les "?" par des "-")
* récupération PV, vue, MM et RM (tout ça utile pour les sorts et compétences)

<- v0.14

* fofo : version française
* bestiaire : envoi des CDM depuis l'extension

<- v0.15

* grille/bulles : réduire l'encombrement des extraits du bestiaire
* calculer et afficher les totaux de MM et RM
* affichage propre du total des mouches
* grille/filtre : remplacer "objets" par "trésors"
* afficher les caractéristiques des monstres y compris dans la table (pas seulement sur la grille)
* grille : ajouter un menu déroulant de limite de vue à côté du filtre (même style arrondi) 
* interception des cdm : ne rien envoyer au serveur si on a raté la comp [à vérifier en ratant la comp...]
* grille : les id des gowaps et leurs noms complets sont bullés
* vue : faire flotter en haut à droite les liens [refresh] et [logout]
* interception des CDM : faire un retour moins barbare qu'une alerte
* bulles des monstres : vérifier le nom avant de modifier le contenu de la bulle (on peut recevoir des réponses à des vieilles questions si le réseau est lent)

<- v0.16

* profil : afficher près du niveau du joueur le niveau minimal des adversaires pour que leur mort rapporte des px

<- v1.0
<- v1.01

* Bug charge (Laz : "j'aimerais que la bulle ait raison et que ma charge soit de 9 cavernes (en fait c'est que 7)"

<- v1.02

EN COURS :
==========
* apprendre le langage go
* calcul des bonus totaux des mouches : séparation entre présentes & toutes
* calculs en roll-over sur les sorts & compétences _(il en reste encore à faire)_
* profil : vérifier qu'on affiche correctement les infos de l'AM quand la fatigue est faible
* procédures de sauvegardes de la bd
* BUG : les sonneries ne marchent pas toujours...
* Bug sur le décumul (Laz : "12-8-4 (en dessous je sais pas) alors que ça indique 12-7-4")

TODO :
======
P1 :
----
* BUG : je crois que les messages de l'AM déconnent en cas de fatigue extrême
* bestiaire/grille : exploiter les CDM du monstre (et pas de son espèce) si on les a (en utilisant maxmin plutôt que minmax)
* affichage des monstres et objets au même niveau [demande](http://canop.org/chrall/fofo/viewtopic.php?f=5&t=14)

P2 :
----
* je viens de voir que les scripts publics MH étaient maintenant en web-service et surtout que le DM envisage de lever la limite d'appels. Il faudra que je regarde ça !
* bonus/malus : totaux [demande](http://canop.org/chrall/fofo/viewtopic.php?f=5&t=12)
* expliquer (par une bulle au passage de la souris sur le tableau ?) pourquoi on a parfois deux niveaux de fatigue affichés pour la prochaine DLA
* à voir : mon contrat d'hébergement n'offre pas théoriquement un débit très important...
* profil : indiquer les alarmes programmées
* sauver les stats d'usage du serveur g0g0chrall ?
* détection des trolls malades

P3 :
----
* grille : coût des déplacements et charges (en tenant compte du gluage éventuel) _(attention : besoin scripts publics)_
* équipement : afficher les bonus [demande Fabdi](http://canop.org/chrall/fofo/viewtopic.php?f=5&t=13&p=71#p71)
* grille : afficher les px rapportés par les monstres (nécessite de stocker ou récupérer le niveau du troll du joueur)
* grille/bulles monstres : afficher (après activation d'une option) moyenne et écart-type des caractéristiques
* liste des trolls : envoi de MP par case à cocher (comme dans MZ)
* profil : affichage rapport tués/décés
* bulles de bestiaire sur les gowaps ?
* intégration d'un lien pour accéder au bestiaire (pour faire des recherches sur des monstres "ressemblant")
* regarder si on ne peut pas récupérer des infos dans les scripts publics (par exemple les malus pour améliorer le calcul de la fatigue)
* grille : permettre que le premier affichage de vue se fasse toujours avec le même preset (réduit) pour un affichage par défaut plus rapide
* bestiaire : batch d'analyse des CDM pour construire le bestiaire
* mouches : récapitulatif (en haut) à la fois sur les mouches actuelles et sur le total (en comptant celles en vadrouille)
* rendre les parsings plus robustes en privilégiant les expressions régulières plutôt que le comptage des lignes ou cellules
* icône (un troll qui nage le crawl ?)
* interface de troll (suivants identifiés)
* grille : trolls amis/ennemis
* grille : mise en place d'un menu contextuel
* grille/menu contextuel : lancement d'action déplacement
* corriger le calcul des prochaines DLA si on passe sur la vue des malus
* grille/menu contextuel : ajout de notes sur des cases ou des things pour l'équipe (par exemple "passer CE portail" ou bien "C'est ce mouch'oo qui m'a piqué mes mouches" ou encore "à finir 90%").
* grille : une flèche discrète par dessus la grille pour indiquer la direction du joueur (utiliser un canvas transparent ?). Cette flèche doit contenir un bouton de centrage.
* profil : un onglet pour lister les notes (de soi et de ceux qui partagent avec nous). Ceci aura l'effet de bord d'offrir des "bookmarks" des trolls et monstres annotés
* profil/actions programmées : afficher la moyenne de la parade
* chat d'équipe 
* tableaux standards MH (monstres, événements, tableau de chasse, etc.) : surligner la ligne de la souris pour faciliter le rapprochement gauche/droite.
* poids de l'équipement : détailler ce qui est porté et ce qui est en besace
* ? icône pour indiquer directement sur la carte quels monstres voient le caché
* alarmes : fonction manuelle d'ajout d'alarme ("on a dit qu'on tapait à 11h33")
* alarmes : ne pas perdre les alarmes (ajouter ?) quand on se loggue sur un autre troll
* alarmes : fenêtre de popup dans le navigateur pour visualiser les alarmes, les désactiver et régler le délai avant DLA
* alarmes : sauver les alarmes en cookies (ou ailleurs ? sur le serveur ?) pour les retrouver au lancement de Chrome même si on ne va pas sur MH
* alarmes : proposer une librairie de sonneries (et les mettre en téléchargement sur téléphone pour se faire des pépétes ! non j'déconne...)
* site web : aide détaillée/tutorial pour assurer que toutes les fonctions soient connues
* préférences détaillées : transformation ou pas de la page d'accueil
* grille/filtre : rendre inactives les cases à cocher de catégories vides
* bestiaire : stocker dans des records spéciaux prioritaires les infos consolidées (automatiquement ou manuellement (niveau des monstres ?))
* cdmstore : détection d'erreur basée sur la variance des valeurs
* ajouter au filtre de manifest.json les pages venant des principaux proxys mh
* PB : la version de chrall est spécifié à 4 endroits (nom du fichier crx et champ caché dans index.php, messager.go, chrallgeneral.js). Ca fait 3 de trop. Faire un makefile ?
* réflexion sur l'opportunité de passer à une base mongodb _(l'inconnue porte sur les performances des consolidations et recherches textuelles)_


NOTES :
=======
* pas de vrai concept d'équipe : chaque troll choisit un par un les trolls à qui il donne accés en lecture à ce qu'il mont(r)e. Et il doit être possible de bloquer les infos d'un autre joueur.
* liste de technos : extensions chrome, git, javascript, ajax, github, mysql, jquery, go, mercurial, php, css
* je viens de tomber sur la fonction fmt.Sscanf. Elle aurait sans doute permis d'écrire le parseur plus simplement.
