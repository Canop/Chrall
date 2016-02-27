"use strict";

// fonction appelée en jsonp par le serveur chrall en réponse à une requete get_notes
window.receiveNotes = function(notes){
	console.log("notes received :");
	console.log(notes);
}
