"use strict";
var chrall = chrall || {};

// cellule dans la grille (correspond à une colonne du jeu : x et y fixés mais z variable)
function Cell(){
}
Cell.prototype.addPlace = function(o){
	if (!this.places) this.places = [];
	this.places.push(o);
};
Cell.prototype.addWall = function(o){
	if (!this.walls) this.walls = [];
	this.walls.push(o);
};
Cell.prototype.addTroll = function(o){
	if (!this.trolls) this.trolls = [];
	this.trolls.push(o);
};
Cell.prototype.addMonster = function(o){
	if (!this.monsters) this.monsters = [];
	this.monsters.push(o);
};
Cell.prototype.addObject = function(o){
	if (!this.objects) this.objects = [];
	this.objects.push(o);
};
Cell.prototype.addMushroom = function(o){
	if (!this.mushrooms) this.mushrooms = [];
	this.mushrooms.push(o);
};
Cell.prototype.addCenotaph = function(o){
	if (!this.cenotaphs) this.cenotaphs = [];
	this.cenotaphs.push(o);
};


// une grille correspond à la vue passée (et donc de taille (2*vue+1)²)
var Grid = chrall.Grid = function(xp, yp, sight){
	this.sight = sight;
	this.dx = xp - sight;
	this.dy = yp - sight;
	var c = 2 * this.sight + 1;
	this.cells = new Array(c);
	for (var i = 0; i < c; i++) this.cells[i] = new Array(c);
	this.nbPlacesInView = 0;
	this.nbTrollsInView = 0;
	this.nbMonstersInView = 0;
	this.nbObjectsInView = 0;
	this.nbMushroomsInView = 0;
	this.nbCenotaphsInView = 0;
	this.outOfGrid = []; // les trucs qui ne tenaient pas dans la grille (hallucinations)
}

// renvoie la cellule de coordonnées passées.
// Renvoie undefined s'il n'y a rien
Grid.prototype.getCellOrNull = function(x, y){
	return this.cells[x - this.dx][y - this.dy];
};

// renvoie la cellule de coordonnées passées.
// La crée si elle n'existe pas (et qu'elle est dans la grille)
Grid.prototype.getCellNotNull = function(x, y){
	x -= this.dx;
	y -= this.dy;
	if (x<0||x>=this.cells.length||y<0||y>=this.cells.length) {
		console.log("bad coordinates:", x+this.dx, y+this.dy);
		return null; // out of grid
	}
	return this.cells[x][y] || (this.cells[x][y] = new Cell());
};

