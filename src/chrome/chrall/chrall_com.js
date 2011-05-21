/*
Communication authentifiée avec le serveur Chrall.


*/

// appelée sans paramètre, indique si le compte est actif, sinon l'active ou le désactive suivant valeur de newValue ("yes" ou "no")
function compteChrallActif(newValue) {
	if ((!player.id)||(player.id==0)) return false;
	var key = 'troll.'+player.id+'.compteActif';
	if (newValue) {
		localStorage[key]=newValue;
	}
	console.log('localStorage['+key+']='+localStorage[key]);
	return localStorage[key]=='yes';
}

// met à jour sur le serveur (si le compte chrall est actif) les infos du troll du joueur
function sendPlayerInfosToChrallServer() {
	var troll = {};
	troll.PV_max = player.pvMax;
	troll.PV_actuels = player.pv;
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
	console.log('Message sent : ');
	console.log(message);
	$.ajax(
		{
			url: 'http://localhost:9090/chrall/json?action='+action+'&message='+JSON.stringify(message),
			crossDomain: true,
			dataType: "jsonp"
		}
	);
	return true;
}

function initCommunications(action) { // l'action reflète surtout ce que l'on veut obtenir dans le message de réponse
	console.log(localStorage);
	if (!action) action='check_account';
	localStorage['com.status.message']='Compte inexistant ou non connecté'; // on réinitialise à chaque page car on peut être sur un autre troll
	console.log('compteChrallActif():'+compteChrallActif());
	console.log("action="+action);
	if (compteChrallActif()) {
		var pendingChange = localStorage['troll.'+player.id+'.actionPartage'];
		if (pendingChange) {
			try {
				var otn = parseInt(localStorage['troll.'+player.id+'.objetPartage']);
				sendToChrallServer(action, {"ChangePartage":localStorage['troll.'+player.id+'.actionPartage'], "IdAutreTroll": otn});
			} catch (e){}
			localStorage['troll.'+player.id+'.actionPartage']='';
		} else {
			sendToChrallServer(action, {});
		}
	}	
}

// appelée par chrall_main, cette méthode intègre dans la page le code de réception (seule façon
//  trouvée pour que le brosseur daigne la considérer comme "sûre").
// Elle regarde également s'il ne traine pas des trucs à envoyer
function prepareReceiver() {
$('body').prepend(
'<script>\
function receiveFromChrallServer(message) {\
	console.log("embedded receiveFromChrallServer");\
	console.log(message);\
	if (message.Error.length>0) {\
		localStorage["com.status.message"]="Compte en erreur : " + message.Error;\
	} else {\
		localStorage["com.status.message"]=message.Text;\
	}\
	if (message.MiPartages && message.MiPartages.length>0) {console.log("Partages reçus :");console.log(message.MiPartages);updateTablesPartage(message.MiPartages);}\
	var com_status_message_span = document.getElementById("com_status_message");\
	if (com_status_message_span) com_status_message_span.innerHTML = localStorage["com.status.message"];\
}\
</script>'
);
}
