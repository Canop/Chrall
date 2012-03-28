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

var resetTroll = pageName == "PlayStart.php";
if (resetTroll) {
	localStorage.removeItem('last_saved_troll_id');
} else {
	player.restore(); // on récupère les infos qui ont pu être obtenues dans d'autres frames ou pages
}
console.log("pageName=\"" + pageName + "\"");


function createInjectNode(fileName) {
	var scriptNode;
	scriptNode = document.createElement('script');
	scriptNode.setAttribute("type", "application/javascript");
	scriptNode.setAttribute("src", chrome.extension.getURL(fileName));
	return scriptNode;
}

// Injecte une série de scripts à exécuter dans le contexte de la page.
// La fonction callback est exécutée lorsque tous les scripts ont été chargés.
function inject(scriptList, callback) {
	var firstNode = createInjectNode(scriptList[0]);
	var previousNode = firstNode;
	for (var i = 1; i < scriptList.length; i++) {
		var nextNode = createInjectNode(scriptList[i]);
		previousNode.onload = (function(name, node) {
			return function() {
				console.log("Injecting ", name);
				document.body.appendChild(node);
			}
		})(scriptList[i], nextNode);
		previousNode = nextNode;
	}
	console.log("Injecting " + scriptList[0]);
	if (typeof callback != "undefined") {
		previousNode.onload = function() {
			console.log("calling callback");
			callback();
		}
	}
	document.body.appendChild(firstNode);
}

switch (pageName) {
	case "PlayStart.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js", ], function() {
			Chrall_analyseAndReformatStartPage()
		});
		break;
	case "Play_profil.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js", "injected_util_message.js"], function() {
			initCommunications();
			Chrall_analyseAndReformatProfile();
		});
		break;
	case "Play_vue.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js", "shared_notify.js",
			"injected_view_partage.js"], function() {
			initCommunications('get_partages');
			Chrall_analyseAndReformatView();
		});
		break;
	case "Play_mouche.php":
		//Chrall_analyseAndReformatFlies();
		break;
	case "Play_BM.php":
		inject(["jquery.js", "injected_util_bubble.js","injected_com.js", "injected_notes.js", ], function() {
			Chrall_analyseAndReformatBM();
		});
		break;
	case "Play_equipement.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			var section = getUrlParameter('as_CurSect', 'equip');
			if (section == 'equip') Chrall_analyseAndReformatEquipment();
		});
		break;
	case "Play_evenement.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_addBubblesToLinks();
		});
		break;
	case "Play_action.php": // c'est la frame en bas qui contient le menu d'action
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_listenForChangeLocation('action');
			Chrall_handleActionPage();
		});
		break;
	case "Play_option.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			initCommunications('check_account');
			Chrall_reformatOptionsView();
		});
		break;
	case "Play_a_Competence16.php": // préparation de CDM (le formulaire de choix du monstre)
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_handleBeforeCdmPage();
		});
		break;
	case "Play_a_Competence16b.php": // résultat de cdm
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_handleCdmPage();
		});
		break;
	case "Play_a_Competence18b.php": // résultat d'insulte
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_analyseResultatInsulte();
		});
		break;
	case "Play_a_Competence18.php": // préparation d'insulte
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_prepareInsulte();
		});
		break;
	case "Play_a_Competence29.php": // préparation de minage (le formulaire dans la frame d'action)
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_handleBeforeMinage();
		});
		break;
	case "Play_a_Competence29b.php": // résultat de minage
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_handleMinagePage();
		});
		break;
	case "Play.php": // c'est le frameset qui engloble tout
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_preparePlayInputs();
		});
		break;
	case "Play_menu.php": // c'est la frame de gauche
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_handleMenuPage();
		});
		break;
	case "Play2.php": // c'est le frameset qui engloble tout ce qui n'est pas la colonne menu de gauche
		break;
	case "Play_a_Move.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_move.js"], function() {
			Chrall_listenForChangeLocation('action');
		});
		break;
	case "PJView.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_analyseAndReformatPJView();
		});
		break;
	case "PJView_Events.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_analysePJEventsView();
			Chrall_addBubblesToLinks();
		});
		break;
	case "Play_news.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_addBubblesToLinks();
		});
		break;
	case "MonsterView.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_analyseAndReformatMonsterView();
			Chrall_addInfosToMonsterEvents();
			Chrall_addBubblesToLinks();
		});
		break;
	case "Play_a_Combat.php": //  résultat de combat
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_analyseResultatCombat();
		});
		break;
	case "FO_Ordres.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_handleFollowerOrders();
		});
		break;
	case "FO_NewOrder.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_fillFollowerNewOrderForm();
			Chrall_askDestinations("injected_answer_gowap_destination.js");
		});
		break;
	case "Play_a_Sort13.php":
		inject(["jquery.js", "injected_util_bubble.js", "injected_com.js", "injected_notes.js"], function() {
			Chrall_askDestinations("injected_answer_teleport_destination.js");
		});
		break;
}

player.save(); // on sauvegarde localement les infos du troll (par exemple sa position), afin que les frames qui ne l'ont pas directement en disposent


