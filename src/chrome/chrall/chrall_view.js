var horizontalViewLimit; // l'horizon actuel, inférieur ou égal à la vue maximale
var grid; // la grille. Tout ce qui est visible est stocké là dedans
var objectsOnPlayerCell;

function makeDeLink(x, y, z) {
	var cost = (player.cellIsFree ? 1 : 2) + (z===player.z ? 0 : 1);
	if (cost>player.pa) return '';
	return '<a href="javascript:playDE('+(x-player.x)+','+(y-player.y)+','+(z-player.z)+');">DE '+x+' '+y+' '+z+'</a>';
}

/**
 * construit la ligne de boites à cocher permettant de filtrer la grille
 */
function Chrall_makeFiltersHtml() {
	html = '';
	html += "<form id=gridFiltersForm>";
	if (player.totalSight>5) {
		html += '<img title="Centre la vue sur votre troll" id=goto_player class=butt src="'+chrome.extension.getURL("player_target.png")+'">';
		html += "Horizon : <select id=viewRedux>";
		html += "<option value="+horizontalViewLimit+">Actuel (vue de "+horizontalViewLimit+")</option>";
		if (horizontalViewLimit!=4 && player.totalSight>4) {
			html += "<option value=4>Intime (vue de 4)</option>";
		}
		if (horizontalViewLimit!=6 && player.totalSight>6) {
			html += "<option value=6>Proche (vue de 6)</option>";
		}
		if (horizontalViewLimit!=8 && player.totalSight>8) {
			html += "<option value=8>Ordinaire (vue de 8)</option>";
		}
		if (horizontalViewLimit!=12 && player.totalSight>12) {
			html += "<option value=12>Lointain (vue de 12)</option>";
		}
		if (horizontalViewLimit!=20 && player.totalSight>20) {
			html += "<option value=20>Très lointain (vue de 20)</option>";
		}
		if (horizontalViewLimit!=player.totalSight) {
			html += "<option value="+player.totalSight+">Max (vue de "+player.totalSight+")</option>";
		}		
		html += "</select> &nbsp;";	
	}
	for (var key in viewFilters) {
		html += "<span><input type=checkbox id='"+key+"'";
		if (viewFilters[key]) html += " checked";
		html += " onClick=\"grid_changeDisplayByName('"+key+"', this.checked?'inline':'none');\"";
		html += "><label for='"+key+"'>"+key+"</label></span>";
	}
	html += "</form>";
	return html;
}

/**
 * cette fonction construit le HTML de la grille. Ce HTML est construit une fois pour toute, le filtrage opérant via des modifications de style.
 */ 
