function formatDuration(seconds) {
	if (seconds == 0) return "";
	var h = Math.floor(seconds / (3600));
	seconds -= h * (3600);
	var m = Math.floor(seconds / (60));
	return h + (m < 10 ? "h0" : "h") + m;
}


function formatDate(timestamp) {
	if (timestamp == 0) return "";
	var d = new Date(timestamp);
	return d.getDate() + "/" + (d.getMonth() < 9 ? ("0" + (d.getMonth() + 1)) : (d.getMonth() + 1)) + " " + d.getHours() + "h" + (d.getMinutes() < 10 ? ("0" + d.getMinutes()) : d.getMinutes());
}


function compteChrallActif(player) {
	if ((!player.id) || (player.id == 0)) return false;
	var key = 'troll.' + player.id + '.compteActif';
	return localStorage[key] == 'yes';
}


// renvoie le mot de passe du compte chrall (il faut vérifier avant cet appel que le compte est actif)
function mdpCompteChrall(player) {
	var mdpkey = 'troll.' + player.id + '.mdp';
	return localStorage[mdpkey];
}


function chrallServer() {
	var serveur_prive_in_prefs = localStorage['private_chrall_server'];
	if (serveur_prive_in_prefs) {
		return serveur_prive_in_prefs;
	}
	else {
		return "http://canop.org:8000/chrall/"
	}
}


// envoie au serveur un message authentifié par le mdp restreint
function sendToChrallServer(action, message) {
	var player = chrall.player();
	if (!compteChrallActif(player)) {
		return false
	}
	var mdpRestreint = mdpCompteChrall(player);
	if ((!mdpRestreint) || (mdpRestreint == '')) {
		return false;
	} // on n'envoie pas au serveur si le joueur n'a pas créé de compte
	message['TrollId'] = parseInt(player.id);
	message['MDP'] = mdpRestreint;
	message['MessageNum'] = 0;
	console.log('Message sortant (action=' + action + ') vers ' + chrallServer() + ' : ');
	console.log(message);
	$.ajax(
			{
				url: chrallServer() + 'json?v=2&action=' + action + '&message=' + JSON.stringify(message),
				crossDomain: true,
				dataType: "jsonp"
			}
	);
	return true;
}


function receiveFromChrallServer(message) {
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
