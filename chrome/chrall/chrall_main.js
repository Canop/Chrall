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
		chrall.doWithInjection(function() {
			Chrall_analyseAndReformatStartPage()
		});
		break;
	case "Play_profil.php":
		chrall.doWithInjection("injected_util_message.js", function() {
			chrall.initCommunications();
			Chrall_analyseAndReformatProfile();
		});
		break;
	case "Play_vue.php":
		chrall.doWithInjection("injected_view_grid.js", "injected_view_partage.js", function() {
			Chrall_analyseAndReformatView();
			chrall.initCommunications('get_partages');
		});
		break;
	case "Play_mouche.php":
		//Chrall_analyseAndReformatFlies();
		break;
	case "Play_BM.php":
		chrall.doWithInjection(function() {
			Chrall_analyseAndReformatBM();
		});
		break;
	case "Play_equipement.php":
		break;
	case "Play_evenement.php":
		chrall.doWithInjection(function() {
			Chrall_addBubblesToLinks();
		});
		break;
	case "Play_action.php": // c'est la frame en bas qui contient le menu d'action
		chrall.doWithInjection(function() {
			Chrall_listenForChangeLocation('action');
			Chrall_handleActionPage();
		});
		break;
	case "Play_option.php":
		chrall.doWithInjection(function() {
			chrall.initCommunications('check_account');
			chrall.reformatOptionsView();
		});
		break;
	case "Play_a_Competence16.php": // préparation de CDM (le formulaire de choix du monstre)
		chrall.doWithInjection(function() {
			Chrall_handleBeforeCdmPage();
		});
		break;
	case "Play_a_Competence16b.php": // résultat de cdm
		chrall.doWithInjection("injected_cdm.js", function() {
			Chrall_handleCdmPage();
		});
		break;
	case "Play_a_Competence18b.php": // résultat d'insulte
		chrall.doWithInjection(function() {
			Chrall_analyseResultatInsulte();
		});
		break;
	case "Play_a_Competence18.php": // préparation d'insulte
		chrall.doWithInjection(function() {
			Chrall_prepareInsulte();
		});
		break;
	case "Play_a_Competence29.php": // préparation de minage (le formulaire dans la frame d'action)
		chrall.doWithInjection(function() {
			Chrall_handleBeforeMinage();
		});
		break;
	case "Play_a_Competence29b.php": // résultat de minage
		chrall.doWithInjection(function() {
			Chrall_handleMinagePage();
		});
		break;
	case "Play.php": // c'est le frameset qui engloble tout
		chrall.doWithInjection(function() {
			Chrall_preparePlayInputs();
		});
		break;
	case "Play_menu.php": // c'est la frame de gauche
		chrall.doWithInjection(function() {
			Chrall_handleMenuPage();
		});
		break;
	case "Play2.php": // c'est le frameset qui engloble tout ce qui n'est pas la colonne menu de gauche
		break;
	case "Play_a_Move.php":
		chrall.doWithInjection("injected_move.js", function() {
			Chrall_listenForChangeLocation('action');
		});
		break;
	case "PJView.php":
		chrall.doWithInjection(function() {
			Chrall_analyseAndReformatPJView();
		});
		break;
	case "PJView_Events.php":
		chrall.doWithInjection(function() {
			Chrall_analysePJEventsView();
			Chrall_addBubblesToLinks();
		});
		break;
	case "Play_news.php":
		chrall.doWithInjection(function() {
			Chrall_addBubblesToLinks();
		});
		break;
	case "MonsterView.php":
		chrall.doWithInjection("injected_events.js", function() {
			chrall.analyseAndReformatMonsterView();
			Chrall_addInfosToMonsterEvents();
			Chrall_addBubblesToLinks();
		});
		break;
	case "Play_a_Combat.php": //  résultat de combat
		chrall.doWithInjection(function() {
			Chrall_analyseResultatCombat();
		});
		break;
	case "FO_Ordres.php":
		chrall.doWithInjection(function() {
			Chrall_handleFollowerOrders();
		});
		break;
	case "FO_NewOrder.php":
		chrall.doWithInjection("injected_answer_destination.js", function() {
			Chrall_fillFollowerNewOrderForm();
			chrall.askDestinations();
		});
		break;
	case "Play_a_Sort13.php":
		chrall.doWithInjection("injected_answer_destination.js", function() {
			chrall.askDestinations();
		});
		break;
	case "Guilde_Membres.php":
		chrall.doWithInjection(function() {
			chrall.addPartageLinkToAll();
		});
	case "MH_Messagerie.php":
		chrall.doWithInjection(function() {
			chrall.compactMessageTitle();
		});
		break;
}

//player.save(); // on sauvegarde localement les infos du troll (par exemple sa position), afin que les frames qui ne l'ont pas directement en disposent


