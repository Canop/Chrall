/*
 contient des fonctions liées à l'interface générale
 et des utilitaires. Contient aussi la constante donnant la version courante de Chrall
*/

var chrallVersion = "1.14";


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
 *  dans l'extension.
 */ 
function Chrall_sendDlaToExtension(dlaTime, cumulTime) {
	chrome.extension.sendRequest(
		{
			"dla": dlaTime,
			"cumul": cumulTime
		}
	);
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
