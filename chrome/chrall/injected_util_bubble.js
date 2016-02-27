"use strict";
if (0 == $("#bubbleRequestId").size()) {
	$('body').append($("<input type='hidden' id='bubbleRequestId' value=''/>"));
}

// ce nom n'est pas générique parce que je n'ai  pas eu envie de couper la compatibilité client-serveur le temps que les testeurs changent de version...
// attention: cette fonction est appelée en JSONP par le serveur gogochrall
window.grid_receive = function(answer){
	chrall.receiveBubbleContent(answer);
}
