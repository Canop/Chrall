
/**
 * construit la ligne de boites à cocher permettant de filtrer la grille
 */
function Chrall_makeFiltersHtml() {
	var html = "<script>";
	html += "function ChrallEmbedded_toggleDisplayByName(key, display){";
	html += " var os = document.getElementsByName(key);";
	html += " for (var i=0; i<os.length; i++) {";
	html += "  if (!display) {";
	html += "   if (os[i].style.display=='block') os[i].style.display='none';";
	html += "   else os[i].style.display='block';";
	html += "  } else {";
	html += "   os[i].style.display=display;";
	html += "  }";
	html += " }";
	html += "}";
	html += "";
	html += "</script>";
	html += "<form id=gridFiltersForm> Montrer : ";
	for (var key in viewFilters) {
		html += "<span><input type=checkbox id='"+key+"'";
		if (viewFilters[key]) html += " checked";
		html += " onClick=\"ChrallEmbedded_toggleDisplayByName('"+key+"', this.checked?'block':'none');\"";
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
	
	html = "<script>";
	html += "function grid_receive(answer) {";
	html += " var id = answer.RequestId;"; // sera peut-être un jour utilisé pour vérifier que la bulle ouverte est celle pour laquelle on a fait la requete
	html += " var html = answer.Html;";
	html += " var div = document.getElementById('bubbleContent');";
	html += " if (div) {";
	html += "  div.innerHTML=html;"; // il n'y a plus de div si la bulle est close
	html += " }";
	html += "}";
	html += "</script>";
	
	html += "<table class=grid>";
	html += "<tr><td bgcolor=#BABABA></td><td colspan=" + (xmax-xmin+3) + " align=center>Nordhikan (Y+)</td><td bgcolor=#BABABA></td></tr>";
	html += "<tr>";
	html += "<td nowrap rowspan="+(ymax-ymin+3)+"\"><span style='display:block;-webkit-transform:rotate(-90deg);transform:rotate(-90deg);-moz-transform:rotate(-90deg);margin-left:-30px;margin-right:-30px;'>Oxhykan&nbsp;(X-)</span></td>";
	html += "<td align=center height=30 width=30>y\\x</td>";
	for (var x=xmin; x<=xmax; x++) {
		html += "<td class=grad>"+x+"</td>";
	}
	html += "<td align=center height=30 width=30>x/y</td>";
	html += "<td rowspan="+(ymax-ymin+3)+" ><span style='display:block;transform:rotate(90deg);-webkit-transform:rotate(90deg);-moz-transform:rotate(90deg);margin-left:-30px;margin-right:-30px;'>Orhykan&nbsp;(X+)</span></td>";
	html += "</tr>\n";
	for (var y=ymax; y>=ymin; y--) {
		html += "<tr><td class=grad height=30>"+ y + "</td>\n";
		for (var x=xmin; x<=xmax; x++) {
			var hdist = player.hdist(x, y);
			var hasHole = false;
			var cellPositionMessage = "X="+x+" Y="+y+"<br>Distance horizontale: "+hdist;
			var cellContent = "";
			if (x==player.x && y==player.y) {
				cellContent += "<span class=ch_player>"+player.z+":Vous êtes ici</span><br>"
			}
			for (var i=0; i<trollsInView.length; i++) {
				var t = trollsInView[i];
				if (t.x==x && t.y==y) {
					cellContent += "<a name='trolls' class=ch_troll href=\"javascript:EPV("+t.id+");\"";
					cellContent += " message=\""+cellPositionMessage+"\"" // TODO trouver un moyen de moins dupliquer ce message !
					if (t.isIntangible) cellContent += " intangible";
					cellContent += ">"+t.z+": "+t.name+"&nbsp;"+t.race[0]+t.level+"</a>";
				}
			}
			for (var i=0; i<monstersInView.length; i++) {
				var m = monstersInView[i];
				if (m.x==x && m.y==y) {
					if (m.isGowap) {
						cellContent += "<a name='gowaps' class=ch_gowap href=\"javascript:EMV("+m.id+",750,550);\">"+m.z+": "+m.name+"";
						if (m.isSick) cellContent += "<span class=ch_tag>[M]</span>";
						cellContent += "</a>";
					} else {
						cellContent += "<a name='monstres' class=ch_monster href=\"javascript:EMV("+m.id+",750,550);\"";
						cellContent += " message=\""+m.fullName+" en "+cellPositionMessage+"\""
						cellContent += " id="+m.id;
						cellContent += " nom_complet_monstre=\""+encodeURIComponent(m.fullName)+"\"";
						cellContent += ">"+m.z+": "+m.fullName+"</a>";
					}
				}
			}
			for (var i=0; i<placesInView.length; i++) {
				var t = placesInView[i];
				if (t.x==x && t.y==y) {
					if (t.isHole) {
						hasHole = true;
					} else {
						cellContent += "<a name='lieux' class=ch_place>"+t.z+": "+t.name+"</a>";
					}
				}
			}
			//> on regroupe les objets par étage et pour chaque étage on les compte afin de ne pas afficher des milliers de lignes quand une tanière est écroulée
			var objectsByLevel = {};
			for (var i=0; i<objectsInView.length; i++) {
				var t = objectsInView[i];
				if (t.x!=x || t.y!=y) continue;
				if (!objectsByLevel[t.z]) {
					objectsByLevel[t.z] = new Array();
				}
				objectsByLevel[t.z].push(t);
			}
			for (var level in objectsByLevel) {
				var list = objectsByLevel[level];
				var merge = list.length>3;				
				if (merge) {
					var divName = "objects_"+(x<0?"_"+(-x):x)+"_"+(y<0?"_"+(-y):y)+"_"+(-level);
					cellContent += "<span name='objets' class=ch_object>" + level + " : ";
					// ligne suivante : début de tentative de mettre un triangle d'ouverture
					//cellContent += "<img border=0 src=\""+grey_closed_png_url+"\">";
					cellContent += "<a class=ch_objects_toggler href=\"javascript:ChrallEmbedded_toggleDisplayByName('"+divName+"');\">";
					cellContent += "<b>"+list.length+" trésors</b>";
					cellContent += "</a>";
					cellContent += "<div name="+divName+" class=hiddenDiv>";
				}
				for (var i=0; i<list.length; i++) {
					var t = list[i];
					cellContent += "<span name='objets' bub=\""+t.id+" : "+t.name+"\" class=ch_object>"+t.z+": "+t.name+"</span>"; // note :pb à attendre si le nom du trésor contient un guillement
				}
				if (merge) {
					cellContent += "</div></span>";
				}		
			}
			for (var i=0; i<mushroomsInView.length; i++) {
				var t = mushroomsInView[i];
				if (t.x==x && t.y==y) {
					cellContent += "<a name='champignons' class=ch_mushroom>"+t.z+": "+t.name+"</a>";
				}
			}
			for (var i=0; i<cenotaphsInView.length; i++) {
				var t = cenotaphsInView[i];
				if (t.x==x && t.y==y) {
					cellContent += "<a name='cénotaphes' class=ch_cenotaph>"+t.z+": "+t.name+"</a>";
				}
			}
			html += "<td class=d"+((hdist-horizontalViewLimit+20001)%2);
			if (cellContent.length>0) html += " hasContent"; 
			html += ">";
			if (hasHole==true) html += "<span class=ch_place>Trou de Météorite</span>";
			html += cellContent;
			html += "</td>\n";
		}
		html += "<td class=grad height=30>"+ y + "</td></tr>";
	}
	html += "<tr>";
	html += "<td align=center height=30 width=30>y/x</td>";
	for (var x=xmin; x<=xmax; x++) {
		html += "<td class=grad>"+x+"</td>";
	}
	html += "<td align=center height=30 width=30>x\\y</td>";
	html += "</tr>";
	html += "<tr><td bgcolor=#BABABA></td><td colspan=" + (xmax-xmin+3) + " align=center>Midikan (Y-)</td><td bgcolor=#BABABA></td></tr>";
	html += "</table>";
	return html;
}

function Chrall_analyseMonsterTable(monsterTable) {
	$(monsterTable).find("tr.mh_tdpage").each(
		function(){
			var monster = new Monster();
			var cells = $(this).find("td");
			var i=1;
			monster.id = parseInt($(cells[i++]).text());
			monster.setName($(cells[i++]).text());
			monster.x = parseInt($(cells[i++]).text());
			monster.y = parseInt($(cells[i++]).text());
			monster.z = parseInt($(cells[i++]).text());
			monstersInView.push(monster);
			//$(this).append("vu");
		}
	);
	// TODO trier par z pour la construction de la grille
	// TODO faire un objet (un tableau) grid ?
}

function Chrall_analyseTrollTable(table) {
	$(table).find("tr.mh_tdpage").each(
		function(){
			var troll = new Troll();
			var cells = $(this).find("td");
			var i=1;
			troll.id = parseInt($(cells[i++]).text());
			var cell = $(cells[i++]);
			troll.name = cell.text();
			troll.isIntangible = cell.html().indexOf("mh_trolls_0")>=0; // les trolls intangibles sont marqués par le style 'mh_trolls_0' au lieu de 'mh_trolls_1'
			troll.level = $(cells[i++]).text();
			troll.race = $(cells[i++]).text();
			troll.guilde = $(cells[i++]).text();
			troll.x = parseInt($(cells[i++]).text());
			troll.y = parseInt($(cells[i++]).text());
			troll.z = parseInt($(cells[i++]).text());
			trollsInView.push(troll);
		}
	);
}

function Chrall_analyseThingTable(table, list) {
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
			list.push(thing);
		}
	);
}
function Chrall_analyseMushroomTable(table, list) {
	$(table).find("tr.mh_tdpage").each(
		function(){
			var thing = new Thing();
			var cells = $(this).find("td");
			var i=1;
			// je vens de m'apercevoir que les champignons n'avaient pas d'ID visible...
			thing.name = $(cells[i++]).text();
			thing.x = parseInt($(cells[i++]).text());
			thing.y = parseInt($(cells[i++]).text());
			thing.z = parseInt($(cells[i++]).text());
			list.push(thing);
		}
	);
}

