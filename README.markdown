Présentation :
==============

Chrall est une extension pour Chrome destinée aux joueurs en ligne de www.mountyhall.com.

Le projet est géré par cano.petrole@gmail.com

Installation :
==============

Le plus simple pour profiter de Chrall est d'installer l'extension déjà préparée. Visitez pour cela [le site officiel](http://canop.org/chrall) avec votre navigateur Chrome.

Structure :
===========

1. **l'extension Chrome** qui reformate les pages de la forme `games.mountyhall.com/*` : le code source est dans `src/chrome`. Il s'agit essentiellement de javascript.

2. **le serveur gogochrall** : Il offre sur http://canop.org:8000/chrall un bestiaire et un outil d'alimentation mais surtout il répond aux requètes de l'extension (essentiellement en JSON/JSONP). Son code source est dans `src/server`. Il s'agit de [go](http://golang.org) et d'une base MySQL.

3. **le site web** : il s'agit du site présentant l'extension et les outils Chrall à l'adresse http://canop.org/chrall.

Compiler vous même l'extension :
================================

Pour découvrir le développement des extensions Chrome ou parce que vous êtes parano et voulez être sûr de ce qu'il y a dans votre browser, vous pouvez télécharger l'extension et la charger à partir des sources dans Chrome (menu Outils/Extensions).

Contribuer :
============

Si vous envisagez de participer au développement, vous pouvez faire un fork du projet. N'hésitez pas à venir en discuter sur [le forum de Chrall](http://canop.org/chrall/fofo). Vous pouvez également me contacter pour causer des technologies mises en oeuvre si vous êtes curieux.


Licence :
=========

La license est dans src/chrome/chrall. Elle s'applique aussi à la partie en go, et à tout ce à quoi elle a l'air de s'appliquer. Au moins.
