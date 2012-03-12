/*
 * ce script lance les actions (les autres ne contiennent que des classes et des fonctions appelées depuis ici).
 * Il contient aussi les variables globales.
 */


var GOGOCHRALL = "http://canop.org:8000/chrall/";
var TEST_LOCAL = false; // passer à true pour tester localement, ce qui suppose évidemment de disposer d'un serveur chrall localement

var SERVEUR_CHRALL_PUBLIC = GOGOCHRALL; // l'adresse du serveur principal (celui qui hébèrge le bestaire et les infos publiques)
var SERVEUR_CHRALL_PRIVE = SERVEUR_CHRALL_PUBLIC; // l'adresse du serveur privé (par défaut le public mais peut être modifié)
if (TEST_LOCAL) {
	SERVEUR_CHRALL_PUBLIC = "http://localhost:8000/chrall/";
	SERVEUR_CHRALL_PRIVE = SERVEUR_CHRALL_PUBLIC;
} else {
	var serveur_prive_in_prefs = localStorage['private_chrall_server'];
	if (serveur_prive_in_prefs) SERVEUR_CHRALL_PRIVE = serveur_prive_in_prefs;
}

var viewIsEmpty = true; // correspond à un état d'analyse de la vue
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
	"cénotaphes" : false,
	"intangibles" : true,
	"3D" : true
};

var splitedPathname = document.location.pathname.split('/');
var hallIsAccro = document.location.host == "accro.mountyhall.com"; // est-ce qu'on est dans le PH spécial des accros ?
var pageName = splitedPathname[splitedPathname.length - 1];
console.log("pageName=\"" + pageName + "\"");

var resetTroll = pageName == "PlayStart.php";
if (!resetTroll) {
	player.restore(); // on récupère les infos qui ont pu être obtenues dans d'autres frames ou pages
}

$.getScript(chrome.extension.getURL("jquery.js"), function() {
	// Il y a quelque chose de pas hyper compréhensible ici, quelle que soit la manière dont les scripts sont
	// injectés dans la page (s'ils ne le sont pas par l'ajout d'un noeud de jscript pur et dur mais par l'ajout
	// d'un noeud avec attribut "src" ou par l'invocation de $.getScript), ça semble être fait de façon
	// asynchrone et parallele. Du coup, si les scripts injectés font appel à JQuery (c'est quand même plus pratique)
	// ce dernier n'a pas forcément été parsé complètement avant. C'est un peu gênant, il faudrait trouver comment
	// forcer le chargement des scripts de façon synchrone.
	Chrall_inject("injected_util_bubble.js");
});
Chrall_inject('injected_com.js');
Chrall_inject('injected_notes.js');


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
		//Chrall_analyseAndReformatFlies();
		break;
	case "Play_BM.php":
		Chrall_analyseAndReformatBM();
		break;
	case "Play_equipement.php":
		var section = getUrlParameter('as_CurSect', 'equip');
		if (section == 'equip') Chrall_analyseAndReformatEquipment();
		break;
	case "Play_evenement.php":
		Chrall_addBubblesToLinks();
		break;
	case "Play_action.php": // c'est la frame en bas qui contient le menu d'action
		Chrall_listenForChangeLocation('action');
		Chrall_handleActionPage();
		break;
	case "Play_option.php":
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
		break;
	case "Play_a_Move.php":
		Chrall_listenForChangeLocation('action');
		Chrall_inject('injected_move.js');
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
	case "Play_a_Combat.php": //  résultat de combat
		Chrall_analyseResultatCombat();
	case "FO_Ordres.php":
		Chrall_handleFollowerOrders();
		break;
	case "FO_NewOrder.php":
		Chrall_fillFollowerNewOrderForm();
		Chrall_askDestinations("injected_answer_gowap_destination.js");
		break;
	case "Play_a_Sort13.php":
		Chrall_askDestinations("injected_answer_teleport_destination.js");
		break;
}

player.save(); // on sauvegarde localement les infos du troll (par exemple sa position), afin que les frames qui ne l'ont pas directement en disposent


