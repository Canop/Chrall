Présentation :
==============

Chrall est une extension pour Chrome destinée aux joueurs en ligne de www.mountyhall.com.

Le projet est géré par cano.petrole@gmail.com et est discuté sur [Miaou](https://dystroy.org/miaou/167?Chrall).

[![Build Status](https://travis-ci.org/Canop/Chrall.svg?branch=master)](https://travis-ci.org/Canop/Chrall)

Installation :
==============

Le plus simple pour profiter de Chrall est d'installer l'extension déjà préparée. Visitez pour cela [le site officiel](https://chrall.dystroy.org) avec votre navigateur Chrome.

Structure :
===========

1. **l'extension Chrome** qui reformate les pages de la forme `games.mountyhall.com/*` : le code source est dans `src/chrome`. Il s'agit essentiellement de javascript. Les fichiers dont le nom commence par "chrall_" sont exécutés dans le contexte de l'extension. Ceux dont le nom commence par "injected_" sont injectables dans le contexte de la page.

2. **le serveur chrallserver** : Il offre sur https://chrall.dystroy.org/chrall/gogo un bestiaire et un outil d'alimentation mais surtout il répond aux requètes de l'extension (essentiellement en JSON/JSONP). Son code source est dans `go/chrallserver`. Il s'agit de [go](http://golang.org) et d'une base MySQL.

3. **le programme killometre** : Il analyse les fichiers de kills fournis en ftp par le serveur MH et construit des statistiques concernant les trolls, ainsi que la distinction MK/TK/ATK.

4. **le site web** : il s'agit du site présentant l'extension et les outils Chrall à l'adresse https://chrall.dystroy.org.

Compiler vous même l'extension :
================================

Pour découvrir le développement des extensions Chrome ou parce que vous êtes parano et voulez être sûr de ce qu'il y a dans votre browser, vous pouvez télécharger l'extension et la charger à partir des sources dans Chrome (menu Outils/Extensions).

Contribuer :
============

Si vous envisagez de participer au développement, vous pouvez faire un fork du projet. N'hésitez pas à venir en discuter sur  [Miaou](https://dystroy.org/miaou/167?Chrall) Vous pouvez également me contacter pour causer des technologies mises en oeuvre si vous êtes curieux.

Licence :
=========

La license est dans src/chrome/chrall. Elle s'applique aussi à la partie en go, et à tout ce à quoi elle a l'air de s'appliquer. Au moins.
