(function (chrall) {

	var ùmessages = document.getElementById("messages");
	if (!ùmessages) return;
	
	var observer = new MutationObserver(function(mutations){
		//~ console.log(mutations);
		for (var i=0; i<mutations.length; i++) {
			var nodes = mutations[i].addedNodes;
			if (!nodes || !nodes.length) continue;
			for (var j=0; j<nodes.length; j++) {
				if (!/\buser-messages\b/.test(nodes[j].className)) continue;
				var messsageNodes = nodes[j].childNodes;				
				for (var k=0; k<messsageNodes.length; k++) {
					if (!/\bmessage\b/.test(messsageNodes[k].className)) continue;
					var childs = messsageNodes[k].childNodes;
					for (var l=childs.length; l--;) {
						var child = childs[l];
						if (!/\bcontent\b/.test(child.className)) continue;
						var text = child.innerText; // innerText préserve les \n contrairement à textContent...
						if (/^.?\s?#chrall ./.test(text)) {
							var lines = text.split('\n').filter(Boolean);
							handleChrallCommand(
								lines[0].match(/^.?\s?#chrall (.*)/)[1].trim(), // la commande
								lines.slice(1), // les lignes du message après la commande
								nodes[j], // l'élement .message
								child // l'élément .content
							);
						}
						break;
					}
				}
			}
		}
	});
	observer.observe(ùmessages, {childList:true});

	function handleChrallCommand(command, lines, ùm, ùc){
		console.log("Chrall command", command);
		switch (command) {
		case "set teams":
			return handleSetTeams(lines, ùm, ùc);
		case "set cells":
			return handleSetCells(lines, ùm, ùc);
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
				if (!/[rvbj]/i.test(match[2])) {
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

	function handleSetCells(lines, ùm, ùc){
		$('<button>').text("Définir les couleurs des cases dans Chrall").prependTo(ùc).click(function(){
			var $ok = $('<div><i>Cases ajoutées</i></div>').hide();
			$(this).replaceWith($ok);
			var cells = [];
			lines.forEach(function(line){
				var match = line.match(/^\s*(-?\d+)[\s,;_](-?\d+)[\s,;_]?(-?\d+)?\s*(\w?)/);
				if (match) cells.push({
					pos: match.slice(1,4).filter(Boolean).join(','), // exemples : "-8,-3,-30" ou "-8,-3"
					team: /^[rvbj]/i.test(match[4]) ? match[4][0].toUpperCase() : 'R'
				});
			});
			console.log("Cells to set :", cells);
			chrall.cdb.setCells(cells, function(){
				console.log("Cases ajoutées");
				$ok.show();
			});
		});
	}
	
	chrall.cdb.getTrolls(function(t){
		console.log("all trolls:",t);
	});

})(window.chrall = window.chrall || {});
