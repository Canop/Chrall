(function (chrall) {

	chrall.askDestinations = function () {
		var ajaxUrl = SERVEUR_CHRALL_PRIVE + "json?action=get_destinations_jsonp&asker=" + player.id + "&mdpr=" + mdpCompteChrall(player);
		$.ajax(
				{
					url: ajaxUrl,
					crossDomain: true,
					dataType: "jsonp"
				}
		);
	}


})(window.chrall = window.chrall || {});




