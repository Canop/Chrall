(function (chrall) {

	chrall.askDestinations = function () {
		chrall.jsonp(chrall.serveurPrive() + "json?action=get_destinations_jsonp&asker=" + player.id + "&mdpr=" + chrall.mdpCompteChrall());
	}


})(window.chrall = window.chrall || {});




