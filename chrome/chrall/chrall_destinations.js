function Chrall_askDestinations(receiveScript) {
	$.getScript(chrome.extension.getURL("jquery.js"))
	$.getScript(chrome.extension.getURL(receiveScript))
	var ajaxUrl = SERVEUR_CHRALL_PRIVE + "json?action=get_destinations_jsonp&asker=" + player.id + "&mdpr=" + mdpCompteChrall();
	$.ajax(
			{
				url: ajaxUrl,
				crossDomain: true,
				dataType: "jsonp"
			}
	);
}
