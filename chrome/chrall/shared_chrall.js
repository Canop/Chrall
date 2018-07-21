"use strict";
(function(chrall){

	// --------------------------------------------------------
	// -- Constantes globales à reconfigurer pour développement
	// --------------------------------------------------------

	var TEST_LOCAL = false; // passer à true pour tester localement, ce qui suppose évidemment de disposer d'un serveur chrall localement

	var SERVEUR_CHRALL_PUBLIC = "https://chrall.dystroy.org/gogo/"; // l'adresse du serveur principal (celui qui hébèrge le bestaire et les infos publiques)
	//var SERVEUR_CHRALL_PUBLIC = "https://localhost:8000/chrall/"; // l'adresse du serveur principal (celui qui hébèrge le bestaire et les infos publiques)
	var SERVEUR_CHRALL_PRIVE = SERVEUR_CHRALL_PUBLIC; // l'adresse du serveur privé (par défaut le public mais peut être modifié)

	if (!TEST_LOCAL) {
		var serveur_prive_in_prefs = localStorage['private_chrall_server'];
		if (serveur_prive_in_prefs) {
			SERVEUR_CHRALL_PRIVE = serveur_prive_in_prefs;
		}
	}

	chrall.serveurPublic = function(){
		return SERVEUR_CHRALL_PUBLIC;
	}

	chrall.serveurPrive = function(){
		return SERVEUR_CHRALL_PRIVE;
	}

	// --------------------------------------------------------
	// -- mini logging framework
	// --------------------------------------------------------

	var TRACE = 0, DEBUG = 1, INFO = 2, WARN = 3, ERROR = 4; //eslint-disable-line
	var log_level = INFO;

	console.log_trace = function(item){
		if (TRACE < log_level) {
			return;
		}
		console.log(item);
	}
	console.log_debug = function(item){
		if (DEBUG < log_level) {
			return;
		}
		console.log(item);
	}
	console.log_info = function(item){
		if (INFO < log_level) {
			return;
		}
		console.log(item);
	}
	console.log_warn = function(item){
		if (WARN < log_level) {
			return;
		}
		console.warn(item);
	}
	console.log_error = function(item){
		console.error(item);
	}

	// --------------------------------------------------------
	// -- Gestion du "domaine"
	// --------------------------------------------------------

	var pageName;
	var hallIsAccro = document.location.host == "accro.mountyhall.com"; // est-ce qu'on est dans le PH spécial des accros ?

	chrall.pageName = function(){
		if (!pageName) {
			pageName = document.location.pathname.split('/').pop();
		}
		return pageName;
	}

	chrall.hallIsAccro = function(){
		return hallIsAccro;
	}

	// --------------------------------------------------------
	// -- Helpers génériques
	// --------------------------------------------------------

	chrall.formatDuration = function(seconds){
		if (seconds == 0) {
			return "";
		}
		var h = Math.floor(seconds / (3600));
		seconds -= h * (3600);
		var m = Math.floor(seconds / (60));
		return h + (m < 10 ? "h0" : "h") + m;
	};

	// le timestamp passé peut l'être en secondes ou en millisecondes
	chrall.formatDate = function(timestamp){
		if (timestamp == 0) {
			return "";
		}
		if (timestamp<12345678901) timestamp *= 1000;
		var d = new Date(timestamp);
		return d.getDate() + "/" + (d.getMonth() < 9 ? ("0" + (d.getMonth() + 1)) : (d.getMonth() + 1)) + " " +
				d.getHours() + "h" + (d.getMinutes() < 10 ? ("0" + d.getMinutes()) : d.getMinutes());
	};

	chrall.isOptionDisabled = function(key){
		return "yes" != localStorage[key];
	};

	chrall.isOptionEnabled = function(key, defaultChoice){
		var enabled = localStorage[key];
		if (undefined === enabled && undefined !== defaultChoice) {
			localStorage[key] = defaultChoice;
			enabled = defaultChoice;
		}
		return "yes" == enabled;
	};

	chrall.integerOption = function(key, defaultChoice){
		var value = localStorage[key];
		value = parseInt(value);
		if ((undefined === value || isNaN(value)) && undefined !== defaultChoice) {
			localStorage[key] = defaultChoice;
			value = defaultChoice;
		}
		return value;
	};

	/**
	 * Affiche une notification à l'utilisateur pendant quelques secondes
	 * Les options sont un hash dont les clés possibles sont:
	 * <ul>
	 * <li>delay: int, default: 5000, durée d'affichage en ms</li>
	 * <li>text: string, texte à afficher</li>
	 * <li>icon: string, chemin d'une icone (au sein du filesystem de l'extension, le getUrl est fait en interne)</li>
	 * <li>style: des infos de style supplémentaires (genre: background red pour un pbm)</li>
	 * </ul>
	 * @param options
	 */
	chrall.notifyUser = function(options){
		var delay = options['delay'] ? options['delay'] : 5000;

		// besoin d'un div où placer les notifications
		if (!$("#chrall_notify_wrapper").length) {
			$("html").prepend("<div id='chrall_notify_wrapper'></div>");
		}

		var notificationId = "notification_" + new Date().getTime();
		var icon_html = options['icon'] ? '<span class="icon"><img src="' + chrome.extension.getURL(options['icon']) +
				'" /></span>' : '';

		// Injection de la notif (au dessus des autres éventuelles)
		var wrapper = $("#chrall_notify_wrapper");
		var style = options['style'] ? "display:none;" + options['style'] : "display:none";
		wrapper.prepend('<div class="chrall_notify" id="' + notificationId + '" style="' + style + '">' + icon_html +
				options["text"] + '</div>');

		// Affichage
		$("div#" + notificationId).slideDown("fast").delay(delay).slideUp("fast", function(){
			$(this).remove()
		});
	};


	// Fonction pour initialiser en masse une série de valeurs dans le local storage, liées à un troll particulier
	chrall.setTrollStorage = function(valueMap){
		for (var key in valueMap) {
			localStorage['troll.' + chrall.playerId() + key] = valueMap[key];
		}
	};

	chrall.getTrollStorage = function(key){
		return localStorage['troll.' + chrall.playerId() + key];
	};

	// Pendant de setTrollStorage, pour nettoyer après usage
	chrall.clearTrollStorage = function(){
		for (var i = 0; i < arguments.length; i++) {
			localStorage.removeItem('troll.' + chrall.playerId() + arguments[i]);
		}
	};


	// --------------------------------------------------------
	// -- Gestion de l'objet lié au Troll de l'utilisateur
	// --------------------------------------------------------

	// le troll du joueur. Sera éventuellement récupéré de la page de fond dans getBackgroundInfosThenExecute
	var currentPlayer = new Troll();

	chrall.player = function(){
		return currentPlayer;
	};

	chrall.playerId = function(){
		return currentPlayer.id;
	};

	chrall.playerInvalid = function(){
		return (!chrall.playerId()) || (chrall.playerId() == 0);
	};

	if ("PlayStart.php" == chrall.pageName()) {
		localStorage.removeItem('last_saved_troll_id');
	} else {
		currentPlayer.restore(); // on récupère les infos qui ont pu être obtenues dans d'autres frames ou pages
	}


})(window.chrall = window.chrall || {});
