$('body').append($("<input type='hidden' id='bubbleRequestId' value=''/>"));

// ce nom n'est pas générique parce que je n'ai  pas eu envie de couper la compatibilité client-serveur le temps que les testeurs changent de version...
function grid_receive(answer) {
	// on vérifie que la réponse correspond à la bulle actuelle (et pas à une bulle fermée)
	if ($('#bubbleRequestId').val() != answer.RequestId) {
		//console.log('answer received to old request : ' + answer.RequestId);
		return;
	}

	// Store the result of the Ajax query in the dom, so that it doesn't need to be requested again, ligthening the
	// load on the server
	// canop : je désactive ce système de cache (bug perte d'une partie du contenu et inutile pour Chrall pour l'instant)
	/*
	var cacheId = $('#bubbleRequestId').attr('cacheId');
	if (cacheId) {
		var $whereToCache = $('#' + cacheId);
		$whereToCache.attr('cached_bubble_value', answer.Html);
	}
	*/

	var div = $('#bubbleContent');
	if (div) { // il n'y a plus de div si la bulle est close
		div.html(answer.Html);
	}
}
