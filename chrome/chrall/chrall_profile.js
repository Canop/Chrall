"use strict";
// modifie la page du profil, et lit les informations disponibles concernant le troll

(function(chrall){
	/**
	 * renvoie une durée en secondes à partir d'une expression MH de type "3 j 10 h 5 m 1 s"
	 */
	chrall.parseDuration = function(text){
		let tokens = text.split(/\W+/g);
		let seconds = 0;
		let unit = null;
		for (let i = tokens.length; i-- > 0;) {
			try {
				let num = parseInt(tokens[i]);
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
				// hum
			}
			// pas un nombre, c'est peut-être une unité
			unit = tokens[i];
		}
		return seconds;
	};

	chrall.extractBasicInfos = function(){
		chrall.player().id = parseInt($("#id").text());
		chrall.player().name = $("#nom").text();
		chrall.player().race = $("#race").text();
	};

	chrall.extractXpInfos = function(){
		chrall.player().level = parseInt($("#niv").text());
		chrall.player().pi = parseInt($("#pitot").text());
		chrall.player().px = parseInt($("#px").text());
		chrall.player().pxPerso = parseInt($("#px_perso").text());
		chrall.player().availablePi = parseInt($("#pi").text());
	};

	chrall.makeXpComments = function(){
		let nextLevelPi = chrall.getTotalPiForLevel(chrall.player().level + 1);
		let trainingPx = chrall.player().level > 2 ? chrall.player().level * 2 : 5;
		let html = "";
		let diff = chrall.player().px + chrall.player().pxPerso - trainingPx;
		let $msgentrainer = $("#msgentrainer");
		if (diff >= 0) {
			html += "Vous pouvez vous entrainer : il vous restera " + diff + " px.";
		} else {
			html += "Il vous manque " + (-diff) + " px pour vous entrainer.";
		}
		$msgentrainer.html(html);
		html = "Chaque entrainement coûte " + trainingPx + " PX. Vous devez vous entrainer " +
				Math.ceil((nextLevelPi - chrall.player().pi) / trainingPx) + " fois pour passer au niveau " +
				(chrall.player().level + 1) + ".";
		html += "<br>Tuer un monstre ou un troll ne vous rapporte des px que s'il est de niveau supérieur à " +
				Math.max(1, Math.floor((2 * chrall.player().level - 10) / 3)) +
				".<br>Chaque niveau supplémentaire de la cible vous rapporte 3 px de plus.";
		chrall.triggerBubble($msgentrainer, html, "bub_troll");
		$msgentrainer.attr("title", "");
	};

	chrall.extractPositionAndSight = function(){
		chrall.player().x = parseInt($("#x").text());
		chrall.player().y = parseInt($("#y").text());
		chrall.player().z = parseInt($("#n").text());
		chrall.player().sight = new chrall.Characteristic(
			parseInt($("#vue").text()), 1, parseInt($("#vue_p").text()), parseInt($("#vue_m").text())
		);
		chrall.player().totalSight = parseInt($("#vue_tot").text());
	};

	chrall.extractDlaInfos = function(){
		// Utilisation du selecteur par attribut car deux elements on l'id "dla"
		let dlaString = $("td[id='dla']").text();
		// remarque : on utilise la surcharge de la classe Date définie dans date-fr-FR.js
		chrall.player().dlaTime = (Date.parse(dlaString)).getTime() / 1000;
		let turnDurationString = $("#duree").text();
		chrall.player().turnDuration = chrall.parseDuration(turnDurationString);
		chrall.player().pa = parseInt($("#pa").text()); // théoriquement doublon (on lit ça dans le menu de gauche). On supprimera peut-être.
	};

	chrall.extractPvAndFatigue = function(){
		chrall.player().pv = parseInt($("#pv_courant").text());
		chrall.player().pvMaxSansBMM = parseInt($("#pv").text());
		chrall.player().pvMax = parseInt($("#pv_tot").text());
		chrall.player().strainBase = parseInt($("#fatigue").text());
		chrall.player().strainMalus = parseInt($("#fatiguebm").text());
		chrall.player().strainMalus = isNaN(chrall.player().strainMalus) ? 0 : chrall.player().strainMalus;
		// Ajoute PV pouvant etre perdu sans malus de temps
		let extraTime = chrall.parseDuration($("#bm").text()) - chrall.parseDuration($("#blessure").text()) - chrall.parseDuration($("#poids").text());
		let extraPv = Math.floor(extraTime * chrall.player().pvMax / (250 * 60));
		if (extraPv > 0){
			$("#pos").find("div.barre").closest("td").append(`<span>Perdre <strong>${extraPv}PV</strong> ne créera pas un malus de temps</span>`);
		}
	};

	/**
	 * construit un certain nombre de tables donnant des infos sur la fatigue
	 */
	chrall.makeStrainInfos = function(){
		let html = "<div class=profileInfos>";
		let optimalStrains = [29, 23, 18, 14, 11, 8, 6, 4];
		let m0 = (chrall.player().getDla() - (new Date()).getTime()) / (60 * 1000);
		let m1 = (chrall.player().getDla(1) - (new Date()).getTime()) / (60 * 1000);
		//> construction de la table de récupération
		if (chrall.player().strainBase + chrall.player().strainMalus > 0 || chrall.player().race == "Kastar") { // pour les kastars on affiche toujours le tableau
			// TODO tester présence compétence charge
			html += "<table class=infos><tr><th> DLA &nbsp; </th><th> &nbsp; Fatigue &nbsp; </th><th> &nbsp; Malus de charge &nbsp; </th>";
			if (chrall.player().race == "Kastar") {
				html += "<th> &nbsp; AM: minutes/PV &nbsp; </th><th align=left> &nbsp; AM: suggestion</th>";
			}
			html += "</tr>";
			let baseStrain = chrall.player().strainBase;  // la fatigue de la dla i
			for (let i = 0; i < 20; i++) {
				// Pour les affichages construits ici, on suppose que les malus de DLA doivent disparaitre à la fin de cette DLA, de la prochaine ou de la subséquente.
				// Notons qu'on pourrait faire bien plus compact avec deux fois moins de variables mais je préfère que le code reste lisible.
				let normalStrain;
				let alternateStrain = 0; // (toujours supérieure à normalStrain, sauf si pas applicable)
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
				let normalChargeMalus = Math.floor(normalStrain / 5);
				let alternateChargeMalus = Math.floor(alternateStrain / 5);
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
				} else if (normalChargeMalus > 0) {
					html += " case";
				}
				html += "</td>";
				//chrall.player().race = 'Kastar';
				if ('Kastar' == chrall.player().race) {
					//> calcul et affichage du gain d'une AM en minutes par pv pour la dla i
					html += "<td align=center>";
					let normalPvGain = Math.min(30, Math.floor(120 / (normalStrain * (1 + Math.floor(normalStrain / 10)))));
					let alternatePvGain = Math.min(30, Math.floor(120 / (alternateStrain * (1 + Math.floor(alternateStrain / 10)))));
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
								let pv0 = Math.ceil(m0 / normalPvGain);
								chrall.playerAmAbstract.push("" + normalPvGain + " minutes gagnées par PV dépensé.");
								let mpai = "Vous devez dépenser " + pv0 + " PV pour rejouer de suite. ";
								if (alternatePvGain < normalPvGain) {
									mpai += "Voire plus. ";
								}
								if (pv0 >= 100 /* TODO : mettre les pv restant */) {
									mpai += "Evidemment ça fait beaucoup. ";
								}
								let g1 = -1;
								let pv1 = -1;
								if (pv0 > 2) {
									let pv1 = pv0 - 1;
									g1 = pv1 * normalPvGain;
									mpai += "<br>Si vous attendez " + Math.ceil(m0 - g1) +
										" minutes, ce qui vous mènera à " +
										(chrall.player().getDla().clone().addMinutes(-g1).toString("HH:mm")) +
										" vous pourrez rejouer en accélérant de " + pv1 + " PV. ";
								}
								for (let osi = 0; osi < optimalStrains.length; osi++) {
									if (pv0 + normalStrain > optimalStrains[osi]) {
										let goodAcceleration = optimalStrains[osi] - normalStrain;
										let dateGoodAcceleration = chrall.player().getDla(0).clone().addMinutes(-goodAcceleration *
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
								chrall.playerAmAbstract.push(mpai);
							} else if (normalPvGain ==0) {
								chrall.playerAmAbstract.push("Vous êtes trop fatigué pour accélérer ...");
							} else {
								chrall.playerAmAbstract.push("Vous n'auriez pas loupé votre DLA ?");
							}
						} else {
							chrall.playerAmAbstract.push("Pas assez de PA pour accélerer.");
						}
						html += chrall.playerAmAbstract[chrall.playerAmAbstract.length - 1];

						break;
					case 1 :
						if (m0 < 0 && m1 > 0) {
							let pv0 = Math.ceil(m1 / normalPvGain);
							chrall.playerAmAbstract.push("" + normalPvGain +
									" minutes gagnées par PV dépensé à la prochaine DLA.");
							let mpai = "Si vous activez maintenant vous devez dépenser " + pv0 +
									" PV pour faire un cumul immédiatement. ";
							chrall.playerAmAbstract.push(mpai);
							if (alternatePvGain < normalPvGain) {
								mpai += "Voire plus. ";
							}
							if (pv0 >= 100 /* TODO : mettre les pv restant */) {
								mpai += "Evidemment après ça vous aurez comme un déficit quelque part. ";
							}
							if (pv0 > 2) {
								let pv1 = pv0 - 1;
								let g1 = pv1 * normalPvGain;
								mpai += "Si vous attendez " + Math.ceil(m1 - g1) +
									" minutes, ce qui vous mènera à " +
									(chrall.player().getDla(1).clone().addMinutes(-g1).toString("HH:mm")) +
									" vous pourrez rejouer en accélérant de " + pv1 + " PV. ";
							}
							for (let osi = 0; osi < optimalStrains.length; osi++) {
								if (pv0 + normalStrain > optimalStrains[osi]) {
									let goodAcceleration = optimalStrains[osi] - normalStrain;
									let dateGoodAcceleration = chrall.player().getDla(1).clone().addMinutes(-goodAcceleration *
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
							html += chrall.playerAmAbstract[chrall.playerAmAbstract.length - 1];
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

	chrall.analyseAndReformatMainCharacteristicsTable = function(){
		let Characteristic = chrall.Characteristic;
		let characteristics = [
			{id: "#reg", name: "regeneration", dice: 3},
			{id: "#att", name: "attac", dice: 6},
			{id: "#esq", name: "dodge", dice: 6},
			{id: "#deg", name: "damage", dice: 3},
			{id: "#arm", name: "armor", dice: 3}
		];
		for (let i in characteristics) {
			let c = characteristics[i];
			let $idM = $(c.id + "_m");
			let diceNumber = parseInt($(c.id).text());
			let turnBonus = parseInt($(c.id + "_tour_d").text());
			let physicalBonus = parseInt($(c.id + "_p").text());
			let magicalBonus = parseInt($idM.text());
			chrall.player()[c.name] = new Characteristic(diceNumber, c.dice, physicalBonus, magicalBonus, turnBonus);
			$idM.next().append(" (" + chrall.player()[c.name].getMean() + ")");
		}
	};

	chrall.readTalentTable = function(table){
		let rows = table.find("tr");
		for (let i = 0; i < rows.length; i++) {
			let talent = new chrall.Talent();
			talent.readRow(rows.eq(i));
			if (talent.name) {
				chrall.player().addTalent(talent);
			}
		}
	};

	// renvoie une version améliorée du texte, pouvant le remplacer
	chrall.extractMagic = function(){
		chrall.player().baseRm = parseInt($("#rm").text());
		chrall.player().rm = parseInt($("#rm_tot").text());
		chrall.player().baseMm = parseInt($("#mm").text());
		chrall.player().mm = parseInt($("#mm_tot").text());
		chrall.player().concentration = parseInt($("#conc").text());
	};

	chrall.extractMagicalAttackBonuses = function(text){
		if (0 > text.indexOf("Attaques Magiques")) {
			return;
		}
		let bonusRegExp = /Bonus.*?([+\-\d]+) %/gm;
		let attackBonus = parseInt(bonusRegExp.exec(text)[1]);
		let damageBonus = parseInt(bonusRegExp.exec(text)[1]);

		chrall.player().adjustMagicalAttackMultiplier(attackBonus);
		chrall.player().adjustMagicalDamageMultiplier(damageBonus);
	};

	chrall.analyseAndReformatProfile = function(){
		chrall.extractBasicInfos();
		chrall.extractDlaInfos();
		chrall.extractPositionAndSight();
		chrall.extractXpInfos();
		chrall.extractPvAndFatigue();
		chrall.extractMagic();
		chrall.analyseAndReformatMainCharacteristicsTable();
		// FIXME commenté pour l'instant car je n'ai jamais eu de bonus en %
		//chrall.extractMagicalAttackBonuses(combatInfos.textContent);

		//> on affiche quelques calculs sur les px et les pi
		chrall.makeXpComments();

		//> on affiche les infos liées à la fatigue
		chrall.makeStrainInfos();

		chrall.readTalentTable($("#competences tbody"));
		chrall.readTalentTable($("#sortileges tbody"));

		//> on signale à l'extension la date de la fin de DLA, pour qu'elle programme éventuellement une alarme
		chrall.sendDlaToExtension(chrall.player().getDla(0).getTime(), chrall.player().getDla(1).getTime());

		//> on ajoute de quoi afficher les messages de gogochrall
		let html = "<span id=mbox class=ch_box>\
				<a id='ch_messageTitle'>en attente...</a>\
				<span id='ch_messageContent'>\
				<br><br>...de g0g0chrall...\
				</span>\
			</span><br><br>";
		$("#titre2").after(html);
		chrall.jsonp(
			chrall.serveurPublic() + "json?action=check_messages&TrollId="
			+ chrall.player().id + "&ChrallVersion=" + chrall.version
		);
		$("#ch_messageTitle").click(function(){
			$("#ch_messageContent").toggle();
		});

		console.log("PLAYER:", chrall.player());

		//> ajout des bulles sur les compétences
		$('a[href*="DetailComp"]').each(function(){
			let link = $(this);
			let text = chrall.getTalentBubbleContent(link.text().trim());
			chrall.triggerBubble(link, text, "bub_competence");
		});

		//> ajout des bulles sur les sorts
		$('a[href*="DetailSort"]').each(function(){
			let link = $(this);
			let text = chrall.getTalentBubbleContent(link.text().trim());
			chrall.triggerBubble(link, text, "bub_sort");
		});

		chrall.updateTroll();
	};

})(window.chrall = window.chrall || {});
