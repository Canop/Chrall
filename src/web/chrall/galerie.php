<?php
header("Pragma: no-cache");
header('Content-Type: text/html; charset=utf-8');
ini_set('default_charset', 'utf-8');
?>
<html>
<head>
	<title>Gallerie Chrall</title>
	<link rel="stylesheet" type="text/css" href="chrall.css"/>
	<meta name="description" content="Chrall, une extension Chrome pour Mounty Hall"/>
	<meta name="keywords" content="chrome, extension, mounty hall">
	<script src="jquery.js"></script>
</head>
<body>

<div class=column_wrapper id="top_column_wrapper">
&nbsp;</div>

<div id="title_stripe">
<a href="/">canop.org</a> &gt; <a href="index.php">Chrall</a> &gt; Galerie
</div>

<div class=column_wrapper id="content_column_wrapper">
<div id="content_wrapper">


<h2>La Grille</h2>
<p>Une vue 2D facile à ajuster, directement intégrée à l'interface de Mounty Hall</p>
<img class=screenshot src=screens/redux-800.png>

<p>Vous choisissez ce que vous voulez voir :</p>
<img class=screenshot src=screens/tresors-800.png>

<p>Au passage de la souris sur les objets, trolls, monstres, des informations supplémentaires s'affichent sans qu'il soit besoin de cliquer :</p>
<img class=screenshot src=screens/bestiaire-800.png>
<img class=screenshot src=screens/diplo_001.png>
<img class=screenshot src=screens/diplo_002.png>

<p>Plus moyen de vous planter dans les déplacements :</p>
<img class=screenshot src=screens/menu_de-800.png>

<p>Ou d'oublier de ramasser avant de bouger :</p>
<img class=screenshot src=screens/tresors_aux_pieds-800.png>

<p>Et même avec une vue de 30 vous ne serez jamais perdu :</p>
<img class=screenshot src=screens/bouton_perdu.png>



<h2>Votre profil</h2>
<p>Quelques calculs pratiques sont effectués pour vous faciliter la vie.</p>
<img class=screenshot src=screens/entrainement-800.png>
<br>
<img class=screenshot src=screens/fatigue-800.png>
<br>
<img class=screenshot src=screens/add.png>
<br>
<img class=screenshot src=screens/teleport.png>

<h2>Les profils des autres trolls</h2>
<p>Lorsque vous consultez le profil d'un troll, que ce soit depuis le jeu ou depuis le forum, vous pouvez consulter la "bulle Chrall" afin d'obtenir les informations qui ne sont pas lisibles sur le profil. Il suffit pour cela d'approcher la souris du coin en haut à gauche de la fenêtre :</p>
<img class=screenshot src=screens/pjview_bulle.png>
<p>Cette bulle s'affiche également si vous n'êtes pas connecté à votre troll mais les informations sont plus légères dans ce cas : les px du kill et la diplomatie ne sont alors pas disponibles.</p>

<h2>Le partage d'informations entre joueurs</h2>
<p>Si vous activez un compte sur Chrall, vous pouvez savoir où sont (et dans quel état) vos amis. Et les événements des monstres sont un peu plus détaillés pour ce qui est de vos actions et de celles de vos amis :</p>
<img class=screenshot src=screens/events-monstre.png>

<h2>Ce que vous ne voyez pas</h2>
<p>Certaines fonctions ne sont pas visibles mais audibles : 5 minutes avant votre DLA, un son discret (compatible avec une ambiance de bureau) vous alerte. <a href="javascript:document.getElementById('alarm').play();">Ecoutez</a>.
</p>
<audio id=alarm>
	<source src=sound/zbluejay.wav>
</audio>

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
