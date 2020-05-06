"use strict";
// contient des fonctions liées à l'interface générale
// et des utilitaires. Contient aussi la constante donnant la version courante de Chrall

var chrall = chrall || {};
chrall.version = "3.16";

chrall.changeLocationOtherFrame = function(frameKey, href){
	localStorage['frame_new_location_' + frameKey] = href;
}

chrall.listenForChangeLocation = function(frameKey){
	var localStorageKey = 'frame_new_location_' + frameKey;
	var interval = setInterval(function(){
		var new_href = localStorage[localStorageKey];
		if (new_href) {
			localStorage.removeItem(localStorageKey);
			document.location.href = new_href;
			clearInterval(interval);
		}
	}, 300);
}

/**
 * découpe en mots (un nombre peut être un mot).
 *
 * Attention : si vous corrigez le comportement de la ligne ci-dessus il faudra modifier chrall.extractBasicInfos et pas mal d'autres méthodes
 */
chrall.tokenize = function(text){
	return text.trim().split(/[\s\/|,.:=()]+/g);
}

/**
 * les alarmes, dont la durée de vie peut dépasser celle de la page MH, doivent être gérées
 *  dans l'extension (la page en background).
 */
chrall.sendDlaToExtension = function(dlaTime, cumulTime){
	chrome.extension.sendMessage({
		"dla": dlaTime,
		"cumul": cumulTime
	});
}

/**
 * calcul du nombre de PI (totaux) nécessaires pour atteindre un niveau
 */
chrall.getTotalPiForLevel = function(level){
	return 5 * level * (level + 1) - 10;
}

chrall.itoa = function(o){
	if (o) {
		return (o > 0) ? "+" + o : o;
	} else {
		return "0";
	}
}

chrall.decumul = function(i, val){
	val = val * (1 - ([0, .33, .6, .75, .85, .9][Math.min(i, 5)]));
	return val > 0 ? Math.floor(val) : Math.ceil(val);
}

chrall.turnName = function(turn){
	if (turn == 0) {
		return "en cours";
	} else if (turn == 1) {
		return "prochaine";
	} else if (turn == 2) {
		return "subséquente";
	} else {
		return "+ " + turn;
	}
}

// Traite des cas spéciaux de Chrall.
chrall.atoi = function(s){
	if (!s) return undefined; // à valider
	s = s.trim();
	while (s.charAt(0) == '0' || s.charAt(0) == ':') {
		s = s.substring(1, s.length);
		if (s.length == 0) return 0;
	}
	return parseInt(s, 10);
}

// appelée depuis l'une des sous-frame de droite (la grande, ou bien celle d'actions), cette méthode met à jour
// la position affichée dans le menu et signale la position au serveur Chrall
chrall.updateTroll = function(){
	var player = chrall.player();
	if (player.x) {
		player.save();
		chrall.sendPlayerInfosToChrallServer();
	}
}

// récupère la date de génération de la page et renvoie ça sous forme de secondes depuis 1970
// Renvoie 0 si pas trouvé
chrall.findMHSeconds = function(){
	var date = $("#hserveur");
	return date.length > 0 ? Date.parse(date.text().replace(/ GMT|\]/g, "")).getTime() / 1000 : 0;
}

// Retourne combien de PX seront obtenu lors du kill du niveau en parametre
chrall.getPxOnKill = function(level){
	level = parseInt(level);
	if (isNaN(level) || level < 0) {
		return "Impossible de savoir combien de PX vous donnera ce kill";
	}
	if (!chrall.player().level) {
		return "Vous devez vous rendre tout d'abord dans votre profil afin que Chrall<br>connaisse votre niveau pour savoir combien de PX vous rapportera ce kill";
	}
	return Math.max(0, 10 + 2 * (level - chrall.player().level) + level) + " PX lors du kill";
}