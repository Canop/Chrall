/**
 * ce fichier contient les fonctions d'analyse de la vue reçue de MH.
 */

  
function Chrall_analyseMonsterTable(monsterTable) {
	var rows = monsterTable.find("tr");
	for (var r=1; r<rows.length; r++) {
		var $tr = $(rows[r]);
		var cells = $tr.find("td");
		var monster = new Monster();
		var i=1;
		monster.id = parseInt($(cells[i++]).text());
		monster.setName($(cells[i++]).text());
		monster.x = parseInt($(cells[i++]).text());
		monster.y = parseInt($(cells[i++]).text());
		monster.z = parseInt($(cells[i++]).text());
		grid.getCellNotNull(monster.x, monster.y).addMonster(monster);
		grid.nbMonstersInView++;		
	}
}

function Chrall_analyseTrollTable(table) {
	// en même temps qu'on analyse la table, on ajoute les cases à cocher
	// de sélection des trolls pour l'envoi de MP.
	var rows = table.find("tr");
	for (var r=1; r<rows.length; r++) {
		var $tr = $(rows[r]);
		var troll = new Troll();
		var cells = $tr.find("td");
		var i=1;
		troll.id = parseInt($(cells[i++]).text());
		var cell = $(cells[i++]);
		troll.name = cell.text();
		cell.find('a').attr('id', troll.id).attr('team', troll.pogoTeam = getPogoTeam(troll.id));
		troll.isIntangible = cell.html().indexOf("mh_trolls_0")>=0; // les trolls intangibles sont marqués par le style 'mh_trolls_0' au lieu de 'mh_trolls_1'
		troll.level = $(cells[i++]).text();
		troll.race = $(cells[i++]).text();
		troll.guilde = $(cells[i++]).text();
		troll.x = parseInt($(cells[i++]).text());
		troll.y = parseInt($(cells[i++]).text());
		troll.z = parseInt($(cells[i++]).text());
		grid.getCellNotNull(troll.x, troll.y).addTroll(troll);
		grid.nbTrollsInView++;
		$tr.prepend('<td align=center><input type=checkbox name=cb_troll value='+troll.id+'></td>'); // TODO : sur les grosses tables on pourrait peut-être envisager un detach() ?
	}
	//$(rows[2]).prepend($('<td align=center width=20></td>'));
	var html='<td colspan=11 height=25><script>';
	html += 'function mhmp(cat){';
	html += ' var dests=[];  var cbs = document.getElementsByName(\'cb_troll\');';
	html += ' for (var i=0; i<cbs.length; i++) {if(cbs[i].checked) dests.push(cbs[i].value)}';
	html += ' document.location.href=\'../Messagerie/MH_Messagerie.php?cat=\'+cat+\'&dest=\'+dests.join("%2C");';
	html += '}</script><b>TROLLS</b> <a class=gogo href="javascript:mhmp(3);">Envoyer un message</a>';
	if (player.sessionActive) html += ' <a class=gogo href="javascript:mhmp(8);">Partager des px</a>';
	html += ' <a class=gogo href="javascript:localStorage[\'tab_view\']=\'tabTrolls\';document.location.href=\''+ chrall.pageName() +'\';">Rafraichir</a>';
	html += '</td>';
	$(rows[0]).html(html);
}

function Chrall_analyseMushroomTable(table) {
	table.find("tr.mh_tdpage").each(
		function(){
			var thing = new Thing();
			var cells = $(this).find("td");
			var i=1;
			thing.name = $(cells[i++]).text();
			thing.x = parseInt($(cells[i++]).text());
			thing.y = parseInt($(cells[i++]).text());
			thing.z = parseInt($(cells[i++]).text());
			grid.getCellNotNull(thing.x, thing.y).addMushroom(thing);
			grid.nbMushroomsInView++;
		}
	);
}

