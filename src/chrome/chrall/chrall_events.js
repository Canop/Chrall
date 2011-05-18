

  
function Chrall_addBubblesToLinks() {
	
	$("a.mh_trolls_1").each(
		function() {
			var link = $(this);
			var href = link.attr('href');
			var trollId = href.split('\'')[1];
			if (trollId!=player.id && trollId!=viewedTrollId) {
				bubble(link, '', "bub_troll", GOGOCHRALL+"json?action=get_troll_info&trollId="+trollId, trollId);
			}
		}
	);	
	
	$("a.mh_monstres").each(
		function() {
			var link = $(this);
			var href = link.attr('href');
			var numMonstre = href.split('\'')[1];
			var nomMonstre = link.text().substr(3).trim();
			bubble(link, nomMonstre, "bub_monster", GOGOCHRALL+"json?action=get_extract_jsonp&name=" + encodeURIComponent(nomMonstre) + "&monsterId="+numMonstre, nomMonstre);
		}
	);	
	
}
