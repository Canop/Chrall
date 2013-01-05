// modifie la page du profil, et lit les informations disponibles concernant le troll

(function (chrall) {
	/**
	 * renvoie une durée en secondes à partir d'une expression MH de type "3 jours 25 minutes 1 seconde"
	 */
	chrall.parseDuration = function (text) {
		var tokens = text.split(new RegExp("[ ,:=\\.]+", "g"));
		//alert("text="+text);
		var seconds = 0;
		var unit = null;
		for (var i = tokens.length; i-- > 0;) {
			try {
				var num = parseInt(tokens[i]);
				if (!isNaN(num)) {
					if (unit.indexOf("second") === 0) {
						seconds += num;
					} else {
						if (unit.indexOf("minut") === 0) {
							seconds += 60 * num;
						} else {
							if (unit.indexOf("heure") === 0) {
								seconds += 60 * 60 * num;
							} else {
								if (unit.indexOf("jour") === 0) {
									seconds += 24 * 60 * 60 * num;
								}
							}
						}
					}
					continue;
				}
			} catch (e) {
			}
			// pas un nombre, c'est peut-être une unité
			unit = tokens[i];
		}
		return seconds;
	};

	chrall.extractBasicInfos = function (text) {
		var tokens = Chrall_tokenize(text);
		chrall.player().id = parseInt(tokens[1]);
		chrall.player().name = tokens[3];
		chrall.player().race = tokens[5];
	};

	chrall.extractXpInfos = function (text) {
		var tokens = Chrall_tokenize(text);
		chrall.player().level = parseInt(tokens[1]);
		chrall.player().pi = parseInt(tokens[2]);
		chrall.player().px = parseInt(tokens[5]);
		chrall.player().pxPerso = parseInt(tokens[9]);
		chrall.player().availablePi = parseInt(tokens[11]);
	};

	chrall.makeXpComments = function () {
		var nextLevelPi = Chrall_getTotalPiForLevel(chrall.player().level + 1);
		var trainingPx = chrall.player().level * 2;
		var html = "";
		var diff = chrall.player().px + chrall.player().pxPerso - trainingPx;
		if (diff >= 0) {
			html += "Vous pouvez vous entrainer : il vous restera " + diff + " px.";
		} else {
			html += "Il vous manque " + (-diff) + " px pour vous entrainer.";
		}
		html += "<br>Chaque entrainement coûte " + trainingPx + " PX. Vous devez vous entrainer " +
				Math.ceil((nextLevelPi - chrall.player().pi) / trainingPx) + " fois pour passer au niveau " +
				(chrall.player().level + 1) + ".";
		html += "<br>Tuer un monstre ou un troll ne vous rapporte des px que s'il est de niveau supérieur à " +
				Math.floor((2 * chrall.player().level - 10) / 3) +
				" (chaque niveau supplémentaire de la cible vous rapporte 3 px de plus).";
		return html;
	};

	chrall.extractPositionAndSight = function (text) {
		var lines = text.split('\n');
		// extraction de la position
		var i = lines[0].lastIndexOf('X =');
		var positionText = lines[0].substring(i);
		var posToken = positionText.split('| ');
		chrall.player().x = parseInt(posToken[0].substring(3).trim());
		chrall.player().y = parseInt(posToken[1].substring(3).trim());
		chrall.player().z = parseInt(posToken[2].substring(3).trim());

		// todo
		// extraction de la vue
		for (var l = 0; l < lines.length; l++) {
			if (lines[l].indexOf("Case") >= 0) { // ce test est nécessaire car des lignes peuvent s'intercaler avec la mention du camou ou de l'invi
				var tokens = Chrall_tokenize(lines[l]);
				var sight = new Characteristic();
				sight.diceNumber = parseInt(tokens[0]);
				sight.diceSize = 1;
				sight.physicalBonus = parseInt(tokens[2]);
				chrall.player().sight = sight;
				chrall.player().totalSight = sight.diceNumber + sight.physicalBonus;
				return;
			}
		}
	};

	chrall.extractDlaInfos = function (text) {
		// pour comprendre le code qui suit il faut savoir que la page générée est segmentée en bien plus de lignes que ce qui est visible
		var lines = text.split('\n');
		var dlaString = lines[1].substring(8, lines[1].length).trim();
		chrall.player().dlaTime = (Date.parse(dlaString)).getTime(); // remarque : on utilise la surcharge de la classe Date définie dans date-fr-FR.js (le javascript est un truc de sadiques)
		var turnDurationLine = lines[lines.length - 1].trim();
		var turnDurationString = turnDurationLine.split(':')[1];
		chrall.player().turnDuration = chrall.parseDuration(turnDurationString);
		var actionPointsLine = lines[2];
		chrall.player().pa = parseInt(Chrall_tokenize(actionPointsLine)[3]); // théoriquement doublon (on lit ça dans le menu de gauche). On supprimera peut-être.
	};

	chrall.extractPvAndFatigue = function (text) {
		var lines = text.split('\n');
		var pvTokens = Chrall_tokenize(lines[2]);
		chrall.player().pv = parseInt(pvTokens[1].trim());
		pvTokens = Chrall_tokenize(lines[10]);
		chrall.player().pvMaxSansBMM = parseInt(pvTokens[1].trim());
		chrall.player().pvMax = chrall.player().pvMaxSansBMM;
		try {
			chrall.player().pvMax += parseInt(pvTokens[2].trim());
		} catch (error) {
		}
		var strainLine = lines[16]; // c'est la ligne qui contient "Fatigue............:"
		var tokens = strainLine.split(new RegExp("[\)\( ,:=\.\+]+", "g"));
		var strainBaseFound = false;
		chrall.player().strainMalus = 0; // il n'est pas toujours mentionné. Si on trouve deux nombres c'est que le deuxième est le malus
		for (var i = 2; i < tokens.length; i++) {
			try {
				var v = parseInt(tokens[i]);
				if (!isNaN(v)) {
					if (strainBaseFound) {
						chrall.player().strainMalus = v;
						break;
					} else {
						chrall.player().strainBase = v;
						strainBaseFound = true;
					}
				}
			} catch (error) {
			}
		}
	};

	/**
	 * construit un certain nombre de tables donnant des infos sur la fatigue
	 */
	chrall.makeStrainInfos = function () {
		var html = "<div class=profileInfos>";
		var optimalStrains = [29, 23, 18, 14, 11, 8, 6, 4];
		var m0 = (chrall.player().getDla() - (new Date()).getTime()) / (60 * 1000);
		var m1 = (chrall.player().getDla(1) - (new Date()).getTime()) / (60 * 1000);
		//> construction de la table de récupération
		if (chrall.player().strainBase + chrall.player().strainMalus > 0 || chrall.player().race == "Kastar") { // pour les kastars on affiche toujours le tableau
			// TODO tester présence compétence charge
			html += "<table class=infos><tr><th> DLA &nbsp; </th><th> &nbsp; Fatigue &nbsp; </th><th> &nbsp; Malus de charge &nbsp; </th>";
			if (chrall.player().race == "Kastar") {
				html += "<th> &nbsp; AM: minutes/PV &nbsp; </th><th align=left> &nbsp; AM: suggestion</th>";
			}
			html += "</tr>";
			var baseStrain = chrall.player().strainBase;  // la fatigue de la dla i
			for (var i = 0; i < 20; i++) {
				// Pour les affichages construits ici, on suppose que les malus de DLA doivent disparaitre à la fin de cette DLA, de la prochaine ou de la subséquente.
				// Notons qu'on pourrait faire bien plus compact avec deux fois moins de variables mais je préfère que le code reste lisible.
				var normalStrain;
				var alternateStrain = 0; // (toujours supérieure à normalStrain, sauf si pas applicable)
				html += "<tr><td align=center>";
				if (i == 0) {
					html += "en cours";
					normalStrain = baseStrain + chrall.player().strainMalus;
				} else {
					if (i == 1) {
						html += "prochaine";
						normalStrain = baseStrain;
						alternateStrain = baseStrain + chrall.player().strainMalus;
					} else {
						if (i == 2) {
							html += "subséquente";
							normalStrain = baseStrain;
							alternateStrain = baseStrain + chrall.player().strainMalus;
						} else {
							html += "+ " + i;
							normalStrain = baseStrain; // en principe tous les malus auront disparu
						}
					}
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
				} else {
					if (normalChargeMalus > 0) {
						html += normalChargeMalus;
					} else {
						html += "-";
					}
				}
				if (alternateChargeMalus > 1 || normalChargeMalus > 1) {
					html += " cases";
				}
				else {
					if (normalChargeMalus > 0) {
						html += " case";
					}
				}
				html += "</td>";
				//chrall.player().race = 'Kastar';
				if ('Kastar' == chrall.player().race) {
					//> calcul et affichage du gain d'une AM en minutes par pv pour la dla i
					html += "<td align=center>";
					var normalPvGain = Math.min(30,
							Math.floor(120 / (normalStrain * (1 + Math.floor(normalStrain / 10)))));
					var alternatePvGain = Math.min(30,
							Math.floor(120 / (alternateStrain * (1 + Math.floor(alternateStrain / 10)))));
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
							if (chrall.player().pa >= 2) {
								if (m0 > 0) {
									var pv0 = Math.ceil(m0 / normalPvGain);
									playerAmAbstract.push("" + normalPvGain +
											" minutes gagnées par PV dépensé.");
									var mpai = "Vous devez dépenser " + pv0 + " PV pour rejouer de suite. ";
									if (alternatePvGain < normalPvGain) {
										mpai += "Voire plus. ";
									}
									if (pv0 >=
											100 /* TODO : mettre les pv restant */) {
										mpai += "Evidemment ça fait beaucoup. ";
									}
									var g1 = -1;
									var pv1 = -1;
									if (pv0 > 2) {
										var pv1 = pv0 - 1;
										g1 = pv1 * normalPvGain;
										mpai += "<br>Si vous attendez " + Math.ceil(m0 - g1) +
												" minutes, ce qui vous mènera à " +
												(chrall.player().getDla().clone().addMinutes(-g1).toString("HH:mm")) +
												" vous pourrez rejouer en accélérant de " + pv1 + " PV. ";
									}
									for (var osi = 0; osi < optimalStrains.length; osi++) {
										if (pv0 + normalStrain > optimalStrains[osi]) {
											var goodAcceleration = optimalStrains[osi] - normalStrain;
											var dateGoodAcceleration = chrall.player().getDla(0).clone().addMinutes(-goodAcceleration *
													normalPvGain);
											if (dateGoodAcceleration.getTime() < chrall.player().getDla(0).getTime() &&
													pv1 != goodAcceleration) {
												mpai += "<br>Si vous attendez " +
														dateGoodAcceleration.toString("le dd/MM à HH:mm") +
														" vous pourrez accélérer de " + goodAcceleration +
														" PV pour rejouer de suite, ce qui portera votre fatigue à " +
														optimalStrains[osi] + " (laquelle deviendra négligeable en " +
														(optimalStrains.length - osi - 1) + " tours). ";
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
								playerAmAbstract.push("" + normalPvGain +
										" minutes gagnées par PV dépensé à la prochaine DLA.");
								var mpai = "Si vous activez maintenant vous devez dépenser " + pv0 +
										" PV pour faire un cumul immédiatement. ";
								playerAmAbstract.push(mpai);
								if (alternatePvGain < normalPvGain) {
									mpai += "Voire plus. ";
								}
								if (pv0 >=
										100 /* TODO : mettre les pv restant */) {
									mpai += "Evidemment après ça vous aurez comme un déficit quelque part. ";
								}
								if (pv0 > 2) {
									var pv1 = pv0 - 1;
									var g1 = pv1 * normalPvGain;
									mpai += "Si vous attendez " + Math.ceil(m1 - g1) +
											" minutes, ce qui vous mènera à " +
											(chrall.player().getDla(1).clone().addMinutes(-g1).toString("HH:mm")) +
											" vous pourrez rejouer en accélérant de " + pv1 + " PV. ";
								}
								for (var osi = 0; osi < optimalStrains.length; osi++) {
									if (pv0 + normalStrain > optimalStrains[osi]) {
										var goodAcceleration = optimalStrains[osi] - normalStrain;
										var dateGoodAcceleration = chrall.player().getDla(1).clone().addMinutes(-goodAcceleration *
												normalPvGain);
										if (dateGoodAcceleration.getTime() < chrall.player().getDla(1).getTime()) {
											mpai += "Si vous attendez " +
													dateGoodAcceleration.toString("le dd/MM à HH:mm") +
													" vous pourrez accélérer de " + goodAcceleration +
													" PV pour jouer deux fois de suite, ce qui portera votre fatigue à " +
													optimalStrains[osi] + " (laquelle deviendra négligeable en " +
													(optimalStrains.length - osi - 1) + " tours). ";
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
					if (chrall.player().race != "Kastar" || i > 1) {
						break;
					}
				}
			}
			html += "</table>";
		}
		html += "</div>";
		return html;
	};

	chrall.analyseAndReformatMainCharacteristicsTable = function (table) {
		var rows = table.find("tr");
		chrall.player().regeneration = new Characteristic().readRow(rows[0]);
		$(rows[0]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne : " + chrall.player().regeneration.getMean() +
				"</td>");
		chrall.player().attac = new Characteristic().readRow(rows[1]);
		$(rows[1]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne AN : " + chrall.player().attac.getMean() +
				"</td>");
		chrall.player().dodge = new Characteristic().readRow(rows[2]);
		$(rows[2]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne : " + chrall.player().dodge.getMean() + "</td>");
		chrall.player().damage = new Characteristic().readRow(rows[3]);
		$(rows[3]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne AN : " + chrall.player().damage.getMean() + "/" +
				chrall.player().damage.getCriticalMean() + "</td>");
		chrall.player().armor = new Characteristic().readRow(rows[4]);
		$(rows[4]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne : " + chrall.player().armor.getMean() + "</td>");
		var agility = chrall.player().dodge.diceNumber + chrall.player().regeneration.diceNumber;
		var stabDices = (Math.floor(agility / 3) * 2);
		var stabBM = (chrall.player().dodge.physicalBonus + chrall.player().dodge.magicalBonus);
		var html = ' => Stabilité contre le balayage : ' + stabDices + 'D6 + ' + stabBM + '  &nbsp; Moyenne : ' +
				(3.5 * stabDices + stabBM);
		$('p:contains("Agilité")').append(html);
	};

	chrall.readTalentTable = function (table) {
		var rows = table.find("tr");
		for (var i = 0; i < rows.length; i++) {
			var talent = new Talent();
			talent.readRow(rows[i]);
			if (talent.name) {
				chrall.player().addTalent(talent);
			}
		}
	};

	// renvoie une version améliorée du texte, pouvant le remplacer
	chrall.extractMagic = function (text) {
		var tokens = Chrall_tokenize(text);
		chrall.player().baseRm = parseInt(tokens[4]);
		chrall.player().rm = chrall.player().baseRm + parseInt(tokens[6]);
		chrall.player().baseMm = parseInt(tokens[11]);
		chrall.player().mm = chrall.player().baseMm + parseInt(tokens[13]);
		chrall.player().concentration = parseInt(tokens[17]);
		var r = "<table border=0>"; // je n'ai pas trouvé d'autre moyens d'insérer les totaux que de reconstruire toute la cellule :\
		r += "<tr><td>Résistance à la Magie</td><td> : " + chrall.player().baseRm + "</td><td> + " +
				(chrall.player().rm - chrall.player().baseRm) + "</td><td> = " + chrall.player().rm + " points</td></tr>";
		r += "<tr><td>Maîtrise de la Magie</td><td> : " + chrall.player().baseMm + "</td><td> + " + (chrall.player().mm - chrall.player().baseMm) +
				"</td><td> = " + chrall.player().mm + " points</td></tr>";
		r += "<tr><td>Bonus de Concentration</td><td> : " + chrall.player().concentration + " %</td></tr>";
		r += "</table>";
		return r;
	};

	chrall.extractMagicalAttackBonuses = function (text) {
		if (0 > text.indexOf("Attaques Magiques")) {
			return;
		}
		var bonusRegExp = /Bonus.*?([+\-\d]+) %/gm;
		var attackBonus = parseInt(bonusRegExp.exec(text)[1]);
		var damageBonus = parseInt(bonusRegExp.exec(text)[1]);

		chrall.player().adjustMagicalAttackMultiplier(attackBonus);
		chrall.player().adjustMagicalDamageMultiplier(damageBonus);
	};

	chrall.analyseAndReformatProfile = function () {
		// TODO simplifier la décomposition
		var cells = $("table table table.mh_tdborder tr.mh_tdpage td");

		var mainProfileTable = $("table.mh_tdborder[align=center]").get(0);
		var profileRows = mainProfileTable.firstElementChild.children;
		var basicInfos = profileRows[0].children[1];
		var dlaInfos = profileRows[1].children[1];
		var positionInfos = profileRows[2].children[1];
		var experienceInfos = profileRows[3].children[1];
		var lifeInfos = profileRows[4].children[1];
		var characteristicsInfos = profileRows[5].children[1];
		var combatInfos = profileRows[6].children[1];
		var resurrectionInfos = profileRows[7].children[1];
		var programmedInfos = profileRows[8].children[1];
		var magicInfos = profileRows[9].children[1];

		chrall.extractBasicInfos($(cells[1]).text()); // la cellule qui contient l'id, le nom, la race
		chrall.extractDlaInfos($(cells[4]).text()); // cells[4] est la cellule en face de "Echeance du tour"
		chrall.extractPositionAndSight($(cells[6]).text());
		chrall.extractXpInfos($(cells[8]).text());
		chrall.extractPvAndFatigue($(cells[10]).text());
		chrall.analyseAndReformatMainCharacteristicsTable($($("table table table.mh_tdborder table")[2])); // TODO trouver plus fiable !
		chrall.extractMagicalAttackBonuses(combatInfos.textContent);

		var mmrmcell = $("table table table.mh_tdborder tr.mh_tdpage").find('td:contains("Résistance à la Magie")');
		var mmrmtext = chrall.extractMagic(mmrmcell.text());
		mmrmcell.html(mmrmtext);

		//> on affiche la date du prochain cumul
		$(cells[4]).append("<b>---&gt;&nbsp;DLA suivante : " + chrall.player().getDla(1).toString("dd/MM/yyyy HH:mm:ss") +
				"</b>");
		$(cells[4]).append("<br>(et encore après : " + chrall.player().getDla(2).toString("dd/MM/yyyy HH:mm:ss") + ")");

		//> on affiche quelques calculs sur les px et les pi
		$(cells[8]).append("<br>" + chrall.makeXpComments());

		//> on affiche les infos liées à la fatigue
		$(cells[10]).append(chrall.makeStrainInfos());

		var compAndSortTables = $("table table table.mh_tdpage");
		var compTable = $(compAndSortTables[2]);
		chrall.readTalentTable($(compAndSortTables[2]));
		chrall.readTalentTable($(compAndSortTables[3]));

		//> on signale à l'extension la date de la fin de DLA, pour qu'elle programme éventuellement une alarme
		Chrall_sendDlaToExtension(chrall.player().getDla(0).getTime(), chrall.player().getDla(1).getTime());

		//> on ajoute de quoi afficher les messages de gogochrall
		var html = "<span id=mbox class=ch_box><a id=ch_messageTitle>en attente...</a>";
		html += "<span id=ch_messageContent><br><br>...de g0g0chrall...</span></span><br><br>";
		$($("table table table")[0]).append(html);
		chrall.jsonp(chrall.serveurPublic() + "json?action=check_messages&TrollId=" + chrall.player().id + "&ChrallVersion=" +
				chrallVersion);
		$("#ch_messageTitle").click(function () {
			$("#ch_messageContent").toggle();
		});

		//> ajout des bulles sur les compétences
		$('a[href*="EnterComp"]').each(
				function () {
					var link = $(this);
					var text = chrall.getBubbleContentForCompetence(link.text().trim());
					chrall.triggerBubble(link, text, "bub_competence");
				}
		);

		//> ajout des bulles sur les sorts
		$('a[href*="EnterSort"]').each(
				function () {
					var link = $(this);
					var text = chrall.getBubbleContentForSort(link.text().trim());
					chrall.triggerBubble(link, text, "bub_sort");
				}
		);

		updateTroll();
	};

})(window.chrall = window.chrall || {});
