// construit les tables permettant d'exploiter et visualiser les partages (actuellement
//  dans l'onglet 'Partages' de la vue)
function makePartageTables() {
	if (!chrall.compteChrallActif()) {
		return "Pour partager des informations privées vous devez activer votre compte Chrall dans les options.";
	}
	var html = $("<div style='text-align: center;'> \
	<h2>Partages actifs</h2>\
	<table border='0' cellspacing='1' cellpadding='2' class='mh_tdborder' align='center'>\
		<thead><tr class=mh_tdtitre>\
			<td>dist.</td>\
			<td>Nom</td>\
			<td>Race</td>\
			<td>Niveau</td>\
			<td>PV</td>\
			<td>PA</td>\
			<td>DLA</td>\
			<td>Durée tour</td>\
			<td>Position</td>\
			<td>Mise à jour</td>\
			<td>Action</td>\
		</tr></thead>\
		<tbody id=partagesActifs></tbody>\
	</table>\
	<h2>Propositions</h2>\
	<table border='0' cellspacing='1' cellpadding='2' class='mh_tdborder' align='center'>\
		<thead><tr class='mh_tdtitre'>\
			<td>Partage avec</td>\
			<td>Etat</td>\
			<td>Action</td>\
		</tr></thead>\
		<tbody id=propositionsPartage></tbody>\
	</table>\
	<p>Nouveau partage avec le troll <input id=partage_proposal_troll_id value=''>\
	<a class=gogo id=partage_proposal>Proposer</a></p>\
	</div>");

	$("#partage_proposal", html).click(function() {
		var target = $('#partage_proposal_troll_id').val();
		target = parseInt(target);
		if (0 >= target) {
			return;
		}
		$('#partage_proposal_troll_id').val("");
		chrall.sendToChrallServer("get_partages", {"ChangePartage":'Proposer', "IdCible": target});
		chrall.notifyUser({text :"proposition de partage envoyée"});
	});

	return html;
}

