// enrichit la page des ordres d'un suivant
function Chrall_handleFollowerOrders() {

	Chrall_gridLive(); // <- ça c'est parce qu'on va sans doute ajouter des liens d'ouverture de vues "zoom"

	var tableOrdre = $('p table.mh_tdborder_fo');
	var lignes = tableOrdre.find('tr');
	var str = $(lignes[0]).text();
	var firstDot = str.indexOf('.');
	var numGowap = parseInt(str.substring(firstDot - 10, firstDot));
	var position = str.lastIndexOf('X =');
	var positionText = str.substring(position + 2);
	var posToken = positionText.split('|');
	var gowap_x = parseInt(posToken[0].trim());
	var gowap_y = parseInt(posToken[1].trim());
	var gowap_z = parseInt(posToken[2].trim());
	var chemin = new Chemin(new Point(gowap_x, gowap_y));
	var chGowap = new ChGowap(gowap_x, gowap_y, gowap_z, numGowap);
	var numMaxOrdre = 0;

	$('<td width=150px><a name=zoom class=gogo x=' + gowap_x + ' y=' + gowap_y + ' z=' + gowap_z + '>Montrer les alentours</a></td>').appendTo($(lignes[0]));
	for (var i = 2; i < lignes.length; i++) {
		var cells = $(lignes[i]).find('td');
		var numOrdre = parseInt($(cells[0]).text());
		if (numOrdre > numMaxOrdre) numMaxOrdre = numOrdre;
		var str = $(cells[2]).text();
		var index = str.indexOf("vers");
		if (index > 0) {
			var posText = str.substring(index + 5, str.length);
			var posToken = posText.split('|');
			gowap_x = parseInt(posToken[0].trim().split('=')[1]);
			gowap_y = parseInt(posToken[1].trim().split('=')[1]);
			gowap_z = parseInt(posToken[2].trim().split('=')[1]);
			chemin.add(new Point(gowap_x, gowap_y));
			$('<td><a name=zoom class=gogo x=' + gowap_x + ' y=' + gowap_y + ' z=' + gowap_z + '>Montrer les alentours</a></td>').appendTo($(lignes[i]));
		} else {
			$('<td></td>').appendTo($(lignes[i]));
		}
	}
	var html = '';
	html += "<script>";
	html += "function lanceMouvementGowap(){";
	html += " parent.frames['Action'].location.href='FO_NewOrder.php?ai_IdOrdre=1&ai_IdFollower=" + numGowap + "&ai_NbOrdres=" + numMaxOrdre + "&as_Action=Enregistrer+un+nouvel+Ordre';";
	html += "}";
	html += "</script>";
	html += '<center><br>';
	html += '<canvas id=cartehall onClick="lanceMouvementGowap();" style="width:400px;height:400px;"></canvas>';
	html += '<div id=tdbCarte>Carte du Hall <span id=messageCarte>Cliquez sur la carte pour donner un ordre de mouvement.</span></div>';
	html += '</center>';
	$(html).appendTo($('form[name="form1"]'));

	var ch = new CarteHall("cartehall", "messageCarte");
	ajouteTrous(ch);
	ch.recomputeCanvasPosition();
	ch.add(chemin);
	if (player) {
		ch.add(new ChTroll(player.x, player.y, player.z, "blue", player.name, player.sight ? (player.sight.diceNumber + player.sight.physicalBonus) : 0));
	}
	ch.add(chGowap);

	ch.onClick = function(x, y, z) {
		Chrall_setTrollStorage({'.gowap-order': 'move', '.gowap-x': x, '.gowap-y': y, '.gowap-z' : gowap_z});
	}
	ch.redraw();


	// Boutons pour destination hard-codées: case du troll, case du gowap
	var actionButton = $("[name='as_Action']");
	var orderLine = actionButton.parent();
	var node = $("'<a class=gogo>Aller sur ma case</a>'");
	node.appendTo(orderLine);
	node.bind("click", Chrall_triggerGowapAction(player.x, player.y, player.z, 'move', numGowap, numMaxOrdre))
	node = $("'<a class=gogo>Retourner sur sa case</a>'");
	node.appendTo(orderLine);
	node.bind("click", Chrall_triggerGowapAction(chGowap.x, chGowap.y, chGowap.z, 'move', numGowap, numMaxOrdre))

	// Ordres supplémentaires si le gowap peut s'ébrouer
	if (0 < $("[name='ai_IdOrdre'] > [value='7']").length) {
		var ebroueNode = $("'<a class=gogo >S\'ébrouer sur ma case</a>'");
		ebroueNode.appendTo(orderLine);
		ebroueNode.bind("click", Chrall_triggerGowapAction(player.x, player.y, player.z, 'snort', numGowap, numMaxOrdre));
		ebroueNode = $("'<a class=gogo>S\'ébrouer à ses pieds</a>'");
		ebroueNode.bind("click", Chrall_triggerGowapAction(chGowap.x, chGowap.y, chGowap.z, 'snort', numGowap, numMaxOrdre));
		ebroueNode.appendTo(orderLine);
	}
}

function Chrall_triggerGowapAction(x, y, z, order, numGowap, numMaxOrdre) {
	return (function () {
		Chrall_setTrollStorage({'.gowap-x': x, '.gowap-y': y, '.gowap-z' : z, '.gowap-order': order, '.gowap-numGowap' : numGowap , '.gowap-numMaxOrdre' : numMaxOrdre});
		$.getScript(chrome.extension.getURL("injected_trigger_gowap_action.js"));
	});
}

function Chrall_fillFollowerNewOrderForm() {
	if (localStorage['troll.' + player.id + '.gowap-order']) {
		var order = localStorage['troll.' + player.id + '.gowap-order'];
		if ('move' == order || 'snort' == order) {
			$('input[name="ai_X"]').val(localStorage['troll.' + player.id + '.gowap-x']);
			$('input[name="ai_Y"]').val(localStorage['troll.' + player.id + '.gowap-y']);
			$('input[name="ai_N"]').val(localStorage['troll.' + player.id + '.gowap-z']);
		}
		Chrall_clearTrollStorage('.gowap-order', '.gowap-x', '.gowap-y', '.gowap-z', '.gowap-numGowap', '.gowap-numMaxOrdre');
	}
}

// Fonction pour initialiser en masse une série de valeurs dans le local storage, liées à un troll particulier
function Chrall_setTrollStorage(valueMap) {
	for (key in valueMap) {
		localStorage['troll.' + player.id + key] = valueMap[key];
	}
}

// Pendant de Chrall_setTrollStorage, pour nettoyer après usage
function Chrall_clearTrollStorage() {
	for (var i = 0; i < arguments.length; i++) {
		localStorage.removeItem('troll.' + player.id + arguments[i]);
	}
}
