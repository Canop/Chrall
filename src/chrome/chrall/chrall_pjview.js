
  
  
function Chrall_analysePJEventsView() {
	viewedTrollId = $('input[name="ai_IDPJ"]').val();
}


function Chrall_analyseAndReformatPJView() {
	viewedTrollId = $('input[name="ai_IDPJ"]').val();
	
	var html = [];
	var h = 0;
	html[h++] = '<div id=ch_pjpop_trigger>';
	html[h++] = '<div id=ch_pjpop>';
	html[h++] = '</div>';
	html[h++] = '</div>';
	$(html.join('')).appendTo($('body'));

	bubble($("#ch_pjpop_trigger"), '', "bub_troll", GOGOCHRALL+"json?action=get_troll_info&asker="+player.id+"&trollId="+viewedTrollId, viewedTrollId);

	
}
