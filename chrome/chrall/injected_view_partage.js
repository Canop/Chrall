function isPartageActif(partage) {
	return partage.Statut == 'on' && partage.StatutAutreTroll == 'on';
}

function distance(partage, player) {
	var autreTroll = partage.AutreTroll;
	return Math.max(Math.max(Math.abs(player.x - autreTroll.X), Math.abs(player.y - autreTroll.Y)), Math.abs(player.z - autreTroll.Z));
}

function updateTablesPartage(partages) {
	var trollId = localStorage['last_saved_troll_id'];
	var player = localStorage['troll.' + trollId];

	var partagesActifs = $('#partagesActifs');
	var propositionPartage = $('#propositionsPartage');
	if (!propositionPartage) return;
	var row, trollCell, actionCell;
	for (var i = 0; i < partages.length; i++) {
		var partage = partages[i];
		if (isPartageActif(partage)) {// ajout dans la table des partages actifs
			row = $("<tr/>");
			var distCell = $("<td/>", { class: 'mh_tdpage'});
			distCell.text(distance(partage, player));
			trollCell = $("<td/>", { class: 'mh_tdpage'});
			trollCell.append($("<a/>", {text: partage.NomAutreTroll}));
			var raceCell = $("<td/>", { class: 'mh_tdpage', text: partage.RaceAutreTroll});
			var levelCell = $("<td/>", { class: 'mh_tdpage', text: partage.NiveauAutreTroll});
			var hitPointsCell = $("<td/>", { class: 'mh_tdpage', text: partage.AutreTroll.PV_max > 0 ? partage.AutreTroll.PV_actuels + ' / ' + partage.AutreTroll.PV_max : ""});
			var actionPointsCell = $("<td/>", { class: 'mh_tdpage', text: partage.AutreTroll.PA});
			var nextTurnCell = $("<td/>", { class: 'mh_tdpage', text: formatDate(partage.AutreTroll.ProchainTour)});
			var durationCell = $("<td/>", { class: 'mh_tdpage', text: formatDuration(partage.AutreTroll.DureeTour)});
			var positionCell = $("<td/>", { class: 'mh_tdpage'});
			positionCell.append($("<a/>", {name: 'zoom', class: 'gogo',  x: partage.AutreTroll.X, y: partage.AutreTroll.Y, z: partage.AutreTroll.Z, text: partage.AutreTroll.X + ' ' + partage.AutreTroll.Y + ' ' + partage.AutreTroll.Z}))
			var lastUpdateCell = $("<td/>", { class: 'mh_tdpage', text: formatDate(partage.AutreTroll.MiseAJour)});
			actionCell = $("<td/>", { class: 'mh_tdpage'});
			actionCell.append($("<a/>", {text: "Rompre"}));
			actionCell.append($("<a/>", {text: "Mettre à jour la vue"}));
			// TODO contenuActif += '<a href=\"javascript:EPV(' + partage.IdAutreTroll + ')\" class=mh_trolls_1 id=' + partage.IdAutreTroll + '>' +  + '</a>';
			// TODO contenuActif += '<a class=gogo href=\"javascript:changePartage(' + scra + ', ' + partage.IdAutreTroll + ');\">' + a + '</a>';
			// TODO a = 'TestVue';
			// TODO contenuActif += '<a class=gogo href=\"javascript:majVue(' + partage.IdAutreTroll + ');\">Met à jour la vue</a>';
			row.append(distCell).append(trollCell).append(raceCell).append(levelCell).append(hitPointsCell).append(actionPointsCell).append(nextTurnCell)
					.append(durationCell).append(positionCell).append(lastUpdateCell).append(actionCell);
			partagesActifs.append(row);
		} else {// ajout dans la table des partages inactifs
			row = $("<tr/>");
			trollCell = $("<td/>", { class: 'mh_tdpage'});
			trollCell.append($("<a/>", {text: partage.NomAutreTroll}));
			var partageCell = ("<td/>", { class: 'mh_tdpage',
				text: partage.StatutAutreTroll == 'on' ? 'Ce partage est accepté par ' + partage.NomAutreTroll + '. Acceptez le pour activer.' : 'Pour être actif, ce partage doit être accepté par ' + partage.NomAutreTroll + '.'});
			var actionCell = $("<td/>", { class: 'mh_tdpage'});
			actionCell.append($("<a/>", {text: "Rompre"}));
			actionCell.append($("<a/>", {text: "Accepter"}));
			// TODO var a = partage.Statut ==  'on' ? 'Rompre' : 'Accepter';
			// TODO contenuPropositions += '<a class=gogo href=\"javascript:changePartage(' + scra + ', ' + partage.IdAutreTroll + ');\">' + a + '</a>';
			if (partage.Statut == 'off') {
				actionCell.append($("<a/>", {text: "Supprimer"}));
				// TODO contenuPropositions += '<a class=gogo href=\"javascript:changePartage(' + scra + ', ' + partage.IdAutreTroll + ');\">' + a + '</a>';
			}
			row.append(trollCell).append(partageCell).append(actionCell);
			propositionPartage.append(row);
		}
	}
}

function majVue(autreTroll) {
	// TODO: remove insane function
	localStorage['troll."+player.id+".majVue'] = autreTroll;
	if (autreTroll == 0) {
		localStorage['tab_view'] = 'tabRecherche';
	} else {
		localStorage['tab_view'] = 'tabPartages';
	}
	document.location.href = '"+pageName+"';
}

function changePartage(action, autreTroll) {
	// TODO: remove insane function
	localStorage['troll.' + player.id + '.actionPartage'] = action;
	localStorage['troll.' + player.id + '.objetPartage'] = autreTroll;
	localStorage['tab_view'] = 'tabPartages';
	document.location.href = pageName;
}
