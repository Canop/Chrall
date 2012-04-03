/**
 * ce fichier contient les fonctions d'analyse de la vue reçue de MH.
 */


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
	/*
	 var $allTables = $("table.mh_tdborder");
	 for (var i=0; i<$allTables.length; i++) {
	 var $table = $($allTables[i]);
	 var tableName = $table.find("a[name]").first().attr("name");
	 if (tableName) {
	 $tables[tableName]=$table;
	 $table.detach(); // grosse accélération. Mais effet de bord : si ça plante on n'a plus rien. Il faudra sans doute que je fasse un gros try/catch et que je m'arrange pour remettre les tables en cas d'exception
	 }
	 }*/

	var findTable = function(key) {
		var $t = $('#mh_vue_hidden_' + key + ' table');
		$t.detach();
		$tables[key] = $t;
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
