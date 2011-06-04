/*
Communication authentifiée avec le serveur Chrall.


*/

var sentMessagesCount = 0;

// appelée sans paramètre, indique si le compte est actif, sinon l'active ou le désactive suivant valeur de newValue ("yes" ou "no")
function compteChrallActif(newValue) {
	if ((!player.id)||(player.id==0)) return false;
	var key = 'troll.'+player.id+'.compteActif';
	if (newValue) {
		localStorage[key]=newValue;
	}
	return localStorage[key]=='yes';
}

// renvoie le mot de passe du compte chrall (il faut vérifier avant cet appel que le compte est actif)
function mdpCompteChrall() {
	var mdpkey = 'troll.'+player.id+'.mdp';
	return localStorage[mdpkey];
}

// met à jour sur le serveur (si le compte chrall est actif) les infos du troll du joueur
function sendPlayerInfosToChrallServer() {
	var troll = {};
	if (player.totalSight) troll.Vue = player.totalSight;
	if (player.dlaTime) { // si on n'a pas ça, le reste (hormis la position) est probablement faux
		troll.ProchainTour = player.dlaTime; // timestamp (millisecondes)
		if (player.strainBase) troll.Fatigue = player.strainBase+player.strainMalus;
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
	var mdpkey = 'troll.'+player.id+'.mdp';
	var mdpRestreint = localStorage[mdpkey];
	if ((!mdpRestreint) || (mdpRestreint=='')) return false; // on n'envoie pas au serveur si le joueur n'a pas créé de compte
	message['TrollId'] = player.id;
	message['MDP'] = mdpRestreint;
	message['MessageNum'] = ++sentMessagesCount;
	console.log('Message sortant de '+pageName+' (action='+action+') : ');
	console.log(message);
	$.ajax(
		{
			url: GOGOCHRALL + 'json?v=2&action='+action+'&message='+JSON.stringify(message),
			crossDomain: true,
			dataType: "jsonp"
		}
	);
	return true;
}

function initCommunications(action) {
	localStorage['com.status.message']='Compte inexistant ou non connecté'; // on réinitialise à chaque page car on peut être sur un autre troll
	if (action && compteChrallActif()) {
		var pendingChange = localStorage['troll.'+player.id+'.actionPartage'];
		if (pendingChange) {
			try {
				var otn = parseInt(localStorage['troll.'+player.id+'.objetPartage']);
				sendToChrallServer(action, {"ChangePartage":localStorage['troll.'+player.id+'.actionPartage'], "IdCible": otn});
			} catch (e){}
			localStorage.removeItem('troll.'+player.id+'.actionPartage');
		} else {
			sendToChrallServer(action, {});
		}
		// on lance en parallèle séparément la maj de la vue car gogochrall devra attendre la réponse du serveur soap de MH
		var demandeMajVue = localStorage['troll.'+player.id+'.majVue'];
		if (demandeMajVue) {
			try {
				var numMajVue = parseInt(localStorage['troll.'+player.id+'.majVue']);
				sendToChrallServer("maj_vue", {"IdCible": numMajVue});
			} catch (e){}
			localStorage.removeItem('troll.'+player.id+'.majVue');
		}		
	}	
}

// appelée par chrall_main, cette méthode intègre dans la page le code de réception (seule façon
//  trouvée pour que le brosseur daigne la considérer comme "sûre").
// Elle regarde également s'il ne traine pas des trucs à envoyer
function prepareReceiver() {
$('body').prepend(
'<script>\
function formatDuration(seconds) {\
	if (seconds==0) return "";\
	var h = Math.floor(seconds/(3600));\
	seconds -= h*(3600);\
	var m = Math.floor(seconds/(60));\
	return h+(m<10?"h0":"h")+m;\
}\
function formatDate(timestamp) {\
	if (timestamp==0) return "";\
	var d = new Date(timestamp);\
	return d.getDate()+"/"+(d.getMonth()<9?("0"+(d.getMonth()+1)):(d.getMonth()+1))+" "+d.getHours()+"h"+(d.getMinutes()<10?("0"+d.getMinutes()):d.getMinutes());\
}\
function receiveFromChrallServer(message) {\
	console.log("Message entrant :");\
	console.log(message);\
	if (message.Error.length>0) {\
		localStorage["com.status.message"]="Compte en erreur ou problème authentification";\
	} else {\
		localStorage["com.status.message"]=message.Text;\
	}\
	var span_resultat_maj_vue = document.getElementById("resultat_maj_vue");\
	if (message.MiPartages && message.MiPartages.length>0 && typeof(updateTablesPartage)=="function") updateTablesPartage(message.MiPartages);\
	if (message.TextMajVue && span_resultat_maj_vue) span_resultat_maj_vue.innerHTML = message.TextMajVue;\
	if (message.Actions && message.Actions.length>0 && typeof(addActionsToMonsterEvents)=="function") addActionsToMonsterEvents(message.Actions);\
	var com_status_message_span = document.getElementById("com_status_message");\
	if (com_status_message_span) com_status_message_span.innerHTML = localStorage["com.status.message"];\
}\
</script>'
);
}
