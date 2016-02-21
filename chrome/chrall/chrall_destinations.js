(function(chrall) {

	chrall.askDestinations = function() {
		chrall.jsonp(chrall.serveurPrive() + "json?action=get_destinations_jsonp&asker=" + player.id + "&mdpr=" + chrall.mdpCompteChrall());
	};

	chrall.warnOnTp = function() {
		var $warn = $('<span>').addClass('mh_tdpage');
		$('<div>').insertAfter('.Action:eq(0)').css({textAlign: "center", padding: 5}).append($warn);
		function writeWarning() {
			var x = parseInt(document.getElementsByName('ai_OrigineX')[0].value);
			var y = parseInt(document.getElementsByName('ai_OrigineY')[0].value);
			var z = parseInt(document.getElementsByName('ai_OrigineN')[0].value);
			if (x * y * z != x * y * z) {
				$warn.hide();
			} else {
				$warn.text(teleportHoleMessage(x, y, z)).show();
			}
		}

		writeWarning();
		$('input').on('keyup', writeWarning);
	};


})(window.chrall = window.chrall || {});