// enregistre les modifications 'live' (au sens jquery)
chrall.gridLive = function(){

	// ajout de la fenêtre de zoom et de quelques fonctions
	var html = "<div id=zoom>";
	html += "<a class=gogo style='position:fixed;right:24px;top:24px;' id=btn_close_zoom>Fermer</a>";
	html += "<form class=gridFiltersForm>";
	var key = '3D';
	html += "<span><input type=checkbox id='" + key + "'"; // on va la checker automatiquement à chaque ouverture (voir plus loin)
	html += "><label for='" + key + "'>" + key + "</label></span>";
	html += "</form>";
	$('#'+key).change(function(e){
		chrall.gridChangeDisplayByName(key, this.checked?'inline':'none', true);
	});
	html += "<div id=zoom_content>En attente de gogochrall...</div></div>";
	$(html).appendTo('body');

	//> on ajoute le popup sur les monstres
	function getMonsterArgs(link){
		var player = chrall.player();
		var args = {};
		var monsterId = parseInt(link[0].href.replace("javascript:EMV(", ""));
		var tokens = link.text().split(':');
		var linkText = null == link.attr("nom_complet_monstre") ? tokens[tokens.length - 1].trim() : link.attr("nom_complet_monstre").trim();
		var nomMonstre = encodeURIComponent(linkText);
		args.text = link.attr('message');
		if (args.text) {
			var level = parseInt($("#" + monsterId + "_monster").closest("tr").find("td.level").text());
			args.text += "<br>" + chrall.getPxOnKill(level);
		}
		var imgUrl = chrall.getMonsterMhImageUrl(linkText);
		if (imgUrl != null) {
			args.leftCol = "<img class=illus src=\"" + imgUrl + "\">";
		}
		args.ajaxUrl = chrall.serveurPublic() + "json?action=get_extract_jsonp&asker=" + player.id + "&name=" + nomMonstre + "&monsterId=" + monsterId;
		if (chrall.compteChrallActif()) {
			args.ajaxUrl += '&mdpr=' + chrall.mdpCompteChrall();
		}
		args.ajaxRequestId = linkText;
		return args;
	}
	chrall.bubbleLive('a[href*="EMV"]', 'bub_monster', getMonsterArgs);
	chrall.bubbleLive('img.vlc', 'bub_monster', function(){
		return {text: 'Voit le caché !'};
	});
	chrall.bubbleLive('img.projo', 'bub_monster', function(img){
		var damages = chrall.projoDamage(chrall.player().talents["Projectile Magique"].range - img.data('dist'));
		var att = 3.5 * chrall.player().sight.diceNumber + chrall.player().attac.magicalBonus;
		return {text: `<table>
		<tr><td colspan='2' align='center'>Projectile Magique</td></tr>
		<tr><td>Portée</td><td> : ${img.data('dist')}</td></tr>
		<tr><td>Attaque moyenne</td><td> : ${att} (${chrall.player().sight.diceNumber} D6 ${chrall.itoa(chrall.player().attac.magicalBonus)})</td></tr>
		<tr><td>Dégâts moyens</td><td> : ${damages.damage} / ${damages.damageCrit}</td></tr>
		</table>`};
	});
	chrall.bubbleLive('img.mission', 'bub_monster', function (img) {
		return {text: `<div class=bubbleTitle>Mission ${img.data('id')}</div>${chrall.player().missions[img.data('id')].step}`};
	});
	chrall.bubbleLive('img.potion', 'bub_monster', function(img){
		var bv = Math.min(10, (1 - img.data('dist')) * 10 + chrall.player().totalSight);
		var cppc = chrall.player().talents["Lancer de Potions"].mastering + chrall.player().concentration;
		return {text: `<table>
		<tr><td colspan='2' align='center'>Lancer de Potions</td></tr>
		<tr><td>Jet de toucher</td><td> : ${cppc + bv} %</td></tr>
		</table>`};
	});
	$('img.mission').click(function() {
		document.location = `https://games.mountyhall.com/mountyhall/MH_Missions/Mission_Equipe.php?ai_idMission=${$(this).data('id')}`;
	});

	//> popup sur les trolls
	function getTrollArgs(link){
		var player = chrall.player();
		var trollId = parseInt(link.attr('id'));
		return {
			ajaxUrl: chrall.serveurPublic() + 'json?action=get_troll_info&asker=' + player.id + '&trollId=' + trollId,
			text: link.attr('message'),
			ajaxRequestId: trollId
		};
	}
	chrall.bubbleLive(
		'#grid a.ch_troll, div#tabTrolls a.mh_trolls_1, #tabPartages a.mh_trolls_1, #tabRecherche a.mh_trolls_1, #zoom_content a.ch_troll',
		'bub_troll', getTrollArgs
	);

	//> on ajoute le menu des DE, le titre de chaque cellule
	chrall.objectMenuLive('table.grid td[grid_x]', function(o){
		var x = parseInt(o.attr('grid_x'));
		var y = parseInt(o.attr('grid_y'));
		var links = '';
		// on ajoute au menu la liste des trésors aux pieds du joueur, pas qu'il oublie de les prendre...
		var	objectsOnPlayerCell = chrall.objectsOnPlayerCell,
			player = chrall.player();
		if (objectsOnPlayerCell) {
			if (x === player.x && y === player.y) {
				if (objectsOnPlayerCell.length > 4) {
					links += "<span class=ch_pl_object>Il y a " + objectsOnPlayerCell.length + " trésors à vos pieds.</span>";
				} else if (objectsOnPlayerCell.length > 0) {
					links += '<span class=ch_pl_object>A vos pieds :</span>';
					for (var i = 0; i < objectsOnPlayerCell.length; i++) {
						links += '<br><span class=ch_pl_object>' + objectsOnPlayerCell[i].name + '</span>';
					}
				}
			}
		}
		// liste des DE possibles
		if (player.pa > 1 || (player.cellIsFree && player.pa > 0)) {
			var deRange = player.z === 0 ? 2 : 1;
			var cellIsAccessibleByDe = x >= player.x - deRange && x <= player.x + deRange && y >= player.y - deRange && y <= player.y + deRange;
			if (cellIsAccessibleByDe) {
				if (player.z < 0) links += (chrall.makeDeLink(x, y, player.z + 1));
				if (x != player.x || y != player.y) links += (chrall.makeDeLink(x, y, player.z));
				links += (chrall.makeDeLink(x, y, player.z - 1));
			}
		}
		return {
			'html_top':x + ' ' + y,
			'html_bottom':links
		}
	});

	//> outillage des liens DE (du menu de la grille)
	$(document).on('click', 'a.chrall_de', function(){
		var $this = $(this);
		localStorage['todo'] = 'de';
		localStorage['todo_args'] = $this.attr('x') + ' ' + $this.attr('y') + ' ' + $this.attr('z');
		chrall.changeLocationOtherFrame('action', '/mountyhall/MH_Play/Play_action.php?ai_ToDo=112&amp;as_Action=ACTION!');
	});

	//> le défilement à la molette perturbe objectMenu
	document.onmousewheel = function(e){
		chrall.hideOm();
	};

	// outillage des liens d'ouvertures de vue "zoom"
	//$(document).on('click', 'a[name="zoom"]', function(){
	//	var player = chrall.player();
	//	if (chrall.compteChrallActif()) {
	//		var $link = $(this);
	//		var x = $link.attr('x');
	//		var y = $link.attr('y');
	//		var z = $link.attr('z');
	//		var url = chrall.serveurPrive() + "vue?asker=" + player.id + "&mdpr=" + chrall.mdpCompteChrall() + "&x=" + x + "&y=" + y + "&z=" + z + "&tresors=1";
	//		var $zoom = $('#zoom');
	//		$zoom.show();
	//		$('#zoom_content').load(url, function(){
	//			setTimeout(function(){
	//				// centrage de la vue
	//				chrall.hideOm();
	//				chrall.scrollInProgress = true;
	//				var $targetCell = $('#zoom_content').find('td[grid_x="' + x + '"][grid_y="' + y + '"]');
	//				var $grid_holder = $('#zoom');
	//				$grid_holder.animate(
	//					{
	//						scrollLeft: ($grid_holder.scrollLeft() + $targetCell.offset().left + ($targetCell.innerWidth() - window.innerWidth) / 2),
	//						scrollTop: ($grid_holder.scrollTop() + $targetCell.offset().top + ($targetCell.innerHeight() - window.innerHeight) / 2)
	//					},
	//					'slow',
	//					function(){
	//						chrall.scrollInProgress = false;
	//					}
	//				);
	//			}, 200);
	//		});
	//		$('#3D').attr("checked", "checked"); // à chaque ouverture on est en 3D initialement
	//		$zoom.dragscrollable({dragSelector: '#zoom_content'});
	//	} else {
	//		alert("Un compte Chrall actif est nécessaire pour utiliser cette fonction.");
	//	}
	//});
	// lien de fermeture de la "fenêtre" de zoom
	$(document).on('click', '#btn_close_zoom', function(){
		$('#zoom').hide();
	});

}

