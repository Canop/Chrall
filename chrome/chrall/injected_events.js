"use strict";
var chrall = chrall || {};
chrall.addActionsToMonsterEvents = function(actions){
	var et = document.getElementById("monster_events");
	var etb = et.tBodies[0];
	var td = document.createElement("td");
	td.innerHTML = "<b>Détails</b>";
	etb.rows[0].appendChild(td);
	for (var i = 1; i < etb.rows.length; i++) {
		var row = etb.rows[i];
		var t = row.cells[0].innerHTML.trim().split(" ");
		var t1 = t[0].split("/");
		var t2 = t[1].split(":");
		var date = new Date(t1[2], t1[1] - 1, t1[0], t2[0], t2[1], t2[2]);
		var seconds = date.getTime() / 1000;
		var description = row.cells[2].innerHTML;
		var text = "";
		for (var j = 0; j < actions.length; j++) {
			var a = actions[j];
			var i0 = description.indexOf("( " + a.Auteur + " )");
			if (i0 < 0) continue;
			var i1 = description.indexOf("( " + a.NumCible + " )");
			if (i1 < i0) continue;
			var dd = Math.abs(a.Date - seconds);
			if (dd > 10) continue;
			text += a.Type;
			text += a.Succes ? " réussi" : " raté";
			if (a.Type == "Insulte" || a.Type == "CDM" || a.Type.indexOf("Botte ") == 0) text += "e";
			if (a.PV > 0) text += "<br><b>-" + a.PV + " PV</b>";
			if (a.Degats > 0) text += " Deg: " + a.Degats;
			if (a.Esquive > 0) text += " Esq: " + a.Esquive;
			if (a.Type == "CDM") text += "<br><b>" + a.PourcentageBlessure + " %</b>";
		}
		td = document.createElement("td");
		td.innerHTML = text;
		row.appendChild(td);
	}
}
