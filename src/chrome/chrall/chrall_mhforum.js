// traite une page du forum MH

var scrollInProgress = false;

console.log("Handling MH Forum page");

chrome.extension.sendRequest(
	{'get_trollId': ''},
	function(answer) {
		var playerId = answer.trollId;
		$('a[href^="javascript:oT("]').each(
			function() {
				var link = $(this);
				var href = link.attr('href');
				var trollId = href.split('(')[1].split(')')[0];// la flemme de chercher une formule raisonnable... n'hésite pas à intervenir, Ô lecteur!
				console.log('trollId='+trollId);
				bubble(link, '', "bub_troll", "http://canop.org:9090/chrall/json?action=get_troll_info&asker="+playerId+"&trollId="+trollId, trollId);
			}
		);
	}
);

