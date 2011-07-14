/*
 contient des fonctions liées à l'interface générale
 et des utilitaires. Contient aussi la constante donnant la version courante de Chrall
*/

var chrallVersion = "2.5";


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
	return 5*level*(level+1)-10;
}

function itoa(o) {
	if (o) {
		if (o>0) return "+"+o;
		else return ""+o;
	} else {
		return "-";
	}
}

function decumul(i, val) {
	return Math.floor(val - val*([0, .33, .6, .75, .85, .9][Math.min(i,4)]));
}

function turnName(turn) {	
	if (turn==0) {
		return "en cours";
	} else if (turn==1) {
		return "prochaine";
	} else if (turn==2) {
		return "subséquente";
	} else {
		return "+ " + turn;	
	}
}

// remplace la fonction parseInt, trop capricieuse ( parseInt("05")=5 mais parseInt("08")=0 )
// Traite aussi des cas spéciaux de Chrall.
function atoi(s) {
	if (!s) return undefined; // à valider
	s = s.trim();
	while(s.charAt(0)=='0' || s.charAt(0)==':' || s.charAt(0)=='0') s = s.substring(1, s.length);
	return parseInt(s);
}

// appelée depuis l'une des sous-frame de droite (la grande, ou bien celle d'actions), cette méthode met à jour
// la position affichée dans le menu et signale la position au script de fond.
function updateTroll() {
	chrome.extension.sendRequest({
		"player":player
	});
	if (player.x) {
		var s = 'X='+player.x + ' | Y='+player.y + ' | N='+player.z;
		$('<script>parent.parent.Sommaire.document.getElementById("ch_menu_position").innerHTML="'+s+'";</script>').appendTo($('body'));
	}
	sendPlayerInfosToChrallServer();
}

// récupère la date de génération de la page et renvoie ça sous forme de secondes depuis 1970
// Renvoie 0 si pas trouvé
function findMHSeconds() {
	var text = $('body').text();
	var lines = text.split('\n');
	for (var i=lines.length; i-->0;) {
		var line = lines[i];
		if (line.indexOf("Page générée")>0) {
			var t = Chrall_tokenize(line);
			var d = new Date(atoi(t[2]), atoi(t[1])-1, atoi(t[0]), atoi(t[3]), atoi(t[4]), atoi(t[5]));
			return d.getTime()/1000;
		}
	}
	return 0;
}





