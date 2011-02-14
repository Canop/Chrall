/*
 * ce script lance les actions (les autres ne contiennent que des fonctions appelées depuis ici).
 * Il contient aussi les variables globales.
 */


var monstersInView = new Array();
var trollsInView = new Array();
var placesInView = new Array();
var objectsInView = new Array();
var mushroomsInView = new Array();
var cenotaphsInView = new Array();
 
var splitedPathname = document.location.pathname.split('/');
var pageName = splitedPathname[splitedPathname.length-1];


// étendue de la vue
var viewIsEmpty=true;
var xmin, xmax, ymin, ymax, zmin, zmax;

// position du joueur
var playerLocation = null; // instance de Point


if (pageName=="Play_vue.php") { 
	//> on vire la "décoration" latérale
	$($("td[width=55]")).remove();
	
	//> on vire la grosse et moche banière "Mounty Hall la terre des trolls"
	$($("tr")[0]).remove();
	
	//> on vire le titre "Ma Vue" et les liens vers les tableaux
	$($("table table table")[0]).remove();
	$($("table table center")[0]).remove();
	
	//> on analyse la vue
	Chrall_analyseView();
	
	//> on ajoute la grille
	//Chrall_insertViewGrid();
	
	var html="<ul class=tabs>";
	html += "<li><a href=#tabGrid>Grille</a></li>";
	html += "<li><a href=#tabMonsters>Monstres ("+monstersInView.length+")</a></li>";
	html += "<li><a href=#tabTrolls>Trolls ("+trollsInView.length+")</a></li>";
	html += "<li><a href=#tabObjects>Trésors ("+objectsInView.length+")</a></li>";
	html += "<li><a href=#tabMushrooms>Champignons ("+mushroomsInView.length+")</a></li>";
	html += "<li><a href=#tabPlaces>Lieux ("+placesInView.length+")</a></li>";
	html += "<li><a href=#tabCenotaphs>Cénotaphes ("+cenotaphsInView.length+")</a></li>";
	html += "<li><a href=#tabSettings>Réglages</a></li>";
	html += "</ul>";
	html += "<div class=tab_container>";
	html += "<div id=tabGrid class=tab_content>";
	html += Chrall_makeGridHtml();
	html += "</div>";
	html += "<div id=tabMonsters class=tab_content></div>";
	html += "<div id=tabTrolls class=tab_content></div>";
	html += "<div id=tabObjects class=tab_content></div>";
	html += "<div id=tabMushrooms class=tab_content></div>";
	html += "<div id=tabPlaces class=tab_content></div>";
	html += "<div id=tabCenotaphs class=tab_content></div>";
	html += "<div id=tabSettings class=tab_content></div>";
	html += "</div>";
	$($(document).find("table.mh_tdborder")[0]).parent().parent().prepend(html);
	
	var tables = $("table.mh_tdborder");
	
	$("div#tabSettings").append(tables[0]);
	$("div#tabMonsters").append(tables[1]);
	$("div#tabTrolls").append(tables[2]);
	$("div#tabObjects").append(tables[3]);
	$("div#tabMushrooms").append(tables[4]);
	$("div#tabPlaces").append(tables[5]);
	$("div#tabCenotaphs").append(tables[6]);
	
	$(".tab_content").hide(); //Hide all content
	$("ul.tabs li:first").addClass("active").show(); //Activate first tab
	$(".tab_content:first").show(); //Show first tab content
	//On Click Event
	$("ul.tabs li").click(function() {
		$("ul.tabs li").removeClass("active"); //Remove any "active" class
		$(this).addClass("active"); //Add "active" class to selected tab
		$(".tab_content").hide(); //Hide all tab content
		var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		$(activeTab).fadeIn(); //Fade in the active ID content
		return false;
	});
}

