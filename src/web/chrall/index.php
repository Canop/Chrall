<?php
header("Pragma: no-cache");
header('Content-Type: text/html; charset=utf-8');
ini_set('default_charset', 'utf-8');
?>
<html>
<head>
	<title>Chrall</title>
	<link rel="stylesheet" type="text/css" href="chrall.css"/>
	<meta name="description" content="Chrall, une extension Chrome pour Mounty Hall"/>
	<meta name="keywords" content="chrome, extension, mounty hall">
	<script src="jquery.js"></script>
</head>
<body>

<div class=column_wrapper id="top_column_wrapper">
&nbsp;</div>

<div id="title_stripe">
<a href="/">canop.org</a> &gt; Chrall
</div>

<div class=column_wrapper id="content_column_wrapper">
<div id="content_wrapper">

<p>
<a href=screens/screen_01.png target=nouvelOnglet><img border=0 align=right src=screens/screen_01.png width=320></a>
Chrall est une extension Chrome pour le jeu <a href=http://www.mountyhall.com>Mounty Hall</a>.</p>
<p>Pour simplifier disons que c'est la première extension qui vous permet d'avoir une vue claire, directe et efficace de ce qui vous entoure dans les souterrains.</p>
<p>Une vue que vous glissez à la souris, qui vous indique qui est TK ou ATK, vous donne les caractéristiques des monstres...</p>
<p>Une extension qui vous fait les menus calculs pratiques tels la récupération de la fatigue ou des malus sur les prochaines DLA ou encore l'extension de portée de votre TP par des BUM...</p>


<h2>Installation</h2>
<p><a href=chrall_v001_011.crx class=install>Installer Chrall</a> Version actuelle : <span id=version>1.11</span></p>
<p id=browserInfos></p>


<h2>Photos d'écran</h2>
<p>
Allez jeter un oeuil à la <a href=galerie.php>galerie</a>.
</p>

<h2>Discuter</h2>
<p>
Un forum a été mis en place : <a href=fofo/>le canofofo</a>.
</p>

<h2>Développement</h2>
<p>
Chrall est open-source.<br>
Vous pouvez participer au développement, signaler des bugs, ou simplement consulter les sources par curiosité via <a href=http://www.github.com/Canop/Chrall>github</a>.
</p>

<h2>Bestiaire & co</h2>
<p>
Vous pouvez <a href="http://canop.org:9090/chrall/bestiaire">consulter le bestiaire</a> ou <a href="http://canop.org:9090/chrall/puits">y contribuer</a>.
</p>

</div> <!-- content_wrapper -->
</div> <!-- content_column_wrapper -->

<br><br>

<script type="text/javascript">

//> google analytics
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-15064357-4']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
  
//> détection du navigateur
var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') >= 0;
if (!is_chrome) $("p#browserInfos").html("<font color=red>Sauf erreur, vous n'êtes pas sous Chrome. Vous devriez revenir sur cette page après avoir changé de navigateur.</font>");

</script>

</body>
</html>
