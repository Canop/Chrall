/**
 * contient le profil d'un troll
 * Params :
 *  - dla (instance de Date)
 *  - turnDuration (en secondes)
 *  - strainBase (la fatigue de base)
 *  - strainMalus (le malus de fatigue)
 */
function TrollProfile() {	
}
/**
 * getDla(0) est la DLA en cours (getDla() est pareil)
 * getDla(1) est le prochain cumul
 * getDla(2) est le cumul suivant
 * je vous laisse deviner pour la suite
 */
TrollProfile.prototype.getDla = function(nbTurnsToAdd) {
	if (arguments.length==0) return this.dla;
	return this.dla.add({seconds: nbTurnsToAdd*this.turnDuration}); 
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
	var turnDurationLine = lines[lines.length-1].trim();
	var turnDurationString = turnDurationLine.split(':')[1];
	playerProfile.turnDuration = Chrall_parseDuration(turnDurationString);
}

function Chrall_extractFatigue(text) {
	var lines = text.split('\n');
	//~ for (var i=0; i<lines.length; i++) {
		//~ alert("lines["+i+"]=***"+lines[i]+"***");
	//~ }
	var strainLine = lines[16]; // c'est la ligne qui contient "Fatigue............:"
	
}

function Chrall_analyseAndReformatProfile() {
	var cells = $("table table table.mh_tdborder tr.mh_tdpage td");
	//alert(cells.length);
	
	Chrall_extractDlaInfos($(cells[4]).text()); // cells[4] est la cellule en face de "Echeance du tour"
	Chrall_extractFatigue($(cells[10]).text());
	
	//> on affiche la date du prochain cumul
	$(cells[4]).append("<b>---&gt;&nbsp;Prochain cumul : " + playerProfile.getDla(1).toString("dd/MM/yyyy HH:mm:ss") + "</b>");
	$(cells[4]).append("<br>(cumul suivant : " + playerProfile.getDla(2).toString("dd/MM/yyyy HH:mm:ss") + ")");
	
}
