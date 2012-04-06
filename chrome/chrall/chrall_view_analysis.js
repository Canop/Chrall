/**
 * ce fichier contient les fonctions d'analyse de la vue reçue de MH.
 */


(function (chrall) {

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
		if ('yes' != localStorage['view-show-distance-in-view'] || "undefined" == typeof table) {
			return;
		}
		var lines = table.children[0].children
		for (var lineIndex = 1; lineIndex < lines.length; lineIndex++) {
			var cells = lines[lineIndex].children;
			var x = parseInt(cells[xColumn].textContent);
			if (isNaN(x)) { continue;}
			var y = parseInt(cells[xColumn + 1].textContent);
			var z = parseInt(cells[xColumn + 2].textContent);
			var dist = cells[distColumn].textContent + " (" + chrall.distanceFromPlayer(x, y, z) + " PA)";
			$(cells[distColumn]).text(dist);
		}
	}


})(window.chrall = window.chrall || {});


function Chrall_analyseMonsterTable(table) {
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
		item.x = parseInt(cells[i++].textContent);
		item.y = parseInt(cells[i++].textContent);
		item.z = parseInt(cells[i++].textContent);
		item.hasLink = nameCell.children[0].href ? true : false;
		grid.getCellNotNull(item.x, item.y).addMonster(item);
	}
}

function Chrall_analyseTrollTable(table) {
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
	sendMessage.click(Chrall_redirectToMailbox);
	actionCell.append(sendMessage);
	if (player.sessionActive) {
		var sharePx = $('<a/>', {class: 'gogo', cat: 8}).text("Partager des PX");
		sharePx.click(Chrall_redirectToMailbox);
		actionCell.append(sharePx);
	}

	$(lines[0]).prepend($('<td/>')); // une cellule vide pour décaler la mise en page
	$(table.children[0]).prepend(actions);
}

function Chrall_redirectToMailbox() {
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

function Chrall_analyseMushroomTable(table) {
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

function Chrall_analysePlaceTable(table) {
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

function Chrall_analyseWallTable(table) {
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

function Chrall_analyseObjectTable(table) {
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

function Chrall_analyseCenotaphTable(table) {
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

// renvoie les tables
function Chrall_analyseView() {
	isInLaby = false;

	//> recherche de la position du joueur
	var positionSentenceText = $("table.mh_tdborder").first().find("li").first().text();
	var positionSentenceTokens = positionSentenceText.split(new RegExp("[ ,:=]+", "g"));
	player.x = parseInt(positionSentenceTokens[5]);
	player.y = parseInt(positionSentenceTokens[8]);
	player.z = parseInt(positionSentenceTokens[10]);

	//> recherche de la vue max
	var sightLine = $('form li:contains(" porte actuellement à")'); //
	var tokens = Chrall_tokenize(sightLine.text());
	player.totalSight = parseInt(tokens[5]);

	//> recherche de l'horizon (pour dessiner la grille ensuite)
	try {
		horizontalViewLimit = parseInt(document.getElementsByName("ai_MaxVue")[0].value);
	} catch(error) {
	}
	horizontalViewLimit = Math.max(horizontalViewLimit, 0);
	var horizontalGridLimit = Math.max(horizontalViewLimit, 1); // la grille dépasse la vue pour le menu (TODO : on pourrait limiter ça au cas où la session est active ou bien est-ce que ça gauffrerait le labyrinthe ?)

	//> initialisation de la grille
	grid = new Grid(player.x, player.y, Math.max(1, horizontalGridLimit));

	//> chargement des trucs en vue (monstres, trolls, etc.).
	var $tables = {};

	var findTable = function(key) {
		var $t = $('#mh_vue_hidden_' + key + ' table');
		$t.detach();
		$tables[key] = $t;
		$t.attr("id", "table_" + key); // plus facile pour les récupérer ailleurs plus tard
	}
	findTable('monstres');
	findTable('trolls');
	findTable('tresors');
	findTable('champignons');
	findTable('lieux');
	findTable('cadavre');
	findTable('murs');

	Chrall_analyseMonsterTable($tables['monstres']);
	Chrall_analyseTrollTable($tables['trolls']);
	Chrall_analyseObjectTable($tables['tresors']);
	Chrall_analyseMushroomTable($tables['champignons']);
	Chrall_analysePlaceTable($tables['lieux']);
	Chrall_analyseCenotaphTable($tables['cadavre']);
	if (horizontalViewLimit > 0) Chrall_analyseWallTable($tables['murs']); // Si on est aveugle, on sait que les infos des murs et couloirs sont incorrectes

	chrall.addActionPointDistance($tables['monstres'], 0, 3);
	chrall.addActionPointDistance($tables['trolls'], 1, 7);
	chrall.addActionPointDistance($tables['tresors'], 0, 3);
	chrall.addActionPointDistance($tables['champignons'], 0, 2);
	chrall.addActionPointDistance($tables['lieux'], 0, 3);
	chrall.addActionPointDistance($tables['cadavre'], 0, 3);

	//> on regarde si la case du joueur est encombrée
	// Au passage, comme ça sert plus loin on construit la liste des trésors de cette case
	player.cellIsFree = true;
	objectsOnPlayerCell = new Array();
	var cell = grid.getCellOrNull(player.x, player.y);
	if (cell) {
		if (cell.trolls) {
			for (var i = 0; i < cell.trolls.length; i++) {
				if (cell.trolls[i].z === player.z) {
					player.cellIsFree = false;
					break;
				}
			}
		}
		if ((!player.cellIsFree) && (cell.monsters)) {
			for (var i = 0; i < cell.monsters.length; i++) {
				if (cell.monsters[i].z === player.z) {
					player.cellIsFree = false;
					break;
				}
			}
		}
		if (cell.objects) {
			for (var i = 0; i < cell.objects.length; i++) {
				if (cell.objects[i].z === player.z) {
					objectsOnPlayerCell.push(cell.objects[i]);
				}
			}
		}
	}
	;

	//> on détermine la zone visible 
	xmin = player.x - horizontalGridLimit;
	xmax = player.x + horizontalGridLimit;
	ymin = player.y - horizontalGridLimit;
	ymax = player.y + horizontalGridLimit;
	return $tables;
}
