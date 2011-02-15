/*
 * ce script lance les actions (les autres ne contiennent que des classes et des fonctions appelées depuis ici).
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
var viewIsEmpty=true; // correspond à un état d'analyse de la vue
var xmin, xmax, ymin, ymax, zmin, zmax; // étendue de la vue
var playerLocation = null; // position du joueur : instance de Point
var playerProfile = new TrollProfile();
var horizontalViewLimit = -1;

//> pour google analytics (ça ne marche pas...)
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-15064357-4']);	
(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

if (pageName=="Play_vue.php") { 
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
		$(activeTab).fadeIn();
		return false;
	});
	_gaq.push(['_trackEvent', 'page ' + pageName, 'done']); // pour google analytics
	
} else if (pageName=="Play_profil.php") { 
		//> on analyse la vue
	Chrall_analyseAndReformatProfile();
	_gaq.push(['_trackEvent', 'page ' + pageName, 'done']); // pour google analytics
}

