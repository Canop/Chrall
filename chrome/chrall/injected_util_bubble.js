$('body').append($("<input type='hidden' id='bubbleRequestId' value=''/>"));

// ce nom n'est pas générique parce que je n'ai  pas eu envie de couper la compatibilité client-serveur le temps que les testeurs changent de version...
function grid_receive(answer) {
	// on vérifie que la réponse correspond à la bulle actuelle (et pas à une bulle fermée)
	if ($('#bubbleRequestId').val() != answer.RequestId) {
		//console.log('answer received to old request : ' + answer.RequestId);
		return;
	}
	var div = $('#bubbleContent');
	if (div) { // il n'y a plus de div si la bulle est close
		div.html(answer.Html);
	}
}
