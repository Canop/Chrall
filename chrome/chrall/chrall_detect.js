"use strict";

var paragraph = $("#browserInfos");
if (paragraph.length>0) {
	var html = "Chrall est déjà installé dans ce navigateur et fonctionne.";
	if (chrall.version != $("#version").text()) {
		html += "<br>Votre version est plus ancienne (" + chrall.version + "). Vous devriez cliquer sur le bouton ci-dessus afin de mettre à jour Chrall.";
		setTimeout(function() {
			document.location.reload();
		}, 5000);
	} else {
		html += "<br>De plus, vous disposez de la dernière version. Il n'est donc a priori pas nécessaire de cliquer sur le bouton ci-dessus.";
	}
	paragraph.html(html);
}
