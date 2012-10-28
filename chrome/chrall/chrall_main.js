/*
 * ce script lance les actions (les autres ne contiennent que des classes et des fonctions appelées depuis ici).
 * Il contient aussi les variables globales.
 */


var viewIsEmpty = true; // correspond à un état d'analyse de la vue
var xmin, xmax, ymin, ymax, zmin, zmax; // étendue de la vue
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
	"cénotaphes" : false,
	"intangibles" : true,
	"3D" : true
};


console.info("pageName=[" + chrall.pageName() + "]");

var player = chrall.player(); // for temporary compatibility purposes only


switch (chrall.pageName()) {
	case "PlayStart.php":
		Chrall_analyseAndReformatStartPage()
		break;
	case "Play_profil.php":
		chrall.initCommunications();
		Chrall_analyseAndReformatProfile();
		break;
	case "Play_vue.php":
		Chrall_analyseAndReformatView();
		chrall.initCommunications('get_partages');
		break;
	case "Play_mouche.php":
		//Chrall_analyseAndReformatFlies();
		break;
	case "Play_BM.php":
		Chrall_analyseAndReformatBM();
		break;
	case "Play_equipement.php":
		break;
	case "Play_evenement.php":
		Chrall_addBubblesToLinks();
		break;
	case "Play_action.php": // c'est la frame en bas qui contient le menu d'action
		Chrall_listenForChangeLocation('action');
		Chrall_handleActionPage();
		break;
	case "Play_option.php":
		chrall.initCommunications('check_account');
		chrall.reformatOptionsView();
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
		break;
	case "Play_a_Move.php":
		Chrall_listenForChangeLocation('action');
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
		chrall.analyseAndReformatMonsterView();
		Chrall_addInfosToMonsterEvents();
		Chrall_addBubblesToLinks();
		break;
	case "Play_a_Combat.php": //  résultat de combat
		Chrall_analyseResultatCombat();
		break;
	case "FO_Ordres.php":
		Chrall_handleFollowerOrders();
		break;
	case "FO_NewOrder.php":
		Chrall_fillFollowerNewOrderForm();
		chrall.askDestinations();
		break;
	case "Play_a_Sort13.php":
		chrall.askDestinations();
		break;
	case "Guilde_Membres.php":
		chrall.addPartageLinkToAll();
	case "MH_Messagerie.php":
		chrall.compactMessageTitle();
		break;
}



