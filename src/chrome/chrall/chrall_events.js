

  
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

function Chrall_addInfosToMonsterEvents() {
	if (!compteChrallActif()) return;
	var eventTable = $('body > table.mh_tdborder')[1];
	$(eventTable).attr('id', 'monster_events');
	console.log(eventTable);
	if (!eventTable) return; // arrive s'il n'y a pas encore d'événements je crois
	// on ajoute une méthode pour l'insertion des données supplémentaires
	$('body').prepend('<script>\
	function addActionsToMonsterEvents(actions) {\
		console.log("addActionsToMonsterEvents");\
		console.log(actions);\
		var et = document.getElementById("monster_events");\
		var etb = et.tBodies[0];\
		var td = document.createElement("td");\
		td.innerHTML="<b>Détails</b>";\
		etb.rows[0].appendChild(td);\
		for (var i=1; i<etb.rows.length; i++) {\
			var row = etb.rows[i];\
			var t = row.cells[0].innerHTML.trim().split(" ");\
			var t1 = t[0].split("/");\
			var t2 = t[1].split(":");\
			var date = new Date(t1[2], t1[1]-1, t1[0], t2[0], t2[1], t2[2]);\
			var seconds = date.getTime()/1000;\
			var type = row.cells[1].innerHTML;\
			var description = row.cells[2].innerHTML;\
			var text = "";\
			console.log("event date : " + date);\
			console.log("event seconds : " + seconds);\
			for (var j=0; j<actions.length; j++) {\
				var a = actions[j];\
				var i0 = description.indexOf("( "+a.Auteur+" )");\
				if (i0<0) continue;\
				var i1 = description.indexOf("( "+a.NumCible+" )");\
				if (i1<i0) continue;\
				var dd = Math.abs(a.Date-seconds);\
				console.log("action date : " + (new Date(a.Date*1000)));\
				console.log("delta date : " + dd);\
				if (dd>10) continue;\
				text += a.Type;\
				text += a.Succes ? " réussi" : " raté";\
				if (a.Type=="Insulte" || a.Type=="CDM" || a.Type.indexOf("Botte ")==0) text += "e";\
				if (a.PV>0) text += "<br><b>-"+a.PV+" PV</b>";\
				if (a.Degats>0) text += " Deg: "+a.Degats;\
				if (a.Esquive>0) text += " Esq: "+a.Esquive;\
				if (a.Type=="CDM") text += "<br><b>"+a.PourcentageBlessure+" %</b>";\
			}\
			td = document.createElement("td");\
			td.innerHTML=text;\
			row.appendChild(td);\
		}\
	}\
	</script>');
	sendToChrallServer('getMonsterEvents', {"IdCible": parseInt($('input[name="ai_IDPJ"]').val())});
}
