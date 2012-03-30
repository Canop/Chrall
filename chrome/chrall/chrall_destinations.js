function Chrall_askDestinations() {
	$.getScript(chrome.extension.getURL("injected_answer_destination.js"))
	var ajaxUrl = SERVEUR_CHRALL_PRIVE + "json?action=get_destinations_jsonp&asker=" + player.id + "&mdpr=" + mdpCompteChrall(player);
	$.ajax(
			{
				url: ajaxUrl,
				crossDomain: true,
				dataType: "jsonp"
			}
	);
}
