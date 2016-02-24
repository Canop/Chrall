"use strict";
(function(chrall) {

	chrall.analysePJEventsView = function() {
		chrall.viewedTrollId = $('input[name="ai_IDPJ"]').val();
	};

	chrall.analyseAndReformatPJView = function() {
		var player = chrall.player();
		chrall.viewedTrollId = $('input[name="ai_IDPJ"]').val();

		var html = [];
		var h = 0;
		html[h++] = '<div id=ch_pjpop_trigger>';
		html[h++] = '<div id=ch_pjpop>';
		html[h++] = '</div>';
		html[h++] = '</div>';
		$(html.join('')).appendTo($('body'));

		chrall.triggerBubble(
			$("#ch_pjpop_trigger"),
			'',
			"bub_troll",
			chrall.serveurPublic() + "json?action=get_troll_info&asker=" + player.id + "&trollId=" + chrall.viewedTrollId,
			chrall.viewedTrollId
		);
	};


})(window.chrall = window.chrall || {});
