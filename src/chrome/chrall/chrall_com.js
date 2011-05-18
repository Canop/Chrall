/*
Communication authentifiée avec le serveur Chrall.


*/



// envoie au serveur un message authentifié par le mdp restreint
function sendToChrallServer(action, message) {
	if ((!player.id)||(player.id==0)) return false;
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

// appelée par chrall_main, cette méthode intègre dans la page le code de réception (seule façon
//  trouvée pour que le brosseur daigne la considérer comme "sûre")
function prepareReceiver() { 
localStorage['com.status.message']='Compte inexistant ou non connecté'; // on réinitialise à chaque page car on peut être sur un autre troll
$('body').prepend(
'<script>\
function receiveFromChrallServer(message) {\
	console.log("embedded receiveFromChrallServer");\
	console.log(message);\
	console.log("message.ErrorCode.length="+message.ErrorCode.length);\
	if (message.ErrorCode.length>0) {\
		localStorage["com.status.message"]="Compte en erreur : " + message.ErrorCode;\
	} else {\
		localStorage["com.status.message"]=message.Text;\
	}\
	var com_status_message_span = document.getElementById("com_status_message");\
	if (com_status_message_span) com_status_message_span.innerHTML = localStorage["com.status.message"];\
}\
</script>'
);
}
