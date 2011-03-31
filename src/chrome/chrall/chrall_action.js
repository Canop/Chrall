
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
		chrome.extension.sendRequest({"pa": 0});
	}
}

