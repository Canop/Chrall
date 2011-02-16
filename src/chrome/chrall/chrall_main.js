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

// note : pour l'instant il faut que ces valeurs de départ soient cohérentes avec le css (display='block' ou display='none');
// Par ailleurs attention à un détail : les clés suivantes sont à la fois des clés dans le code et les labels dans l'ihm
var viewFilters = { 
	"trolls" : true,
	"monstres" : true,
	"gowaps" : true,
	"lieux" : true,
	"objets" : false,
	"champignons" : false,
	"cénotaphes" : false
};

if (pageName=="Play_vue.php") { 
	Chrall_analyseAndReformatView();	
} else if (pageName=="Play_profil.php") { 
	Chrall_analyseAndReformatProfile();
}

