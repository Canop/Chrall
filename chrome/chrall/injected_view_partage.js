"use strict";
(function(chrall){

	var partagesAffichés = [];

	function isPartageActif(partage){
		return partage.Statut == 'on' && partage.StatutAutreTroll == 'on';
	}

	function distance(partage, player){
		var autreTroll = partage.AutreTroll;
		return Math.max(Math.max(Math.abs(player.x - autreTroll.X), Math.abs(player.y - autreTroll.Y)), Math.abs(player.z - autreTroll.Z));
	}

	function createTrollCell(partage){
		var trollCell = $("<td/>", { class: 'mh_tdpage'});
		trollCell.append($("<a/>", {text: partage.NomAutreTroll + " (" + partage.IdAutreTroll + ")"}));
		return trollCell;
	}

	chrall.updateTablesPartage = function(partages){
		var partagesActifs = $('#partagesActifs');
		var propositionPartage = $('#propositionsPartage');
		if (!propositionPartage) return;

		var playerInfo = chrall.player();
		partagesActifs.find("tr").remove();
		propositionPartage.find("tr").remove();

		var nbPartagesActifs = 0;
		partagesAffichés = [];

		var row, trollCell, actionCell;
		for (var i = 0; i < partages.length; i++) {
			var partage = partages[i];
			var isSelf = partage.IdAutreTroll == chrall.player().id;
			if (isSelf || isPartageActif(partage)) { // ajout dans la table des partages actifs
				if (!partage.AutreTroll) {
					console.log("données de partage manquantes pour", partage.IdAutreTroll);
					continue;
				}
				partagesAffichés.push(partage);
				row = $("<tr/>");
				var distCell = $("<td/>", { class: 'mh_tdpage'});
				if (!isSelf) distCell.text(distance(partage, playerInfo));
				trollCell = createTrollCell(partage);
				var raceCell = $("<td/>", { class: 'mh_tdpage', text: partage.RaceAutreTroll});
				var levelCell = $("<td/>", { class: 'mh_tdpage', text: partage.NiveauAutreTroll});
				var hitPointsCell = $("<td/>", { class: 'mh_tdpage', text: partage.AutreTroll.PV_max > 0 ? partage.AutreTroll.PV_actuels + ' / ' + partage.AutreTroll.PV_max : ""});
				var actionPointsCell = $("<td/>", { class: 'mh_tdpage', text: partage.AutreTroll.PA});
				var nextTurnCell = $("<td/>", { class: 'mh_tdpage', text: chrall.formatDate(partage.AutreTroll.ProchainTour)});
				var durationCell = $("<td/>", { class: 'mh_tdpage', text: chrall.formatDuration(partage.AutreTroll.DureeTour)});
				var positionCell = $("<td/>", { class: 'mh_tdpage'});
				if (!isSelf) {
					positionCell.append($("<a/>", {name: 'zoom', class: 'gogo',  x: partage.AutreTroll.X, y: partage.AutreTroll.Y, z: partage.AutreTroll.Z, text: partage.AutreTroll.X + ' ' + partage.AutreTroll.Y + ' ' + partage.AutreTroll.Z}))
				}
				var lastUpdateCell = $("<td/>", { class: 'mh_tdpage', text: chrall.formatDate(partage.AutreTroll.MiseAJour)});
				actionCell = $("<td/>", { class: 'mh_tdpage'});

				if (!isSelf) actionCell.append($("<a/>", {text: "Rompre", class: 'gogo', idAutreTroll: partage.IdAutreTroll, actionPartage: "Rompre"}).click(chrall.updatePartage));
				actionCell.append($("<a/>", {text: "Actualiser le profil", class: 'gogo', idAutreTroll: partage.IdAutreTroll}).click(chrall.majProfil));
				if (!isSelf) actionCell.append($("<a/>", {text: "Actualiser la vue", class: 'gogo', idAutreTroll: partage.IdAutreTroll}).click(chrall.majVue));
				row.append(distCell).append(trollCell).append(raceCell).append(levelCell).append(hitPointsCell).append(actionPointsCell).append(nextTurnCell)
						.append(durationCell).append(positionCell).append(lastUpdateCell).append(actionCell);
				partagesActifs[isSelf?'prepend':'append'](row);
				nbPartagesActifs++;
			} else {// ajout dans la table des partages inactifs
				row = $("<tr/>");
				trollCell = createTrollCell(partage);
				var partageText = partage.StatutAutreTroll == 'on' ? partage.NomAutreTroll + ' accepte ce partage. Acceptez-le pour activer.' : partage.NomAutreTroll + " doit accepter ce partage pour qu'il soit actif.";
				var partageCell = $("<td/>", { class: 'mh_tdpage', text: partageText});
				actionCell = $("<td/>", { class: 'mh_tdpage'});
				actionCell.append($("<a/>", {text: "Rompre", class: 'gogo', idAutreTroll: partage.IdAutreTroll, actionPartage: "Rompre"}).click(chrall.updatePartage));
				if ("on" == partage.StatutAutreTroll) {
					actionCell.append($("<a/>", {text: "Accepter", class: 'gogo', idAutreTroll: partage.IdAutreTroll, actionPartage: "Accepter"}).click(chrall.updatePartage));
				}
				if ('off' == partage.Statut) {
					actionCell.append($("<a/>", {text: "Supprimer", class: 'gogo', idAutreTroll: partage.IdAutreTroll, actionPartage: "Supprimer"}).click(chrall.updatePartage));
				}
				row.append(trollCell).append(partageCell).append(actionCell);
				propositionPartage.append(row);
			}
		}

		var $boutonsMajPartages = $('#boutonsMajPartages').empty();
		if (nbPartagesActifs>1) {
			$boutonsMajPartages.append($("<a/>", {text: "Actualiser tous les profils", class: 'gogo'}).click(chrall.majProfil));
		}
		$boutonsMajPartages.append(
			$("<a/>", {text: "Rafraichir la page", class: 'gogo'}).click(()=> location.reload())
		);

	}

	chrall.updatePartage = function(){
		var action = $(this).attr("actionPartage");
		var autreTroll = parseInt($(this).attr("idAutreTroll"));
		chrall.sendToChrallServer(action, {"ChangePartage": action, "IdCible": autreTroll});
		chrall.notifyUser({ text: "Action: " + action + " partage " + autreTroll});
	}

	chrall.majTroll = function(facette, idAutreTroll){
		var autreTroll = $(this).attr("idAutreTroll");
		autreTroll = ("undefined" == typeof autreTroll || "" == autreTroll) ? idAutreTroll : autreTroll;
		autreTroll = parseInt(autreTroll);
		// Operation asynchrone, gogochrall devra attendre la réponse du serveur soap de MH
		chrall.sendToChrallServer("maj_"+facette, {"IdCible": autreTroll});
		var notificationText = 'GogoChrall attend la r\u00e9ponse du serveur Mounty Hall';
		if (!autreTroll) notificationText += " pour tous vos amis";
		notificationText += '. Cela peut prendre quelques minutes.';
		$("#resultat_maj").text(notificationText);
		chrall.notifyUser({text : notificationText});
		localStorage['troll.' + chrall.playerId() + '.messageMaj'] = notificationText;
	}

	chrall.majVue = function(idAutreTroll){
		chrall.majTroll.call(this, "vue", idAutreTroll);
	}

	chrall.majProfil = function(idAutreTroll){
		chrall.majTroll.call(this, "profil", idAutreTroll);
	}

	chrall.bindCopy_tablePartages = function(){
		$(window).on('copy', function(e){
			console.log('copy');
			if (!$('#partagesActifs:visible tr').length>1) {
				console.log('table partages vide ou non visible');
				return;
			}
			var selection = window.getSelection();
			if (selection.toString().trim().length) {
				console.log('selection non vide -> comportement standard');
				return;
			}
			var copiedPreWrapper = document.createElement('div');
			document.body.appendChild(copiedPreWrapper);
			var copiedPre = document.createElement('pre');
			copiedPreWrapper.appendChild(copiedPre);
			console.log(partagesAffichés);
			var tbl = "Troll|RN|PV|DLA|PA|PDLA\n";
			tbl += "-|:-:|:-:|:-:|:-:|:-:\n";
			console.log(chrall.player());
			tbl += partagesAffichés.map(function(p){
				var t = p.AutreTroll;
				console.log(p.NomAutreTroll, "DLA:", t.ProchainTour, chrall.formatDate(t.ProchainTour));
				return [
					p.NomAutreTroll,
					p.RaceAutreTroll[0].toUpperCase()+p.NiveauAutreTroll,
					t.PV_actuels+'/'+t.PV_max,
					chrall.formatDate(t.ProchainTour),
					t.PA,
					chrall.formatDate(t.ProchainTour+t.DureeTour)
				].join('|')
			}).join('\n');
			copiedPre.innerHTML = tbl;
			selection.selectAllChildren(copiedPreWrapper);
			setTimeout(() => copiedPreWrapper.remove(), 0);
		});
	}


})(window.chrall = window.chrall || {});





