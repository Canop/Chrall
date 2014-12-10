(function (chrall) {

	var ùmessages = document.getElementById("messages");
	if (!ùmessages) return;
	
	var observer = new MutationObserver(function(mutations){
		//~ console.log(mutations);
		for (var i=0; i<mutations.length; i++) {
			var nodes = mutations[i].addedNodes;
			if (!nodes || !nodes.length) continue;
			for (var j=0; j<nodes.length; j++) {
				if (!/\bmessage\b/.test(nodes[j].className)) continue;
				var childs = nodes[j].childNodes;
				for (var k=childs.length; k--;) {
					var child = childs[k];
					if (!/\bcontent\b/.test(child.className)) continue;
					var text = child.innerText; // innerText préserve les \n contrairement à textContent...
					if (/^.?\s?#chrall ./.test(text)) {
						var lines = text.split('\n');
						handleChrallCommand(
							lines[0].match(/^.?\s?#chrall (.*)/)[1].trim(), // la commande
							lines.slice(1), // les lignes du message après la commande
							nodes[j], // l'élement .message
							child // l'élément .content
						);
					}
					break;
				}
				break;
			}
		}
	});
	observer.observe(ùmessages, {childList:true});

	function handleChrallCommand(command, lines, ùm, ùc){
		console.log("Chrall command", command);
		switch (command) {
		case "set teams":
			return handleSetTeams(lines, ùm, ùc);
		default:
			console.log("Commande Chrall incomprise");
		}
	}

	function handleSetTeams(lines, ùm, ùc){
		$('<button>').text("Définir les équipes dans Chrall").prependTo(ùc).click(function(){
			var $ok = $('<div><i>Trolls ajoutés</i></div>').hide();
			$(this).replaceWith($ok);
			var trolls = lines.map(function(line){
				var match = line.match(/^\s*(\d+)\W+(\w)/);
				if (!match) return;
				console.log("match", match);
				if (!/[rvb]/i.test(match[2])) {
					console.log("invalid team:", line);
					return;
				}
				return {num:+match[1], team:match[2].toUpperCase()};
			}).filter(Boolean);
			console.log("Trolls to set :", trolls);
			chrall.cdb.setTrolls(trolls, function(){
				console.log("Trolls ajoutés");
				$ok.show();
			});
		});
	}
	
	chrall.cdb.getTrolls(function(t){
		console.log("all trolls:",t);
	});

})(window.chrall = window.chrall || {});
