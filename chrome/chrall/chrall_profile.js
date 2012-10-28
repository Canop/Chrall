// modifie la page du profil, et lit les informations disponibles concernant le troll

/**
 * renvoie une durée en secondes à partir d'une expression MH de type "3 jours 25 minutes 1 seconde"
 */
function Chrall_parseDuration(text) {
	var tokens = text.split(new RegExp("[ ,:=\.]+", "g"));
	//alert("text="+text);
	var seconds = 0;
	var unit = null;
	for (var i = tokens.length; i-- > 0;) {
		try {
			var num = parseInt(tokens[i]);
			if (!isNaN(num)) {
				if (unit.indexOf("second") === 0) {
					seconds += num;
				} else if (unit.indexOf("minut") === 0) {
					seconds += 60 * num;
				} else if (unit.indexOf("heure") === 0) {
					seconds += 60 * 60 * num;
				} else if (unit.indexOf("jour") === 0) {
					seconds += 24 * 60 * 60 * num;
				}
				continue;
			}
		} catch (e) {
		}
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
}

function Chrall_extractXpInfos(text) {
	var tokens = Chrall_tokenize(text);
	player.level = parseInt(tokens[1]);
	player.pi = parseInt(tokens[2]);
	player.px = parseInt(tokens[5]);
	player.pxPerso = parseInt(tokens[9]);
	player.availablePi = parseInt(tokens[11]);
}

function Chrall_makeXpComments() {
	var nextLevelPi = Chrall_getTotalPiForLevel(player.level + 1);
	var trainingPx = player.level * 2;
	var html = "";
	var diff = player.px + player.pxPerso - trainingPx;
	if (diff >= 0) {
		html += "Vous pouvez vous entrainer : il vous restera " + diff + " px.";
	} else {
		html += "Il vous manque " + (-diff) + " px pour vous entrainer.";
	}
	html += "<br>Chaque entrainement coûte " + trainingPx + " PX. Vous devez vous entrainer " + Math.ceil((nextLevelPi - player.pi) / trainingPx) + " fois pour passer au niveau " + (player.level + 1) + ".";
	html += "<br>Tuer un monstre ou un troll ne vous rapporte des px que s'il est de niveau supérieur à " + Math.floor((2 * player.level - 10) / 3) + " (chaque niveau supplémentaire de la cible vous rapporte 3 px de plus).";
	return html;
}

function Chrall_extractPositionAndSight(text) {
	var lines = text.split('\n');
	// extraction de la position
	var i = lines[0].lastIndexOf('X =');
	var positionText = lines[0].substring(i);
	var posToken = positionText.split('| ');
	player.x = parseInt(posToken[0].substring(3).trim());
	player.y = parseInt(posToken[1].substring(3).trim());
	player.z = parseInt(posToken[2].substring(3).trim());

	// todo
	// extraction de la vue
	for (var l = 0; l < lines.length; l++) {
		if (lines[l].indexOf("Case") >= 0) { // ce test est nécessaire car des lignes peuvent s'intercaler avec la mention du camou ou de l'invi
			var tokens = Chrall_tokenize(lines[l]);
			var sight = new Characteristic();
			sight.diceNumber = parseInt(tokens[0]);
			sight.diceSize = 1;
			sight.physicalBonus = parseInt(tokens[2]);
			player.sight = sight;
			player.totalSight = sight.diceNumber + sight.physicalBonus;
			return;
		}
	}
}

function Chrall_extractDlaInfos(text) {
	// pour comprendre le code qui suit il faut savoir que la page générée est segmentée en bien plus de lignes que ce qui est visible
	var lines = text.split('\n');
	var dlaString = lines[1].substring(8, lines[1].length).trim();
	player.dlaTime = (Date.parse(dlaString)).getTime(); // remarque : on utilise la surcharge de la classe Date définie dans date-fr-FR.js (le javascript est un truc de sadiques)
	var turnDurationLine = lines[lines.length - 1].trim();
	var turnDurationString = turnDurationLine.split(':')[1];
	player.turnDuration = Chrall_parseDuration(turnDurationString);
	var actionPointsLine = lines[2];
	player.pa = parseInt(Chrall_tokenize(actionPointsLine)[3]); // théoriquement doublon (on lit ça dans le menu de gauche). On supprimera peut-être.
}

function Chrall_extractPvAndFatigue(text) {
	var lines = text.split('\n');
	var pvTokens = Chrall_tokenize(lines[2]);
	player.pv = parseInt(pvTokens[1].trim());
	pvTokens = Chrall_tokenize(lines[10]);
	player.pvMaxSansBMM = parseInt(pvTokens[1].trim());
	player.pvMax = player.pvMaxSansBMM;
	try {
		player.pvMax += parseInt(pvTokens[2].trim());
	} catch (error) {
	}
	var strainLine = lines[16]; // c'est la ligne qui contient "Fatigue............:"
	var tokens = strainLine.split(new RegExp("[\)\( ,:=\.\+]+", "g"));
	var strainBaseFound = false;
	player.strainMalus = 0; // il n'est pas toujours mentionné. Si on trouve deux nombres c'est que le deuxième est le malus
	for (var i = 2; i < tokens.length; i++) {
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
}

/**
 * construit un certain nombre de tables donnant des infos sur la fatigue
 */
function Chrall_makeStrainInfos() {
	var html = "<div class=profileInfos>";
	var optimalStrains = [29, 23, 18, 14, 11, 8, 6, 4];
	var m0 = (player.getDla() - (new Date()).getTime()) / (60 * 1000);
	var m1 = (player.getDla(1) - (new Date()).getTime()) / (60 * 1000);
	//> construction de la table de récupération
	if (player.strainBase + player.strainMalus > 0 || player.race == "Kastar") { // pour les kastars on affiche toujours le tableau
		// TODO tester présence compétence charge
		html += "<table class=infos><tr><th> DLA &nbsp; </th><th> &nbsp; Fatigue &nbsp; </th><th> &nbsp; Malus de charge &nbsp; </th>";
		if (player.race == "Kastar") {
			html += "<th> &nbsp; AM: minutes/PV &nbsp; </th><th align=left> &nbsp; AM: suggestion</th>";
		}
		html += "</tr>";
		var baseStrain = player.strainBase;  // la fatigue de la dla i
		for (var i = 0; i < 20; i++) {
			// Pour les affichages construits ici, on suppose que les malus de DLA doivent disparaitre à la fin de cette DLA, de la prochaine ou de la subséquente.
			// Notons qu'on pourrait faire bien plus compact avec deux fois moins de variables mais je préfère que le code reste lisible.
			var normalStrain;
			var alternateStrain = 0; // (toujours supérieure à normalStrain, sauf si pas applicable)
			html += "<tr><td align=center>";
			if (i == 0) {
				html += "en cours";
				normalStrain = baseStrain + player.strainMalus;
			} else if (i == 1) {
				html += "prochaine";
				normalStrain = baseStrain;
				alternateStrain = baseStrain + player.strainMalus;
			} else if (i == 2) {
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
			if (alternateStrain > normalStrain) {
				html += " à " + alternateStrain;
			}
			html += "</td>";
			//> calcul et affichage du malus de charge pour la DLA i
			var normalChargeMalus = Math.floor(normalStrain / 5);
			var alternateChargeMalus = Math.floor(alternateStrain / 5);
			html += "<td align=center>";
			if (alternateChargeMalus > normalChargeMalus) {
				html += normalChargeMalus + " à " + alternateChargeMalus;
			} else if (normalChargeMalus > 0) {
				html += normalChargeMalus;
			} else {
				html += "-";
			}
			if (alternateChargeMalus > 1 || normalChargeMalus > 1) html += " cases";
			else if (normalChargeMalus > 0) html += " case";
			html += "</td>";
			//player.race = 'Kastar';
			if (player.race == 'Kastar') {
				//> calcul et affichage du gain d'une AM en minutes par pv pour la dla i
				html += "<td align=center>";
				var normalPvGain = Math.min(30, Math.floor(120 / (normalStrain * (1 + Math.floor(normalStrain / 10)))));
				var alternatePvGain = Math.min(30, Math.floor(120 / (alternateStrain * (1 + Math.floor(alternateStrain / 10)))));
				if (alternatePvGain < normalPvGain) {
					html += alternatePvGain + " à " + normalPvGain;
				} else {
					html += normalPvGain;
				}
				html += "</td>";
				//> calcul et affichage d'une suggestion pour l'AM
				html += "<td align=left>";
				switch (i) {
					case 0 :
						if (player.pa >= 2) {
							if (m0 > 0) {
								var pv0 = Math.ceil(m0 / normalPvGain);
								playerAmAbstract.push("" + normalPvGain + " minutes gagnées par PV dépensé.");
								var mpai = "Vous devez dépenser " + pv0 + " PV pour rejouer de suite. ";
								if (alternatePvGain < normalPvGain) mpai += "Voire plus. ";
								if (pv0 >= 100 /* TODO : mettre les pv restant */) mpai += "Evidemment ça fait beaucoup. ";
								var g1 = -1;
								var pv1 = -1;
								if (pv0 > 2) {
									var pv1 = pv0 - 1;
									g1 = pv1 * normalPvGain;
									mpai += "<br>Si vous attendez " + Math.ceil(m0 - g1) + " minutes, ce qui vous mènera à " + (player.getDla().clone().addMinutes(-g1).toString("HH:mm")) + " vous pourrez rejouer en accélérant de " + pv1 + " PV. ";
								}
								for (var osi = 0; osi < optimalStrains.length; osi++) {
									if (pv0 + normalStrain > optimalStrains[osi]) {
										var goodAcceleration = optimalStrains[osi] - normalStrain;
										var dateGoodAcceleration = player.getDla(0).clone().addMinutes(-goodAcceleration * normalPvGain);
										if (dateGoodAcceleration.getTime() < player.getDla(0).getTime() && pv1 != goodAcceleration) {
											mpai += "<br>Si vous attendez " + dateGoodAcceleration.toString("le dd/MM à HH:mm") + " vous pourrez accélérer de " + goodAcceleration + " PV pour rejouer de suite, ce qui portera votre fatigue à " + optimalStrains[osi] + " (laquelle deviendra négligeable en " + (optimalStrains.length - osi - 1) + " tours). ";
										}
										break;
									}
								}
								playerAmAbstract.push(mpai);
							} else {
								playerAmAbstract.push("Vous n'auriez pas loupé votre DLA ?");
							}
						} else {
							playerAmAbstract.push("Pas assez de PA pour accélerer.");
						}
						html += playerAmAbstract[playerAmAbstract.length - 1];

						break;
					case 1 :
						if (m0 < 0 && m1 > 0) {
							var pv0 = Math.ceil(m1 / normalPvGain);
							playerAmAbstract.push("" + normalPvGain + " minutes gagnées par PV dépensé à la prochaine DLA.");
							var mpai = "Si vous activez maintenant vous devez dépenser " + pv0 + " PV pour faire un cumul immédiatement. ";
							playerAmAbstract.push(mpai);
							if (alternatePvGain < normalPvGain) mpai += "Voire plus. ";
							if (pv0 >= 100 /* TODO : mettre les pv restant */) mpai += "Evidemment après ça vous aurez comme un déficit quelque part. ";
							if (pv0 > 2) {
								var pv1 = pv0 - 1;
								var g1 = pv1 * normalPvGain;
								mpai += "Si vous attendez " + Math.ceil(m1 - g1) + " minutes, ce qui vous mènera à " + (player.getDla(1).clone().addMinutes(-g1).toString("HH:mm")) + " vous pourrez rejouer en accélérant de " + pv1 + " PV. ";
							}
							for (var osi = 0; osi < optimalStrains.length; osi++) {
								if (pv0 + normalStrain > optimalStrains[osi]) {
									var goodAcceleration = optimalStrains[osi] - normalStrain;
									var dateGoodAcceleration = player.getDla(1).clone().addMinutes(-goodAcceleration * normalPvGain);
									if (dateGoodAcceleration.getTime() < player.getDla(1).getTime()) {
										mpai += "Si vous attendez " + dateGoodAcceleration.toString("le dd/MM à HH:mm") + " vous pourrez accélérer de " + goodAcceleration + " PV pour jouer deux fois de suite, ce qui portera votre fatigue à " + optimalStrains[osi] + " (laquelle deviendra négligeable en " + (optimalStrains.length - osi - 1) + " tours). ";
									}
									break;
								}
							}
							html += playerAmAbstract[playerAmAbstract.length - 1];
						}
						break;
					default:
				}
				html += "</td>";
			}
			html += "</tr>";
			//> on calcule la fatigue (de base) de la dla i+1
			baseStrain = Math.floor(baseStrain - baseStrain / 5);
			if (baseStrain <= 0) {
				if (player.race != "Kastar" || i > 1) break;
			}
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
	$(rows[1]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne AN : " + player.attac.getMean() + "</td>");
	player.dodge = new Characteristic().readRow(rows[2]);
	$(rows[2]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne : " + player.dodge.getMean() + "</td>");
	player.damage = new Characteristic().readRow(rows[3]);
	$(rows[3]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne AN : " + player.damage.getMean() + "/" + player.damage.getCriticalMean() + "</td>");
	player.armor = new Characteristic().readRow(rows[4]);
	$(rows[4]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne : " + player.armor.getMean() + "</td>");
	var agility = player.dodge.diceNumber + player.regeneration.diceNumber;
	var stabDices = (Math.floor(agility / 3) * 2);
	var stabBM = (player.dodge.physicalBonus + player.dodge.magicalBonus);
	var html = ' => Stabilité contre le balayage : ' + stabDices + 'D6 + ' + stabBM + '  &nbsp; Moyenne : ' + (3.5 * stabDices + stabBM);
	$('p:contains("Agilité")').append(html);
}

function Chrall_readTalentTable(table) {
	var rows = table.find("tr");
	for (var i = 0; i < rows.length; i++) {
		var talent = new Talent();
		talent.readRow(rows[i]);
		if (talent.name) {
			player.addTalent(talent);
		}
	}
}

// renvoie une version améliorée du texte, pouvant le remplacer
function Chrall_extractMagic(text) {
	var tokens = Chrall_tokenize(text);
	player.baseRm = parseInt(tokens[4]);
	player.rm = player.baseRm + parseInt(tokens[6]);
	player.baseMm = parseInt(tokens[11]);
	player.mm = player.baseMm + parseInt(tokens[13]);
	player.concentration = parseInt(tokens[17]);
	var r = "<table border=0>"; // je n'ai pas trouvé d'autre moyens d'insérer les totaux que de reconstruire toute la cellule :\
	r += "<tr><td>Résistance à la Magie</td><td> : " + player.baseRm + "</td><td> + " + (player.rm - player.baseRm) + "</td><td> = " + player.rm + " points</td></tr>";
	r += "<tr><td>Maîtrise de la Magie</td><td> : " + player.baseMm + "</td><td> + " + (player.mm - player.baseMm) + "</td><td> = " + player.mm + " points</td></tr>";
	r += "<tr><td>Bonus de Concentration</td><td> : " + player.concentration + " %</td></tr>";
	r += "</table>";
	return r;
}

function Chrall_analyseAndReformatProfile() {
	var cells = $("table table table.mh_tdborder tr.mh_tdpage td");

	Chrall_extractBasicInfos($(cells[1]).text()); // la cellule qui contient l'id, le nom, la race
	Chrall_extractDlaInfos($(cells[4]).text()); // cells[4] est la cellule en face de "Echeance du tour"
	Chrall_extractPositionAndSight($(cells[6]).text());
	Chrall_extractXpInfos($(cells[8]).text());
	Chrall_extractPvAndFatigue($(cells[10]).text());
	Chrall_analyseAndReformatMainCharacteristicsTable($($("table table table.mh_tdborder table")[2])); // TODO trouver plus fiable !

	var mmrmcell = $("table table table.mh_tdborder tr.mh_tdpage").find('td:contains("Résistance à la Magie")');
	var mmrmtext = Chrall_extractMagic(mmrmcell.text());
	mmrmcell.html(mmrmtext);

	//> on affiche la date du prochain cumul
	$(cells[4]).append("<b>---&gt;&nbsp;DLA suivante : " + player.getDla(1).toString("dd/MM/yyyy HH:mm:ss") + "</b>");
	$(cells[4]).append("<br>(et encore après : " + player.getDla(2).toString("dd/MM/yyyy HH:mm:ss") + ")");

	//> on affiche quelques calculs sur les px et les pi
	$(cells[8]).append("<br>" + Chrall_makeXpComments());

	//> on affiche les infos liées à la fatigue
	$(cells[10]).append(Chrall_makeStrainInfos());

	var compAndSortTables = $("table table table.mh_tdpage");
	var compTable = $(compAndSortTables[2]);
	Chrall_readTalentTable($(compAndSortTables[2]));
	Chrall_readTalentTable($(compAndSortTables[3]));

	//> on signale à l'extension la date de la fin de DLA, pour qu'elle programme éventuellement une alarme
	Chrall_sendDlaToExtension(player.getDla(0).getTime(), player.getDla(1).getTime());

	//> on ajoute de quoi afficher les messages de gogochrall
	var html = "<span id=mbox class=ch_box><a id=ch_messageTitle>en attente...</a>";
	html += "<span id=ch_messageContent><br><br>...de g0g0chrall...</span></span><br><br>";
	$($("table table table")[0]).append(html);
	chrall.jsonp(chrall.serveurPublic() + "json?action=check_messages&TrollId=" + player.id + "&ChrallVersion=" + chrallVersion);
	$("#ch_messageTitle").click(function() {
		$("#ch_messageContent").toggle();
	});

	//> ajout des bulles sur les compétences
	$('a[href*="EnterComp"]').each(
		function() {
			var link = $(this);
			var text = getBubbleContentForCompetence(link.text().trim());
			chrall.triggerBubble(link, text, "bub_competence");
		}
	);

	//> ajout des bulles sur les sorts
	$('a[href*="EnterSort"]').each(
		function() {
			var link = $(this);
			var text = getBubbleContentForSort(link.text().trim());
			chrall.triggerBubble(link, text, "bub_sort");
		}
	);

	updateTroll();
}
