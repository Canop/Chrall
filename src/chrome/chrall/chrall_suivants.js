
// enrichit la page des ordres d'un suivant
function Chrall_handleFollowerOrders() {
	
	Chrall_gridLive(); // <- ça c'est parce qu'on va sans doute 
	
	var tableOrdre = $('p table.mh_tdborder_fo');	
	var lignes = tableOrdre.find('tr');
	var str = $(lignes[0]).text();
	var ocl = str.indexOf('[');
	var ocr = str.indexOf(']');
	var numGowap = str.substring(ocl+1, ocr);	
	var op = str.lastIndexOf('(');
	var posText = str.substring(op+1, str.length-3);
	var posToken=posText.split(',');
	var gowap_x = parseInt(posToken[0].trim());
	var gowap_y = parseInt(posToken[1].trim());
	var gowap_z = parseInt(posToken[2].trim());
	var chemin = new Chemin(new Point(gowap_x, gowap_y));
	var chGowap = new ChGowap(gowap_x, gowap_y, gowap_z, numGowap);
	var numMaxOrdre = 0;
	$('<td width=150px><a name=zoom class=gogo x='+gowap_x+' y='+gowap_y+' z='+gowap_z+'>Montrer les alentours</a></td>').appendTo($(lignes[0]));
	for (var i=1; i<lignes.length; i++) {
		var cells = $(lignes[i]).find('td');
		var numOrdre = parseInt($(cells[0]).text());
		if (numOrdre>numMaxOrdre) numMaxOrdre=numOrdre;
		var str = $(cells[2]).text();
		var index = str.indexOf("vers");
		if (index>0) {
			var posText = str.substring(index+5, str.length);
			var posToken=posText.split('|');
			var gowap_x = parseInt(posToken[0].trim().split('=')[1]);
			var gowap_y = parseInt(posToken[1].trim().split('=')[1]);
			gowap_z = parseInt(posToken[2].trim().split('=')[1]);
			chemin.add(new  Point(gowap_x, gowap_y));
			$('<td><a name=zoom class=gogo x='+gowap_x+' y='+gowap_y+' z='+gowap_z+'>Montrer les alentours</a></td>').appendTo($(lignes[i]));
		} else {
			$('<td></td>').appendTo($(lignes[i]));
		}
	}

	var html = '';
	html += "<script>";
	html += "function lanceMouvementGowap(){";
	html += " parent.frames['Action'].location.href='FO_NewOrder.php?ai_IdOrdre=1&ai_IdFollower="+numGowap+"&ai_NbOrdres="+numMaxOrdre+"&as_Action=Enregistrer+un+nouvel+Ordre';";
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
		ch.add(new ChTroll(player.x, player.y, player.z, "blue", player.name, player.sight?(player.sight.diceNumber+player.sight.physicalBonus):0));		
	}
	ch.add(chGowap);
	
	ch.onClick = function(x, y, z) {
		localStorage['troll.'+player.id+'.gowap-order'] = 'move';
		localStorage['troll.'+player.id+'.gowap-x'] = x;
		localStorage['troll.'+player.id+'.gowap-y'] = y;
		localStorage['troll.'+player.id+'.gowap-z'] = gowap_z;
	}
	ch.redraw();
}

function Chrall_fillFollowerNewOrderForm() {
	if (localStorage['troll.'+player.id+'.gowap-order']) {
		if (localStorage['troll.'+player.id+'.gowap-order']=='move') {
			$('input[name="ai_X"]').val(localStorage['troll.'+player.id+'.gowap-x']);
			$('input[name="ai_Y"]').val(localStorage['troll.'+player.id+'.gowap-y']);
			$('input[name="ai_N"]').val(localStorage['troll.'+player.id+'.gowap-z']);
		}
		localStorage.removeItem('troll.'+player.id+'.gowap-order');
	}
}
