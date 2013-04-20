(function (chrall) {

	chrall.addMonsterInfo = function () {
		if (chrall.isOptionDisabled('view-display-monster-level')) {
			return;
		}

		var $monsterTitle = chrall.$tables().monstres.find("tr[class='mh_tdtitre']");
		var $monsterRows = chrall.$tables().monstres.find("tr[class='mh_tdpage']");

		var $nivalTitle = $("<td/>", {style: "width: 5em"});
		$nivalTitle.append($("<b/>", {text: "Nival"}));
		$($monsterTitle[0].children[1]).after($nivalTitle);


		$monsterRows.each(function (index, row) {
			var tokens = row.children[2].textContent.split(/\[|\]/);
			var monsterName = tokens[0];
			var monsterAge = tokens[1];
			var addedText = computeLevel(monsterName, monsterAge);
			var $nivalCell = $("<td/>", { text: addedText});
			$(row.children[1]).after($nivalCell);
		});
	}

	function computeLevel(monsterName, monsterAge) {
		var level = 0;
		var i, j, index;
		for (i = 0; i < templates.length; i++) {
			var template = templates[i];
			var templateText = template[0];
			index = monsterName.indexOf(templateText);
			if (0 <= index) {
				level += template[1];
				monsterName = monsterName.replace(templateText, "");
				monsterName = monsterName.trim();
				break;
			}
		}
		var monsterFound = false;
		for (i = 0; i < monsters.length; i++) {
			var monster = monsters[i];
			var monsterText = monster[0];
			index = monsterName.indexOf(monsterText);
			if (0 <= index) {
				level += monster[1];
				monsterFound = true;
				break;
			}
		}
		if (0 <= monsterName.indexOf("Gowap")
				|| 0 <= monsterName.indexOf("Familier")) {
			return level;
		}
		if (!monsterFound) {
			return -999;
		}
		var ageFound = false;
		AGE:
				for (i = 0; i < ages.length; i++) {
					var ageRow = ages[i];
					for (j = 0; j < 6; j++) {
						var ageText = ageRow[j];
						index = monsterAge.indexOf(ageText);
						if (0 <= index) {
							level += ageRow[6];
							ageFound = true;
							break AGE;
						}
					}
				}
		if (!ageFound) {
			return -888;
		}
		return level;
	}


	var ages = [
		["Bébé", "Initial", "Nouveau", "Larve", "Nouveau", "Naissant", 0 ],
		["Enfançon", "Novice", "Jeune", "Immature", "Jeune", "Récent", 1 ],
		["Jeune", "Mineur", "Adulte", "Juvénile", "Adulte", "Ancien", 2 ],
		["Adulte", "Favori", "Vétéran", "Imago", "Vétéran", "Vénérable", 3 ],
		["Mature", "Majeur", "Briscard", "Développé", "Briscard", "Séculaire", 4 ],
		["Chef de Harde", "Supérieur", "Doyen", "Mûr", "Doyen", "Antique", 5 ],
		["Ancien", "Suprême", "Légendaire", "Accompli", "Légendaire", "Ancestral", 6 ],
		["Ancêtre", "Ultime", "Mythique", "Achevé", "Mythique", "Antédiluvien", 7 ]
	];


	var templates = [
		["Agressif", 1 ],
		["Agressive", 1 ],
		["Alchimiste", 2 ],
		["Alpha", 11 ],
		["Archaïque", -1 ],
		["Archi-", 5 ],
		["Archiatre", 2 ],
		["Attentionné", 2 ],
		["Attentionnée", 2 ],
		["Barbare", 1 ],
		["Berserker", 2 ],
		["Berserkere", 2 ],
		["Champion", 4 ],
		["Championne", 4 ],
		["Cogneur", 2 ],
		["Cogneuse", 2 ],
		["Colossal", 7 ],
		["Colossale", 7 ],
		["Coriace", 1 ],
		["Corrompu", 1 ],
		["Corrompue", 1 ],
		["Cracheur", 2 ],
		["Cracheuse", 2 ],
		["de Cinquième Cercle", 5 ],
		["de Premier Cercle", -1 ],
		["de Quatrième Cercle", 4 ],
		["de Second Cercle", 0 ],
		["de Troisième Cercle", 2 ],
		["des Abysses", 3 ],
		["Effrayé", -1 ],
		["Effrayée", -1 ],
		["Enragé", 3 ],
		["Enragée", 3 ],
		["Esculape", 2 ],
		["Ethéré", 3 ],
		["Ethérée", 3 ],
		["Fanatique", 2 ],
		["Folle", 1 ],
		["Fou", 1 ],
		["Fouisseur", 0 ],
		["Fouisseuse", 0 ],
		["Frénétique", 3 ],
		["Frondeur", 2 ],
		["Frondeuse", 2 ],
		["Fustigateur", 2 ],
		["Fustigatrice", 2 ],
		["Gardien", 20 ],
		["Gardienne", 20 ],
		["Gargantuesque", 3 ],
		["Gigantesque", 1 ],
		["Grand Frondeur", 4 ],
		["Grande Frondeuse", 4 ],
		["Gros", 0 ],
		["Grosse", 0 ],
		["Guérisseur", 2 ],
		["Guérisseuse", 2 ],
		["Guerrière", 1 ],
		["Guerrier", 1 ],
		["Héros", 5 ],
		["Homochrome", 2 ],
		["Homomorphe", 3 ],
		["Implacable", 3 ],
		["Invocateur", 5 ],
		["Invocatrice", 5 ],
		["Lobotomisateur", 2 ],
		["Lobotomisatrice", 2 ],
		["Médicastre", 2 ],
		["Maître", 8 ],
		["Malade", -1 ],
		["Mentat", 2 ],
		["Morticole", 2 ],
		["Mutant", 2 ],
		["Mutante", 2 ],
		["Nécromant", 5 ],
		["Nécromante", 5 ],
		["Ouvrière", 0 ],
		["Ouvrier", 0 ],
		["Paysan", -1 ],
		["Paysanne", -1 ],
		["Petit", -1 ],
		["Petite", -1 ],
		["Planqué", 1 ],
		["Planquée", 1 ],
		["Prince", 8                                                           ],
		["Psychophage", 2 ],
		["Reine", 1 ],
		["Roi", 1 ],
		["Ronfleur", 2 ],
		["Ronfleuse", 2 ],
		["Scout", 2 ],
		["Shaman", 0 ],
		["Soldat", 2 ],
		["Sorcière", 0       ],
		["Sorcier", 0 ],
		["Spectral", 3 ],
		["Spectrale", 3 ],
		["Strident", 3 ],
		["Stridente", 3 ],
		["Traqueur", 1 ],
		["Traqueuse", 1 ],
		["Voleur", 2 ],
		["Voleuse", 2 ],
		["Vorace", 1 ]
	];

	var monsters = [
		["Balrog", 50],
		["Beholder", 50],
		["Hydre", 50],
		["Liche", 50],
		["Geck'oo Majestueux", 40],
		["Gritche", 39],
		["Nécromant", 39],
		["Foudroyeur", 38],
		["Mégacéphale", 38],
		["Bouj'Dla Placide", 37],
		["Nécrochore", 37],
		["Anoploure Purpurin", 36],
		["Barghest", 36],
		["Ashashin", 35],
		["Capitan", 35],
		["Trancheur", 35],
		["Behemoth", 34],
		["Flagelleur Mental", 33],
		["Marilith", 33],
		["Mouch'oo Majestueux Sauvage", 33],
		["Vouivre", 33],
		["Cube Gélatineux", 32],
		["Phoenix", 32],
		["Golem de Fer", 31],
		["Grylle", 31],
		["Essaim Cratérien", 30],
		["Mante Fulcreuse", 30],
		["Sphinx", 30],
		["Djinn", 29],
		["Palefroi Infernal", 29],
		["Vampire", 29],
		["Shai", 28],
		["Daemonite", 27],
		["Effrit", 27],
		["Elémentaire du Chaos", 26],
		["Labeilleux", 26],
		["Titan", 26],
		["Carnosaure", 25],
		["Crasc Maexus", 25],
		["Essaim Sanguinaire", 25],
		["Chonchon", 24],
		["Fantôme", 24],
		["Abishaii Rouge", 23],
		["Cheval à Dents de Sabre", 23],
		["Elémentaire d'Air", 23],
		["Golem de Pierre", 23],
		["Coccicruelle", 22],
		["Fumeux", 22],
		["Géant des Gouffres", 22],
		["Elémentaire de Feu", 21],
		["Elémentaire de Terre", 21],
		["Chevalier du Chaos", 20],
		["Feu Follet", 20],
		["Glouton", 20],
		["Tertre Errant", 20],
		["Abishaii Bleu", 19],
		["Bouj'Dla", 19],
		["Bulette", 19],
		["Ectoplasme", 18],
		["Hellrot", 18],
		["Ours-Garou", 18],
		["Crasc Médius", 17],
		["Elémentaire d'Eau", 17],
		["Sorcière", 17],
		["Banshee", 16],
		["Esprit-Follet", 16],
		["Abishaii Vert", 15],
		["Geck'oo", 15],
		["Golem d'Argile", 15],
		["Yuan-ti", 15],
		["Behir", 14],
		["Mille-Pattes Géant", 14],
		["Mouch'oo Domestique", 14],
		["Mouch'oo Sauvage", 14],
		["Spectre", 14],
		["Tubercule Tueur", 14],
		["Veskan Du Chaos", 14],
		["Xorn", 14],
		["Chimère", 13],
		["Géant de Pierre", 13],
		["Incube", 13],
		["Mille-Pattes", 13],
		["Nuée de Vermine", 13],
		["Ombre de Roches", 13],
		["Succube", 13],
		["Tigre-Garou", 12],
		["Ver Carnivore Géant", 12],
		["Basilisk", 11],
		["Gorgone", 11],
		["Ver Carnivore", 11],
		["Abishaii Noir", 10],
		["Ankheg", 10],
		["Crasc", 10],
		["Furgolin", 10],
		["Limace Géante", 10],
		["Naga", 10],
		["Scorpion Géant", 10],
		["Thri-kreen", 10],
		["Amibe Géante", 9],
		["Bondin", 9],
		["Fungus Géant", 9],
		["Limace", 9],
		["Manticore", 9],
		["Scorpion", 9],
		["Ame-en-peine", 8],
		["Amibe", 8],
		["Anaconda des Catacombes", 8],
		["Ettin", 8],
		["Fungus", 8],
		["Golem de Chair", 8],
		["Hurleur", 8],
		["Loup-Garou", 8],
		["Molosse Satanique", 8],
		["Nécrophage", 8],
		["Sirène", 8],
		["Yéti", 8],
		["Erinyes", 7],
		["Minotaure", 7],
		["Nuage d'Insectes", 7],
		["Ogre", 7],
		["Croquemitaine", 6],
		["Méduse", 6],
		["Mimique", 6],
		["Cockatrice", 5],
		["Diablotin", 5],
		["Gnoll", 5],
		["Lézard Géant", 5],
		["Pseudo-Dragon", 5],
		["Rocketeux", 5],
		["Slaad", 5],
		["Worg", 5],
		["Chauve-Souris Géante", 4],
		["Fungus Violet", 4],
		["Goblin", 4],
		["Goblours", 4],
		["Goule", 4],
		["Grouilleux", 4],
		["Harpie", 4],
		["Homme-Lézard", 4],
		["Lézard", 4],
		["Lutin", 4],
		["Momie", 4],
		["Plante Carnivore", 4],
		["Scarabée Géant", 4],
		["Tutoki", 4],
		["Boggart", 3],
		["Champi-Glouton", 3],
		["Chauve-Souris", 3],
		["Gargouille", 3],
		["Gremlins", 3],
		["Monstre Rouilleur", 3],
		["Orque", 3],
		["Rat-Garou", 3],
		["Sagouin", 3],
		["Scarabée", 3],
		["Araignée Géante", 2],
		["Kobold", 2],
		["Ombre", 2],
		["Rat Géant", 2],
		["Strige", 2],
		["Zombie", 2],
		["Araignée", 1],
		["Caillouteux", 1],
		["Dindon", 1],
		["Familier", 1],
		["Gnu Domestique", 1],
		["Gnu Sauvage", 1],
		["Gobelin Magique", 1],
		["Golem de cuir", 1],
		["Golem de mithril", 1],
		["Golem de métal", 1],
		["Golem de papier", 1],
		["Gowap Apprivoisé", 1],
		["Gowap Sauvage", 1],
		["Raquettou", 1],
		["Rat", 1],
		["Squelette", 1],
		["Elémentaire Magmatique", 0],
		["Nâ-Hàniym-Hééé", 0],
		["Pititabeille", 0],
		["Réhzineû de N'hoyël", 0]
	]


})(window.chrall = window.chrall || {});



