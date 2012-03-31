/*
 Communication authentifiée avec le serveur Chrall.
 */


(function (chrall) {

	// private
	var sentMessagesCount = 0; // ceci est inutile et sera sans doute supprimé

	chrall.compteChrallActif = function () {
		if (chrall.playerInvalid()) return false;
		var key = 'troll.' + chrall.playerId() + '.compteActif';
		return localStorage[key] == 'yes';
	}


	chrall.setStatutCompte = function (newStatus) {
		if (chrall.playerInvalid()) return;
		var key = 'troll.' + chrall.playerId() + '.compteActif';
		localStorage[key] = newStatus;
	}


	// renvoie le mot de passe du compte chrall (il faut vérifier avant cet appel que le compte est actif)
	chrall.mdpCompteChrall = function () {
		var mdpkey = 'troll.' + chrall.playerId() + '.mdp';
		return localStorage[mdpkey];
	}

	// met à jour sur le serveur (si le compte chrall est actif) les infos du troll du joueur
	chrall.sendPlayerInfosToChrallServer = function () {
		if (!chrall.compteChrallActif()) return;
		
		var troll = {};
		var player = chrall.player();
		if (player.totalSight) troll.Vue = player.totalSight;
		if (player.dlaTime) { // si on n'a pas ça, le reste (hormis la position) est probablement faux
			troll.ProchainTour = player.dlaTime; // timestamp (millisecondes)
			if (player.strainBase) troll.Fatigue = player.strainBase + player.strainMalus;
			if (player.turnDuration) troll.DureeTour = player.turnDuration; // en secondes
			troll.PA = player.pa;
			if (player.pvMax) troll.PV_max = player.pvMax;
			if (player.pv) troll.PV_actuels = player.pv;
		}
		troll.X = player.x;
		troll.Y = player.y;
		troll.Z = player.z;
		chrall.sendToChrallServer("updateTroll", {"Troll":troll});
	}


	chrall.initCommunications = function (action) {
		localStorage['com.status.message'] = 'Compte inexistant ou non connecté'; // on réinitialise à chaque page car on peut être sur un autre troll
		if (action && chrall.compteChrallActif()) {
			chrall.sendToChrallServer(action, {});
		}
	}


	chrall.chrallServer = function () {
		var serveur_prive_in_prefs = localStorage['private_chrall_server'];
		if (serveur_prive_in_prefs) {
			return serveur_prive_in_prefs;
		}
		else {
			return "http://canop.org:8000/chrall/"
		}
	}


	// envoie au serveur un message authentifié par le mdp restreint
	chrall.sendToChrallServer = function (action, message) {
		var player = chrall.player();
		if (!chrall.compteChrallActif()) {
			return false
		}
		//		if (hallIsAccro) {
		//			console.log("l'envoi de messages est désactivé dans le hall des accros");
		//			return false;
		//		}

		var mdpRestreint = chrall.mdpCompteChrall();
		if ((!mdpRestreint) || (mdpRestreint == '')) {
			return false;
		} // on n'envoie pas au serveur si le joueur n'a pas créé de compte
		message['TrollId'] = parseInt(chrall.playerId());
		message['MDP'] = mdpRestreint;
		message['MessageNum'] = ++sentMessagesCount;
		console.log('Message sortant de ' + chrall.pageName() + ' (action=' + action + ') vers ' + chrall.chrallServer() + ' : ');
		console.log(message);
		$.ajax(
				{
					url: chrall.chrallServer() + 'json?v=2&action=' + action + '&message=' + JSON.stringify(message),
					crossDomain: true,
					dataType: "jsonp"
				}
		);
		return true;
	}

	
	chrall.receiveFromChrallServer = function (message) {
		console.log("Message entrant :");
		console.log(message);
		if (message.Error.length > 0) {
			localStorage["com.status.message"] = "Compte en erreur ou problème authentification";
		} else {
			localStorage["com.status.message"] = message.Text;
		}
		if (message.MiPartages && message.MiPartages.length > 0) {
			updateTablesPartage(message.MiPartages);
		}
		if (message.TextMajVue) {
			chrall.notifyUser({text: message.TextMajVue});
			localStorage['troll.' + chrall.player().id + '.messageMaj']
			$("#resultat_maj_vue").text(message.TextMajVue);
		}
		if (message.Actions && message.Actions.length > 0 && typeof(addActionsToMonsterEvents) == "function") {
			addActionsToMonsterEvents(message.Actions);
		}
		$("#com_status_message").text(localStorage["com.status.message"]);
	}


})(window.chrall = window.chrall || {});
