
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

function Chrall_extractBasicInfos(text) {
	var tokens = Chrall_tokenize(text);
	player.id = parseInt(tokens[1]);
	player.name = tokens[3];
	player.race = tokens[5];
	//~ alert("player.id="+player.id);
	//~ alert("player.name="+player.name);
	//~ alert("player.race="+player.race);
}
	
function Chrall_extractDlaInfos(text) {
	// pour comprendre le code qui suit il faut savoir que la page générée est segmentée en bien plus de lignes que ce qui est visible
	var lines = text.split('\n');
	var dlaString = lines[1].substring(8, lines[1].length).trim();
	player.dla = Date.parse(dlaString); // remarque : on utilise la surcharge de la classe Date définie dans date-fr-FR.js (le javascript est un truc de sadiques)
	var turnDurationLine = lines[lines.length-1].trim();
	var turnDurationString = turnDurationLine.split(':')[1];
	player.turnDuration = Chrall_parseDuration(turnDurationString);
}

function Chrall_extractFatigue(text) {
	var lines = text.split('\n');
	//~ for (var i=0; i<lines.length; i++) {
		//~ alert("lines["+i+"]=***"+lines[i]+"***");
	//~ }
	var strainLine = lines[16]; // c'est la ligne qui contient "Fatigue............:"
	var tokens = strainLine.split(new RegExp("[\)\( ,:=\.\+]+", "g"));
	var strainBaseFound = false;
	player.strainMalus = 0; // il n'est pas toujours mentionné. Si on trouve deux nombres c'est que le deuxième est le malus
	for (var i=2; i<tokens.length; i++) {
		try {
			var v = parseInt(tokens[i]);
			if (!isNaN(v)) {
				if (strainBaseFound) {
					player.strainMalus = v;
					break;
				} else {
					player.strainBase = v;
					strainBaseFound = true;
				}
			}
		} catch (error) {
		}
	}
	//alert("player.strainBase="+player.strainBase);
	//alert("player.strainMalus="+player.strainMalus);
}

/**
 * construit un certain nombre de tables donnant des infos sur la fatigue
 */
function Chrall_makeStrainInfos() {
	var html = "<div class=profileInfos>";
	html += "<table border=0><tr><td valign=top>";
	if (player.strainBase>0) {
		html += "<table class=infos><tr><th>DLA</th><th>Fatigue</th></tr>";
		var s = player.strainBase;
		for (var i=0;i<20;i++) {
			html += "<tr><td align=center>";
			if (i==0) html += "en cours";
			else if (i==1) html += "prochaine";
			else html += "+ " + i;
			var v = s;
			if (player.strainMalus>0) {
				if (i==0)  v += player.strainMalus;
				else if (i==1) v += " ou " + (s+player.strainMalus);
				// au delà les malus auront sans doute totalement disparu...
			}
			html += "</td><td align=center>" + v + "</td></tr>";
			s = Math.floor(s - s/5);
			if (s<=0) break;
		}
		html += "</table>";
		html += "</td><td valign=top>";
	}
	var totalStrain = player.strainBase + player.strainMalus;
	if (true) { // TODO vérifier que le troll a bien la compétence charge
		if (totalStrain>0) {
			var chargeMalus = Math.floor(totalStrain/5);
			if (chargeMalus>0) html += "Malus de charge : " + chargeMalus + " case" + (chargeMalus>1?"s":"") + ".<br><br>";
			else html += "Pas de malus de charge (car fatigue inférieure à 5).";
		}
	}
	if (true) {
		var pvGain = Math.min(30, Math.floor(120/(totalStrain*(1+Math.floor(totalStrain/10)))));
		html += "Accélération du métabolisme : un PV fait gagner " + pvGain + (pvGain>1 ? " minutes" : " minute") + ".<br>";
		if (player.race!="Kastar") html+="<small>Je sais bien que vous êtes un "+player.race+", mais je laisse ça pour la phase de tests.</small><br>";
	}
	html += "</td></tr></table>";
	html += "</div>";
	return html;
}

function Chrall_analyseAndReformatMainCharacteristicsTable(table) {
	var rows = table.find("tr");
	player.regeneration = new Characteristic().readRow(rows[0]);
	$(rows[0]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne : " + player.regeneration.getMean() + "</td>");
	player.attac = new Characteristic().readRow(rows[1]);
	$(rows[1]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne : " + player.attac.getMean() + "</td>");
	player.dodge = new Characteristic().readRow(rows[2]);
	$(rows[2]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne : " + player.dodge.getMean() + "</td>");
	player.damage = new Characteristic().readRow(rows[3]);
	$(rows[3]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne AN : " + player.damage.getMean() + "/" + player.damage.getCriticalMean() + "</td>");
	player.armor = new Characteristic().readRow(rows[4]);
	$(rows[4]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Total : " + player.armor.getMean() + "</td>");
	
}

function Chrall_analyseAndReformatProfile() {
	var cells = $("table table table.mh_tdborder tr.mh_tdpage td");
	//alert(cells.length);
	
	Chrall_extractBasicInfos($(cells[1]).text()); // la cellule qui contient l'id, le nom, la race
	Chrall_extractDlaInfos($(cells[4]).text()); // cells[4] est la cellule en face de "Echeance du tour"
	Chrall_extractFatigue($(cells[10]).text());
	Chrall_analyseAndReformatMainCharacteristicsTable($($("table table table.mh_tdborder table")[2])); // TODO trouver plus fiable !
	
	//> on affiche la date du prochain cumul
	$(cells[4]).append("<b>---&gt;&nbsp;DLA suivante : " + player.getDla(1).toString("dd/MM/yyyy HH:mm:ss") + "</b>");
	$(cells[4]).append("<br>(et encore après : " + player.getDla(2).toString("dd/MM/yyyy HH:mm:ss") + ")");

	//> on affiche les infos liées à la fatigue
	$(cells[10]).append(Chrall_makeStrainInfos());
	
	//> on signale à l'extension la date de la fin de DLA, pour qu'elle programme éventuellement une alarme
	Chrall_sendDlaToExtension(player.getDla(0).getTime(), player.getDla(1).getTime());
}
