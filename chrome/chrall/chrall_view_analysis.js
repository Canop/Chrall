/**
 * ce fichier contient les fonctions d'analyse de la vue reçue de MH.
 */


(function (chrall) {


	// --- Utilitaires --------------------------------------------

	// Renvoie vers la messagerie ou le partage de px
	chrall.redirectToMailbox = function () {
		var checked = $("[name='cb_troll']:checked");
		if (0 == checked.length) {
			return;
		}
		var dests = [];
		checked.each(function() {
			dests.push(this.value);
		});
		var cat = this.attributes["cat"].value;
		document.location.href = "../Messagerie/MH_Messagerie.php?cat=" + cat + "&dest=" + dests.join(',');
	}


	chrall.distanceFromPlayer = function(targetX, targetY, targetN) {
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
	}


	chrall.addActionPointDistance = function($table, distColumn, xColumn) {
		var table = $table.get(0);
		if (chrall.isOptionDisabled('view-show-distance-in-view') || "undefined" == typeof table) {
			return;
		}
		var lines = table.children[0].children
		for (var lineIndex = 1; lineIndex < lines.length; lineIndex++) {
			var cells = lines[lineIndex].children;
			var x = parseInt(cells[xColumn].textContent);
			if (isNaN(x)) {
				continue;
			}
			var y = parseInt(cells[xColumn + 1].textContent);
			var z = parseInt(cells[xColumn + 2].textContent);
			var dist = cells[distColumn].textContent + " (" + chrall.distanceFromPlayer(x, y, z) + " PA)";
			$(cells[distColumn]).text(dist).attr("style", "width:10ex");
		}
	}

	// ------------------ Analyse des composants de la vue --------------------

	chrall.analyseMonsterTable = function (table) {
		table = table.get(0);
		if ("undefined" == typeof table) {
			return;
		}
		var lines = table.children[0].children
		grid.nbMonstersInView = lines.length - 1;
		for (var lineIndex = 1; lineIndex < lines.length; lineIndex++) {
			var item = new Monster();
			var cells = lines[lineIndex].children;
			var i = 1;
			item.id = parseInt(cells[i++].textContent);
			var nameCell = cells[i++];
			item.setName(nameCell.textContent);
			$(nameCell.children[0]).attr("id", item.id + "_monster"); // !! Analyze AND modify : inject monster id
			item.x = parseInt(cells[i++].textContent);
			item.y = parseInt(cells[i++].textContent);
			item.z = parseInt(cells[i++].textContent);
			item.hasLink = nameCell.children[0].href ? true : false;
			grid.getCellNotNull(item.x, item.y).addMonster(item);
		}
	}

	chrall.analyseTrollTable = function (table) {
		// en même temps qu'on analyse la table, on ajoute les cases à cocher
		// de sélection des trolls pour l'envoi de MP.
		table = table.get(0);
		if ("undefined" == typeof table) {
			return;
		}
		var lines = table.children[0].children
		grid.nbTrollsInView = lines.length - 1;
		for (var lineIndex = 1; lineIndex < lines.length; lineIndex++) {
			var item = new Troll();
			var line = lines[lineIndex];
			var cells = line.children;
			var i = 1;
			item.id = parseInt(cells[i++].textContent);
			var nameCell = cells[i++];
			item.name = nameCell.textContent;
			$(nameCell.children[0]).attr('id', item.id + "_troll");
			item.level = cells[i++].textContent;
			item.race = cells[i++].textContent;
			item.guilde = cells[i++].textContent;
			item.x = parseInt(cells[i++].textContent);
			item.y = parseInt(cells[i++].textContent);
			item.z = parseInt(cells[i++].textContent);
			var selectBox = $('<td/>', { align: 'center'}).append($('<input/>', {type: 'checkbox', name: 'cb_troll', value: item.id}));
			$(line).prepend(selectBox);
			grid.getCellNotNull(item.x, item.y).addTroll(item);
		}

		var actionCell = $('<td/>', { colspan: 11, height: 25});
		var actions = $('<tr/>', { class: 'mh_tdtitre'}).append(actionCell);
		var sendMessage = $('<a/>', {class: 'gogo', cat: 3}).text("Envoyer un message");
		sendMessage.click(chrall.redirectToMailbox);
		actionCell.append(sendMessage);
		if (chrall.player().sessionActive) {
			var sharePx = $('<a/>', {class: 'gogo', cat: 8}).text("Partager des PX");
			sharePx.click(chrall.redirectToMailbox);
			actionCell.append(sharePx);
		}

		$(lines[0]).prepend($('<td/>')); // une cellule vide pour décaler la mise en page
		$(table.children[0]).prepend(actions);
	}

	chrall.analyseMushroomTable = function (table) {
		table = table.get(0);
		if ("undefined" == typeof table) {
			return;
		}
		var lines = table.children[0].children
		grid.nbMushroomsInView = lines.length - 1;
		for (var lineIndex = 1; lineIndex < lines.length; lineIndex++) {
			var item = new Thing();
			var cells = lines[lineIndex].children;
			var i = 1;
			var nameCell = cells[i++];
			item.setName(nameCell.textContent);
			item.x = parseInt(cells[i++].textContent);
			item.y = parseInt(cells[i++].textContent);
			item.z = parseInt(cells[i++].textContent);
			grid.getCellNotNull(item.x, item.y).addMushroom(item);
		}
	}

	chrall.analysePlaceTable = function (table) {
		table = table.get(0);
		if ("undefined" == typeof table) {
			return;
		}
		var lines = table.children[0].children
		grid.nbPlacesInView = lines.length - 1;
		for (var lineIndex = 1; lineIndex < lines.length; lineIndex++) {
			var item = new Place();
			var cells = lines[lineIndex].children;
			var i = 1;
			item.id = parseInt(cells[i++].textContent);
			var nameCell = cells[i++];
			item.setName(nameCell.textContent);
			item.x = parseInt(cells[i++].textContent);
			item.y = parseInt(cells[i++].textContent);
			item.z = parseInt(cells[i++].textContent);
			item.hasLink = nameCell.children[0].href ? true : false;
			grid.getCellNotNull(item.x, item.y).addPlace(item);
		}
	}


	chrall.analyseObjectTable = function (table) {
		table = table.get(0);
		if ("undefined" == typeof table) {
			return;
		}

		var lines = table.children[0].children
		grid.nbObjectsInView = lines.length - 1;
		for (var lineIndex = 1; lineIndex < lines.length; lineIndex++) {
			var item = new Thing();
			var cells = lines[lineIndex].children;
			var i = 1;
			item.id = parseInt(cells[i++].textContent);
			var nameCell = cells[i++];
			item.setName(nameCell.textContent);
			item.x = parseInt(cells[i++].textContent);
			item.y = parseInt(cells[i++].textContent);
			item.z = parseInt(cells[i++].textContent);
			item.hasLink = nameCell.children[0].href ? true : false;
			grid.getCellNotNull(item.x, item.y).addObject(item);
		}
	}


	chrall.analyseCenotaphTable = function (table) {
		table = table.get(0);
		if ("undefined" == typeof table) {
			return;
		}

		var lines = table.children[0].children
		grid.nbCenotaphsInView = lines.length - 1;
		for (var lineIndex = 1; lineIndex < lines.length; lineIndex++) {
			var item = new Cenotaphe();
			var cells = lines[lineIndex].children;
			var i = 1;
			item.id = parseInt(cells[i++].textContent);
			var nameCell = cells[i++];
			item.setName(nameCell.textContent);
			item.x = parseInt(cells[i++].textContent);
			item.y = parseInt(cells[i++].textContent);
			item.z = parseInt(cells[i++].textContent);
			grid.getCellNotNull(item.x, item.y).addCenotaph(item);
		}
	}


	chrall.analyseWallTable = function (table) {
		if ("undefined" == typeof table) {
			return;
		}
		if (table.length == 0) return;
		isInLaby = true;

		table = table.get(0);
		var lines = table.children[0].children
		for (var lineIndex = 1; lineIndex < lines.length; lineIndex++) {
			var item = new LabySquare();
			var cells = lines[lineIndex].children;
			var i = 1;
			item.id = parseInt(cells[i++].textContent);
			var nameCell = cells[i++];
			item.name = nameCell.textContent;
			item.x = parseInt(cells[i++].textContent);
			item.y = parseInt(cells[i++].textContent);
			item.z = parseInt(cells[i++].textContent);
			grid.getCellNotNull(item.x, item.y).addWall(item);
		}
	}

	//> chargement des trucs en vue (monstres, trolls, etc.).
	var jq_tables = {};

	chrall.findTable = function(key) {
		var $t = $('#mh_vue_hidden_' + key + ' table');
		jq_tables[key] = $t;
		$t.attr("id", "table_" + key); // plus facile pour les récupérer ailleurs plus tard
		$t.detach();
	}

	chrall.$tables = function() {
		return jq_tables;
	}


})(window.chrall = window.chrall || {});


