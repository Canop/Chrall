<?php
header("Pragma: no-cache");
header('Content-Type: text/html; charset=utf-8');
ini_set('default_charset', 'utf-8');
?>
<html>
<head>
	<title>Le Kill-O-Mètre de Chrall</title>
	<link rel="stylesheet" type="text/css" href="chrall.css"/>
	<meta name="description" content="Un Kill-O-Mètre à pied, ça use, ça use..."/>
	<meta name="keywords" content="chrome, extension, mounty hall">
	<script src="jquery.js"></script>
</head>
<body>

<div class=column_wrapper id="top_column_wrapper">
&nbsp;</div>

<div id="title_stripe">
<a href="/">canop.org</a> &gt; <a href=index.php>Chrall</a> &gt; <a href=killometre.php>Killomètre</a>
</div>

<div class=column_wrapper id="content_column_wrapper">
<div id="content_wrapper">


<table width=100%>
	<tr>
		<td class=tab>Trolls par kills</td>
		<td class=tab>Trolls par kills de monstres</td>
		<td class=tab>Trolls par kills de trolls</td>
		<td class=tab>ATK par kills de trolls</td>
		<td width=10%>&nbsp;</td>
		<td class=tab>Troll</td>
	</tr>
	<td colspan=6>burp</td>
	</tr>
</table>
	

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
