"use strict";

(function(chrall){
	chrall.makeDeLink = function(x, y, z){
		var p = chrall.player();
		var cost = (p.cellIsFree ? 1 : 2) + (z === p.z ? 0 : 1);
		if (cost > p.pa) return '';
		return '<a class=chrall_de x=' + (x - p.x) + ' y=' + (y - p.y) + ' z=' + (z - p.z) + '>DE ' + x + ' ' + y + ' ' + z + '</a>';
	};

	/**
	 * construit la ligne de boites à cocher permettant de filtrer la grille
	 */
	chrall.makeFiltersHtml = function(){
		var	horizontalViewLimit = chrall.horizontalViewLimit,
			viewFilters = chrall.viewFilters,
			player = chrall.player();
		var html = '';
		html += "<form class=gridFiltersForm>";
		if (player.totalSight > 5) {
			html += '<img title="Centre la vue sur votre troll" id=goto_player class=butt src="' + chrome.extension.getURL("player_target.png") + '">';
			html += "Horizon : <select id=viewRedux>";
			html += "<option value=" + horizontalViewLimit + ">Actuel (vue de " + horizontalViewLimit + ")</option>";
			if (horizontalViewLimit != 4 && player.totalSight > 4) {
				html += "<option value=4>Intime (vue de 4)</option>";
			}
			if (horizontalViewLimit != 6 && player.totalSight > 6) {
				html += "<option value=6>Proche (vue de 6)</option>";
			}
			if (horizontalViewLimit != 8 && player.totalSight > 8) {
				html += "<option value=8>Ordinaire (vue de 8)</option>";
			}
			if (horizontalViewLimit != 12 && player.totalSight > 12) {
				html += "<option value=12>Lointain (vue de 12)</option>";
			}
			if (horizontalViewLimit != 20 && player.totalSight > 20) {
				html += "<option value=20>Très lointain (vue de 20)</option>";
			}
			if (horizontalViewLimit != player.totalSight) {
				html += "<option value=" + player.totalSight + ">Max (vue de " + player.totalSight + ")</option>";
			}
			html += "</select> &nbsp;";
		}
		for (var key in viewFilters) {
			html += "<span><input type=checkbox id='" + key + "'";
			if (viewFilters[key]) html += " checked";
			html += "><label for='" + key + "'>" + key + "</label></span>";
			(function(key){
				$(document).on('change', '#' + key, function(e){
					localStorage['grid_filter_' + key] = this.checked ? 'inline' : 'none';
					chrall.gridChangeDisplayByName(key, this.checked ? 'inline' : 'none', true);
				});
			})(key);
		}
		html += "</form>";
		return html;
	};

	function compactText(name, maxLength){
		name = null == name ? "" : name.trim();
		if (maxLength < name.length) {
			name = name.substr(0, maxLength) + "..";
		}
		return  name;
	}

	function monsterName(compactNames, maxLength, monsterCell){
		if (!compactNames) {
			return monsterCell.fullName;
		}
		var name = monsterCell.name;
		return compactText(name, maxLength);
	}

	function distanceStyle(verticalDistanceHint, z){
		if (!verticalDistanceHint) {
			return "";
		}
		var distance = Math.abs(chrall.player().z - z);
		distance = Math.min(15, distance);
		var fontSize = 110 - 3 * distance;
		return "font-size:" + fontSize + "%;";
	}

	function addPosition(thing, attributes){
		attributes.x = thing.x;
		attributes.y = thing.y;
		attributes.z = thing.z;
	}

	function addCurrentPlayer($cell){
		var player = chrall.player();
		var attributes = {
			id:      player.id,
			text:    player.z + ':Vous êtes ici',
			'class': 'ch_player',
			href:    'javascript:EPV(' + player.id + ');'
		};
		addPosition(player, attributes);
		if (player.isIntangible) attributes.intangible = 1;
		var $a = $("<a/>", attributes);
		$("<div/>").append($a).appendTo($cell);
		$cell.attr("id", 'cellp0p0');
		chrall.cdb.getTroll(player.id, function(t){
			if (t && t.team) {
				$a.attr('team', player.team = t.team);
			}
		});
	}

	function append3D($cell, attributes, differentLevel, actions, icons){
		// TODO : span name = 3D // TODO plus tard name ==> class
		var $a = $("<a/>", attributes);
		var $div = $("<div/>");
		if (differentLevel) {
			$div.append($("<span/>", {name: "3D"}));
		}
		$cell.append($div.append($a));
		if (actions) {
			$div.prepend(actions);
		}
		if (icons) {
			$div.append(icons);
		}
		return $a;
	}

	function addTrolls(cell, $cell, noteRequest, horizontalDist, verticalDistanceHint, compactNames, maxLength){
		var player = chrall.player();
		cell.trolls.forEach(function(troll){
			noteRequest.NumTrolls.push(troll.id);
			var differentLevel = player.z != troll.z;
			var raceLetter = /Darkling/i.test(troll.race) ? "G" : troll.race[0];
			var attributes = {
				id:      troll.id,
				text:    troll.z + ": " + (compactNames ? compactText(troll.name, maxLength) : troll.name) + " " + raceLetter + troll.level,
				class: 'ch_troll',
				href:    'javascript:EPV(' + troll.id + ');',
				style:   distanceStyle(verticalDistanceHint, troll.z),
				message: "en X=" + troll.x + " Y=" + troll.y + " Z=" + troll.z + "<br>Distance horizontale : " + horizontalDist + " (" + chrall.distanceFromPlayer(troll.x, troll.y, troll.z) + " PA)<br>" + chrall.getPxOnKill(troll.level)
			};
			addPosition(troll, attributes);
			if (troll.team) attributes.team = troll.team;
			if (troll.isIntangible) attributes.intangible = 1;
			var $a = append3D($cell, attributes, differentLevel, troll.actions, troll.icons);
			chrall.cdb.getTroll(troll.id, function(t){
				if (t && t.team) $a.attr('team', t.team);
			});
		});
	}

	function computeMonsterStacks(cell, monstersByLevel, compactNames, maxLength){
		for (var i = 0; i < cell.monsters.length; i++) {
			var monster = cell.monsters[i];
			var z = monster.z;
			monstersByLevel[z] = monstersByLevel[z] || [];
			monstersByLevel[z].push(monster);
		}
		// Group each pack of monsters on a level into sub-packs
		for (var level in monstersByLevel) {
			var monstersOnLevel = monstersByLevel[level];
			monstersOnLevel.sort(chrall.cellNameComparator);
			monstersByLevel[level] = [];
			var previousName = "";
			var pack = [];
			for (i = 0; i < monstersOnLevel.length; i++) {
				monster = monstersOnLevel[i];
				var name = monsterName(compactNames, maxLength, monster);
				if (name != previousName) {
					if (0 < pack.length) {
						monstersByLevel[level].push(pack);
					}
					pack = [];
					previousName = name;
				}
				pack.push(monster);
			}
			if (0 < pack.length) {
				monstersByLevel[level].push(pack);
			}
		}
	}

	function monsterAttributes(monster, compactNames, maxLength, verticalDistanceHint, horizontalDistance){
		var attributes = {
			id:      monster.id,
			name: monster.isGowap ? 'gowaps' : 'monstres',
			'class': monster.isGowap ? 'ch_gowap' : 'ch_monster',
			text:    monster.z + ": " + monsterName(compactNames, maxLength, monster),
			href:    'javascript:EMV(' + monster.id + ',750,550);',
			style:   distanceStyle(verticalDistanceHint, monster.z),
			message: monster.fullName + ' ( ' + monster.id + ' ) en X=' + monster.x + ' Y=' + monster.y + ' Z=' + monster.z + '<br>Distance horizontale : ' + horizontalDistance + " (" + chrall.distanceFromPlayer(monster.x, monster.y, monster.z) + " PA)"
		};
		return attributes;
	}

	function addMonsters(cell, $cell, noteRequest, horizontalDistance, verticalDistanceHint, compactNames, maxLength){
		var player = chrall.player();
		var compactMonsterStacks = chrall.isOptionEnabled('view-grid-compact-monster-stacks', true);
		var monstersByLevel = {};
		if (compactMonsterStacks) {
			computeMonsterStacks(cell, monstersByLevel, compactNames, maxLength);
			for (var level in monstersByLevel) {
				var differentLevel = player.z != level;
				var packs = monstersByLevel[level];
				for (var i = 0; i < packs.length; i++) {
					var list = packs[i];
					var merge = list.length >= 2;
					var $monsterContainer = $cell;
					if (merge) {
						var monsterFromPack = list[0];
						var divName = "monsters_" + Math.random();
						var isGowap = monsterFromPack.isGowap;
						var isTameGowap = isGowap && 0 < monsterFromPack.fullName.indexOf("Apprivoi");
						var mergeAttributes = {
							name: isGowap ? 'gowaps' : 'monstres',
							'class': isGowap ? 'ch_gowap ch_monster_toggler' : 'ch_monster ch_monster_toggler',
							text:       level + ': ' + (isTameGowap ? " Gowaps" : monsterName(compactNames, maxLength, monsterFromPack)) + ' [' + list.length + ']',
							style:      distanceStyle(verticalDistanceHint, level),
							toggleName: divName
						};
						var extendedList = $("<div/>", {name: divName, 'class': 'hiddenDiv'});
						$monsterContainer = extendedList;
						append3D($cell, mergeAttributes, differentLevel);
						$cell.append(extendedList);
					}
					for (var j = 0; j < list.length; j++) {
						var monster = list[j];
						differentLevel = player.z != monster.z;
						noteRequest.NumMonstres.push(monster.id);
						var attributes = monsterAttributes(monster, compactNames, maxLength, verticalDistanceHint, horizontalDistance);
						addPosition(monster, attributes);
						if (!monster.isGowap) attributes.nom_complet_monstre = monster.fullName;
						append3D($monsterContainer, attributes, differentLevel, monster.actions, monster.icons);
					}
				}
			}
		} else {
			for (i = 0; i < cell.monsters.length; i++) {
				monster = cell.monsters[i];
				differentLevel = player.z != monster.z;
				noteRequest.NumMonstres.push(monster.id);
				attributes = monsterAttributes(monster, compactNames, maxLength, verticalDistanceHint, horizontalDistance);
				addPosition(monster, attributes);
				if (!monster.isGowap) attributes.nom_complet_monstre = monster.fullName;
				append3D($cell, attributes, differentLevel, monster.actions, monster.icons);
			}
		}

	}

	function addPlaces(cell, $cell, verticalDistanceHint, compactNames, maxLength){
		var hasHole = false;
		for (var i = 0; i < cell.places.length; i++) {
			var place = cell.places[i];
			if (place.isHole) {
				hasHole = true;
			} else {
				var differentLevel = chrall.player.z != place.z;
				var attributes = {
					id:      place.id,
					name:    'lieux',
					'class': 'ch_place',
					text:    place.z + ": " + (compactNames ? compactText(place.name, maxLength) : place.name),
					bub:     place.id + ":" + place.name,
					style:   distanceStyle(verticalDistanceHint, place.z)
				};
				addPosition(place, attributes);
				if (place.hasLink) attributes.href = 'javascript:Enter(\'/mountyhall/View/TaniereDescription.php?ai_IDLieu=' + place.id + ',750,550);';
				append3D($cell, attributes, differentLevel, place.actions);
			}
		}
		return hasHole;
	}

	function addMushrooms(cell, $cell, verticalDistanceHint){
		for (var i = 0; i < cell.mushrooms.length; i++) {
			var mushRoom = cell.mushrooms[i];
			var differentLevel = chrall.player.z != mushRoom.z;
			var attributes = {
				name:    'champignons',
				'class': 'ch_mushroom',
				text:    mushRoom.z + ": " + mushRoom.name,
				style:   distanceStyle(verticalDistanceHint, mushRoom.z)
			};
			addPosition(mushRoom, attributes);
			append3D($cell, attributes, differentLevel);
		}
	}

	function addCenotaphs(cell, verticalDistanceHint, $cell){
		for (var i = 0; i < cell.cenotaphs.length; i++) {
			var cenotaph = cell.cenotaphs[i];
			var differentLevel = chrall.player.z != cenotaph.z;
			var attributes = {
				name:    'cénotaphes',
				'class': 'ch_cenotaph',
				text:    cenotaph.z + ": " + cenotaph.name,
				style:   distanceStyle(verticalDistanceHint, cenotaph.z),
				href:    'javascript:EPV(' + cenotaph.trollId + ');'
			};
			addPosition(cenotaph, attributes);
			append3D($cell, attributes, differentLevel);
		}
	}

	function addWalls(cell, $cell){
		// S'il y a un mur, c'est probablement qu'on est dans un labyrinthe et que la vue est limitée à 1.
		// On va donc se permettre d'afficher toutes les cases de la même taille pour que ce soit plus joli.
		// Pour bien faire, il faudrait fixer initialement la taille des cases à une certaine taille si on est dans un labyrinthe.
		// Ainsi, tout se centrerait bien sans souci. (Là c'est un peu tard pour le faire, y a un peu de bidouille...)
		// On va aussi mettre une image de mur en arrière fond pour les cases qui en sont
		// A noter qu'on se limite au minimum, mais je pense que ça suffit pour Chrall.
		// (Dans la version normale toujours accessible dans l'onglet murs et couloirs d'ailleurs, il y a des images de trolls, de lieux, ...)
		for (var i = 0; i < cell.walls.length; i++) {
			var wall = cell.walls[i];
			if (wall.name == "Mur") {
				//On met une image de mur en background et on n'affiche rien dans la case, chrall suffit pour obtenir les coordonnées.
				$cell.append($("<div/>", {style: "background-image:url(https://games.mountyhall.com/mountyhall/View/IMG_LABY/mur.gif);background-repeat:repeat;min-height:160;min-width:160"}));
			} else {
				// Compte le nombre d'éléments dans la case. L'utilité sera d'estimer plus ou moins la hauteur de la case en fonction de ce qu'elle contient.
				// On aurait pu le faire avec un compteur tout au long du parcours global des éléments, mais comme l'utilité sera très spécifique au labyrinthe, autant le faire ici.
				var elementsNumber = 0;
				if (cell.trolls) elementsNumber += cell.trolls.length;
				if (cell.monsters) elementsNumber += cell.monsters.length;
				if (cell.places) elementsNumber += cell.places.length;
				if (cell.objects) elementsNumber += cell.objects.length;
				if (cell.mushrooms) elementsNumber += cell.mushrooms.length;
				if (cell.cenotaphs) elementsNumber += cell.cenotaphs.length;

				// On affiche le couloir dans un div dont la hauteur est relative au nombre d'éléments dans cette case.
				// C'est très approximatif, clairement pas au pixel prêt, mais ça permet plus ou moins de garder des cases carrées tant qu'il n'y a pas trop déléments dedans.
				// (Par exemple, ça ne prend pas en compte qu'un élément est affiché ou non pour définir la hauteur de base.)
				// A noter qu'avec ce fonctionnement, les éléments d'un couloir sont listés en haut de la case, et en sont donc plus centrés.
				// Je n'affiche pas le z de profondeur avant le mot couloir. Un labyrinthe est plat, et de toute façon on a encore l'info pour tous les autres trucs de la vue, notamment soi-même dans la case centrale.
				var minHeight = Math.max(0, 160 - elementsNumber * 20);
				var $div = $("<div/>", {style: 'align:center;min-width:160;min-height:' + minHeight});
				$div.append($("<a/>", {style: 'align:center;color:#969696', name: 'murs', 'class': 'ch_wall', text: wall.name}));
				$cell.append($div);
			}
		}
	}

	function addObjects(cell, $cell, x, y, orderItemsByType, verticalDistanceHint, compactNames, maxLength){
		// on regroupe les objets par étage et pour chaque étage on les compte afin de ne pas afficher des milliers de lignes quand une tanière est écroulée
		var objectsByLevel = {};
		var player = chrall.player();
		for (var i = 0; i < cell.objects.length; i++) {
			var object = cell.objects[i];
			objectsByLevel[object.z] = objectsByLevel[object.z] ? objectsByLevel[object.z] : [];
			objectsByLevel[object.z].push(object);
		}
		for (var level in objectsByLevel) {
			var differentLevel = player.z != level;
			var list = objectsByLevel[level];
			if (orderItemsByType) list.sort(chrall.cellNameComparator);
			var merge = list.length > 3;
			var $treasureContainer = $cell;
			if (merge) {
				var divName = "objects_" + (x < 0 ? "_" + (-x) : x) + "_" + (y < 0 ? "_" + (-y) : y) + "_" + (-level);
				var mergeAttributes = {
					name:       'trésors',
					'class':    'ch_object ch_objects_toggler',
					text:       level + ': ' + list.length + " trésors",
					style:      distanceStyle(verticalDistanceHint, level),
					toggleName: divName
				};
				var extendedList = $("<div/>", {name: divName, 'class': 'hiddenDiv'});
				$treasureContainer = extendedList;
				append3D($cell, mergeAttributes, differentLevel);
				$cell.append(extendedList);
			}
			for (var j = 0; j < list.length; j++) {
				var treasure = list[j];
				var attributes = {
					id:      treasure.id,
					name:    'trésors',
					'class': 'ch_object',
					bub:     treasure.id + " : " + treasure.name,
					text:    treasure.z + ": " + (compactNames ? compactText(treasure.name, maxLength) : treasure.name),
					style:   distanceStyle(verticalDistanceHint, level) + 'display:inline;'
				};
				addPosition(treasure, attributes);
				if (treasure.hasLink) attributes.href = "javascript:Enter('/mountyhall/View/TresorHistory2.php?ai_IDTresor=" + treasure.id + "',750,500);";
				append3D($treasureContainer, attributes, differentLevel, treasure.actions);
			}
		}
	}

	// Dans le cas où des erreurs d'analyse indiqueraient que la grille n'est pas bonne, on affiche un div de warning,
	//  construit par cette fonction
	chrall.makeGridErrorDiv = function($holder){
		var grid = chrall.grid;
		if (!grid.outOfGrid.length) return;
		var m = {};
		grid.outOfGrid.forEach(function(o){
			if (o instanceof chrall.Troll) m.troll=(m.troll||0)+1;
			else if (o instanceof chrall.Monster) m.monstre=(m.monstre||0)+1;
			else throw new Error("Hein ? Y a aut'chose ? Faut mettre à jour makeGridErrorDiv.");
		});
		var txt = "Erreur d'affichage pour "+
			Object.keys(m)
			.filter((k) => m[k])
			.map((k) => m[k]+' '+k+(m[k]>1?'s':''))
			.join(' et ')
			+ ".\nRéférez-vous aux tables plutôt qu'à la grille.";
		$('<div>').text(txt).prependTo($holder).css({
			background: 'red', color: 'white', opacity: 0.55,
			padding: '10px', borderRadius: '10px',
			pointerEvents: 'none',
			position: 'fixed', top: 100, left: 20, zIndex: 42
		});
	}

	/**
	 * construit le HTML de la grille. Ce HTML est construit une fois pour toute, le filtrage opérant via des modifications de style.
	 *
	 * Cette fonction n'est utilisée que pour la grille de la vue principale, pas pour les vues "zoom" qui proviennent du serveur chrall.
	 *
	 * Remplit au passage un objet contenant des infos sur ce qui est visible (pour les notes)
	 */
	chrall.makeGrid = function(noteRequest){
		var	player = chrall.player(),
			grid = chrall.grid;
		var orderItemsByType = chrall.isOptionEnabled("view-sort-items-per-type");
		noteRequest.NumTrolls = [];
		noteRequest.NumMonstres = [];
		noteRequest.XMin = chrall.xmin;
		noteRequest.XMax = chrall.xmax;
		noteRequest.YMin = chrall.ymin;
		noteRequest.YMax = chrall.ymax;
		noteRequest.ZMin = chrall.zmin;
		noteRequest.ZMax = chrall.zmax;

		var $gridTable = $("<table/>", {id: 'grid', 'class': 'grid'});
		var $tr = $("<tr/>");
		$gridTable.append($tr);
		$tr.append($("<td/>", {bgcolor: "#BABABA"}));
		$tr.append($("<td/>", {colspan: chrall.xmax - chrall.xmin + 3, align: 'center', text: 'Nordhikan (Y+)'}));
		$tr.append($("<td/>", {bgcolor: "#BABABA"}));

		$tr = $("<tr/>").appendTo($gridTable);
		$tr.append(
			$("<td/>", {rowspan: chrall.ymax - chrall.ymin + 3, style: 'min-width:1em'})
			.append($("<span/>", {
				style: 'display:block;-webkit-transform:rotate(-90deg);margin-left:-30px;margin-right:-30px;',
				text: 'Oxhykan (X-)'
			}))
		)
		.append(
			$("<td/>", {align: 'center', height: 30, width: 30, text: 'y\\x'})
		);

		var x, y;
		for (x = chrall.xmin; x <= chrall.xmax; x++) {
			$tr.append($("<td/>", {class: 'grad', text: x}));
		}
		$tr.append(
			$("<td/>", {align: 'center', height: 30, width: 30, text: 'x/y'})
		);
		$tr.append(
			$("<td/>", {rowspan: chrall.ymax - chrall.ymin + 3, style: 'min-width:1em'})
			.append($("<span/>", {style: 'display:block;-webkit-transform:rotate(90deg);margin-left:-30px;margin-right:-30px;', text: 'Orhykan (X+)'}))
		);

		var compactNames = chrall.isOptionEnabled('view-grid-compact-names');
		var maxLength = chrall.integerOption('view-grid-compact-names-length', 20);
		var verticalDistanceHint = chrall.isOptionEnabled('view-grid-vertical-distance-hint');
		var coloredCell = chrall.isOptionEnabled('view-display-colored-cell');

		for (y = chrall.ymax; y >= chrall.ymin; y--) {
			$tr = $("<tr/>");
			$gridTable.append($tr);
			$tr.append($("<td/>", { 'class': 'grad', text: y}));

			for (x = chrall.xmin; x <= chrall.xmax; x++) {
				var horizontalDistance = player.horizontalDistance(x, y);
				var cellAttributes = {
					'class': "d" + ((horizontalDistance - chrall.horizontalViewLimit + 20001) % 2),
					grid_x:  x,
					grid_y:  y
				};
				var $cell = $("<td/>", cellAttributes);

				if (coloredCell){
					(function($cell){
						// on va éventuellement colorier la case si un message #chrall set cells dans miaou nous l'a demandé
						chrall.cdb.getCell(x+','+y, function(cell){
							if (cell && cell.team) {
								$cell.attr('team', cell.team);
							}
						});
					})($cell);
				}

				$tr.append($cell);
				if ((chrall.horizontalViewLimit == 0) && ( (player.x != x) || (player.y != y) )) {
					// Si on est aveugle, on indique que les cases autour sont inconnues avec un point d'interrogation.
					// La vue étant minimaliste dans ce cas-là, on peut fixer une taille par défaut pour les cases.
					$cell.uncharted = 1;
				}

				var cell = grid.getCellOrNull(x, y);
				var hasHole = false;
				if (x === player.x && y === player.y) {
					addCurrentPlayer($cell);
				}
				if (cell) {
					if (cell.trolls) {
						addTrolls(cell, $cell, noteRequest, horizontalDistance, verticalDistanceHint, compactNames, maxLength);
					}
					if (cell.monsters) {
						addMonsters(cell, $cell, noteRequest, horizontalDistance, verticalDistanceHint, compactNames, maxLength);
					}
					if (cell.places) {
						hasHole = hasHole || addPlaces(cell, $cell, verticalDistanceHint, compactNames, maxLength);
					}
					if (cell.objects) {
						addObjects(cell, $cell, x, y, orderItemsByType, verticalDistanceHint, compactNames, maxLength);
					}
					if (cell.mushrooms) {
						addMushrooms(cell, $cell, verticalDistanceHint);
					}
					if (cell.cenotaphs) {
						addCenotaphs(cell, verticalDistanceHint, $cell);
					}
					if (cell.walls) {
						addWalls(cell, $cell);
					}
				}

				var deRange = player.z === 0 ? 2 : 1;
				var cellIsAccessibleByDe = x >= player.x - deRange && x <= player.x + deRange && y >= player.y - deRange && y <= player.y + deRange;

				if (0 < $cell.size() || cellIsAccessibleByDe) $cell.attr('hasContent', 1);
				if (hasHole) $cell.prepend($("<span/>", {'class': 'ch_place', text: 'Trou de Météorite'}));
			}
			$tr.append($("<td/>", { 'class': 'grad', text: y}));
		}

		$tr = $("<tr/>");
		$gridTable.append($tr);
		$tr.append($("<td/>", {align: 'center', height: 30, width: 30, text: 'y/x'}));
		for (x = chrall.xmin; x <= chrall.xmax; x++) {
			$tr.append($("<td/>", {class: 'grad', text: x}));
		}
		$tr.append($("<td/>", {align: 'center', height: 30, width: 30, text: 'x\\y'}));

		$tr = $("<tr/>");
		$gridTable.append($tr);
		$tr.append($("<td/>", {bgcolor: "#BABABA"}));
		$tr.append($("<td/>", {colspan: chrall.xmax - chrall.xmin + 3, align: 'center', text: 'Mydikan (Y-)'}));
		$tr.append($("<td/>", {bgcolor: "#BABABA"}));

		return $gridTable;
	};

	chrall.cellNameComparator = function(a, b){
		return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
	};

	chrall.addTab = function($tabs, href, text, count){
		text = count ? text + " (" + count + ")" : text;
		$tabs.append($("<li/>").append($("<a/>", { href: href}).text(text)));
	};

	chrall.makeTabDiv = function(id){
		var $div = $("<div scroll></div>");
		$div.attr("id", id);
		$div.attr("class", "tab_content");
		return $div;
	};

	chrall.analyseAndReformatView = function(){
		var noteRequest = {};
		$(document.body).css('overflow', 'hidden');

		$('#footer2').remove(); // ce truc là se retrouve maintenant par dessus, je le vire carrément

		//> on analyse la vue
		var	$tables = chrall.analyseView(), // this creates chrall.grid
			grid = chrall.grid;

		//> on vire la frise latérale
		$("td[width='55']").remove();
		//> on vire la bannière "Mounty Hall la terre des trolls" qu'on a vu pendant 5 ans déjà...
		$("#mhBanner").first().remove();
		//> on vire le titre "Ma Vue" et les liens vers les tableaux
		$("table table center").first().remove();
		$('td[height="1000"]').removeAttr('height'); // c'est compliqué souvent de déperversifier les pages MH...

		//> on colle en haut à droite les liens [Refresh] et [Logout]
		$("#mhPlay div:first-child").addClass("floatTopRight");

		//> on reconstruit la vue en répartissant les tables dans des onglets et en mettant la grille dans le premier
		var $tabs = $("<ul/>", {id: "tabs_view", 'class': "tabs", view: "yes"});
		if (chrall.isOptionDisabled('view-disable-grid-view')) {
			chrall.addTab($tabs, "#tabGrid", "Grille");
		}
		//onglet spécifique pour les murs et couloirs dans les pocket hall de type labyrinthe
		if (chrall.isInLaby) {
			chrall.addTab($tabs, "#tabWalls", "Murs et couloirs");
		}
		chrall.addTab($tabs, "#tabTrolls", "Trolls", grid.nbTrollsInView);
		chrall.addTab($tabs, "#tabMonsters", "Monstres", grid.nbMonstersInView);
		chrall.addTab($tabs, "#tabPlaces", "Lieux", grid.nbPlacesInView);
		chrall.addTab($tabs, "#tabObjects", "Trésors", grid.nbObjectsInView);
		chrall.addTab($tabs, "#tabMushrooms", "Champignons", grid.nbMushroomsInView);
		chrall.addTab($tabs, "#tabCenotaphs", "Cénotaphes", grid.nbCenotaphsInView);
		chrall.addTab($tabs, "#tabSettings", "Réglages");


		// temporary removal, will be totally gone if nobody complains
		//if (!chrall.hallIsAccro()) {
		//	chrall.addTab($tabs, "#tabPartages", "Partages");
		//	chrall.addTab($tabs, "#tabRecherche", "Recherche");
		//}
		var $tabContainer = $("<div/>", { 'class': "tab_container", view: "yes"});
		$("table.mh_tdborder").first().parent().parent().prepend($tabs);
		$tabContainer.insertAfter($tabs);

		if (chrall.isOptionDisabled('view-disable-grid-view')) {
			var $tabGrid = $("<div/>", { id: "tabGrid", 'class': "tab_content"}).html(chrall.makeFiltersHtml());
			var $holder = $("<div/>", { id: "grid_holder"});
			$holder.append(chrall.makeGrid(noteRequest));
			chrall.makeGridErrorDiv($holder);
			$tabGrid.append($holder);
			$tabContainer.append($tabGrid);
		}

		if (chrall.isInLaby) $tabContainer.append(chrall.makeTabDiv("tabWalls"));
		$tabContainer.append(chrall.makeTabDiv("tabTrolls"));
		$tabContainer.append(chrall.makeTabDiv("tabMonsters"));
		$tabContainer.append(chrall.makeTabDiv("tabPlaces"));
		$tabContainer.append(chrall.makeTabDiv("tabObjects"));
		$tabContainer.append(chrall.makeTabDiv("tabMushrooms"));
		$tabContainer.append(chrall.makeTabDiv("tabCenotaphs"));
		$tabContainer.append(chrall.makeTabDiv("tabSettings"));
		if (!chrall.hallIsAccro()) {
			//$tabContainer.append(chrall.makeTabDiv("tabPartages"));
			//$tabContainer.append(chrall.makeTabDiv("tabRecherche"));
			if (chrall.isInLaby) {
				$tabContainer.append(chrall.makeTabDiv("tabWalls"));
			}
		}




		$("#tabSettings").append(document.getElementsByName("LimitViewForm")[0]); // on déplace le formulaire de limitation de vue, avec la table qu'il contient (c'est tables[0] mais on a besoin du formulaire pour que les boutons fonctionnent)
		// onglet spécifique pour les murs et couloirs dans les pocket hall de type labyrinthe
		if (chrall.isInLaby) $("#tabWalls").append($tables['murs']);
		$("#tabMonsters").append($tables['monstres']);
		$("#tabTrolls").append($tables['trolls']);
		$("#tabObjects").append($tables['tresors']);
		$("#tabMushrooms").append($tables['champignons']);
		$("#tabPlaces").append($tables['lieux']);
		$("#tabCenotaphs").append($tables['cadavres']);
		if (!chrall.hallIsAccro()) {
			$("#tabPartages").append(chrall.makePartageTables());
			chrall.makeSearchPanel($("#tabRecherche"));
		}
		$(".tab_content").hide();

		var $tabs_view = $("#tabs_view");
		$tabs_view.find("li:first").addClass("active").show();
		$(".tab_content:first").show();
		var changeTab = function($tab){
			chrall.hideOm(); // fermeture des éventuels objectMenus de la grille
			$("#tabs_view").find("li").removeClass("active");
			$tab.addClass("active");
			$(".tab_content").hide();
			var activeTab = $tab.find("a").attr("href");
			window.scroll(0, 0);
			$(activeTab).fadeIn("fast");
		};
		$tabs_view.find("li").click(function(){
			changeTab($(this));
		});
		// on corrige les liens internes, pour qu'ils agissent sur les onglets
		$('a[href$="#monstres"]').click(function(){
			changeTab($('#tabs_view').find('a[href="#tabMonsters"]').parent());
		});
		$('a[href$="#trolls"]').click(function(){
			changeTab($('#tabs_view').find('a[href="#tabTrolls"]').parent());
		});
		$('a[href$="#tresors"]').click(function(){
			changeTab($('#tabs_view').find('a[href="#tabObjects"]').parent());
		});
		$('a[href$="#champignons"]').click(function(){
			changeTab($('#tabs_view').find('a[href="#tabMushrooms"]').parent());
		});
		$('a[href$="#lieux"]').click(function(){
			changeTab($('#tabs_view').find('a[href="#tabPlaces"]').parent());
		});
		$('a[href$="#cadavre"]').click(function(){
			changeTab($('#tabs_view').find('a[href="#tabCenotaphs"]').parent());
		});

		var $grid_holder = $('#grid_holder');
		$grid_holder.dragscrollable({dragSelector: '#grid'});

		//> on applique les réglages de filtrages de la fois précédente
		for (var key in chrall.viewFilters) {
			var display = localStorage['grid_filter_' + key];
			if (display != null) {
				var os = document.getElementsByName(key);
				for (var i = 0; i < os.length; i++) {
					os[i].style.display = display;
				}
				var viewFilter = document.getElementById(key);
				viewFilter.checked = display != "none";
			}
		}

		$(document.body).on('click', '[toggleName]', function(){
			chrall.gridChangeDisplayByName($(this).attr('toggleName'));
		});

		setTimeout(// afin d'accélérer l'affichage initial, on repousse un peu l'ajout des bulles et menus
				function(){
					chrall.gridLive();

					//> bulle popup sur le lien du joueur
					var $grid = $("#grid");
					var link = $grid.find("a.ch_player");
					var trollId = link.attr('id');
					if (trollId == 0) {
						chrall.triggerBubble(link, "Problème. Peut-être avez vous mis à jour Chrall sans rouvrir la session MH. Utilisez le bouton 'Refresh' de MH.", "bub_player");
					} else {
						chrall.triggerBubble(link, '', "bub_player", chrall.serveurPublic() + "json?action=get_troll_info&trollId=" + trollId, trollId);
					}

					//> on met un popup sur les trésors et les endroits pour afficher leur numéro (utile pour le pilotage de gowap)
					$grid.find("a.ch_object, a.ch_place").each(
							function(){
								var o = $(this);
								var text = o.attr("bub");
								if (text) {
									chrall.triggerBubble(o, text, "bub_object");
								} else {
									chrall.triggerBubble(o, "Cliquez pour voir tous ces trésors", "bub_object");
								}
							}
					);

					//> demande de notes
					// dys 20150129 je désactive ce truc là pas utilisé mais lourd
					// chrall.sendToChrallServer('get_notes', {'NoteRequest': noteRequest});
				}, 1000
		);

		//> on outille le select de réduction de vue
		$('#viewRedux').change(function(){
			var limit = $(this).val();
			document.getElementsByName("ai_MaxVue")[0].value = limit;
			document.getElementsByName("ai_MaxVueVert")[0].value = Math.ceil(limit / 2);
			$('form[name="LimitViewForm"]').submit();
		});

		var $gridHolder = $grid_holder;
		var $playerCell = $('#cellp0p0');
		var gotoPlayer = function(){
			chrall.hideOm();
			chrall.scrollInProgress = true;
			$gridHolder.animate(
				{
					scrollLeft: ($gridHolder.scrollLeft() + $playerCell.offset().left + ($playerCell.innerWidth() - window.innerWidth) / 2),
					scrollTop:  ($gridHolder.scrollTop() + $playerCell.offset().top + ($playerCell.innerHeight() - window.innerHeight) / 2)
				},
				'slow',
				function(){
					chrall.scrollInProgress = false;
				}
			);
		};
		//> on centre la vue sur la cellule du joueur
		if (chrall.isOptionDisabled('view-disable-grid-view')) {
			setTimeout(gotoPlayer, 100);
		}
		//> bouton de centrage
		$('#goto_player').click(gotoPlayer);
		//> hook pour le centrage au double-clic
		$('#grid').dblclick(gotoPlayer);

		// On corrige si nécessaire la position affichée dans le menu de gauche et on signale
		// cette position au serveur Chrall
		chrall.updateTroll();
	}

})(window.chrall = window.chrall || {});



