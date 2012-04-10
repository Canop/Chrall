
function Chrall_analyseAndReformatMonsterView() {
	var monsterId = $('input[name="ai_IDPJ"]').val();
	
	var titre = $('div.titre2').text();
	var nomMonstre = titre.substring(0, titre.indexOf('(')-1).trim();
	
	var html = [];
	var h = 0;
	html[h++] = '<div id=ch_pjpop_trigger>';
	html[h++] = '<div id=ch_pjpop>';
	html[h++] = '</div>';
	html[h++] = '</div>';
	$(html.join('')).appendTo($('body'));

	bubble($("#ch_pjpop_trigger"), '', "bub_monster", chrall.serveurPublic()+"json?action=get_extract_jsonp&asker="+player.id+"&name=" + encodeURIComponent(nomMonstre) + "&monsterId="+monsterId, nomMonstre);
}
