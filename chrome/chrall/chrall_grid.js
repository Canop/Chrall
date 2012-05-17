// cellule dans la grille (correspond à une colonne du jeu : x et y fixés mais z variable)
function Cell() {
}
Cell.prototype.addPlace = function(o) {
	if (!this.places) this.places = new Array();
	this.places.push(o);
}
Cell.prototype.addWall = function(o) {
	if (!this.walls) this.walls = new Array();
	this.walls.push(o);
}
Cell.prototype.addTroll = function(o) {
	if (!this.trolls) this.trolls = new Array();
	this.trolls.push(o);
}
Cell.prototype.addMonster = function(o) {
	if (!this.monsters) this.monsters = new Array();
	this.monsters.push(o);
}
Cell.prototype.addObject = function(o) {
	if (!this.objects) this.objects = new Array();
	this.objects.push(o);
}
Cell.prototype.addMushroom = function(o) {
	if (!this.mushrooms) this.mushrooms = new Array();
	this.mushrooms.push(o);
}
Cell.prototype.addCenotaph = function(o) {
	if (!this.cenotaphs) this.cenotaphs = new Array();
	this.cenotaphs.push(o);
}


// une grille correspond à la vue passée (et donc de taille (2*vue+1)²)
function Grid(xp, yp, sight) {
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
}

// renvoie la cellule de coordonnées passées.
// Renvoie undefined s'il n'y a rien
Grid.prototype.getCellOrNull = function(x, y) {
	return this.cells[x - this.dx][y - this.dy];
}

// renvoie la cellule de coordonnées passées.
// La crée si elle n'existe pas
Grid.prototype.getCellNotNull = function(x, y) {
	var c = this.cells[x - this.dx][y - this.dy];
	if (!c) {
		c = new Cell();
		this.cells[x - this.dx][y - this.dy] = c;
	}
	return c;
}

// enregistre les modifications 'live' (au sens jquery)
function Chrall_gridLive() {

	// ajout de la fenêtre de zoom et de quelques fonctions
	var html = "<div id=zoom>";
	html += "<a class=gogo style='position:fixed;right:24px;top:24px;' id=btn_close_zoom>Fermer</a>";
	html += "<form class=gridFiltersForm>";
	var key = '3D';
	html += "<span><input type=checkbox id='" + key + "'"; // on va la checker automatiquement à chaque ouverture (voir plus loin)
	html += " onClick=\"chrall.gridChangeDisplayByName('" + key + "', this.checked?'inline':'none', true);\"";
	html += "><label for='" + key + "'>" + key + "</label></span>";
	html += "</form>";
	html += "<div id=zoom_content>En attente de gogochrall...</div></div>";
	$(html).appendTo($('body'));

	//> on ajoute le popup sur les monstres
	function getMonsterArgs(link) {
		var args = {};
		var monsterId = parseInt(link.attr('id'));
		var tokens = link.text().split(':');
		var linkText = tokens[tokens.length - 1].trim();
		var nomMonstre = encodeURIComponent(linkText);
		var imgUrl = getMonsterMhImageUrl(linkText);
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

	//> popup sur les trolls
	function getTrollArgs(link) {
				var trollId = parseInt(link.attr('id'));
				return {
					'ajaxUrl':chrall.serveurPublic() + 'json?action=get_troll_info&asker=' + player.id + '&trollId=' + trollId,
					'ajaxRequestId':trollId
				};
			}
	chrall.bubbleLive(
			'#grid a.ch_troll, div#tabTrolls a.mh_trolls_1, #tabPartages a.mh_trolls_1, #tabRecherche a.mh_trolls_1, #zoom_content a.ch_troll',
			'bub_troll', getTrollArgs);

	//> on ajoute le menu des DE, le titre de chaque cellule
	objectMenuLive('table.grid td[grid_x]', function(o) {
		var x = parseInt(o.attr('grid_x'));
		var y = parseInt(o.attr('grid_y'));
		var links = '';
		// on ajoute au menu la liste des trésors aux pieds du joueur, pas qu'il oublie de les prendre...
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
	$('a.chrall_de').live('click', function() {
		var $this = $(this);
		localStorage['todo'] = 'de';
		localStorage['todo_args'] = $this.attr('x') + ' ' + $this.attr('y') + ' ' + $this.attr('z');
		Chrall_changeLocationOtherFrame('action', '/mountyhall/MH_Play/Play_action.php?ai_ToDo=112&amp;as_Action=ACTION!');
	});

	//> le défilement à la molette perturbe objectMenu
	document.onmousewheel = function(e) {
		hideOm();
	}

	// outillage des liens d'ouvertures de vue "zoom"
	$('a[name="zoom"]').live('click', function() {
		if (chrall.compteChrallActif()) {
			var $link = $(this);
			var x = $link.attr('x');
			var y = $link.attr('y');
			var z = $link.attr('z');
			var url = chrall.serveurPrive() + "vue?asker=" + player.id + "&mdpr=" + chrall.mdpCompteChrall() + "&x=" + x + "&y=" + y + "&z=" + z + "&tresors=1";
			$('#zoom').show();
			$('#zoom_content').load(url, function() {
				setTimeout(function() {
					// centrage de la vue
					hideOm();
					scrollInProgress = true;
					$targetCell = $('#zoom_content').find('td[grid_x="' + x + '"][grid_y="' + y + '"]');
					$grid_holder = $('#zoom');
					$grid_holder.animate(
							{
								scrollLeft: ($grid_holder.scrollLeft() + $targetCell.offset().left + ($targetCell.innerWidth() - window.innerWidth) / 2),
								scrollTop: ($grid_holder.scrollTop() + $targetCell.offset().top + ($targetCell.innerHeight() - window.innerHeight) / 2)
							},
							'slow',
							function() {
								scrollInProgress = false;
							}
					);
				}, 200);
			});
			$('#3D').attr("checked", "checked"); // à chaque ouverture on est en 3D initialement
			$('#zoom').dragscrollable({dragSelector: '#zoom_content'});
		} else {
			alert("Un compte Chrall actif est nécessaire pour utiliser cette fonction.");
		}
	});
	// lien de fermeture de la "fenêtre" de zoom
	$('#btn_close_zoom').live('click', function() {
		$('#zoom').hide();
	});

}

