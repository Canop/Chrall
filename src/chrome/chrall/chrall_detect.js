
var paragraph = $("p#browserInfos");
if (paragraph) {
	var html = "Chrall est déjà installé dans ce navigateur et fonctionne.";
	if (chrallVersion != $("span#version").text()) {
		html += "<br>Votre version est plus ancienne (" + chrallVersion + "). Vous devriez cliquer sur le lien ci-dessus afin de mettre à jour Chrall.";
	} else {
		html += "<br>De plus, vous disposez de la dernière version. Il n'est donc a priori pas nécessaire de cliquer sur le lien ci-dessus.";
	}
	paragraph.html(html);
}
