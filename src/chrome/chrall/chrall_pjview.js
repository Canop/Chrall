
  
  
function Chrall_analysePJEventsView() {
	viewedTrollId = $('input[name="ai_IDPJ"]').val();
}


function Chrall_analyseAndReformatPJView() {
	viewedTrollId = $('input[name="ai_IDPJ"]').val();
	
	var html = [];
	var h = 0;
	html[h++] = '<div id=ch_popm>';
	html[h++] = '<span id=ch_popm_trigger>C</span><span id=ch_popm_content style="display:none;">hrall';
	html[h++] = '<br>player.id='+player.id;
	html[h++] = '</span>';
	html[h++] = '</div>';
	console.log(html);
	$(html.join('')).appendTo($('body'));
	
	$('#ch_popm_trigger').click(function(){$('#ch_popm_content').toggle();});
}
