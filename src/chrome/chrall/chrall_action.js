
function Chrall_handleActionPage() {
	//> on va essayer de lire les PA disponibles
	var sentence = $('b:contains("Il me reste ")');
	if (sentence.length>0) {
		var tokens = Chrall_tokenize(sentence.text());
		try {
			rpa = parseInt(tokens[3]);
			$('<script>parent.chrall_pa_restant.value='+tokens[3]+';</script>').appendTo($('body'));
			chrome.extension.sendRequest({"pa": rpa});
		} catch(error) {
			console.log(error);
		}
	} else {
		// a priori si on n'a pas cette phrase c'est qu'on n'a pas activé
		$('<script>parent.chrall_pa_restant.value=0;</script>').appendTo($('body'));
		chrome.extension.sendRequest({"pa": -1}); // -1 pour signaler que la session n'est pas active
	}
}



// Verifie simplement si l'action "Creuser" est presente, et affiche que c'est possible s'il y a lieu.
// Pas besoin de verifier d'abord que la DLA est activee.
function Chrall_displayDiggingIsPossible() {
    var htmlDiggingIsPossible = '<div><font color="#FF9933"><b>Il est possible de creuser!<b></font></div>';
    
    if ($('option:contains("Creuser")').length > 0) {
        $('select + br').remove();
        $('select').after(htmlDiggingIsPossible);
    }
}
