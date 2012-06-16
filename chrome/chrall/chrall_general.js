// contient des fonctions liées à l'interface générale
// et des utilitaires. Contient aussi la constante donnant la version courante de Chrall

var chrallVersion = "2.23.1";

function getUrlParameter(name, defaultValue) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(document.location.href);
	if (results == null)
		return defaultValue;
	else
		return results[1];
}

function Chrall_changeLocationOtherFrame(frameKey, href) {
	localStorage['frame_new_location_' + frameKey] = href;
}

function Chrall_listenForChangeLocation(frameKey) {
	var localStorageKey = 'frame_new_location_' + frameKey;
	var interval = setInterval(function() {
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
 * Note : comme je ne suis pas fort en expressions régulières, si un "-" est isolé, il sort comme un mot...
 * Attention : si vous corrigez le comportement de la ligne ci-dessus il faudra modifier Chrall_extractBasicInfos et pas mal d'autres méthodes
 */
function Chrall_tokenize(text) {
	return text.trim().split(new RegExp("[ /|\t\n\r\f,.:=()]+", "g"));
}

/**
 * les alarmes, dont la durée de vie peut dépasser celle de la page MH, doivent être gérées
 *  dans l'extension (la page en background).
 */
function Chrall_sendDlaToExtension(dlaTime, cumulTime) {
	chrome.extension.sendRequest({
		"dla": dlaTime,
		"cumul": cumulTime
	});
}

/**
 * calcul du nombre de PI (totaux) nécessaires pour atteindre un niveau
 */
function Chrall_getTotalPiForLevel(level) {
	return 5 * level * (level + 1) - 10;
}

function itoa(o) {
	if (o) {
		if (o > 0) return "+" + o;
		else return "" + o;
	} else {
		return "-";
	}
}

function decumul(i, val) {
	return Math.floor(val - val * ([0, .33, .6, .75, .85, .9][Math.min(i, 4)]));
}

function turnName(turn) {
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
function atoi(s) {
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
function updateTroll() {
	if (player.x) {
		player.save();
		var s = 'X=' + player.x + ' | Y=' + player.y + ' | N=' + player.z;
		// TODO: trouver comment faire ça, le frame principal ne semble pas être "atteignable"; mais ceci est-il vraiment nécessaire?
		//$('<script>parent.parent.Sommaire.document.getElementById("ch_menu_position").innerHTML="'+s+'";</script>').appendTo($('body'));
		chrall.sendPlayerInfosToChrallServer();
	}
}

// récupère la date de génération de la page et renvoie ça sous forme de secondes depuis 1970
// Renvoie 0 si pas trouvé
function findMHSeconds() {
	var text = $('body').text();
	var lines = text.split('\n');
	for (var i = lines.length; i-- > 0;) {
		var line = lines[i];
		if (line.indexOf("Page générée") > 0) {
			var t = Chrall_tokenize(line);
			var d = new Date(atoi(t[2]), atoi(t[1]) - 1, atoi(t[0]), atoi(t[3]), atoi(t[4]), atoi(t[5]));
			return d.getTime() / 1000;
		}
	}
	return 0;
}