function Chrall_makeGridHtml() {
	var grey_closed_png_url = chrome.extension.getURL("grey_closed.png");
	var grey_open_png_url = chrome.extension.getURL("grey_open.png");
	var h=0;
	var html = [];
	html[h++] = "<script>";
	html[h++] = "function playDE(dx, dy, dz){";
	html[h++] = " parent.chrall_de_dx.value=dx;";
	html[h++] = " parent.chrall_de_dy.value=dy;";
	html[h++] = " parent.chrall_de_dz.value=dz;";
	html[h++] = " parent.frames['Action'].location.href='Play_action.php?ai_ToDo=112&amp;as_Action=ACTION!';";
	html[h++] = "";
	html[h++] = "}";
	html[h++] = "</script>";
	
	html[h++] = "<table id=grid class=grid><tbody>";
	html[h++] = "<tr><td bgcolor=#BABABA></td><td colspan=" + (xmax-xmin+3) + " align=center>Nordhikan (Y+)</td><td bgcolor=#BABABA></td></tr>";
	html[h++] = "<tr>";
	html[h++] = "<td nowrap rowspan="+(ymax-ymin+3)+"\"><span style='display:block;-webkit-transform:rotate(-90deg);transform:rotate(-90deg);-moz-transform:rotate(-90deg);margin-left:-30px;margin-right:-30px;'>Oxhykan&nbsp;(X-)</span></td>";
	html[h++] = "<td align=center height=30 width=30>y\\x</td>";
	for (var x=xmin; x<=xmax; x++) {
		html[h++] = "<td class=grad>"+x+"</td>";
	}
	html[h++] = "<td align=center height=30 width=30>x/y</td>";
	html[h++] = "<td rowspan="+(ymax-ymin+3)+" ><span style='display:block;transform:rotate(90deg);-webkit-transform:rotate(90deg);-moz-transform:rotate(90deg);margin-left:-30px;margin-right:-30px;'>Orhykan&nbsp;(X+)</span></td>";
	html[h++] = "</tr>\n";
	for (var y=ymax; y>=ymin; y--) {
		html[h++] = "<tr><td class=grad height=30>"+ y + "</td>\n";
		for (var x=xmin; x<=xmax; x++) {
			var hdist = player.hdist(x, y);
			var cell = grid.getCellOrNull(x, y);
			var hasHole = false;
			var cellContent = [];
			var c = 0;
			var cellId=null;
			//var cellMenuInfos = null;
			if (x===player.x && y===player.y) {
				cellContent[c++] = "<a class=ch_player href=\"javascript:EPV("+player.id+");\"";
				cellContent[c++] = " id="+player.id;
				if (player.isIntangible) cellContent[c++] = " intangible";
				cellContent[c++] = ">"+player.z+":Vous êtes ici</a>";
				//cellMenuInfos = "cell00";
				cellId='cellp0p0';
			}
			if (cell) {
				if (cell.trolls) {
					for (var i=0; i<cell.trolls.length; i++) {
						var t = cell.trolls[i];
						if (c>0) cellContent[c++] = "<br name='trolls' class=ch_troll>";
						cellContent[c++] = "<a name='trolls' class=ch_troll href=\"javascript:EPV("+t.id+");\"";
						cellContent[c++] = ' message="en X='+x+' Y='+y+' Z='+t.z+'<br>Distance horizontale : ' + hdist+'"';
						cellContent[c++] = " id="+t.id;
						if (t.isIntangible) cellContent[c++] = " intangible";
						cellContent[c++] = ">"+t.z+": "+t.name+"&nbsp;"+t.race[0]+t.level+"</a>";
					}
				}
				if (cell.monsters) {
					for (var i=0; i<cell.monsters.length; i++) {
						var m = cell.monsters[i];
						if (m.isGowap) {
							if (c>0) cellContent[c++] = "<br name='gowaps' class=ch_gowap>";
							cellContent[c++] = "<a name='gowaps' class=ch_gowap href=\"javascript:EMV("+m.id+",750,550);\"";
							cellContent[c++] = ' message="'+m.fullName+' ( '+m.id+' )<br>en X='+x+' Y='+y+' Z='+m.z+'<br>Distance horizontale : ' + hdist+'"';
							cellContent[c++] = ">"+m.z+": "+m.name+"";
							if (m.isSick) cellContent[c++] = "<span class=ch_tag>[M]</span>";
							cellContent[c++] = "</a>";
						} else {
							if (c>0) cellContent[c++] = "<br name='monstres' class=ch_monster>";
							cellContent[c++] = "<a name='monstres' class=ch_monster href=\"javascript:EMV("+m.id+",750,550);\"";
							cellContent[c++] = ' message="'+m.fullName+' ( '+m.id+' )<br>en X='+x+' Y='+y+' Z='+m.z+'<br>Distance horizontale : ' + hdist+'"';
							cellContent[c++] = " id="+m.id;
							cellContent[c++] = " nom_complet_monstre=\""+encodeURIComponent(m.fullName)+"\"";
							cellContent[c++] = ">"+m.z+": "+m.fullName+"</a>";
						}
					}
				}
				if (cell.places) {
					for (var i=0; i<cell.places.length; i++) {
						var t = cell.places[i];
						if (t.isHole) {
							hasHole = true;
						} else {
						if (c>0) cellContent[c++] = "<br name='lieux' class=ch_place>";
							cellContent[c++] = "<a name='lieux' class=ch_place";
							if (t.hasLink) cellContent[c++] = ' href="javascript:Enter(\'/mountyhall/View/TaniereDescription.php?ai_IDLieu='+t.id+'\',750,500)"';
							cellContent[c++] = ">"+t.z+": "+t.name+"</a>";
						}
					}
				}
				if (cell.walls) {
					for (var i=0; i<cell.walls.length; i++) {
						var t = cell.walls[i];
						
						if (c>0) cellContent[c++] = "<br name='murs' class=ch_wall>";
							cellContent[c++] = ">" + "<a name='murs' class=ch_wall";
							cellContent[c++] = ">"+t.z+": "+t.name+"</a>";
					}
				}
				if (cell.objects) {
					//> on regroupe les objets par étage et pour chaque étage on les compte afin de ne pas afficher des milliers de lignes quand une tanière est écroulée
					var objectsByLevel = {};
					for (var i=0; i<cell.objects.length; i++) {
						var t = cell.objects[i];
						if (!objectsByLevel[t.z]) {
							objectsByLevel[t.z] = new Array();
						}
						objectsByLevel[t.z].push(t);
					}
					for (var level in objectsByLevel) {
						var list = objectsByLevel[level];
						var merge = list.length>3;				
						if (merge) {
							if (c>0) cellContent[c++] = "<br name='trésors' class=ch_object>";
							var divName = "objects_"+(x<0?"_"+(-x):x)+"_"+(y<0?"_"+(-y):y)+"_"+(-level);
							cellContent[c++] = "<span name='trésors' class=ch_object>" + level + " : ";
							cellContent[c++] = "<a class=ch_objects_toggler href=\"javascript:grid_changeDisplayByName('"+divName+"');\">";
							cellContent[c++] = "<b>"+list.length+" trésors</b>";
							cellContent[c++] = "</a>";
							cellContent[c++] = "<div name="+divName+" class=hiddenDiv>";
						}
						for (var i=0; i<list.length; i++) {
							var t = list[i];
							if (c>0) cellContent[c++] = "<br name='trésors' class=ch_object>";
							cellContent[c++] = "<span name='trésors' bub=\""+t.id+" : "+t.name+"\" class=ch_object>"+t.z+": "+t.name+"</span>"; // note :pb à attendre si le nom du trésor contient un guillement
						}
						if (merge) {
							cellContent[c++] = "</div></span>";
						}		
					}
				}
				if (cell.mushrooms) {
					for (var i=0; i<cell.mushrooms.length; i++) {
						var t = cell.mushrooms[i];
						if (c>0) cellContent[c++] = "<br name='champignons' class=ch_mushroom>";
						cellContent[c++] = "<a name='champignons' class=ch_mushroom>"+t.z+": "+t.name+"</a>";
					}
					
				}
				if (cell.cenotaphs) {
					for (var i=0; i<cell.cenotaphs.length; i++) {
						var t = cell.cenotaphs[i];
						if (c>0) cellContent[c++] = "<br name='cénotaphes' class=ch_cenotaph>";
						cellContent[c++] = "<a name='cénotaphes' class=ch_cenotaph>"+t.z+": "+t.name+"</a>";
					}					
				}
			}

			html[h++] = "<td class=d"+((hdist-horizontalViewLimit+20001)%2);
			html[h++] = " grid_x=" + x;
			html[h++] = " grid_y=" + y;
			if (cellId!=null) html[h++] = ' id='+cellId;
			var deRange = player.z===0 ? 2 : 1;
			var cellIsAccessibleByDe = x>=player.x-deRange && x<=player.x+deRange && y>=player.y-deRange && y<=player.y+deRange;
			if (c>0 || cellIsAccessibleByDe) html[h++] = " hasContent";
			//if (cellMenuInfos!=null) html[h++] = " cellMenuInfos="+cellMenuInfos;
			html[h++] = ">";
			if (hasHole===true) {
				html[h++] = "<span class=ch_place>Trou de Météorite</span>";
			}
			html[h++] = cellContent.join('');
			html[h++] = "</td>\n";
		}
		html[h++] = "<td class=grad height=30>"+ y + "</td></tr>";
	}
	html[h++] = "<tr>";
	html[h++] = "<td align=center height=30 width=30>y/x</td>";
	for (var x=xmin; x<=xmax; x++) {
		html[h++] = "<td class=grad>"+x+"</td>";
	}
	html[h++] = "<td align=center height=30 width=30>x\\y</td>";
	html[h++] = "</tr>";
	html[h++] = "<tr><td bgcolor=#BABABA></td><td colspan=" + (xmax-xmin+3) + " align=center>Mydikan (Y-)</td><td bgcolor=#BABABA></td></tr>";
	html[h++] = "</tbody></table>";
	return html.join('');
}

