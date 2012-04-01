(function (chrall) {

	chrall.askDestinations = function () {
		var ajaxUrl = chrall.serveurPrive() + "json?action=get_destinations_jsonp&asker=" + player.id + "&mdpr=" + chrall.mdpCompteChrall();
		$.ajax(
				{
					url: ajaxUrl,
					crossDomain: true,
					dataType: "jsonp"
				}
		);
	}


})(window.chrall = window.chrall || {});




