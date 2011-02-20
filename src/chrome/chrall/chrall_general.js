/*
 contient des fonctions liées à l'interface générale
 et des utilitaires
*/

function Chrall_findPlayerLocation() {
	/*
	 * pour l'instant il n'y a pas grand chose là dedans, je n'arrive pas à accéder aux autres frames
	 */ 
	//alert($(document.getElementsByName("sommaire")[0]).find("div.infoMenu").length);
}

/**
 * découpe en mots (un nombre peut être un mot).
 * 
 * Note : comme je ne suis pas fort en expressions régulières, si un "-" est isolé, il sort comme un mot...
 * Attention : si vous corrigez le comportement de la ligne ci-dessus il faudra modifier Chrall_extractBasicInfos
 */
/* copiable pour tester :
for (var i=0; i<tokens.length; i++) alert(tokens[i]); 
*/
function Chrall_tokenize(text) {
	return text.trim().split(new RegExp("[ /\t\n\r\f,.:=]+", "g"));
	
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