function Chrall_analyseMonsterTable(monsterTable) {
	var rows = $(monsterTable).find("tr");
	for (var r=3; r<rows.length; r++) {
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
	var rows = $(table).find("tr");
	for (var r=3; r<rows.length; r++) {
		var $tr = $(rows[r]);
		var troll = new Troll();
		var cells = $tr.find("td");
		var i=1;
		troll.id = parseInt($(cells[i++]).text());
		var cell = $(cells[i++]);
		troll.name = cell.text();
		cell.find('a').attr('id', troll.id);
		troll.isIntangible = cell.html().indexOf("mh_trolls_0")>=0; // les trolls intangibles sont marqués par le style 'mh_trolls_0' au lieu de 'mh_trolls_1'
		troll.level = $(cells[i++]).text();
		troll.race = $(cells[i++]).text();
		troll.guilde = $(cells[i++]).text();
		troll.x = parseInt($(cells[i++]).text());
		troll.y = parseInt($(cells[i++]).text());
		troll.z = parseInt($(cells[i++]).text());
		grid.getCellNotNull(troll.x, troll.y).addTroll(troll);
		grid.nbTrollsInView++;
		$tr.prepend('<td align=center><input type=checkbox name=cb_troll value='+troll.id+'></td>');
	}
	$(rows[2]).prepend($('<td align=center width=20></td>'));
	var html='<td colspan=10 height=25><script>';
	html += 'function mhmp(cat){';
	html += ' var dests=[];  var cbs = document.getElementsByName(\'cb_troll\');';
	html += ' for (var i=0; i<cbs.length; i++) {if(cbs[i].checked) dests.push(cbs[i].value)}';
	html += ' document.location.href=\'../Messagerie/MH_Messagerie.php?cat=\'+cat+\'&dest=\'+dests.join("%2C");';
	html += '}</script><b>TROLLS</b> <a class=gogo href="javascript:mhmp(3);">Envoyer un message</a>';
	if (player.sessionActive) html += ' <a class=gogo href="javascript:mhmp(8);">Partager des px</a>';
	html += '</td>';
	$(rows[0]).html(html);
}

function Chrall_analyseMushroomTable(table) {
	$(table).find("tr.mh_tdpage").each(
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
	$(table).find("tr.mh_tdpage").each(
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
	$(table).find("tr.mh_tdpage").each(
		function(){
			var thing = new Wall();
			var cells = $(this).find("td");
			//alert( $(cells[0]).text() + " / " + $(cells[1]).text() + " / " + $(cells[2]).text() + " / " + $(cells[3]).text() + " / " + $(cells[4]).text() + " ");
			thing.id = parseInt($(cells[0]).text());
			var nameCell = $(cells[1]);
			thing.setName(nameCell.text());
			thing.x = parseInt($(cells[2]).text());
			thing.y = parseInt($(cells[3]).text());
			thing.z = parseInt($(cells[4]).text());
			grid.getCellNotNull(thing.x, thing.y).addWall(thing);
			//grid.nbWallsInView++;
		}
	);	
}


function Chrall_analyseObjectTable(table) {
	// optm : cette méthode consomme beaucoup, peut-être l'itération sur les cellules
	// il faudrait peut-être, comme il n'y a pas de vraies recherches, itérer directement sur le DOM
	var lines = $(table).find("tr.mh_tdpage");
	grid.nbObjectsInView = lines.length;
	for (var l=0; l<grid.nbObjectsInView; l++) {
		var thing = new Thing();
		var cells = $(lines[l]).find("td");
		var i=1;
		thing.id = parseInt($(cells[i++]).text());
		thing.name = $(cells[i++]).text();
		thing.x = parseInt($(cells[i++]).text());
		thing.y = parseInt($(cells[i++]).text());
		thing.z = parseInt($(cells[i++]).text());
		grid.getCellNotNull(thing.x, thing.y).addObject(thing);		
	}
}
function Chrall_analyseCenotaphTable(table) {
	$(table).find("tr.mh_tdpage").each(
		function(){
			var thing = new Thing();
			var cells = $(this).find("td");
			var i=1;
			thing.id = parseInt($(cells[i++]).text());
			thing.name = $(cells[i++]).text();
			thing.x = parseInt($(cells[i++]).text());
			thing.y = parseInt($(cells[i++]).text());
			thing.z = parseInt($(cells[i++]).text());
			grid.getCellNotNull(thing.x, thing.y).addCenotaph(thing);
			grid.nbCenotaphsInView++;
		}
	);
}


function Chrall_analyseView() {

	//> recherche de la position du joueur
	var positionSentenceText = $($($("table.mh_tdborder").first()).find("li")[0]).text();
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
	
	//> initialisation de la grille
	grid = new Grid(player.x, player.y, horizontalViewLimit);
	
	//> chargement des trucs en vue (monstres, trolls, etc.). On remplit la grille au fur et à mesure
	$("table.mh_tdborder:has(a[name])").each(function() { 
		  	
  	switch ($(this).find("a[name]").first().attr("name")) {
			case "monstres":
				Chrall_analyseMonsterTable($(this))
			break;
			case "trolls":
				Chrall_analyseTrollTable($(this))
			break;
			case "tresors":
				Chrall_analyseObjectTable($(this))
			break;
			case "champignons":
				Chrall_analyseMushroomTable($(this))
			break;
			case "lieux":
				Chrall_analysePlaceTable($(this))
			break;
			case "cadavre":
				Chrall_analyseCenotaphTable($(this))
			break;
			case "murs":
				Chrall_analyseWallTable($(this))
			break;
			default: 
				alert("Cet écran de Vue n'est pas conforme aux écrans de vue classiques de MountyHall. Il n'a donc pas été totalement traité. Contacter un développeur Chrall pour voir ce qu'il y a moyen de faire. Partie non traitée: \"" + $(this).find("a[name]").first().text() + "\"" )
			break;
		}
	});
	
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
	}
	
	//> on détermine la zone visible 
	xmin = player.x-horizontalViewLimit;
	xmax = player.x+horizontalViewLimit;
	ymin = player.y-horizontalViewLimit;
	ymax = player.y+horizontalViewLimit;
}

// OPTM : le plus long, dans cette opération, est le append de la grille, c'est-à-dire la construction par le browser de la
//         page. Il me semble difficile d'optimiser ça.
//         "table-layout: fixed;" ne change rien
function Chrall_analyseAndReformatView() {
	var time_enter = (new Date()).getTime(); // <= prof
	
	// prof : les quelques suppressions qui suivent peuvent prendre près de 2 secondes avec une vue de 30
	//> on vire la frise latérale
	$($("td[width=55]")).remove();
	//> on vire la bannière "Mounty Hall la terre des trolls" qu'on a vu pendant 5 ans déjà...
	$($("tr")[0]).remove();
	//> on vire le titre "Ma Vue" et les liens vers les tableaux
	$($("table table table")[0]).remove();
	$($("table table center")[0]).remove();
	
	var time_after_cleaning = (new Date()).getTime(); // <= prof
	
	//> on analyse la vue
	Chrall_analyseView();
	
	//> on colle en haut à droite les liens [Refresh] et [Logout]
	var refreshLogout = $("table table div");
	refreshLogout.addClass("floatTopRight");

	var time_before_grid = (new Date()).getTime(); // <= prof
	
	//> on reconstruit la vue en répartissant les tables dans des onglets et en mettant la grille dans le premier
	//var tables = $("table.mh_tdborder");
	var html = []
	var h = 0;
	html[h++] = "<ul class=tabs view>";
	html[h++] = "<li><a href=#tabGrid>Grille</a></li>";
	//onglet spécifique pour les murs et couloirs dans les pocket hall de type labyrinthe
	if ($("a[name=murs]").length > 0 ) {
		html[h++] = "<li><a href=#tabWalls>Murs et couloirs</a></li>";
	}	
	html[h++] = "<li><a href=#tabTrolls>Trolls ("+grid.nbTrollsInView+")</a></li>";
	html[h++] = "<li><a href=#tabMonsters>Monstres ("+grid.nbMonstersInView+")</a></li>";
	html[h++] = "<li><a href=#tabPlaces>Lieux ("+grid.nbPlacesInView+")</a></li>";
	html[h++] = "<li><a href=#tabObjects>Trésors ("+grid.nbObjectsInView+")</a></li>";
	html[h++] = "<li><a href=#tabMushrooms>Champignons ("+grid.nbMushroomsInView+")</a></li>";
	html[h++] = "<li><a href=#tabCenotaphs>Cénotaphes ("+grid.nbCenotaphsInView+")</a></li>";
	html[h++] = "<li><a href=#tabSettings>Réglages</a></li>";
	html[h++] = "<li><a href=#tabPartages>Partages</a></li>";
	html[h++] = "<li><a href=#tabRecherche>Recherche</a></li>";
	//html[h++] = "<li><a href=#tabGogol>Gogol Map</a></li>";
	html[h++] = "</ul>";
	html[h++] = "<div class=tab_container view>";
	html[h++] = "<div id=tabGrid class=tab_content>";
	html[h++] = Chrall_makeFiltersHtml();
	html[h++] = "<div id=grid_holder>";
	html[h++] = Chrall_makeGridHtml();
	html[h++] = "</div>";
	html[h++] = "</div>";
	//onglet spécifique pour les murs et couloirs dans les pocket hall de type labyrinthe
	if ($("a[name=murs]").length > 0 ) {
		html[h++] = "<div id=tabWalls class=tab_content scroll></div>";
	}
	html[h++] = "<div id=tabTrolls class=tab_content scroll></div>";
	html[h++] = "<div id=tabMonsters class=tab_content scroll></div>";
	html[h++] = "<div id=tabPlaces class=tab_content scroll></div>";
	html[h++] = "<div id=tabObjects class=tab_content scroll></div>";
	html[h++] = "<div id=tabMushrooms class=tab_content scroll></div>";
	html[h++] = "<div id=tabCenotaphs class=tab_content scroll></div>";
	html[h++] = "<div id=tabSettings class=tab_content scroll></div>";
	html[h++] = "<div id=tabPartages class=tab_content scroll></div>";
	html[h++] = "<div id=tabRecherche class=tab_content scroll></div>";
	//onglet spécifique pour les murs et couloirs dans les pocket hall de type labyrinthe
	if ($("a[name=murs]").length > 0 ) {
		html[h++] = "<div id=tabWalls class=tab_content scroll></div>";
	}
	//html[h++] = "<div id=tabGogol class=tab_content scroll></div>";
	html[h++] = "</div>";
	
	var time_after_grid_building = (new Date()).getTime(); // <= prof
	
	$($("table.mh_tdborder")[0]).parent().parent().prepend(html.join(''));	
	$("#tabSettings").append($(document.getElementsByName("LimitViewForm")[0])); // on déplace le formulaire de limitation de vue, avec la table qu'il contient (c'est tables[0] mais on a besoin du formulaire pour que les boutons fonctionnent)
	//onglet spécifique pour les murs et couloirs dans les pocket hall de type labyrinthe
	if ($("a[name=murs]").length > 0 ) {
		$("#tabWalls").append($("table.mh_tdborder:has(a[name=murs])").first());		
	}
	$("#tabMonsters").append($("table.mh_tdborder:has(a[name=monstres])").first());
	$("#tabTrolls").append($("table.mh_tdborder:has(b:contains('TROLLS'))").first());
	$("#tabObjects").append($("table.mh_tdborder:has(a[name=tresors])").first());
	$("#tabMushrooms").append($("table.mh_tdborder:has(a[name=champignons])").first());
	$("#tabPlaces").append($("table.mh_tdborder:has(a[name=lieux])").first());
	$("#tabCenotaphs").append($("table.mh_tdborder:has(a[name=cadavre])").first());
	$("#tabPartages").append(makePartageTables());
	makeSearchPanel($("#tabRecherche"));
	$(".tab_content").hide();
	
	if (localStorage['tab_view']) {
		$('ul.tabs li:has(a[href="#'+localStorage['tab_view']+'"])').addClass("active").show();
		$('#'+localStorage['tab_view']).show();
		localStorage.removeItem('tab_view');
	} else {
		$("ul.tabs li:first").addClass("active").show();
		$(".tab_content:first").show();
	}
	
	$("ul.tabs li").click(function() {
		hideOm(); // fermeture des éventuels objectMenus de la grille
		$("ul.tabs li").removeClass("active");
		$(this).addClass("active");
		$(".tab_content").hide();
		var activeTab = $(this).find("a").attr("href");
		window.scroll(0, 0);
		$(activeTab).fadeIn("fast");
		return false;
	});
	
	var time_after_grid_append = (new Date()).getTime(); // <= prof
	
	$('td[height="1000"]').removeAttr('height'); // c'est compliqué souvent de déperversifier les pages MH...
	$('#grid_holder').dragscrollable({dragSelector: '#grid'});
	
	//> on applique les réglages de filtrages de la fois précédente
	for (var key in viewFilters) {
		var display = localStorage['grid_filter_'+key];
		if (display!=null) {
			var os = document.getElementsByName(key);
			for (var i=0; i<os.length; i++) {
				os[i].style.display=display;
			}
			if (display!='none') $('#'+key).attr("checked", "checked");
			else $('#'+key).removeAttr("checked");
		}
	}

	setTimeout( // afin d'accélérer l'affichage initial, on repousse un peu l'ajout des bulles et menus
		function() {

			Chrall_gridLive();

			//> bulle popup sur le lien du joueur
			var link = $("#grid a.ch_player");
			var trollId = link.attr('id');
			if (trollId==0) {
				bubble(link, "Problème. Peut-être avez vous mis à jour Chrall sans rouvrir la session MH. Utilisez le bouton 'Refresh' de MH.", "bub_player");
			} else {
				bubble(link, '', "bub_player", GOGOCHRALL+"json?action=get_troll_info&trollId="+trollId, trollId);
			}
	
			//> on met un popup sur les trésors pour afficher leur numéro (utile pour le pilotage de gowap)
			$("#grid span.ch_object").each(
				function() {
					var o = $(this);
					var text = o.attr("bub");
					if (text) {
						bubble(o, text, "bub_object");
					} else {
						bubble(o, "Cliquez pour voir tous ces trésors", "bub_object");
					}
				}
			);
						
		}, 1000
	);

	//> on outille le select de réduction de vue
	$('#viewRedux').change(function(){
		var limit  = $(this).val();
		document.getElementsByName("ai_MaxVue")[0].value = limit;
		document.getElementsByName("ai_MaxVueVert")[0].value = Math.ceil(limit/2);
		$('form[name="LimitViewForm"]').submit();
	});
	
	var $gridHolder = $('#grid_holder');
	var $playerCell = $('#cellp0p0');
	var gotoPlayer = function() {
		hideOm();
		scrollInProgress = true;
		$gridHolder.animate(
			{
				scrollLeft: ($gridHolder.scrollLeft()+$playerCell.offset().left + ($playerCell.innerWidth()-window.innerWidth)/2),
				scrollTop: ($gridHolder.scrollTop()+$playerCell.offset().top + ($playerCell.innerHeight()-window.innerHeight)/2)
			},
			'slow',
			function() {
				scrollInProgress = false;
			}
		);
	}
	//> on centre la vue sur la cellule du joueur
	setTimeout(
		gotoPlayer,
		100
	);
	//> bouton de centrage
	$('#goto_player').click(gotoPlayer);
	//> hook pour le centrage au double-clic
	$('#grid').dblclick(gotoPlayer);
	
	var time_end = (new Date()).getTime(); // <= prof
	console.log("Profiling - Vue de " + horizontalViewLimit);
	console.log("Duration Cleaning : " + (time_after_cleaning-time_enter));
	console.log("Duration Analysis : " + (time_before_grid-time_after_cleaning));
	console.log("Duration Grid Building: " + (time_after_grid_building-time_before_grid));
	console.log("Duration Grid Append : " + (time_after_grid_append-time_after_grid_building));
	console.log("Duration Bubbles : " + (time_end-time_after_grid_append));
	console.log("Total Duration : " + (time_end-time_enter));
	
	// On corrige si nécessaire la position affichée dans le menu de gauche et on signale
	// cette position au script de fond
	updateTroll();
	
	
	
}
