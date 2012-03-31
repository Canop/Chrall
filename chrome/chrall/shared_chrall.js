(function (chrall) {

	var pageName;

	chrall.pageName = function() {
		if (!pageName) {
			var pathTokens = document.location.pathname.split('/');
			pageName = pathTokens[pathTokens.length - 1];
		}
		return pageName;
	}

	var STANDARD_INJECTED_SCRIPT = ["jquery.js", "chrall_things.js", "shared_chrall.js", "injected_util_bubble.js", "shared_communication.js", "injected_notes.js", ];

	// Private
	function createInjectNode(fileName) {
		var scriptNode;
		scriptNode = document.createElement('script');
		scriptNode.setAttribute("type", "application/javascript");
		scriptNode.setAttribute("src", chrome.extension.getURL(fileName));
		return scriptNode;
	}

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

	// Injecte une série de scripts à exécuter dans le contexte de la page.
	// La fonction callback est exécutée lorsque tous les scripts ont été chargés.
	chrall.inject = function (scriptList, callback) {
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
		wrapper.prepend('<div class="chrall_notify" id="' + notificationId + '" style="display:none">' + icon_html + options["text"] + '</div>');

		// Affichage
		$("div#" + notificationId).slideDown("fast").delay(delay).slideUp("fast", function() {$(this).remove()});
	};


	// Fonction pour initialiser en masse une série de valeurs dans le local storage, liées à un troll particulier
	chrall.setTrollStorage = function (valueMap) {
		for (key in valueMap) {
			localStorage['troll.' + player.id + key] = valueMap[key];
		}
	}


	// Pendant de setTrollStorage, pour nettoyer après usage
	chrall.clearTrollStorage = function () {
		for (var i = 0; i < arguments.length; i++) {
			localStorage.removeItem('troll.' + player.id + arguments[i]);
		}
	}


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


