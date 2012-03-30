/*
 Communication authentifiée avec le serveur Chrall.
 */

var sentMessagesCount = 0; // ceci est inutile et sera sans doute supprimé

// appelée sans paramètre, indique si le compte est actif, sinon l'active ou le désactive suivant valeur de newValue ("yes" ou "no")
function compteChrallActif(newValue) {
	if ((!player.id) || (player.id == 0)) return false;
	var key = 'troll.' + player.id + '.compteActif';
	if (newValue) {
		localStorage[key] = newValue;
	}
	return localStorage[key] == 'yes';
}

// renvoie le mot de passe du compte chrall (il faut vérifier avant cet appel que le compte est actif)
function mdpCompteChrall() {
	var mdpkey = 'troll.' + player.id + '.mdp';
	return localStorage[mdpkey];
}

// met à jour sur le serveur (si le compte chrall est actif) les infos du troll du joueur
function sendPlayerInfosToChrallServer() {
	var troll = {};
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
	sendToChrallServer("updateTroll", {"Troll":troll});
}

// envoie au serveur un message authentifié par le mdp restreint
function sendToChrallServer(action, message) {
	if (!compteChrallActif()) return false
	if (hallIsAccro) {
		console.log("l'envoi de messages est désactivé dans le hall des accros");
		return false;
	}
	var mdpkey = 'troll.' + player.id + '.mdp';
	var mdpRestreint = localStorage[mdpkey];
	if ((!mdpRestreint) || (mdpRestreint == '')) return false; // on n'envoie pas au serveur si le joueur n'a pas créé de compte
	message['TrollId'] = player.id;
	message['MDP'] = mdpRestreint;
	message['MessageNum'] = ++sentMessagesCount;
	console.log('Message sortant de ' + chrall.pageName() + ' (action=' + action + ') vers ' + SERVEUR_CHRALL_PRIVE + ' : ');
	console.log(message);
	$.ajax(
			{
				url: SERVEUR_CHRALL_PRIVE + 'json?v=2&action=' + action + '&message=' + JSON.stringify(message),
				crossDomain: true,
				dataType: "jsonp"
			}
	);
	return true;
}

function initCommunications(action) {
	localStorage['com.status.message'] = 'Compte inexistant ou non connecté'; // on réinitialise à chaque page car on peut être sur un autre troll
	if (action && compteChrallActif()) {
		sendToChrallServer(action, {});
	}
}

