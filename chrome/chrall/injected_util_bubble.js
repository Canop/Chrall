if (0 == $("#bubbleRequestId").size()) {
	$('body').append($("<input type='hidden' id='bubbleRequestId' value=''/>"));
}

// ce nom n'est pas générique parce que je n'ai  pas eu envie de couper la compatibilité client-serveur le temps que les testeurs changent de version...
function grid_receive(answer) {
	chrall.receiveBubbleContent(answer);
}