function Chrall_analysePlaceTable(table, list) {
	$(table).find("tr.mh_tdpage").each(
		function(){
			var thing = new Place();
			var cells = $(this).find("td");
			var i=1;
			thing.id = parseInt($(cells[i++]).text());
			thing.setName($(cells[i++]).text());
			thing.x = parseInt($(cells[i++]).text());
			thing.y = parseInt($(cells[i++]).text());
			thing.z = parseInt($(cells[i++]).text());
			list.push(thing);
		}
	);
}

function Chrall_enlargeView(thingList) {
	var t;
	var i=0;
	if (thingList.length>0 && viewIsEmpty) {
		t = thingList[i++];
		xmin = t.x;
		xmax = t.x;
		ymin = t.y;
		ymax = t.y;
		zmin = t.z;
		zmax = t.z;
		viewIsEmpty = false;
	}
	for (;i<thingList.length; i++) {
		t = thingList[i++];
		if (t.x<xmin) xmin=t.x;
		else if (t.x>xmax) xmax=t.x;
		if (t.y<ymin) ymin=t.y;
		else if (t.y>ymax) ymax=t.y;
		if (t.z<zmin) zmin=t.z;
		else if (t.z>zmax) zmax=t.z;
	}
}

function Chrall_analyseView() {
	var tables = $("table.mh_tdborder");

	//> recherche de la position du joueur
	var positionSentenceText = $($(tables[0]).find("li")[0]).text();
	var positionSentenceTokens = positionSentenceText.split(new RegExp("[ ,:=]+", "g"));
	player.x = parseInt(positionSentenceTokens[5]);
	player.y = parseInt(positionSentenceTokens[8]);
	player.z = parseInt(positionSentenceTokens[10]);

	//> recherche de la limite de vue horizontale (pour dessiner la grille ensuite)
	try {
		horizontalViewLimit = parseInt(document.getElementsByName("ai_MaxVue")[0].value);
	} catch(error) {
	}
	horizontalViewLimit = Math.max(horizontalViewLimit, 0); // on utilise ça plus tard dans la construction de la grille (pour que le bord de la vue ne soit pas blanc)
	
	//> chargement des trucs en vue (monstres, trolls, etc.)
	Chrall_analyseMonsterTable(tables[1]);
	Chrall_analyseTrollTable(tables[2]);
	Chrall_analyseThingTable(tables[3], objectsInView);
	Chrall_analyseMushroomTable(tables[4], mushroomsInView);
	Chrall_analysePlaceTable(tables[5], placesInView);
	Chrall_analyseThingTable(tables[6], cenotaphsInView);
	
	//> on détermine la zone visible 
	if (horizontalViewLimit>=0) {
		xmin = player.x-horizontalViewLimit;
		xmax = player.x+horizontalViewLimit;
		ymin = player.y-horizontalViewLimit;
		ymax = player.y+horizontalViewLimit;
	} else {
		// si on n'a pas la portée on regarde les monstres (je garde ça car plus tard je ferai sans doute une fonction pour tom d'auto-adaptation de la vue en fonction de certains critères)
		Chrall_enlargeView(monstersInView);
		Chrall_enlargeView(trollsInView);
	}
}

