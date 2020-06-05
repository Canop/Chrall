"use strict";

/**
 * ce fichier contient les fonctions d'analyse de la vue reçue de MH.
 */
(function(chrall){

	// --- Utilitaires --------------------------------------------

	// Renvoie vers la messagerie ou le partage de px
	chrall.redirectToMailbox = function(){
		var checked = $("[name='cb_troll']:checked");
		if (0 == checked.length) {
			return;
		}
		var dests = [];
		checked.each(function(){
			dests.push(this.value);
		});
		var cat = this.attributes["cat"].value;
		document.location.href = "../Messagerie/MH_Messagerie.php?cat=" + cat + "&dest=" + dests.join(',');
	};

	chrall.distanceFromPlayer = function(targetX, targetY, targetN){
		// TODO: compute the cost of movement through surface, to know when it's cheaper
		var playerX = chrall.player().x;
		var playerY = chrall.player().y;
		var playerN = chrall.player().z;

		var deltaX, deltaY, deltaN, fromSurface, toSurface, cost, save_on_x, save_on_y, save_surface;
		deltaX = Math.abs(playerX - targetX);
		deltaY = Math.abs(playerY - targetY);
		deltaN = Math.abs(playerN - targetN);

		fromSurface = playerN == 0;
		toSurface = targetN == 0;

		// Lateral move + level change cost
		cost = Math.max(Math.max(deltaX, deltaY), deltaN) + deltaN;
		// If through surface
		save_on_x = Math.max(0, Math.floor((deltaX - deltaN) / 2.0));
		save_on_y = Math.max(0, Math.floor((deltaY - deltaN) / 2.0));
		save_surface = (fromSurface || toSurface) ? Math.max(save_on_x, save_on_y) : 0;

		cost -= save_surface;

		// Moving down from the surface costs an extra AP
		cost += (fromSurface && !toSurface) ? 1 : 0;

		// If the cave is busy, one extra AP, unless from the surface
		cost += (!chrall.player().cellIsFree && !fromSurface && cost > 0) ? 1 : 0;

		return cost;
	};

	chrall.addActionPointDistance = function(cells, x, y, z){
		var $cell = $(cells[0]).attr({ style: 'width:5rem', align: 'center'});
		if (chrall.isOptionDisabled('view-show-distance-in-view')) {
			return;
		}
		var dist = chrall.distanceFromPlayer(x, y, z);
		if (dist > 0) {
			$cell.append(` (${dist} PA)`);
		}
	};

	// Icone du projo
	chrall.projoIcon = function(cells, nameCell, item){
		if (chrall.player().race !== "Tomawak"){
			return;
		}
		var dist = parseInt(cells[0].innerHTML);
		if (dist <= chrall.player().talents["Projectile Magique"].range && item.z === chrall.player().z) {
			var projoImg = ` <img class='projo' data-dist='${dist}' src='${chrome.extension.getURL("/images/projo.png")}' />`;
			$(nameCell).append(projoImg);
			item.icons += projoImg;
		}
	};

	// Icone de mission
	chrall.missionIcon = function (nameCell, item) {
		for (var id in chrall.player().missions) {
			var mission = chrall.player().missions[id];
			var isRace = !mission.race || item.name.indexOf(mission.race) > -1;
			var isLevel = mission.minLevel <= item.level && item.level <= mission.maxLevel;
			if (isRace && isLevel) {
				var missionImg = ` <img class='mission' data-id='${id}' src='${chrome.extension.getURL("/images/mission.png")}' />`;
				$(nameCell).append(missionImg);
				item.icons += missionImg;
			}
		}
	};

	// Icone de lancer de potions
	chrall.potionIcon = function (cells, nameCell, item) {
		if (!chrall.player().talents["Lancer de Potions"]){
			return;
		}
		var dist = parseInt(cells[0].innerHTML);
		if (dist <= chrall.player().talents["Lancer de Potions"].range && item.z === chrall.player().z){
			var potionImg = ` <img class='potion' data-dist='${dist}' src='${chrome.extension.getURL("/images/potion.png")}' />`;
			$(nameCell).append(potionImg);
			item.icons += potionImg;
		}
	};

	// ------------------ Analyse des composants de la vue --------------------

	chrall.analyseMonsterTable = function(table){
		var grid = chrall.grid;
		table = table.get(0);
		if (table === undefined) return;
		var lines = table.querySelectorAll("tbody tr");
		chrall.grid.nbMonstersInView = lines.length;

		// Add level cell
		if (chrall.isOptionEnabled('view-display-monster-level', 'yes')) {
			var $nivalTitle = $("<th/>", { width: '3rem', text: 'Nival' });
			$('tr.mh_tdtitre', table).find('th').eq(0).after($nivalTitle);
		}

		for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
			var item = new chrall.Monster();
			var cells = lines[lineIndex].children;
			var i = 1;
			if (cells.length>=7) {
				item.actions = cells[i++].innerHTML.trim();
			}
			item.id = parseInt(cells[i++].textContent);
			var nameCell = cells[i++];
			item.setName(nameCell.textContent);
			nameCell.children[0].id = item.id + "_monster"; // !! Analyze AND modify : inject monster id
			if (chrall.isSeeingHidden(nameCell.innerText)) {
				var vlcImg = " <img class='vlc' src='" + chrome.extension.getURL("/images/vlc.png") + "' />";
				nameCell.innerHTML += vlcImg;
				item.icons += vlcImg;
			}
			item.x = parseInt(cells[i++].textContent);
			item.y = parseInt(cells[i++].textContent);
			item.z = parseInt(cells[i++].textContent);
			item.hasLink = !!nameCell.children[0].href;
			item.level = chrall.computeLevel(item.name, item.ageTag);
			var cell = grid.getCellNotNull(item.x, item.y);
			if (cell) cell.addMonster(item);
			else grid.outOfGrid.push(item);
			chrall.addActionPointDistance(cells, item.x, item.y, item.z);
			chrall.projoIcon(cells, nameCell, item);
			chrall.missionIcon(nameCell, item);
			chrall.potionIcon(cells, nameCell, item);
			// Add monster's level
			if (chrall.isOptionEnabled('view-display-monster-level', 'yes')) {
				var $nivalCell = $("<td/>", { text: item.level, class: "level", align: "center" });
				chrall.triggerBubble($nivalCell, chrall.getPxOnKill(item.level), "bub_monster");
				$(cells[0]).after($nivalCell);
			}
		}
	};

	chrall.analyseTrollTable = function(table){
		var grid = chrall.grid;
		// en même temps qu'on analyse la table, on ajoute les cases à cocher
		// de sélection des trolls pour l'envoi de MP.
		table = table.get(0);
		if (!table) return;
		var	$headRow = $(table).find("thead tr").eq(0);
		var $checkAll = $("<td align='center' style='width:1rem'><input type='checkbox'/></td>");
		$checkAll.children().click(function () {
			$("input[name='cb_troll']").click();
		});
		$headRow.prepend($checkAll);
		var	nbCols = $headRow.find("td,th").length;

		var lines = table.querySelectorAll("tbody tr");
		grid.nbTrollsInView = lines.length;
		[].forEach.call(lines, function(line){
			var item = new Troll();
			var cells = line.children;
			var i = 1;
			if (cells.length>=10) {
				item.actions = cells[i++].innerHTML.trim();
			}
			item.id = parseInt(cells[i++].textContent);
			var nameCell = cells[i++];
			item.name = nameCell.textContent;
			$(nameCell.children[0]).attr('id', item.id + "_troll");
			var $a = $('a', nameCell).attr('id', item.id);
			chrall.cdb.getTroll(item.id, function(t){
				if (t && t.team) $a.attr('team', item.team = t.team);
			});
			// les trolls intangibles sont marqués par le style 'mh_trolls_0' au lieu de 'mh_trolls_1'
			item.isIntangible = $(nameCell).html().indexOf("mh_trolls_0")>=0;
			item.guilde = cells[i++].textContent;
			chrall.triggerBubble($(cells[i]), chrall.getPxOnKill(cells[i].textContent), "bub_troll");
			item.level = cells[i++].textContent;
			item.race = cells[i++].textContent;
			item.x = parseInt(cells[i++].textContent);
			item.y = parseInt(cells[i++].textContent);
			item.z = parseInt(cells[i++].textContent);
			chrall.addActionPointDistance(cells, item.x, item.y, item.z);
			chrall.projoIcon(cells, nameCell, item);
			chrall.potionIcon(cells, nameCell, item);
			var selectBox = $('<td>', { align: 'center'})
			.append($('<input/>', {type: 'checkbox', name: 'cb_troll', value: item.id}));
			$(line).prepend(selectBox);
			var cell = grid.getCellNotNull(item.x, item.y);
			if (cell) cell.addTroll(item);
			else grid.outOfGrid.push(item);
		});

		var actionCell = $('<td/>', { colspan: nbCols, height: 25});
		var actions = $('<tr/>', { class: 'mh_tdtitre'}).append(actionCell);
		var sendMessage = $('<a/>', {class: 'gogo', cat: 3}).text("Envoyer un message");
		sendMessage.click(chrall.redirectToMailbox);
		actionCell.append(sendMessage);
		if (chrall.player().sessionActive) {
			var sharePx = $('<a/>', {class: 'gogo', cat: 8}).text("Partager des PX");
			sharePx.click(chrall.redirectToMailbox);
			actionCell.append(sharePx);
		}

		$(table.children[0]).prepend(actions);
	};

	chrall.analyseMushroomTable = function(table){
		var grid = chrall.grid;
		table = table.get(0);
		if (table===undefined) return;
		var lines = table.querySelectorAll("tbody tr");
		grid.nbMushroomsInView = lines.length;
		try {
			for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
				var item = new chrall.Thing();
				var cells = lines[lineIndex].children;
				console.log('cells:', cells.length);
				let i = 1;
				if (cells.length>=7) {
					// c'est le cas si le "menu d'actions contextuelles" est
					//  coché dans les options de vue de MH
					item.actions = cells[i++].innerHTML;
				}
				i += 1;
				var nameCell = cells[i++];
				item.setName(nameCell.textContent);
				item.x = parseInt(cells[i++].textContent);
				item.y = parseInt(cells[i++].textContent);
				item.z = parseInt(cells[i++].textContent);
				grid.getCellNotNull(item.x, item.y).addMushroom(item);
				chrall.addActionPointDistance(cells, item.x, item.y, item.z);
			}
		} catch (e) {
			console.warn("Erreur lors du décodage de la table des champignons");
		}
	};

	chrall.analysePlaceTable = function(table){
		var grid = chrall.grid;
		table = table.get(0);
		if (table===undefined) return;
		var lines = table.querySelectorAll("tbody tr");
		grid.nbPlacesInView = lines.length;
		for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
			var item = new chrall.Place();
			var cells = lines[lineIndex].children;
			var i = 1;
			if (cells.length>=7) {
				item.actions = cells[i++].innerHTML.trim();
			}
			item.id = parseInt(cells[i++].textContent);
			var nameCell = cells[i++];
			item.setName(nameCell.textContent);
			item.x = parseInt(cells[i++].textContent);
			item.y = parseInt(cells[i++].textContent);
			item.z = parseInt(cells[i++].textContent);
			item.hasLink = nameCell.children.length && !!nameCell.children[0].href;
			grid.getCellNotNull(item.x, item.y).addPlace(item);
			chrall.addActionPointDistance(cells, item.x, item.y, item.z);
		}
	};


	chrall.analyseObjectTable = function(table){
		var grid = chrall.grid;
		table = table.get(0);
		if (table===undefined) return;
		var lines = table.querySelectorAll("tbody tr");
		grid.nbObjectsInView = lines.length;
		for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
			var item = new chrall.Thing();
			var cells = lines[lineIndex].children;
			var i = 1;
			if (cells.length>=7) {
				item.actions = cells[i++].innerHTML.trim();
			}
			item.id = parseInt(cells[i++].textContent);
			var nameCell = cells[i++];
			item.setName(nameCell.textContent);
			item.x = parseInt(cells[i++].textContent);
			item.y = parseInt(cells[i++].textContent);
			item.z = parseInt(cells[i++].textContent);
			item.hasLink = !!nameCell.children.length && nameCell.children[0].href;
			grid.getCellNotNull(item.x, item.y).addObject(item);
			chrall.addActionPointDistance(cells, item.x, item.y, item.z);
		}
	};

	chrall.analyseCenotaphTable = function(table){
		var grid = chrall.grid;
		table = table.get(0);
		if (table===undefined) return;
		var lines = table.querySelectorAll("tbody tr");
		grid.nbCenotaphsInView = lines.length;
		for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
			var item = new chrall.Cenotaphe();
			var cells = lines[lineIndex].children;
			var i = 1;
			if (cells.length>=7) {
				item.actions = cells[i++].innerHTML;
			}
			item.id = parseInt(cells[i++].textContent);
			var nameCell = cells[i++];
			item.setName(nameCell.textContent);
			item.x = parseInt(cells[i++].textContent);
			item.y = parseInt(cells[i++].textContent);
			item.z = parseInt(cells[i++].textContent);
			grid.getCellNotNull(item.x, item.y).addCenotaph(item);
			chrall.addActionPointDistance(cells, item.x, item.y, item.z);
		}
	};

	chrall.analyseWallTable = function(table){
		var grid = chrall.grid;
		if ("undefined" == typeof table) {
			return;
		}
		if (table.length == 0) return;
		chrall.isInLaby = true;

		table = table.get(0);
		var lines = table.children[0].children
		for (var lineIndex = 1; lineIndex < lines.length; lineIndex++) {
			var item = new chrall.LabySquare();
			var cells = lines[lineIndex].children;
			var i = 1;
			item.id = parseInt(cells[i++].textContent);
			var nameCell = cells[i++];
			item.name = nameCell.textContent;
			item.x = parseInt(cells[i++].textContent);
			item.y = parseInt(cells[i++].textContent);
			item.z = parseInt(cells[i++].textContent);
			grid.getCellNotNull(item.x, item.y).addWall(item);
			chrall.addActionPointDistance(cells, item.x, item.y, item.z);
		}
	};

	//> chargement des trucs en vue (monstres, trolls, etc.).
	var jq_tables = {};

	chrall.findTable = function(key){
		var $t = $('#mh_vue_hidden_' + key + ' table');
		jq_tables[key] = $t;
		$t.attr("id", "table_" + key); // plus facile pour les récupérer ailleurs plus tard
		$t.detach();
	};

	chrall.$tables = function(){
		return jq_tables;
	};

	// renvoie les tables
	chrall.analyseView = function(){
		chrall.isInLaby = false;

		//> recherche de la position du joueur
		var positionMatch = $("table.mh_tdborder")[0].textContent.match(/Ma Position Actuelle est : X =\s*(-?\d+)\s*,\s*Y =\s*(-?\d+),\s*N =\s*(-?\d+)/);
		chrall.player().x = parseInt(positionMatch[1]);
		chrall.player().y = parseInt(positionMatch[2]);
		chrall.player().z = parseInt(positionMatch[3]);

		//> recherche de la vue max
		var sightLine = $('form li:contains(" porte actuellement à")'); //
		var tokens = chrall.tokenize(sightLine.text());
		chrall.player().totalSight = parseInt(tokens[5]);

		//> recherche de l'horizon (pour dessiner la grille ensuite)
		try {
			chrall.horizontalViewLimit = parseInt(document.getElementsByName("ai_MaxVue")[0].value);
		} catch (error) {
			console.log("horizontal view limit not found");
		}
		chrall.horizontalViewLimit = Math.max(chrall.horizontalViewLimit, 0);
		var horizontalGridLimit = Math.max(chrall.horizontalViewLimit, 1);
		// la grille dépasse la vue pour le menu
		// (TODO : on pourrait limiter ça au cas où la session est active ou bien est-ce que ça gauffrerait le labyrinthe ?)

		//> initialisation de la grille
		var grid = chrall.grid = new chrall.Grid(chrall.player().x, chrall.player().y, Math.max(1, horizontalGridLimit));

		chrall.findTable('monstres');
		chrall.findTable('trolls');
		chrall.findTable('tresors');
		chrall.findTable('champignons');
		chrall.findTable('lieux');
		chrall.findTable('cadavres');
		chrall.findTable('murs');

		chrall.analyseMonsterTable(chrall.$tables()['monstres']);
		chrall.analyseTrollTable(chrall.$tables()['trolls']);
		chrall.analyseObjectTable(chrall.$tables()['tresors']);
		chrall.analyseMushroomTable(chrall.$tables()['champignons']);
		chrall.analysePlaceTable(chrall.$tables()['lieux']);
		chrall.analyseCenotaphTable(chrall.$tables()['cadavres']);
		if (chrall.horizontalViewLimit > 0) {
			// Si on est aveugle, on sait que les infos des murs et couloirs sont incorrectes
			chrall.analyseWallTable(chrall.$tables()['murs']);
		}

		//> on regarde si la case du joueur est encombrée
		// Au passage, comme ça sert plus loin on construit la liste des trésors de cette case
		chrall.player().cellIsFree = true;
		chrall.objectsOnPlayerCell = new Array();
		var cell = grid.getCellOrNull(chrall.player().x, chrall.player().y);
		if (cell) {
			var i;
			if (cell.trolls) {
				for (i = 0; i < cell.trolls.length; i++) {
					if (cell.trolls[i].z === chrall.player().z) {
						chrall.player().cellIsFree = false;
						break;
					}
				}
			}
			if ((chrall.player().cellIsFree) && (cell.monsters)) {
				for (i = 0; i < cell.monsters.length; i++) {
					if (cell.monsters[i].z === chrall.player().z) {
						chrall.player().cellIsFree = false;
						break;
					}
				}
			}
			if (cell.objects) {
				for (i = 0; i < cell.objects.length; i++) {
					if (cell.objects[i].z === chrall.player().z) {
						chrall.objectsOnPlayerCell.push(cell.objects[i]);
					}
				}
			}
		}

		//> on détermine la zone visible
		chrall. xmin = chrall.player().x - horizontalGridLimit;
		chrall. xmax = chrall.player().x + horizontalGridLimit;
		chrall. ymin = chrall.player().y - horizontalGridLimit;
		chrall. ymax = chrall.player().y + horizontalGridLimit;
		return chrall.$tables();
	}

})(window.chrall = window.chrall || {});

