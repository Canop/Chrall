"use strict";
(function(chrall){

	chrall.addBubblesToLinks = function(){
		$("a.mh_trolls_1").each(function(){
			var player = chrall.player();
			var link = $(this);
			var href = link.attr('href');
			var trollId = href.split('\'')[1];
			if (trollId != player.id && trollId != chrall.viewedTrollId) {
				chrall.triggerBubble(
					link,
					'',
					"bub_troll",
					chrall.serveurPublic() + "json?action=get_troll_info&trollId=" + trollId,
					trollId
				);
			}
		});

		$("a.mh_monstres").each(function(){
			var link = $(this);
			var href = link.attr('href');
			var numMonstre = href.split('\'')[1];
			var nomMonstre = link.text().substr(3).trim();
			chrall.triggerBubble(
				link,
				'',
				"bub_monster",
				chrall.serveurPublic() + "json?action=get_extract_jsonp&name=" + encodeURIComponent(nomMonstre) + "&monsterId=" + numMonstre,
				nomMonstre
			);
		});
	};

	chrall.addInfosToMonsterEvents = function(){
		if (!chrall.compteChrallActif()) {
			return;
		}
		var eventTable = $('body > table.mh_tdborder')[1];
		$(eventTable).attr('id', 'monster_events');
		if (!eventTable) {
			return;
		} // arrive s'il n'y a pas encore d'événements je crois
		// on ajoute une méthode pour l'insertion des données supplémentaires
		chrall.sendToChrallServer('getMonsterEvents', {"IdCible": parseInt($('input[name="ai_IDPJ"]').val())});
	};

})(window.chrall = window.chrall || {});
