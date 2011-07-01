/*
 * ce script lance les actions (les autres ne contiennent que des classes et des fonctions appelées depuis ici).
 * Il contient aussi les variables globales.
 */

var GOGOCHRALL = "http://localhost:8000/chrall/";
//var GOGOCHRALL = "http://canop.org:8000/chrall/";

var viewIsEmpty=true; // correspond à un état d'analyse de la vue
var xmin, xmax, ymin, ymax, zmin, zmax; // étendue de la vue
var player = new Troll(); // le troll du joueur. Sera éventuellement récupéré de la page de fond dans getBackgroundInfosThenExecute
var playerAmAbstract = new Array(); // strings. utilisées dans le profil à la fois pour le tableau de l'am et pour la bulle de la compétence en bas
var viewedTrollId;
var sessionActive = false; 

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

// on rend jquery disponible dans les pages (ça n'a pas l'air de marcher)
//$('head').append('<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>');

prepareReceiver();
//console.log(document.location.href);
var splitedPathname = document.location.pathname.split('/');
var pageName = splitedPathname[splitedPathname.length-1];
console.log("pageName=\""+pageName+"\"");

var resetTroll = pageName=="PlayStart.php";

chrome.extension.sendRequest(
	{"get_bgInfos": resetTroll},
	function(answer) {
		player.fillFrom(answer.player);
		switch (pageName) {
		case "PlayStart.php":
			Chrall_analyseAndReformatStartPage();
			break;
		case "Play_profil.php":
			initCommunications();
			Chrall_analyseAndReformatProfile();	
			break;
		case "Play_vue.php":
			initCommunications('get_partages');
			Chrall_analyseAndReformatView();	
			break;
		case "Play_mouche.php":
			Chrall_analyseAndReformatFlies();
			break;
		case "Play_BM.php":
			Chrall_analyseAndReformatBM();	
			break;
		case "Play_evenement.php":
			Chrall_addBubblesToLinks();
			break;
		case "Play_action.php": // c'est la frame en bas qui contient le menu d'action
			Chrall_handleActionPage();
			break;
		case "Play_option.php":
		//~ case "Play_o_Pwd.php": // je désactive l'onglet sur les pages d'option à part la général : l'apparence de certains blocs MH est trop perturbée
		//~ case "Play_o_Blason.php":
		//~ case "Play_o_Interface.php":
		//~ case "Play_o_css.php":
		//~ case "Play_o_Divers.php":
			initCommunications('check_account');
			Chrall_reformatOptionsView();	
			break;
		case "Play_a_Competence16.php": // préparation de CDM (le formulaire de choix du monstre)
			Chrall_handleBeforeCdmPage();	
			break;
		case "Play_a_Competence16b.php": // résultat de cdm
			Chrall_handleCdmPage();	
			break;
		case "Play_a_Competence18b.php": // résultat d'insulte
			Chrall_analyseResultatInsulte();	
			break;
		case "Play_a_Competence18.php": // préparation d'insulte
			Chrall_prepareInsulte();	
			break;
		case "Play_a_Competence29.php": // préparation de minage (le formulaire dans la frame d'action)
			Chrall_handleBeforeMinage();	
			break;
		case "Play_a_Competence29b.php": // résultat de minage
			Chrall_handleMinagePage();
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
		case "PJView.php":
			Chrall_analyseAndReformatPJView(); 
			break;
		case "PJView_Events.php":
			Chrall_analysePJEventsView();
			Chrall_addBubblesToLinks();
			break;
		case "Play_news.php":
			Chrall_addBubblesToLinks();
			break;
		case "MonsterView.php":
			Chrall_analyseAndReformatMonsterView();
			Chrall_addInfosToMonsterEvents();
			Chrall_addBubblesToLinks();
			break;
		case "Play_a_Combat.php": //  résultat de combat (vérifié pour CDB)
			Chrall_analyseResultatCombat();
		case "FO_Ordres.php":
			Chrall_handleFollowerOrders();
			break;
		case "FO_NewOrder.php":
			Chrall_fillFollowerNewOrderForm();
			break;
		}
		localStorage['todo']='';
	}
);




