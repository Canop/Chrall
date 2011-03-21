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
var player = new Troll();
var horizontalViewLimit = -1;
var playerAmAbstract = new Array(); // strings. utilisées dans le profil à la fois pour le tableau de l'am et pour la bulle de la compétence en bas

// note : pour l'instant il faut que ces valeurs de départ soient cohérentes avec le css (display='block' ou display='none');
// Par ailleurs attention à un détail : les clés suivantes sont à la fois des clés dans le code et les labels dans l'ihm
var viewFilters = { 
	"trolls" : true,
	"monstres" : true,
	"gowaps" : true,
	"lieux" : true,
	"trésors" : false,
	"champignons" : false,
	"cénotaphes" : false
};

console.log("pageName=\""+pageName+"\""); 

switch (pageName) {
	case "PlayStart.php":
		Chrall_analyseAndReformatStartPage();	
		break;
	case "Play_profil.php":
		Chrall_analyseAndReformatProfile();	
		break;
	case "Play_vue.php":
		Chrall_analyseAndReformatView();	
		break;
	case "Play_mouche.php":
		Chrall_analyseAndReformatFlies();	
		break;
	case "Play_option.php":
		Chrall_reformatOptionsView();	
		break;
	case "Play_a_Competence16.php":
	case "Play_a_Competence16b.php": // le 16b serait le formulaire de préparation ?
		Chrall_handleCdmPage();	
		break;
}


