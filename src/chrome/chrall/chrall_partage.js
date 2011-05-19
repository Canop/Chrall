
// construit les tables permettant d'exploiter et visualiser les partages (actuellement
//  dans l'onglet 'Partages' de la vue
function makePartageTables() {
	if (!compteChrallActif()) {
		return "Pour partager des informations privées vous devez activer votre compte Chrall dans les options.";
	}
	var html = [];
	var h=0;
	html[h++] = '<h1>Partages actifs</h1>';

	html[h++] = '<h1>Propositions</h1>';

	html[h++] = "<script>function proposePartage(){";
	html[h++] = " var tid=document.getElementById('partage_proposal_troll_id').value;";
	html[h++] = " localStorage['troll."+player.id+".proposalToSend']=tid;";
	html[h++] = " document.location.href='"+pageName+"';";
	html[h++] = "}</script>";
	html[h++] = "<input id=partage_proposal_troll_id value=''>";
	html[h++] = "<a class=gogo href='javascript:proposePartage();'>Proposer un partage</a>";

	html[h++] = "<script>function updateTablePartage(partages){";
	html[h++] = " var tp=document.getElementById('propositionsPartage');";
	html[h++] = " var h='';";
	html[h++] = " for (var i=0; i<partages.length; i++) {";
	html[h++] = "  h+='<tr><td>'+partages[i].TrollA+'</td><td>'+partages[i].TrollB+'</td></tr>';";
	html[h++] = " }";
	html[h++] = " tp.innerHTML=h;";
	html[h++] = "  ";
	html[h++] = "}</script>";
	html[h++] = "<table><thead><tr><th>Avec</th><th>Etat</th><th>Action</th></tr></thead>";
	html[h++] = "<tbody id=propositionsPartage></tbody></table>";

	return html.join('');
}
