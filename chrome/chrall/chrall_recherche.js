//
function makeSearchPanel($panel) {
	if (!chrall.compteChrallActif()) {
		return "La recherche nécessite un compte chrall actif. Vous pouvez activer votre compte Chrall dans la page Option.";
	}
	var html = [];
	var mdpRestreint = localStorage['troll.' + player.id + '.mdp'];
	var h = 0;
	html[h++] = " &nbsp; <a id=btn_maj href='javascript:chrall.majVue(0);' class=gogo>Mettre à jour les vues</a> <span id=resultat_maj>";
	html[h++] = localStorage['troll.' + player.id + '.messageMaj'];
	localStorage.removeItem('troll.' + player.id + '.messageMaj');
	html[h++] = "</span>";
	html[h++] = "<br> &nbsp; <input style='width:150px' id=ch_search_pattern value=''>";
	html[h++] = "<a id=btn_search class=gogo>Chercher</a>";
	html[h++] = "<div id=search_result style='width:100%;'></div>";
	html[h++] = "<div id=search_details style='width:100%;'></div>";

	$panel.append(html.join(''));

	var search = function() {
		var tok = $('#ch_search_pattern').val();
		$('#search_result').load(chrall.serveurPrive() + 'searchpanel?asker=' + player.id + '&mdpr=' + mdpRestreint + '&tok=' + encodeURIComponent(tok));
	};

	$('#ch_search_pattern').change(search);
	$('#btn_search').click(search);
}