function Chrall_analysePlaceTable(table) {
	table.find("tr.mh_tdpage").each(
		function(){
			var thing = new Place();
			var cells = $(this).find("td");
			var i=1;
			thing.id = parseInt($(cells[i++]).text());
			var nameCell = $(cells[i++]);
			thing.hasLink = nameCell.find('a').length>0;
			thing.setName(nameCell.text());
			thing.x = parseInt($(cells[i++]).text());
			thing.y = parseInt($(cells[i++]).text());
			thing.z = parseInt($(cells[i++]).text());
			grid.getCellNotNull(thing.x, thing.y).addPlace(thing);
			grid.nbPlacesInView++;
		}
	);
}

function Chrall_analyseWallTable(table) {
	if (table.length==0) return;
	isInLaby = true;
	table.find("tr.mh_tdpage").each(
		function(){
			var thing = new LabySquare();
			var cells = $(this).find("td");
			thing.id = parseInt($(cells[0]).text());
			var nameCell = $(cells[1]);
			thing.setName(nameCell.text());
			thing.x = parseInt($(cells[2]).text());
			thing.y = parseInt($(cells[3]).text());
			thing.z = parseInt($(cells[4]).text());
			grid.getCellNotNull(thing.x, thing.y).addWall(thing);
		}
	);	
}

function Chrall_analyseObjectTable(table) {
	// optm : cette méthode consomme beaucoup, peut-être l'itération sur les cellules
	// il faudrait peut-être, comme il n'y a pas de vraies recherches, itérer directement sur le DOM
	var lines = table.find("tr.mh_tdpage");
	grid.nbObjectsInView = lines.length;
	for (var l=0; l<grid.nbObjectsInView; l++) {
		var thing = new Thing();
		var cells = $(lines[l]).find("td");
		var i=1;
		thing.id = parseInt($(cells[i++]).text());
		var nameCell = $(cells[i++]);
		thing.name = nameCell.text();
		thing.hasLink = nameCell.find('a').length>0;
		thing.x = parseInt($(cells[i++]).text());
		thing.y = parseInt($(cells[i++]).text());
		thing.z = parseInt($(cells[i++]).text());
		grid.getCellNotNull(thing.x, thing.y).addObject(thing);		
	}
}

function Chrall_analyseCenotaphTable(table) {
	table.find("tr.mh_tdpage").each(
		function(){
			var thing = new Cenotaphe();
			var cells = $(this).find("td");
			var i=1;
			thing.id = parseInt($(cells[i++]).text());
			thing.setName($(cells[i++]).text());
			thing.x = parseInt($(cells[i++]).text());
			thing.y = parseInt($(cells[i++]).text());
			thing.z = parseInt($(cells[i++]).text());
			grid.getCellNotNull(thing.x, thing.y).addCenotaph(thing);
			grid.nbCenotaphsInView++;
		}
	);
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
	
	var findTable=function(key) {
		var $t =  $('#mh_vue_hidden_'+key+' table');
		$t.detach();
		$tables[key]=$t;
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
			for (var i=0; i<cell.trolls.length; i++) {
				if (cell.trolls[i].z===player.z) {
					player.cellIsFree = false;
					break;
				}
			}			
		}
		if ((!player.cellIsFree)&&(cell.monsters)) {
			for (var i=0; i<cell.monsters.length; i++) {
				if (cell.monsters[i].z===player.z) {
					player.cellIsFree = false;
					break;
				}
			}			
		}
		if (cell.objects) {
			for (var i=0; i<cell.objects.length; i++) {
				if (cell.objects[i].z===player.z) {
					objectsOnPlayerCell.push(cell.objects[i]);
				}
			}			
		}
	};
	
	//> on détermine la zone visible 
	xmin = player.x-horizontalGridLimit;
	xmax = player.x+horizontalGridLimit;
	ymin = player.y-horizontalGridLimit;
	ymax = player.y+horizontalGridLimit;
	return $tables;
}
