"use strict";
(function(chrall){
	chrall.handleFollowerOrders = function(){

		chrall.gridLive(); // <- ça c'est parce qu'on va sans doute ajouter des liens d'ouverture de vues "zoom"

		var tableOrdre = $('.mh_tdborder_fo');
		var lignes = tableOrdre.find('tr');
		var str = $(lignes[0]).text();
		var match = /(\d+)\. .+?\[.*\s+\d+ PA - X = (-?\d+) \| Y = (-?\d+) \| N = (-?\d+)/.exec(str)
		var numGowap = parseInt(match[1]);
		var gowap_x = parseInt(match[2]);
		var gowap_y = parseInt(match[3]);
		var gowap_z = parseInt(match[4]);
		var chemin = new chrall.Chemin(new chrall.Point(gowap_x, gowap_y));
		var chGowap = new chrall.ChGowap(gowap_x, gowap_y, gowap_z, numGowap);
		var numMaxOrdre = 0;

		$('<td width=150px></td>')
				.append('<a name=zoom class=gogo x=' + gowap_x + ' y=' + gowap_y + ' z=' + gowap_z + '>Montrer les alentours</a>')
				.appendTo($(lignes[0]));
		var movementRegexp = /([0-9\-]+) \| Y=([0-9\-]+) \| N=([0-9\-]+)/;
		for (var i = 2; i < lignes.length; i++) {
			var cells = $(lignes[i]).find('td');
			var numOrdre = parseInt($(cells[0]).text());
			if (numOrdre > numMaxOrdre) {
				numMaxOrdre = numOrdre;
			}
			str = $(cells[2]).text();
			var match;
			if ((match = movementRegexp.exec(str))) {
				gowap_x = parseInt(match[1]);
				gowap_y = parseInt(match[2]);
				gowap_z = parseInt(match[3]);
				chemin.add(new chrall.Point(gowap_x, gowap_y));
				$('<td><a name=zoom class=gogo x=' + gowap_x + ' y=' + gowap_y + ' z=' + gowap_z +
						'>Montrer les alentours</a></td>').appendTo($(lignes[i]));
			} else {
				$('<td/>').appendTo($(lignes[i]));
			}
		}

		var $mapDiv = $("<div/>", {style: "text-align: center;"});
		var canvas = $("<canvas/>", {id: "cartehall", style: "width:400px;height:400px;"});
		var carteDiv = $("<div/>", {id: "tdbCarte", style: "text-align: center;"}).text("Carte du Hall");
		carteDiv.append(
				$("<span/>", {id: "messageCarte"}).text("Cliquez sur la carte pour donner un ordre de mouvement.")
		);

		var form = $('form[name="form1"]');
		canvas.appendTo($mapDiv);
		carteDiv.appendTo($mapDiv);
		$mapDiv.appendTo(form);

		var ch = new chrall.CarteHall("cartehall", "messageCarte");
		chrall.ajouteTrous(ch);
		ch.recomputeCanvasPosition();
		ch.add(chemin);
		var player = chrall.player();
		if (player) {
			ch.add(new chrall.ChTroll(
					player.x, player.y, player.z, "blue", player.name,
					player.sight ? (player.sight.diceNumber + player.sight.physicalBonus) : 0
			));
		}
		ch.add(chGowap);

		ch.onClick = function(x, y, z){
			var toInvoke = chrall.triggerGowapAction(x, y, gowap_z, "move", numGowap, numMaxOrdre);
			toInvoke();
		};
		ch.redraw();

		// Boutons pour destination hard-codées: case du troll, case du gowap
		var actionButton = $("[name='as_Action']");
		var orderLine = actionButton.parent().parent();
		var toOwner = $("<td/>", {style: 'width:20em'});
		var toSelf = $("<td/>", {style: 'width:20em'});
		orderLine.append(toOwner);
		orderLine.append(toSelf);

		addMovementNode('Aller sur ma case', 'move', toOwner, player);
		addMovementNode('Retourner sur sa case', 'move', toSelf, chGowap);

		var possibleDestination = localStorage["possibleDestination"];
		var text;
		if (possibleDestination) {
			var toDestination = $("<td/>", {style: 'width:20em'});
			orderLine.append(toDestination);
			possibleDestination = JSON.parse(possibleDestination);
			text = possibleDestination.text.split(":")[1];

			addMovementNode('Aller vers : ' + text, 'move', toDestination, possibleDestination);
		}

		// Ordres supplémentaires si le gowap peut s'ébrouer
		if (0 < $("[name='ai_IdOrdre'] > [value='7']").length) {
			addMovementNode('S\'ébrouer sur ma case', 'snort-self', toOwner, player);
			addMovementNode('S\'ébrouer a ses pieds', 'snort', toSelf, chGowap);
			if (possibleDestination) {
				addMovementNode('S\'ébrouer aux pieds de : ' + text, 'snort', toDestination, possibleDestination);
			}
		}

		function addMovementNode(nodeText, order, parent, dest){
			var $div = $("<div style='padding-top:1ex; padding-bottom:1ex; white-space: nowrap; text-align: center'/>");
			parent.append($div);
			var $table = $("<table style='text-align: center; margin: auto'/>");
			$div.append($table);

			var $tr = $("<tr/>");
			$table.append($tr);
			$tr.append($("<td/>"));
			$tr.append($("<td/>").append(createMovementNode("&#x25B4;", order, dest.x, dest.y + 1, dest.z)));
			$tr.append($("<td/>"));

			$tr = $("<tr/>");
			$table.append($tr);
			$tr.append($("<td/>").append(createMovementNode("&#x25C2;", order, dest.x - 1, dest.y, dest.z)));
			$tr.append($("<td/>").append(createMovementNode(nodeText, order, dest.x, dest.y, dest.z)));
			$tr.append($("<td/>").append(createMovementNode("&#x25B8;", order, dest.x + 1, dest.y, dest.z)));

			$tr = $("<tr/>");
			$table.append($tr);
			$tr.append($("<td/>"));
			$tr.append($("<td/>").append(createMovementNode("&#x25BE;", order, dest.x, dest.y - 1, dest.z)));
			$tr.append($("<td/>"));
		}

		function createMovementNode(nodeText, order, toX, toY, toZ){
			var actionNode = $("<a/>", {'class': 'gogo', html: nodeText});
			var gowapAction = chrall.triggerGowapAction(toX, toY, toZ, order, numGowap, numMaxOrdre);
			actionNode.bind("click", gowapAction);

			return actionNode;
		}
	};

	chrall.triggerGowapAction = function(x, y, z, order, numGowap, numMaxOrdre){
		return (function(){
			let movementType;
			switch (order) {
				case 'move':
					movementType = '1';
					break;
				case 'snort':
					movementType = '7';
					break;
				case 'snort-self':
					movementType = '12';
					break;
				default:
					movementType = '1';
					break;
			} // move or snort
			window.frameElement.parentNode.children[1].src = '/mountyhall/MH_Follower/FO_NewOrder.php?ai_IdOrdre=' +
					movementType + "&ai_IdFollower=" + numGowap + "&ai_NbOrdres=" + numMaxOrdre +
					"&as_Action=Enregistrer+un+nouvel+Ordre;";
			chrall.setTrollStorage({'.gowap-x': x, '.gowap-y': y, '.gowap-z': z, '.gowap-order': order});
		});
	};

	chrall.fillFollowerNewOrderForm = function(){
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
