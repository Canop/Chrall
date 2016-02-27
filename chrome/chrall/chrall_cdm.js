"use strict";
(function(chrall){

	chrall.handleCdmPage = function(){
		if ($("#msgAmelioration").text().indexOf("Vous avez RÉUSSI") !== 0) return;
		var player = chrall.player();
		var msgEffet = $("#msgEffet");
		var cdm = msgEffet.find("b").eq(0).text();
		msgEffet.find("tr").each(function(){
			cdm += "\n" + $(this).text();
		});

		// écriture du script de récupération de la réponse (mécanisme JSONP)
		var $div = $("<div/>", { id: "gogochrall"});
		msgEffet.append($div);

		if (chrall.isOptionEnabled("cdm-send-to-chrall", "yes")) {
			// envoi au serveur de la CDM
			chrall.jsonp(chrall.serveurPublic() + "json?action=accept_cdm_jsonp&author=" + player.id +
					"&cdm=" + encodeURIComponent(cdm) + "&seconds=" + chrall.findMHSeconds());
		} else {
			$div.innerHTML = "Conformément à votre souhait, la CDM n'a pas été envoyée au serveur Chrall. Sniff...";
		}
	}

})(window.chrall = window.chrall || {});