// renvoie les tables
function Chrall_analyseView() {
	isInLaby = false;

	//> recherche de la position du joueur
	var positionSentenceText = $("table.mh_tdborder").first().find("li").first().text();
	var positionSentenceTokens = positionSentenceText.split(new RegExp("[ ,:=]+", "g"));
	chrall.player().x = parseInt(positionSentenceTokens[5]);
	chrall.player().y = parseInt(positionSentenceTokens[8]);
	chrall.player().z = parseInt(positionSentenceTokens[10]);

	//> recherche de la vue max
	var sightLine = $('form li:contains(" porte actuellement à")'); //
	var tokens = Chrall_tokenize(sightLine.text());
	chrall.player().totalSight = parseInt(tokens[5]);

	//> recherche de l'horizon (pour dessiner la grille ensuite)
	try {
		horizontalViewLimit = parseInt(document.getElementsByName("ai_MaxVue")[0].value);
	} catch(error) {
	}
	horizontalViewLimit = Math.max(horizontalViewLimit, 0);
	var horizontalGridLimit = Math.max(horizontalViewLimit, 1); // la grille dépasse la vue pour le menu (TODO : on pourrait limiter ça au cas où la session est active ou bien est-ce que ça gauffrerait le labyrinthe ?)

	//> initialisation de la grille
	grid = new Grid(chrall.player().x, chrall.player().y, Math.max(1, horizontalGridLimit));

	chrall.findTable('monstres');
	chrall.findTable('trolls');
	chrall.findTable('tresors');
	chrall.findTable('champignons');
	chrall.findTable('lieux');
	chrall.findTable('cadavre');
	chrall.findTable('murs');

	chrall.analyseMonsterTable(chrall.$tables()['monstres']);
	chrall.analyseTrollTable(chrall.$tables()['trolls']);
	chrall.analyseObjectTable(chrall.$tables()['tresors']);
	chrall.analyseMushroomTable(chrall.$tables()['champignons']);
	chrall.analysePlaceTable(chrall.$tables()['lieux']);
	chrall.analyseCenotaphTable(chrall.$tables()['cadavre']);
	if (horizontalViewLimit > 0) chrall.analyseWallTable(chrall.$tables()['murs']); // Si on est aveugle, on sait que les infos des murs et couloirs sont incorrectes

	chrall.addActionPointDistance(chrall.$tables()['monstres'], 0, 3);
	chrall.addActionPointDistance(chrall.$tables()['trolls'], 1, 7);
	chrall.addActionPointDistance(chrall.$tables()['tresors'], 0, 3);
	chrall.addActionPointDistance(chrall.$tables()['champignons'], 0, 2);
	chrall.addActionPointDistance(chrall.$tables()['lieux'], 0, 3);
	chrall.addActionPointDistance(chrall.$tables()['cadavre'], 0, 3);

	//> on regarde si la case du joueur est encombrée
	// Au passage, comme ça sert plus loin on construit la liste des trésors de cette case
	chrall.player().cellIsFree = true;
	objectsOnPlayerCell = new Array();
	var cell = grid.getCellOrNull(chrall.player().x, chrall.player().y);
	if (cell) {
		if (cell.trolls) {
			for (var i = 0; i < cell.trolls.length; i++) {
				if (cell.trolls[i].z === chrall.player().z) {
					chrall.player().cellIsFree = false;
					break;
				}
			}
		}
		if ((!chrall.player().cellIsFree) && (cell.monsters)) {
			for (var i = 0; i < cell.monsters.length; i++) {
				if (cell.monsters[i].z === chrall.player().z) {
					chrall.player().cellIsFree = false;
					break;
				}
			}
		}
		if (cell.objects) {
			for (var i = 0; i < cell.objects.length; i++) {
				if (cell.objects[i].z === chrall.player().z) {
					objectsOnPlayerCell.push(cell.objects[i]);
				}
			}
		}
	}
	;

	//> on détermine la zone visible 
	xmin = chrall.player().x - horizontalGridLimit;
	xmax = chrall.player().x + horizontalGridLimit;
	ymin = chrall.player().y - horizontalGridLimit;
	ymax = chrall.player().y + horizontalGridLimit;
	return chrall.$tables();
}
