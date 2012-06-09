(function (chrall) {

	// --------------------------------------------------------
	// -- Constantes globales à reconfigurer pour développement
	// --------------------------------------------------------

	var TEST_LOCAL = false; // passer à true pour tester localement, ce qui suppose évidemment de disposer d'un serveur chrall localement

	var SERVEUR_CHRALL_PUBLIC = "http://canop.org:8000/chrall/"; // l'adresse du serveur principal (celui qui hébèrge le bestaire et les infos publiques)
	//var SERVEUR_CHRALL_PUBLIC = "http://localhost:8000/chrall/"; // l'adresse du serveur principal (celui qui hébèrge le bestaire et les infos publiques)
	var SERVEUR_CHRALL_PRIVE = SERVEUR_CHRALL_PUBLIC; // l'adresse du serveur privé (par défaut le public mais peut être modifié)

	if (!TEST_LOCAL) {
		var serveur_prive_in_prefs = localStorage['private_chrall_server'];
		if (serveur_prive_in_prefs) SERVEUR_CHRALL_PRIVE = serveur_prive_in_prefs;
	}

	chrall.serveurPublic = function() {
		return SERVEUR_CHRALL_PUBLIC;
	}

	chrall.serveurPrive = function() {
		return SERVEUR_CHRALL_PRIVE;
	}

	// --------------------------------------------------------
	// -- mini logging framework
	// --------------------------------------------------------

	var TRACE = 0, DEBUG = 1, INFO = 2, WARN = 3, ERROR = 4;
	var log_level = INFO;

	console.log_trace = function(item) {
		if (TRACE < log_level ) { return; }
		console.log(item);
	}
	console.log_debug= function(item) {
		if (DEBUG < log_level ) { return; }
		console.log(item);
	}
	console.log_info= function(item) {
		if (INFO < log_level ) { return; }
		console.log(item);
	}
	console.log_warn = function(item) {
		if (WARN < log_level ) { return; }
		console.warn(item);
	}
	console.log_error = function(item) {
		console.error(item);
	}


	// --------------------------------------------------------
	// -- Gestion du "domaine"
	// --------------------------------------------------------

	var pageName;
	var hallIsAccro = document.location.host == "accro.mountyhall.com"; // est-ce qu'on est dans le PH spécial des accros ?

	chrall.pageName = function() {
		if (!pageName) {
			var pathTokens = document.location.pathname.split('/');
			pageName = pathTokens[pathTokens.length - 1];
		}
		return pageName;
	}

	chrall.hallIsAccro = function() {
		return hallIsAccro;
	}


	// --------------------------------------------------------
	// -- Intégration des scripts
	// --------------------------------------------------------

	var STANDARD_INJECTED_SCRIPT = ["jquery.js", "chrall_things.js", "shared_chrall.js", "injected_util_bubble.js", "shared_communication.js", "injected_notes.js", ];

	// Private
	function createInjectNode(fileName) {
		var scriptNode;
		scriptNode = document.createElement('script');
		scriptNode.setAttribute("type", "application/javascript");
		scriptNode.setAttribute("src", chrome.extension.getURL(fileName));
		return scriptNode;
	}

	// Injecte une série de scripts à exécuter dans le contexte de la page.
	// La fonction callback est exécutée lorsque tous les scripts ont été chargés.
	chrall.inject = function (scriptList, callback) {
		var firstNode = createInjectNode(scriptList[0]);
		var previousNode = firstNode;
		for (var i = 1; i < scriptList.length; i++) {
			var nextNode = createInjectNode(scriptList[i]);
			previousNode.onload = (function(name, node) {
				return function() {
					console.log_debug("Injecting ", name);
					document.body.appendChild(node);
				}
			})(scriptList[i], nextNode);
			previousNode = nextNode;
		}
		console.log_debug("Injecting " + scriptList[0]);
		if (typeof callback != "undefined") {
			previousNode.onload = function() {
				console.log_debug("calling callback");
				callback();
			}
		}
		document.body.appendChild(firstNode);
	};

	chrall.doWithInjection = function () {
		var length = arguments.length;
		var callback = Array.prototype.slice.call(arguments, length - 1)[0];
		var scriptList = length > 1 ? Array.prototype.slice.call(arguments, 0, length - 1) : new Array();
		var allScripts = STANDARD_INJECTED_SCRIPT.concat(scriptList);
		chrall.inject(allScripts, callback);
	}

	// Just a placeholder to easily switch from injected to non-injected
	chrall.doWithoutInjection = function(callback) {
		callback();
	}


	// --------------------------------------------------------
	// -- Helpers génériques
	// --------------------------------------------------------

	chrall.formatDuration = function (seconds) {
		if (seconds == 0) return "";
		var h = Math.floor(seconds / (3600));
		seconds -= h * (3600);
		var m = Math.floor(seconds / (60));
		return h + (m < 10 ? "h0" : "h") + m;
	}


	chrall.formatDate = function (timestamp) {
		// TODO: y a surement plus propre
		if (timestamp == 0) return "";
		var d = new Date(timestamp);
		return d.getDate() + "/" + (d.getMonth() < 9 ? ("0" + (d.getMonth() + 1)) : (d.getMonth() + 1)) + " " + d.getHours() + "h" + (d.getMinutes() < 10 ? ("0" + d.getMinutes()) : d.getMinutes());
	}

	chrall.isOptionDisabled = function (key) {
		return "yes" != localStorage[key];
	}

	chrall.isOptionEnabled = function (key) {
		return "yes" == localStorage[key];
	}


	// Affiche une notification à l'utilisateur pendant quelques secondes
	// Les options sont un hash dont les clés possibles sont:
	//	delay: int, default: 5000, durée d'affichage en ms
	//	text: string, texte à afficher
	//	icon: string, chemin d'une icone (au sein du filesystem de l'extension, le getUrl est fait en interne)
	//	style: des infos de style supplémentaires (genre: background red pour un pbm)
	chrall.notifyUser = function (options) {
		var delay = options['delay'] ? options['delay'] : 5000;

		// besoin d'un div où placer les notifications
		if (!$("#chrall_notify_wrapper").length) {
			$("html").prepend("<div id='chrall_notify_wrapper'></div>");
		}

		var notificationId = "notification_" + new Date().getTime();
		var icon_html = options['icon'] ? '<span class="icon"><img src="' + chrome.extension.getURL(options['icon']) + '" /></span>' : '';

		// Injection de la notif (au dessus des autres éventuelles)
		var wrapper = $("#chrall_notify_wrapper");
		var style = options['style'] ? "display:none;" + options['style'] : "display:none";
		wrapper.prepend('<div class="chrall_notify" id="' + notificationId + '" style="' + style + '">' + icon_html + options["text"] + '</div>');

		// Affichage
		$("div#" + notificationId).slideDown("fast").delay(delay).slideUp("fast", function() {$(this).remove()});
	};


	// Fonction pour initialiser en masse une série de valeurs dans le local storage, liées à un troll particulier
	chrall.setTrollStorage = function (valueMap) {
		for (key in valueMap) {
			localStorage['troll.' + chrall.playerId() + key] = valueMap[key];
		}
	}

	chrall.getTrollStorage = function (key) {
		return localStorage['troll.' + chrall.playerId() + key];
	}


	// Pendant de setTrollStorage, pour nettoyer après usage
	chrall.clearTrollStorage = function () {
		for (var i = 0; i < arguments.length; i++) {
			localStorage.removeItem('troll.' + chrall.playerId() + arguments[i]);
		}
	}


	// --------------------------------------------------------
	// -- Gestion de l'objet lié au Troll de l'utilisateur
	// --------------------------------------------------------

	// le troll du joueur. Sera éventuellement récupéré de la page de fond dans getBackgroundInfosThenExecute
	var currentPlayer = new Troll();

	chrall.player = function() {
		return currentPlayer;
	}

	chrall.playerId = function() {
		return currentPlayer.id;
	}

	chrall.playerInvalid = function() {
		return (!chrall.playerId()) || (chrall.playerId() == 0);
	}

	if ("PlayStart.php" == chrall.pageName()) {
		localStorage.removeItem('last_saved_troll_id');
	} else {
		currentPlayer.restore(); // on récupère les infos qui ont pu être obtenues dans d'autres frames ou pages
	}


})(window.chrall = window.chrall || {});
