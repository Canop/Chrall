(function (chrall) {
	chrall.handleFollowerOrders = function () {

		Chrall_gridLive(); // <- ça c'est parce qu'on va sans doute ajouter des liens d'ouverture de vues "zoom"

		var tableOrdre = $('p table.mh_tdborder_fo');
		var lignes = tableOrdre.find('tr');
		var str = $(lignes[0]).text();
		var firstDot = str.indexOf('.');
		var numGowap = parseInt(str.substring(firstDot - 10, firstDot));
		var position = str.lastIndexOf('X =');
		var positionText = str.substring(position);
		var posToken = positionText.split('| ');
		var gowap_x = parseInt(posToken[0].substring(3).trim());
		var gowap_y = parseInt(posToken[1].substring(3).trim());
		var gowap_z = parseInt(posToken[2].substring(3).trim());
		var chemin = new Chemin(new Point(gowap_x, gowap_y));
		var chGowap = new ChGowap(gowap_x, gowap_y, gowap_z, numGowap);
		var numMaxOrdre = 0;

		$('<td width=150px><a name=zoom class=gogo x=' + gowap_x + ' y=' + gowap_y + ' z=' + gowap_z + '>Montrer les alentours</a></td>').appendTo($(lignes[0]));
		var movementRegexp = /([0-9\-]+) \| Y=([0-9\-]+) \| N=([0-9\-]+)/;
		for (var i = 2; i < lignes.length; i++) {
			var cells = $(lignes[i]).find('td');
			var numOrdre = parseInt($(cells[0]).text());
			if (numOrdre > numMaxOrdre) numMaxOrdre = numOrdre;
			str = $(cells[2]).text();
			var match;
			if (match = movementRegexp.exec(str)) {
				gowap_x = parseInt(match[1]);
				gowap_y = parseInt(match[2]);
				gowap_z = parseInt(match[3]);
				chemin.add(new Point(gowap_x, gowap_y));
				$('<td><a name=zoom class=gogo x=' + gowap_x + ' y=' + gowap_y + ' z=' + gowap_z + '>Montrer les alentours</a></td>').appendTo($(lignes[i]));
			} else {
				$('<td/>').appendTo($(lignes[i]));
			}
		}

		var $mapDiv = $("<div/>", {style: "text-align: center;"});
		var canvas = $("<canvas/>", {id: "cartehall", style: "width:400px;height:400px;"});
		canvas.click(function () {
			window.frameElement.parentNode.children[1].location = '/mountyhall/MH_Follower/FO_NewOrder.php?ai_IdOrdre=1&ai_IdFollower=' + numGowap + '&ai_NbOrdres=' + numMaxOrdre + '&as_Action=Enregistrer+un+nouvel+Ordre';
		});
		var carteDiv = $("<div/>", {id: "tdbCarte", style: "text-align: center;"}).text("Carte du Hall");
		carteDiv.append($("<span/>", {id: "messageCarte"}).text("Cliquez sur la carte pour donner un ordre de mouvement."));


		var form = $('form[name="form1"]');
		canvas.appendTo($mapDiv);
		carteDiv.appendTo($mapDiv);
		$mapDiv.appendTo(form);

		var ch = new CarteHall("cartehall", "messageCarte");
		ajouteTrous(ch);
		ch.recomputeCanvasPosition();
		ch.add(chemin);
		if (player) {
			ch.add(new ChTroll(player.x, player.y, player.z, "blue", player.name, player.sight ? (player.sight.diceNumber + player.sight.physicalBonus) : 0));
		}
		ch.add(chGowap);

		ch.onClick = function (x, y, z) {
			chrall.setTrollStorage({'.gowap-order': 'move', '.gowap-x': x, '.gowap-y': y, '.gowap-z': gowap_z});
		};
		ch.redraw();


		// Boutons pour destination hard-codées: case du troll, case du gowap
		var actionButton = $("[name='as_Action']");
		var orderLine = actionButton.parent().parent();
		var node = $("<a/>", { 'class': 'gogo', text: 'Aller sur ma case'});
		node.bind("click", chrall.triggerGowapAction(player.x, player.y, player.z, 'move', numGowap, numMaxOrdre));
		var toOwner = $("<td/>", { style: 'width:20em'});
		orderLine.append(toOwner);
		addButtonNode(toOwner, node);
		node = $("<a/>", { 'class': 'gogo', text: 'Retourner sur sa case'});
		var toSelf = $("<td/>", { style: 'width:20em'});
		orderLine.append(toSelf);
		addButtonNode(toSelf, node);
		node.bind("click", chrall.triggerGowapAction(chGowap.x, chGowap.y, chGowap.z, 'move', numGowap, numMaxOrdre));
		var possibleDestination = localStorage["possibleDestination"];
		var text;
		if (possibleDestination) {
			possibleDestination = JSON.parse(possibleDestination);
			text = possibleDestination.text.split(":")[1];
			node = $("<a/>", { 'class': 'gogo', text: 'Aller vers : ' + text});
			var toDestination = $("<td/>", { style: 'width:20em'});
			orderLine.append(toDestination);
			addButtonNode(toDestination, node);
			node.bind("click", chrall.triggerGowapAction(possibleDestination.x, possibleDestination.y, possibleDestination.z, 'move', numGowap, numMaxOrdre));
		}

		// Ordres supplémentaires si le gowap peut s'ébrouer
		function addButtonNode(parent, node) {
			var div = $("<div style='padding-top:1ex; padding-bottom:1ex; white-space: nowrap'/>");
			parent.append(div);
			div.append(node);
		}

		if (0 < $("[name='ai_IdOrdre'] > [value='7']").length) {
			var ebroueNode = $("<a/>", { 'class': 'gogo', text: 'S\'ébrouer sur ma case'});
			addButtonNode(toOwner, ebroueNode);
			ebroueNode.bind("click", chrall.triggerGowapAction(player.x, player.y, player.z, 'snort', numGowap, numMaxOrdre));
			ebroueNode = $("<a/>", { 'class': 'gogo', text: 'S\'ébrouer a ses pieds'});
			ebroueNode.bind("click", chrall.triggerGowapAction(chGowap.x, chGowap.y, chGowap.z, 'snort', numGowap, numMaxOrdre));
			addButtonNode(toSelf, ebroueNode);
			if (possibleDestination) {
				ebroueNode = $("<a/>", { 'class': 'gogo', text: 'S\'ébrouer aux pieds de : ' + text});
				addButtonNode(toDestination, ebroueNode);
				ebroueNode.bind("click", chrall.triggerGowapAction(possibleDestination.x, possibleDestination.y, possibleDestination.z, 'snort', numGowap, numMaxOrdre));
			}
		}
	};

	chrall.triggerGowapAction = function (x, y, z, order, numGowap, numMaxOrdre) {
		return (function () {
			var movementType = 'move' == order ? '1' : '7'; // move or snort
			window.frameElement.parentNode.children[1].location = '/mountyhall/MH_Follower/FO_NewOrder.php?ai_IdOrdre=' + movementType + "&ai_IdFollower=" + numGowap + "&ai_NbOrdres=" + numMaxOrdre + "&as_Action=Enregistrer+un+nouvel+Ordre;";
			chrall.setTrollStorage({'.gowap-x': x, '.gowap-y': y, '.gowap-z': z, '.gowap-order': order});
		});
	}

	chrall.fillFollowerNewOrderForm = function () {
		var order = chrall.getTrollStorage('.gowap-order');
		if (order) {
			if ('move' == order || 'snort' == order) {
				$('input[name="ai_X"]').val(chrall.getTrollStorage('.gowap-x'));
				$('input[name="ai_Y"]').val(chrall.getTrollStorage('.gowap-y'));
				$('input[name="ai_N"]').val(chrall.getTrollStorage('.gowap-z'));
			}
			chrall.clearTrollStorage('.gowap-order', '.gowap-x', '.gowap-y', '.gowap-z');
		}
		var $option = $("option[value='0']");
		if ($option.length) {
			var possibleDestination = localStorage["possibleDestination"];
			if (possibleDestination) {
				possibleDestination = JSON.parse(possibleDestination);
				$option.attr("value", possibleDestination.id);
			}
		}
	}


})(window.chrall = window.chrall || {});
