
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
	var actionPointsLine = lines[2];
	player.actionPoints = parseInt(Chrall_tokenize(actionPointsLine)[3]);
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
	var optimalStrains = [29, 23, 18, 14, 11, 8, 6, 4];
	var m0 = (player.getDla()-(new Date()).getTime())/(60*1000);
	var m1 = (player.getDla(1)-(new Date()).getTime())/(60*1000);
	//> construction de la table de récupération
	if (player.strainBase+player.strainMalus>0) {
		// TODO réussir à déplacer les instructions de style de cette table (center, border) en css
		// TODO tester quelles colonnes afficher (suivant présence compétences AM et charge)
		html += "<table class=infos width=100%><tr><th>DLA</th><th>Fatigue</th><th>Malus de charge</th><th>AM: minutes/PV</th><th align=left> &nbsp; AM: suggestion</th></tr>";
		var baseStrain = player.strainBase;  // la fatigue de la dla i
		for (var i=0;i<20;i++) {
			// Pour les affichages construits ici, on suppose que les malus de DLA doivent disparaitre à la fin de cette DLA, de la prochaine ou de la subséquente.
			// Notons qu'on pourrait faire bien plus compact avec deux fois moins de variables mais je préfère que le code reste lisible.
			var normalStrain;
			var alternateStrain = 0; // (toujours supérieure à normalStrain, sauf si pas applicable)
			html += "<tr><td align=center>";
			if (i==0) {
				html += "en cours";
				normalStrain = baseStrain + player.strainMalus;
			} else if (i==1) {
				html += "prochaine";
				normalStrain = baseStrain;
				alternateStrain = baseStrain + player.strainMalus;
			} else if (i==2) {
				html += "subséquente";
				normalStrain = baseStrain;
				alternateStrain = baseStrain + player.strainMalus;
			} else {
				html += "+ " + i;	
				normalStrain = baseStrain; // en principe tous les malus auront disparu
			}
			html += "</td>";
			//> affichage de la fatigue de la DLA i
			html += "<td align=center>" + normalStrain;
			if (alternateStrain>normalStrain) {
				html += " à " + alternateStrain;
			}
			html += "</td>";
			//> calcul et affichage du malus de charge pour la DLA i
			var normalChargeMalus = Math.floor(normalStrain/5);
			var alternateChargeMalus = Math.floor(alternateStrain/5);
			html += "<td align=center>";
			if (alternateChargeMalus>normalChargeMalus) {
				html += normalChargeMalus + " à " + alternateChargeMalus;
			} else if (normalChargeMalus>0) {
				html += normalChargeMalus;
			} else {
				html += "-";
			}
			if (alternateChargeMalus>1 || normalChargeMalus>1) html += " cases";
			else if (normalChargeMalus>0) html += " case";
			html += "</td>";
			//> calcul et affichage du gain d'une AM en minutes par pv pour la dla i
			html += "<td align=center>";
			var normalPvGain = Math.min(30, Math.floor(120/(normalStrain*(1+Math.floor(normalStrain/10)))));
			var alternatePvGain = Math.min(30, Math.floor(120/(alternateStrain*(1+Math.floor(alternateStrain/10)))));
			if (alternatePvGain<normalPvGain) {
				html += alternatePvGain + " à " + normalPvGain;
			} else {
				html += normalPvGain;				
			}
			html += "</td>";
			//> calcul et affichage d'une suggestion pour l'AM
			html += "<td align=left>";
			switch (i) {
				case 0 :
					if (player.actionPoints>=2) {
						if (m0>0) {
							var pv0 = Math.ceil(m0*normalPvGain);
							html += "Vous devez dépenser " + pv0 + " PV pour rejouer de suite. ";
							if (alternatePvGain<normalPvGain) html += "Voire plus. ";
							if (pv0>=100 /* TODO : mettre les pv restant */) html += "Evidemment ça fait beaucoup. ";
							for (var osi=0; osi<optimalStrains.length; osi++) {
								if (pv0+normalStrain>optimalStrains[osi]) {
									var goodAcceleration = optimalStrains[osi]-normalStrain;
									var dateGoodAcceleration = player.getDla(1).clone().addMinutes(-goodAcceleration*normalPvGain);
									if (dateGoodAcceleration.getTime()<player.getDla(0).getTime()) {
										html += "Si vous attendez " + dateGoodAcceleration.toString("le dd/MM à HH:mm") + " vous pourrez accélérer de " + goodAcceleration + " PV pour rejouer de suite, ce qui portera votre fatigue à " + optimalStrains[osi] + ". ";
									}
									break;
								}
							}
						} else {
							html += "Vous n'auriez pas loupé votre DLA ?";
						}
					} else {
						html += "Pas assez de PA pour accélerer";
					}
					break;
				case 1 :
					if (m0<0 && m1>0) {
						var pv0 = Math.ceil(m1*normalPvGain);
						html += "Si vous activez maintenant vous devez dépenser " + pv0 + " PV pour faire un cumul immédiatement. ";
						if (alternatePvGain<normalPvGain) html += "Voire plus. ";
						if (pv0>=100 /* TODO : mettre les pv restant */) html += "Evidemment après ça vous aurez comme un déficit quelque part. ";
						for (var osi=0; osi<optimalStrains.length; osi++) {
							if (pv0+normalStrain>optimalStrains[osi]) {
								var goodAcceleration = optimalStrains[osi]-normalStrain;
								var dateGoodAcceleration = player.getDla(1).clone().addMinutes(-goodAcceleration*normalPvGain);
								if (dateGoodAcceleration.getTime()<player.getDla(1).getTime()) {
									html += "Si vous attendez " + dateGoodAcceleration.toString("le dd/MM à HH:mm") + " vous pourrez accélérer de " + goodAcceleration + " PV pour jouer deux fois de suite, ce qui portera votre fatigue à " + optimalStrains[osi] + ". ";
								}
								break;
							}
						}
					}
					break;
				case 2 :
					if (player.race!="Kastar") {
						html += "<small>Ah mais vous êtes un " + Chrall_getSentence(player.race, "synonyme") + ", pas un " +  Chrall_getSentence("Kastar", "synonyme") + "...</small>";
					}
					break;
				case 3 :
					if (player.race!="Kastar") {
						html += "<small>"+Chrall_getSentence("nok")+"</small>";
					}
					break;
				case 6 :
					if (player.race!="Kastar") {
						html += "<small>"+Chrall_getSentence("pas d'AM")+"</small>";
					}
					break;
				default:				
			}
			html += "</td>";
			html += "</tr>";
			//> on calcule la fatigue (de base) de la dla i+1
			baseStrain = Math.floor(baseStrain - baseStrain/5);
			if (baseStrain<=0) break;
		}
		html += "</table>";
	}
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
