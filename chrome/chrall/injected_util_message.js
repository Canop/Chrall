// on ajoute de quoi afficher les messages de gogochrall
function chrall_receiveMessage(answer) {
	if (answer.Nature == 'empty') return;
	document.getElementById('mbox').style.display = 'inline-block';
	document.getElementById('ch_messageTitle').innerHTML = answer.Title;
	document.getElementById('ch_messageContent').innerHTML = '<br><br>' + answer.Content;
}
