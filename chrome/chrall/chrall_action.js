"use strict";
(function(chrall) {

	// Verifie simplement si l'action "Creuser" est presente, et affiche que c'est possible s'il y a lieu.
	// Pas besoin de verifier d'abord que la DLA est activee.
	chrall.displayDiggingIsPossible = function() {
		if ($('option:contains("Creuser")').length > 0) {
			$('select + br').remove();
			var htmlDiggingIsPossible = '<div><font color="#FF9933"><b>Il est possible de creuser!<b></font></div>';
			$('select').after(htmlDiggingIsPossible);
		}
	};

	chrall.handleActionPage = function() {
		//> on va essayer de lire les PA disponibles
		var	player = chrall.player(),
			sentence = $('b:contains("Il me reste ")');
		if (sentence.length > 0) {
			var tokens = chrall.tokenize(sentence.text());
			try {
				var rpa = parseInt(tokens[3]);
				player.pa = rpa;
				player.sessionActive = true;
			} catch (error) {
				console.log(error);
			}
		} else {
			// a priori si on n'a pas cette phrase c'est qu'on n'a pas activé
			player.sessionActive = false;
			player.pa = 0;
		}
		player.save();

		var $body = $('body');
		$body.append(chrall.makeLinksDiv());
		chrall.displayDiggingIsPossible();

		$body.css('overflow', 'hidden'); // supprime l'ascenseur tout moche de la frame Actions
	};

})(window.chrall = window.chrall || {});


