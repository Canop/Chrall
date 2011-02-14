/**
 * contient le profil d'un troll
 * Params :
 *  - dla (instance de Date)
 *  - turnDuration (en secondes)
 */
function TrollProfile() {	
}
TrollProfile.prototype.getCumul = function() { // celui qui me donne une traduction en anglais de "cumul" gagne une licence gratuite de Chrall
	return this.dla.add({seconds: this.turnDuration}); 
}

/**
 * renvoie une durée en secondes à partir d'une expression MH de type "3 jours 25 minutes 1 seconde"
 */ 
function Chrall_parseDuration(text) {
	var tokens = text.split(new RegExp("[ ,:=\.]+", "g"));
	//alert("text="+text);
	var seconds = 0;
	var unit = null;
	for (var i=tokens.length; i-->0;) {
		try {
			var num = parseInt(tokens[i]);
			if (!isNaN(num)) {
				if (unit.indexOf("second")===0) {
					seconds += num;
				} else if (unit.indexOf("minut")===0) {
					seconds += 60*num;
				} else if (unit.indexOf("heure")===0) {
					seconds += 60*60*num;
				} else if (unit.indexOf("jour")===0) {
					seconds += 24*60*60*num;
				}
				continue;
			}
		} catch (e) {}
		// pas un nombre, c'est peut-être une unité
		unit = tokens[i];
	}
	return seconds;
}

function Chrall_extractDlaInfos(text) {
	//alert(text);
	// pour comprendre le code qui suit il faut savoir que la page générée est segmentée en bien plus de lignes que ce qui est visible
	var lines = text.split('\n');
	var dlaString = lines[1].substring(8, lines[1].length).trim();
	playerProfile.dla = Date.parse(dlaString); // remarque : on utilise la surcharge de la classe Date définie dans date-fr-FR.js (le javascript est un truc de sadiques)
	//alert("playerProfile.dla=" + playerProfile.dla);
	var turnDurationLine = lines[lines.length-1].trim();
	var turnDurationString = turnDurationLine.split(':')[1];
	//alert("#"+turnDurationString+"#");
	playerProfile.turnDuration = Chrall_parseDuration(turnDurationString);
	//alert(playerProfile.turnDuration);
}


function Chrall_analyseProfile() {
	var cells = $("table table table.mh_tdborder tr.mh_tdpage td");
	//alert(cells.length);
	
	Chrall_extractDlaInfos($(cells[4]).text()); // cells[4] est la cellule en face de "Echeance du tour"
	
	//> on affiche la date du prochain cumul
	//alert("Prochain cumul : " + playerProfile.getCumul());
	$(cells[4]).append("<b>---&gt;&nbsp;Prochain cumul : " + playerProfile.getCumul().toString("d/M/yyyy HH:mm:ss") + "</b>");
	
}
