/*
 * ce script lance les actions (les autres ne contiennent que des classes et des fonctions appelées depuis ici).
 * Il contient aussi les variables globales.
 */

var splitedPathname = document.location.pathname.split('/');
var pageName = splitedPathname[splitedPathname.length-1];
var viewIsEmpty=true; // correspond à un état d'analyse de la vue
var xmin, xmax, ymin, ymax, zmin, zmax; // étendue de la vue
var player = new Troll();
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

function getTrollIdthenExecute(f) {
	chrome.extension.sendRequest(
		{"get_trollId": "s'il-te-plaît?"},
		function(answer) {
			player.id = answer.trollId;
			console.log('player trollID : '+player.id);
			f.call();
		}
	);
}


switch (pageName) {
	case "PlayStart.php":
		Chrall_analyseAndReformatStartPage();	
		break;
	case "Play_profil.php":
		Chrall_analyseAndReformatProfile();	
		break;
	case "Play_vue.php":
		getTrollIdthenExecute(Chrall_analyseAndReformatView);	
		break;
	case "Play_mouche.php":
		Chrall_analyseAndReformatFlies();
		break;
	case "Play_BM.php":
		Chrall_analyseAndReformatBM();	
		break;
	case "Play_action.php": // c'est la frame en bas qui contient le menu d'action
		Chrall_handleActionPage();
		break;
	case "Play_option.php":
		Chrall_reformatOptionsView();	
		break;
	case "Play_a_Competence16.php": // préparation de CDM (le formulaire de choix du monstre)
		Chrall_handleBeforeCdmPage();	
		break;
	case "Play_a_Competence16b.php": // résultat de cdm
		getTrollIdthenExecute(Chrall_handleCdmPage);	
		break;
	case "Play.php": // c'est le frameset qui engloble tout
		Chrall_preparePlayInputs();	
		break;
	case "Play_menu.php": // c'est la frame de gauche
		Chrall_handleMenuPage();	
		break;
	case "Play2.php": // c'est le frameset qui engloble tout ce qui n'est pas la colonne menu de gauche
		Chrall_preparePlay2Inputs();	
		break;
	case "Play_a_Move.php":
		Chrall_handleMovePage();	
		break;
	case "PJView_Events.php":
		Chrall_analyseAndReformatPJView();
		break;
}


