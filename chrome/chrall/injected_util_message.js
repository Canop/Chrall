"use strict";
// on ajoute de quoi afficher les messages de gogochrall
// Cette fonction est appelée par le serveur via JSONP
window.chrall_receiveMessage = function(answer){
	if (answer.Nature == 'empty') return;
	document.getElementById('mbox').style.display = 'inline-block';
	document.getElementById('ch_messageTitle').innerHTML = answer.Title;
	document.getElementById('ch_messageContent').innerHTML = '<br><br>' + answer.Content;
}
