Ce document liste :

* DONE : ce qui a été fait et les versions par ordre chronologique
* EN COURS : ce qui est... en cours ^^ 
* TODO : ce qui reste à faire, classé par priorité

DONE :
======
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

* BUG : la famille du monstre n'est pas toujours décodée
* bonus/malus : totaux [demande](http://canop.org/chrall/fofo/viewtopic.php?f=5&t=12)
* Bug sur le décumul (Laz : "12-8-4 (en dessous je sais pas) alors que ça indique 12-7-4")
* laz : ce serait pas mal que la bulle de charge indique à la fois les valeurs max et instantanée.
* bestiaire/grille : exploiter les CDM du monstre (et pas de son espèce) si on les a (en utilisant maxmin plutôt que minmax)

<- v1.03

* grille : réduire l'encombrement des onglets pour la compatibilité avec les petits écrans
* grille : menu pour initier les DE

<- v1.04

* grille/menuDE : vérifier que la session a été activée
* site : gallerie présentant les principales fonctions
* grille : centrage automatique

<- v1.05

* bestiaire : augmenter la taille de la liste de noms matchants
* grille : affichage des coordonnées des cases (fait via une extension de mon système objectMenu)
* bouton "où suis-je ?" pour retrouver la case du joueur

<- v1.06

* grille : affichage dans le menu des DE des trésors aux pieds du joueur
* OPTM calcul de la grille : remplacement de l'algo de construction en O⁵ par du O³ (surtout intéressant pour les toms, mais il reste pas mal de lenteur sur la lecture qui était déjà en O³ en raison des parsages jquery et surtout sur l'insertion de la grille dans la page)
* diverses optimisations
* PB grille : les titres de cellule perturbent parfois les filtres
* grille : rendre cliquable le "vous êtes içi" (ça a nécessité de récupérer le numéro du troll)
* bulles des trolls et monstres : indiquer les 3 coordonnées
* grille / bulle de troll : intégrer le nombre de kills de trolls et le classement associé
* case à cocher avant la CDM pour permettre de refuser l'envoi [point MH sur l'automatisation](http://www.mountyhall.com/Forum/display_topic_threads.php?ForumID=2&TopicID=137209)
* site web chrall : ne pas continuer à afficher bêtement qu'on n'est pas à jour après l'update

<- v1.07

* cron sur le serveur pour lancer tous les matins l'update des kills
* grille : mettre les liens sur les lieux qui en ont dans la table
* comptage des kills de trolls : enlever les suicides
* grille / bulle de troll : mettre au point une estimation TK/neutre/ATK/NoK
* estimation TK/ATK : mention "Ancien" quand nécessaire
* bulle des trolls, indiquer race et niveau
* utiliser ftp://ftp.mountyhall.com/Public_ Trolls2.txt pour batir une liste des trolls complète et surtout avoir le niveau du joueur
* afficher les bulles de trolls et monstres dans les listes d'évènements de trolls
* correction des types mime pour le JSONP et le JSON, avec précision de l'encodage UTF-8
* afficher les bulles de trolls dans les listes d'évènements de monstres
* page événements : afficher les bulles de trolls et monstres
* profil : ajouter derrière l'agilité le [jet de stabilité](http://mountypedia.mountyhall.com/Mountyhall/Balayage)
* stockage, avec les cdm, de l'id de leur auteur (pour pouvoir plus tard dire "vous avez offert 1000 cdm, merci")
* label sur le bouton de centrage de la vue

<- v1.08

* page news : afficher les bulles de trolls et monstres
* vue : effacer les bouts de menu au changement d'onglet
* bulles des trolls et monstres : affichage des px qu'ils rapportent
* bulles des trolls : indiquer la guilde
* diplomatie intégrée à la vue [demande Laz](http://www.canop.org/chrall/fofo/viewtopic.php?f=5&t=18) Utiliser ftp://ftp.mountyhall.com/Public_ Diplomatie.txt

<- v1.09

* suppression d'un bug qui empêchait l'affichage de la grille dans certaines conditions

<- v1.10

* grille : rendre déplaçable la grille par glissage de la souris
* grille : centrage au double-clic

<- v1.11

* vue : BUG : les tables ne sont à nouveau plus scrollables...
* profil des trolls : approcher la souris du coin en haut à gauche ouvre la bulle du troll
* en réponse à un envoi de CDM répondre en intégrant les données des autres CDM du même monstre et en évaluant les PV restant
* Puits : il est possible de préciser le numéro du donateur
* site chrall : faire un lien d'install à gueule de bouton, ça sera plus clair...

<- v1.12

* ajout de www.mh.fr.nf et de https://games.etc à la liste des patterns pour l'extension
* bugs au [parsage de certaines CDM](http://canop.org/chrall/fofo/viewtopic.php?f=4&t=5&start=10)
* BUG : lorsqu'on passe la souris sur un trésor groupé dans une liste (dégroupée), la bulle n'apparait qu'un dixième de secondes.
* bulles dans l'onglet 'trolls' de la vue
* les filtrages de la grille sont maintenant persistents (pour besoin dragt)
* forum MH: mettre une bulle directement sur les liens vers les trolls

<- v1.13

* permettre d'écrire à plusieurs trolls en les sélectionnant dans la table
* bulle de compétence : piège (à vérifier!)
* permettre la sélection des trolls avec qui partager des px via la table
* indiquer dans les bulles de monstres lesquels peuvent rapporter des compos de valeur pour EM

<- v1.14

* vue/grille : fermeture des menus de cellule lors de l'usage de la molette
* bulle du minage : portée > (vue+ B/M)/2 horizontal et (vue+ B/M)/4
* remplacer getTrollIdthenExecute par une fonction qui récupère aussi les PA et la position
* vue/table des trolls : ne pas afficher le bouton de partage des px si la dla n'est pas activée
* bulle monstre EM : Correction cas de la limace qui sert à la fois comme compo de mois et pour glue (vu par tdd)
* la position affichée dans le menu de gauche est mise à jour lors des déplacements
* formulaire de définition de la recherche de filon (frame action) : indication de la zone fouillée
* action recherche filon : "si tu repères un filon une fenêtre te dirait votre filon se situe entre ?<X<? et ?<Y<? et ,<N<?; idem si il ne se situe pas dans ta recherche)"

<- v1.15

* le baratin d'optimisation de l'AM avait sauté il y a longtemps (bug), je viens de le rétablir
* compte chrall et communication authentifiée extension<->gogochrall pour le partage entre joueurs
* affichage dans la vue (onglet 'Partages') des infos des trolls avec qui un partage est établi
* correction (je pense) du calcul de la portée dans la bulle du minage
* correction (je pense) de l'affichage de la zone couverte lors du minage
* ajout de *.jeuxweb.org comme serveur de jeu possible
* stockage de la blessure des monstres lors des CDM

<- v2.00

* bulles de trolls dans vue/partages
* bulle balayage : ajout des BM à l'attaque
* authentification des demandes de bulles de monstres si compte actif. Inclusion de la blessure (si partages ok) dans la bulle.
* changement de port pour gogochrall : bascule vers le port 8000
* interception des frappes et transmission à Chrall en cas de compte
* interception des cdm : récupérer et transmettre aussi la date (comme pour les actions)
* interception des insultes et transmission à Chrall en cas de compte actif
* mettre dans les événements des monstres les caractéristiques des frappes si partage
* mettre dans les événements des monstres la blessure mesurée en cas de partage actif avec l'auteur de la CDM

<- v2.01

* partage : transmission de la vue au serveur
* vue/Recherche : cet onglet permet de trouver (suivant partages) un troll, monstre (num ou nom), etc.

<- v2.02

* fenêtre événements monstres : affichage dans le coin supérieur gauche de la bulle du monstre
* remplacement de la requete SOAP pour la vue par une requete classique
* illustrations des monstres dans leurs bulles (sauf dans le profil du monstre)
* bug du "rien trouvé" dans les résultats de recherche : erreur sql (x à la place de y)

<- v2.03

* ordres des gowaps : carte avec trous de météorites et trajet
* affichage des objets dans les vues zooom (et donc récupération dans la base chrall)
* les vues zoom sont autocentrées
* suivant/ordres et suivants/liste : bouton d'affichage de la vue proche du gowap
* illustrations des monstres généralement plus petites dans les vues

<- v2.04

* liens ancres MH en haut des tables -> changement d'onglet [demande de Laz]
* affichage dans les actions, le cas échéant, de la possibilité de creuser [dév Chouia/Dragtara]
* total des BM du matériel porté [dév Chouia/Dragtara]

<- v2.05

* killomètre : classement & visu des tags hors extension
* amélioration de la lisibilité de la police dans les bulles
* bulle TP : afficher les zones atteignables et pas seulement la distance (demande prop)
* corrections de divers bugs du calcul des BM du matériel
* gestion des caractéristiques x/x+1 D3 + y + z (caractéristiques dont l'effet n'est pas immédiat à l'"apprentissage")
* correction bug armes à deux mains sur les BM de l'équipement
* le bouton d'activation du compte chrall n'est présent que si le mot de passe est correct
* (dragt) vue dans le labyrinthe
* grosses optimisations de la vue

<- v2.06

* bug : on essaye de calculer les BM de l'équipement sur la page des suivants
* les liens vers les outils (bestiaire, killometre, mountypedia) sont maintenant accessibles dans l'application
* suppression de l'ascenseur tout moche de la frame Actions
* bouton 3D pour filtrer la grille générale
* bouton 3D pour filtrer les grilles "zoomées"

EN COURS :
==========
* apprendre le langage go
* nouvelle grille

TODO :
======
P1 :
----
* table de trolls et de monstres : bouton de vue zoomée
* éditeur pour la diplo trollienne (et la stocker en bd)

* bouton pour proposer le partage à tous les membres de la guilde (demande tdd)
* killomètre : affichage par guilde
* mettre à jour la base pour les niveaux des monstres (faire un max ?)
* ajout d'infos supplémentaires du profil au partage : invi, glue, compétences programmées
* gowaps/ordres : intégrer le bouton de mise à jour de vue
* bug : "laz" n'est pas trouvé alors que je partage avec lazarus -> le script public renvoie une vue vide (il a une vue de 0 mais voit les monstres dans l'interface MH...)
* Vue/Partages : mise à jour de la position des trolls lors de la mise à jour de la vue
* CDM : gestion du vol et du sang-froid (entre autres, voir http://www.mountyhall.com/Forum/display_topic_threads.php?ForumID=5&TopicID=145805)
* le go a maintenant l'opérateur append => l'utiliser partout pour simplifier le code
* indiquer directement dans la bulle si un monstre est insulté (et par qui)
* événements des monstres : si partage indiquer les caracts des hypno
* bug : grille : les dudus et les darklings sont représentés à l'identique (e.g. D24) -> utiliser 'd' ?
* bulles des monstres : indiquer leur jet de stabilité (j'attends la présence d'un darkling sur le fofo)
* comprendre la gestion des packages en go pour factoriser le code online et offline et tout simplement éviter de tout avoir dans "main"
* affichage dans la bulle des trolls (si partage actif) des infos principales PA/PV/DLA
* partage : positionnement des pièges
* recherche de monstres ou de compo particuliers dans la vue (n'oublions pas les toms en mission...)
* partage : cumul des pistages avec représentation graphique (modulaire car on ne peut pas détecter un mouvement de monstre)
* partage : cumul des recherches de filon
* essayer gb (code.google.com/p/go-gb/)
* recherche par niveau de monstre pour mission
* recherche : liste sauvegardée de cibles (tékas, monstres, copains, etc.)
* grille/filtre : sous-cochage par type de trésor

P2 :
----
* trollinfos/kills des atk : tronquer le tableau en comptant les ATK
* recherche : trier par distance (un peu compliqué en raison du tri par date de vue)
* affichage des monstres et objets au même niveau. [Demande](http://canop.org/chrall/fofo/viewtopic.php?f=5&t=14)
* indiquer dans l'équipement quels compos ont de la valeur pour EM et calculer les histoires de %
* interception des cdm : ne rien envoyer au serveur si on a raté la comp
* fonction pour désactiver de façon durable le css d'un troll
* profil : après la mise à jour de Chrall, recommander d'utiliser Refresh
* BUG : le nombre de kills de monstres que j'affiche dans la liste est inférieur à celui du "Tableau de chasse"... sans doute des trous dans la liste du serveur ftp mais la liste de discussion de MH est morte...
* profil d'un autre troll : menu pour definir le troll ou sa guilde en ami ou ennemi (même si on n'est pas guildé -> uniquement pour bd chrall) [pb : authentification ?]
* profil : indiquer les alarmes programmées
* lien pour les lieux proches bricotrolls
* affichage quelque part du nombre de CDM transmises via Chrall
* grille : marquer les trolls ennemis ou amis
* recherche par guilde
* cron : sauvegardes de la bd

P3 :
----
* indiquer les points cardinaux dans les menus de DE
* inventaire de tanière : rendre les listes triables, filtrables
* analyser la position dans le profil
* afficher les UM des matos
* mini carte centrée sur le gowap
* mouches : récapitulatif (en haut) à la fois sur les mouches actuelles et sur le total (en comptant celles en vadrouille)
* fonction de recherche dans la grille, en autocomplétion et centrage automatique
* bulles de trolls sur les liens/noms de trolls du fofo MH.
* lors d'un TP, affichage d'une carte des trous de météorite
* grille : pb du clic et double-clic en même temps sur un lien (refusé pour l'instant : compliqué pour pas grand chose)
* détection des trolls malades
* grille : rendre cliquables les cénotaphes
* calcul des bonus totaux des mouches : séparation entre présentes & toutes
* grille : coût des déplacements et charges (en tenant compte du gluage éventuel) _(attention : besoin scripts publics)_
* grille/bulles monstres : afficher (après activation d'une option) moyenne et écart-type des caractéristiques
* liste des trolls : envoi de MP par case à cocher (comme dans ZZ)
* profil : affichage rapport tués/décés
* bulles de bestiaire sur les gowaps ?
* expliquer (par une bulle au passage de la souris sur le tableau ?) pourquoi on a parfois deux niveaux de fatigue affichés pour la prochaine DLA
* icône (un troll qui nage le crawl ?)
* interface de troll (suivants identifiés)
* corriger le calcul des prochaines DLA si on passe sur la vue des malus
* grille/menu contextuel : ajout de notes sur des cases ou des things pour l'équipe (par exemple "passer CE portail" ou bien "C'est ce mouch'oo qui m'a piqué mes mouches" ou encore "à finir 90%").
* profil : un onglet pour lister les notes (de soi et de ceux qui partagent avec nous). Ceci aura l'effet de bord d'offrir des "bookmarks" des trolls et monstres annotés
* tableaux standards MH (monstres, événements, tableau de chasse, etc.) : surligner la ligne de la souris pour faciliter le rapprochement gauche/droite.
* poids de l'équipement : détailler ce qui est porté et ce qui est en besace
* alarmes : fonction manuelle d'ajout d'alarme ("on a dit qu'on tapait à 11h33")
* alarmes : ne pas perdre les alarmes (ajouter ?) quand on se loggue sur un autre troll
* alarmes : sauver les alarmes en cookies (ou ailleurs ? sur le serveur ?) pour les retrouver au lancement de Chrome même si on ne va pas sur MH
* site web : aide détaillée/tutorial pour assurer que toutes les fonctions soient connues
* préférences détaillées : transformation ou pas de la page d'accueil
* grille/filtre : rendre inactives les cases à cocher de catégories vides
* cdmstore : détection d'erreur basée sur la variance des valeurs
* ajouter au filtre de manifest.json les pages venant des principaux proxys mh
* sauver les stats d'usage du serveur g0g0chrall ?
* PB : la version de chrall est spécifié à 4 endroits (nom du fichier crx et champ caché dans index.php, messager.go, chrallgeneral.js). Ca fait 3 de trop. Faire un makefile ?
* équipement/petits : montrer quels compos sont EM
* bestiaire : montrer quels compos sont EM
* liste matos tanière : montrer quels compos sont EM
* programmation golem : sauvegarde/restauration
* bulle troll : indiquer le compte des kills de gowaps apprivoisés
* bulle troll : indiquer si vous avez (tué/été tué par) le troll
* recherche de lieux intégrée
* grille : flèches pour indiquer les directions des lieux intéressants (bookmarkés ou bien sur recherche)
* système 'mappy' intégré en exploitant la liste des gares TGV du ftp MH
* préférence pour la valeur par défaut de la case à cocher d'activation au login


NOTES :
=======
* liste de technos : extensions chrome, git, javascript, ajax, github, mysql, jquery, go, mercurial, php, css
* pour le serveur, j'aurais peut-être pu aussi utiliser node.js. J'aime bien le go mais node.js semble sympa aussi...
* backup bd : mysqldump -u root -pGroLolo chrall > today_chrall.sql

