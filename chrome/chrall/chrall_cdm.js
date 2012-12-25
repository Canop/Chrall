(function (chrall) {

	chrall.handleCdmPage = function () {
		// récupération de la cdm (en prenant soin de séparer les lignes)
		// TODO : vérifier que ce n'est pas un échec
		var para = $("table table table form p");
		var cdm = "";
		for (var ip = 0; ip < para.length; ip++) {
			var p = $(para[ip]);
			var t = p.find("table");
			if (t.length > 0) {
				// c'est le bon paragraphe, composé d'une ligne en gras et d'un tableau
				cdm += $(p.find("b")[0]).text(); // contient l'intitulé du monstre
				t.find("tr").each(function () {
					cdm += "\n" + $(this).text();
				});
				break;
			}
		}


		// écriture du script de récupération de la réponse (mécanisme JSONP)
		var $div = $("<div/>", { id: "gogochrall"});
		$("table table table form").append($div);

		if (cdm.substring("Monstre Ciblé fait partie") < 0) {
			$div.innerHTML = "cdm ratée ? Pas d'envoi à gogochrall.";
		} else {
			if (chrall.isOptionEnabled("cdm-send-to-chrall", "yes")) {
				// envoi au serveur de la CDM
				chrall.jsonp(chrall.serveurPublic() + "json?action=accept_cdm_jsonp&author=" + player.id +
						"&cdm=" + encodeURIComponent(cdm) + "&seconds=" + findMHSeconds());
			} else {
				$div.innerHTML = "Conformément à votre souhait, la CDM n'a pas été envoyée au serveur Chrall. Sniff...";
			}
		}

	}
})(window.chrall = window.chrall || {});
