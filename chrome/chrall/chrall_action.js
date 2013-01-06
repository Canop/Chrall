// Verifie simplement si l'action "Creuser" est presente, et affiche que c'est possible s'il y a lieu.
// Pas besoin de verifier d'abord que la DLA est activee.
function Chrall_displayDiggingIsPossible() {
	if ($('option:contains("Creuser")').length > 0) {
		$('select + br').remove();
		var htmlDiggingIsPossible = '<div><font color="#FF9933"><b>Il est possible de creuser!<b></font></div>';
		$('select').after(htmlDiggingIsPossible);
	}
}

function Chrall_handleActionPage() {
	//> on va essayer de lire les PA disponibles
	var sentence = $('b:contains("Il me reste ")');
	if (sentence.length > 0) {
		var tokens = Chrall_tokenize(sentence.text());
		try {
			rpa = parseInt(tokens[3]);
			player.pa = rpa;
			player.sessionActive = true;
		} catch(error) {
			console.log(error);
		}
	} else {
		// a priori si on n'a pas cette phrase c'est qu'on n'a pas activé
		player.sessionActive = false;
		player.pa = 0;
	}
	player.save();

	$('body').append(Chrall_makeLinksDiv());
	Chrall_displayDiggingIsPossible();

	$('body').css('overflow', 'hidden'); // supprime l'ascenseur tout moche de la frame Actions
}


