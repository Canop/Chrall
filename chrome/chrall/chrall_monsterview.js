"use strict";
(function (chrall) {

	chrall.analyseAndReformatMonsterView = function() {
		var player = chrall.player();
		var monsterId = $('input[name="ai_IDPJ"]').val();
		var titre = $('div.titre2').text();
		var nomMonstre = titre.substring(0, titre.indexOf('(') - 1).trim();
		var div = $('<div/>', {id: 'ch_pjpop_trigger'}).append($('<div/>', {id: 'ch_pjpop'}))
		div.appendTo($('body'));
		var params = "&asker=" + player.id + "&name=" + encodeURIComponent(nomMonstre) + "&monsterId=" + monsterId;
		chrall.triggerBubble(
			$("#ch_pjpop_trigger"),
			'',
			"bub_monster",
			chrall.serveurPublic() + "json?action=get_extract_jsonp" + params,
			nomMonstre
		);
	}

})(window.chrall = window.chrall || {});