function Chrall_analyseAndReformatView() {
	//> on vire la frise latérale
	$($("td[width=55]")).remove();
	
	//> on vire la bannière "Mounty Hall la terre des trolls" qu'on a vu pendant 5 ans déjà...
	$($("tr")[0]).remove();
	
	//> on vire le titre "Ma Vue" et les liens vers les tableaux
	$($("table table table")[0]).remove();
	$($("table table center")[0]).remove();
	
	//> on analyse la vue
	Chrall_analyseView();
	
	//> on reconstruit la vue en répartissant les tables dans des onglets et en mettant la grille dans le premier
	var tables = $("table.mh_tdborder");
	var html="<ul class=tabs view>";
	html += "<li><a href=#tabGrid>Grille</a></li>";
	html += "<li><a href=#tabTrolls>Trolls ("+trollsInView.length+")</a></li>";
	html += "<li><a href=#tabMonsters>Monstres ("+monstersInView.length+")</a></li>";
	html += "<li><a href=#tabPlaces>Lieux ("+placesInView.length+")</a></li>";
	html += "<li><a href=#tabObjects>Trésors ("+objectsInView.length+")</a></li>";
	html += "<li><a href=#tabMushrooms>Champignons ("+mushroomsInView.length+")</a></li>";
	html += "<li><a href=#tabCenotaphs>Cénotaphes ("+cenotaphsInView.length+")</a></li>";
	html += "<li><a href=#tabSettings>Réglages</a></li>";
	html += "</ul>";
	html += "<div class=tab_container><br><br>";
	html += "<div id=tabGrid class=tab_content><br><br>";
	html += Chrall_makeFiltersHtml();
	html += "<div class=grid_holder>";
	html += Chrall_makeGridHtml();
	html += "</div>";
	html += "</div>";
	html += "<div id=tabTrolls class=tab_content></div>";
	html += "<div id=tabMonsters class=tab_content></div>";
	html += "<div id=tabPlaces class=tab_content></div>";
	html += "<div id=tabObjects class=tab_content></div>";
	html += "<div id=tabMushrooms class=tab_content></div>";
	html += "<div id=tabCenotaphs class=tab_content></div>";
	html += "<div id=tabSettings class=tab_content></div>";
	html += "</div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
	$($("table.mh_tdborder")[0]).parent().parent().prepend(html);	
	$("div#tabSettings").append($(document.getElementsByName("LimitViewForm")[0])); // on déplace le formulaire de limitation de vue, avec la table qu'il contient (c'est tables[0] mais on a besoin du formulaire pour que les boutons fonctionnent)
	$("div#tabMonsters").append(tables[1]);
	$("div#tabTrolls").append(tables[2]);
	$("div#tabObjects").append(tables[3]);
	$("div#tabMushrooms").append(tables[4]);
	$("div#tabPlaces").append(tables[5]);
	$("div#tabCenotaphs").append(tables[6]);
	$(".tab_content").hide();
	$("ul.tabs li:first").addClass("active").show();
	$(".tab_content:first").show();
	
	$("ul.tabs li").click(function() {
		$("ul.tabs li").removeClass("active");
		$(this).addClass("active");
		$(".tab_content").hide();
		var activeTab = $(this).find("a").attr("href");
		window.scroll(0, 0);
		$(activeTab).fadeIn("fast");
		return false;
	});
	
	

	//> on ajoute le popup sur les monstres
	$("a.ch_monster").each(
		function() {
			var link = $(this);
			var text = link.attr("message");
			bubble(link, text, "bub_monster", "http://canop.org:9090/chrall/json?action=get_extract_jsonp&name=" + link.attr("nom_complet_monstre") + "&requestId=" + link.attr("id"));
		}
	);

	//> on ajoute un popup sur les trolls (pour avoir la distance de charge, et plus tard d'autres choses peut-être)
	$("a.ch_troll").each(
		function() {
			var link = $(this);
			var text = link.attr("message");
			bubble(link, text, "bub_troll");
		}
	);	

	//> on met un popup sur les trésors pour afficher leur numéro (utile pour le pilotage de gowap)
	$("span.ch_object").each(
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

}
