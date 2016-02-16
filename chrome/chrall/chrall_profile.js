// modifie la page du profil, et lit les informations disponibles concernant le troll

(function (chrall) {
	/**
	 * renvoie une durée en secondes à partir d'une expression MH de type "3 j 10 h 5 m 1 s"
	 */
	chrall.parseDuration = function (text) {
		var tokens = text.split(/\W+/g);
		var seconds = 0;
		var unit = null;
		for (var i = tokens.length; i-- > 0;) {
			try {
				var num = parseInt(tokens[i]);
				if (!isNaN(num)) {
					if (unit.indexOf("s") === 0) {
						seconds += num;
					} else {
						if (unit.indexOf("m") === 0) {
							seconds += 60 * num;
						} else {
							if (unit.indexOf("h") === 0) {
								seconds += 60 * 60 * num;
							} else {
								if (unit.indexOf("j") === 0) {
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

	chrall.extractBasicInfos = function () {
		chrall.player().id = parseInt($("#id").text());
		chrall.player().name = $("#nom").text();
		chrall.player().race = $("#race").text();
	};

	chrall.extractXpInfos = function () {
		chrall.player().level = parseInt($("#niv").text());
		chrall.player().pi = parseInt($("#pitot").text());
		chrall.player().px = parseInt($("#px").text());
		chrall.player().pxPerso = parseInt($("#px_perso").text());
		chrall.player().availablePi = parseInt($("#pi").text());
	};

	chrall.makeXpComments = function () {
		var nextLevelPi = Chrall_getTotalPiForLevel(chrall.player().level + 1);
		var trainingPx = chrall.player().level > 2 ? chrall.player().level * 2 : 5;
		var html = "";
		var diff = chrall.player().px + chrall.player().pxPerso - trainingPx;
		var $msgentrainer = $("#msgentrainer");
		if (diff >= 0) {
			html += "Vous pouvez vous entrainer : il vous restera " + diff + " px.";
		} else {
			html += "Il vous manque " + (-diff) + " px pour vous entrainer.";
		}
		$msgentrainer.html(html);
		html = "Chaque entrainement coûte " + trainingPx + " PX. Vous devez vous entrainer " +
				Math.ceil((nextLevelPi - chrall.player().pi) / trainingPx) + " fois pour passer au niveau " +
				(chrall.player().level + 1) + ".";
		html += "\nTuer un monstre ou un troll ne vous rapporte des px que s'il est de niveau supérieur à " +
				Math.floor((2 * chrall.player().level - 10) / 3) +
				" (chaque niveau supplémentaire de la cible vous rapporte 3 px de plus).";
		$msgentrainer.attr("title", html);
	};

	chrall.extractPositionAndSight = function () {
		chrall.player().x = parseInt($("#x").text());
		chrall.player().y = parseInt($("#y").text());
		chrall.player().z = parseInt($("#n").text());
		chrall.player().sight = new Characteristic(parseInt($("#vue").text()), 1, parseInt($("#vue_p").text()), parseInt($("#vue_m").text()));
		chrall.player().totalSight = parseInt($("#vue_tot").text());
	};

	chrall.extractDlaInfos = function () { 
		// Utilisation du selecteur par attribut car deux elements on l'id "dla"
		var dlaString = $("td[id='dla']").text();
		chrall.player().dlaTime = (Date.parse(dlaString)).getTime(); // remarque : on utilise la surcharge de la classe Date définie dans date-fr-FR.js (le javascript est un truc de sadiques)
		var turnDurationString = $("#duree").text();
		console.log("turnDurationString:", turnDurationString);
		chrall.player().turnDuration = chrall.parseDuration(turnDurationString);
		console.log("chrall.player().turnDuration:", chrall.player().turnDuration);
		chrall.player().pa = parseInt($("#pa").text()); // théoriquement doublon (on lit ça dans le menu de gauche). On supprimera peut-être.
	};

	chrall.extractPvAndFatigue = function () {
		chrall.player().pv = parseInt($("#pv_courant").text());
		chrall.player().pvMaxSansBMM = parseInt($("#pv").text());
		chrall.player().pvMax = chrall.player().pvMaxSansBMM;
		// FIXME je n'ai pas compris la difference entre strainBase et strainMalus
		chrall.player().strainBase = parseInt($("#fatigue").text());
		chrall.player().strainMalus = chrall.player().strainBase;
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
								if (m0 > 0 && normalPvGain > 0) {
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
								} else if (normalPvGain ==0) {
									playerAmAbstract.push("Vous êtes trop fatigué pour accélérer ...");
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

	chrall.analyseAndReformatMainCharacteristicsTable = function () {
		// TODO faire les modifications d'affichage
		// var rows = table.find("tr");
		chrall.player().regeneration = new Characteristic(parseInt($("#reg").text()), 3, parseInt($("#reg_p").text()), parseInt($("#reg_m").text()));
		// $(rows[0]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne : " + chrall.player().regeneration.getMean() +
				// "</td>");
		chrall.player().attac = new Characteristic(parseInt($("#att").text()), 6, parseInt($("#att_p").text()), parseInt($("#att_m").text()));
		// $(rows[1]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne AN : " + chrall.player().attac.getMean() +
				// "</td>");
		chrall.player().dodge = new Characteristic(parseInt($("#esq").text()), 6, parseInt($("#esq_p").text()), parseInt($("#esq_m").text()));
		// $(rows[2]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne : " + chrall.player().dodge.getMean() + "</td>");
		chrall.player().damage = new Characteristic(parseInt($("#deg").text()), 3, parseInt($("#deg_p").text()), parseInt($("#deg_m").text()));
		// $(rows[3]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne AN : " + chrall.player().damage.getMean() + "/" +
		// 		chrall.player().damage.getCriticalMean() + "</td>");
		chrall.player().armor = new Characteristic(parseInt($("#arm").text()), 3, parseInt($("#arm_p").text()), parseInt($("#arm_m").text()));
		// $(rows[4]).append("<td class=ch_car_mean> &nbsp; &nbsp; &nbsp; Moyenne : " + chrall.player().armor.getMean() + "</td>");
		// var agility = chrall.player().dodge.diceNumber + chrall.player().regeneration.diceNumber;
		// var stabDices = (Math.floor(agility / 3) * 2);
		// var stabBM = (chrall.player().dodge.physicalBonus + chrall.player().dodge.magicalBonus);
		// var html = ' => Stabilité contre le balayage : ' + stabDices + 'D6 + ' + stabBM + '  &nbsp; Moyenne : ' +
		// 		(3.5 * stabDices + stabBM);
		// $('p:contains("Agilité")').append(html);
	};

	chrall.readTalentTable = function (table) {
		var rows = table.find("tr");
		for (var i = 0; i < rows.length; i++) {
			var talent = new Talent();
			talent.readRow(rows.eq(i));
			if (talent.name) {
				chrall.player().addTalent(talent);
			}
		}
	};

	// renvoie une version améliorée du texte, pouvant le remplacer
	chrall.extractMagic = function (text) {		
		var matchRM = text.match(/Résistance à la Magie\.+:\s*(-?\d+)\s*points\s*([+-]\s*\d+)\s*/i);
		chrall.player().baseRm = parseInt(matchRM[1]);
		chrall.player().rm = chrall.player().baseRm + parseInt(matchRM[2]);
		
		var matchMM = text.match(/Maîtrise de la Magie\.+:\s*(-?\d+)\s*points\s*([+-]\s*\d+)\s*/i);
		chrall.player().baseMm = parseInt(matchMM[1]);
		chrall.player().mm = chrall.player().baseMm + parseInt(matchMM[2]);
		
		var matchBC = text.match(/Bonus de Concentration\s*:\s*(-?\d+)/i);
		chrall.player().concentration = parseInt(matchBC[1]);
				
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
		chrall.extractBasicInfos();
		chrall.extractDlaInfos();
		chrall.extractPositionAndSight();
		chrall.extractXpInfos();
		chrall.extractPvAndFatigue();
		chrall.analyseAndReformatMainCharacteristicsTable(); 
		// FIXME commenté pour l'instant car je n'ai jamais eu de bonus en %
		//chrall.extractMagicalAttackBonuses(combatInfos.textContent);

		//> on affiche quelques calculs sur les px et les pi
		chrall.makeXpComments();

		//> on affiche les infos liées à la fatigue
		// TODO trouver une idée d'affichage
		//cells.eq(4).append(chrall.makeStrainInfos());

		chrall.readTalentTable($("#competences tbody"));
		chrall.readTalentTable($("#sortileges tbody"));

		//> on signale à l'extension la date de la fin de DLA, pour qu'elle programme éventuellement une alarme
		Chrall_sendDlaToExtension(chrall.player().getDla(0).getTime(), chrall.player().getDla(1).getTime());

		//> on ajoute de quoi afficher les messages de gogochrall
		var html = "<span id=mbox class=ch_box>\
				<a id='ch_messageTitle'>en attente...</a>\
				<span id='ch_messageContent'>\
				<br><br>...de g0g0chrall...\
				</span>\
			</span><br><br>";
		$("#titre2").after(html);
		chrall.jsonp(
			chrall.serveurPublic() + "json?action=check_messages&TrollId="
			+ chrall.player().id + "&ChrallVersion=" + chrallVersion
		);
		$("#ch_messageTitle").click(function () {
			$("#ch_messageContent").toggle();
		});
		
		console.log("PLAYER:", chrall.player());

		//> ajout des bulles sur les compétences
		$('a[href*="DetailComp"]').each(
				function () {
					var link = $(this);
					var text = chrall.getBubbleContentForCompetence(link.text().trim());
					chrall.triggerBubble(link, text, "bub_competence");
				}
		);

		//> ajout des bulles sur les sorts
		$('a[href*="DetailSort"]').each(
				function () {
					var link = $(this);
					var text = chrall.getBubbleContentForSort(link.text().trim());
					chrall.triggerBubble(link, text, "bub_sort");
				}
		);

		updateTroll();
	};

})(window.chrall = window.chrall || {});
