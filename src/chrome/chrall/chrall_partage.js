
// construit les tables permettant d'exploiter et visualiser les partages (actuellement
//  dans l'onglet 'Partages' de la vue
function makePartageTables() {
	if (!compteChrallActif()) {
		return "Pour partager des informations privées vous devez activer votre compte Chrall dans les options.";
	}
	var html = [];
	var h=0;
	html[h++] = "<center>";
	html[h++] = "<script>function updateTablesPartage(partages){";
	html[h++] = " var tpa=document.getElementById('partagesActifs');";
	html[h++] = " var tpp=document.getElementById('propositionsPartage');";
	html[h++] = " if (!tpp) return;";
	html[h++] = " var hpp='';";
	html[h++] = " var hpa='';";
	html[h++] = " for (var i=0; i<partages.length; i++) {";
	html[h++] = "  var p=partages[i];";
	html[h++] = "  if (p.Statut=='on' && p.StatutAutreTroll=='on') {"; // ajout dans la table des partages actifs
	html[h++] = "   hpa+= '<tr><td class=mh_tdpage>';";
	html[h++] = "   if (p.AutreTroll) hpa+= Math.max(Math.max(Math.abs("+player.x+"-p.AutreTroll.X), Math.abs("+player.y+"-p.AutreTroll.Y)), Math.abs("+player.z+"-p.AutreTroll.Z));";
	html[h++] = "   hpa+= '</td><td class=mh_tdpage>';";
	html[h++] = "   hpa+= '<a href=\"javascript:EPV('+p.IdAutreTroll+')\" class=mh_trolls_1 id='+p.IdAutreTroll+'>'+p.NomAutreTroll+'</a>';";
	html[h++] = "   hpa+= '</td>';";
	html[h++] = "   if (p.AutreTroll) {";
	html[h++] = "    if (p.AutreTroll.PV_max>0) hpa+= '<td class=mh_tdpage>'+p.AutreTroll.PV_actuels+' / '+p.AutreTroll.PV_max+'</td>';"; 
	html[h++] = "    hpa+= '<td class=mh_tdpage>'+p.AutreTroll.X+'</td>';"; 
	html[h++] = "    hpa+= '<td class=mh_tdpage>'+p.AutreTroll.Y+'</td>';"; 
	html[h++] = "    hpa+= '<td class=mh_tdpage>'+p.AutreTroll.Z+'</td>';"; 
	html[h++] = "   } else {";
	html[h++] = "    hpa+= '<td class=mh_tdpage colspan=4>Pas de données</td>';";
	html[h++] = "   }";	
	html[h++] = "   hpa+= '</tr>';";
	html[h++] = "  } else {"; // ajout dans la table des partages inactifs
	html[h++] = "   hpp+='<tr><td class=mh_tdpage>';";
	html[h++] = "   hpp+='<a href=\"javascript:EPV('+p.IdAutreTroll+')\" class=mh_trolls_1 id='+p.IdAutreTroll+'>'+p.NomAutreTroll+'</a>';";
	html[h++] = "   hpp+= '</td><td class=mh_tdpage>';";
	html[h++] = "   if (p.StatutAutreTroll=='on') hpp+='Ce partage est accepté par '+p.NomAutreTroll+'. Acceptez le pour activer.';";
	html[h++] = "   else hpp+='Ce partage doit être accepté par '+p.NomAutreTroll+'.';";	
	html[h++] = "   hpp+= '</td><td class=mh_tdpage>';";
	html[h++] = "   var a = p.Statut=='on' ? 'Rompre' : 'Accepter';";
	html[h++] = "   var scra='\\\''+a+'\\\'';"; // les échappements sont la misère...
	html[h++] = "   hpp+='<a class=gogo href=\"javascript:changePartage('+scra+', '+p.IdAutreTroll+');\">'+a+'</a>';";	
	html[h++] = "   if (p.Statut=='off') {";
	html[h++] = "    a = 'Supprimer';";
	html[h++] = "    scra='\\\''+a+'\\\'';";
	html[h++] = "    hpp+='<a class=gogo href=\"javascript:changePartage('+scra+', '+p.IdAutreTroll+');\">'+a+'</a>';";	
	html[h++] = "   }";
	html[h++] = "   hpp+= '</td></tr>';";
	html[h++] = "  }";
	html[h++] = " }";
	html[h++] = " tpa.innerHTML=hpa;";
	html[h++] = " tpp.innerHTML=hpp;";
	//~ html[h++] = "  ";
	html[h++] = "}";
	html[h++] = "function changePartage(action, autreTroll){";
	html[h++] = " localStorage['troll."+player.id+".actionPartage']=action;";
	html[h++] = " localStorage['troll."+player.id+".objetPartage']=autreTroll;";
	html[h++] = " document.location.href='"+pageName+"';";
	html[h++] = "}</script>";

	html[h++] = '<h2>Partages actifs</h2>';

	html[h++] = "<table border='0' cellspacing='1' cellpadding='2' class='mh_tdborder' align='center'>";
	html[h++] = "<thead><tr class=mh_tdtitre><td>dist.</td><td>Troll</td><td>PV</td><td>X</td><td>Y</td><td>N</td></tr></thead>";
	html[h++] = "<tbody id=partagesActifs></tbody></table>";

	html[h++] = '<h2>Propositions</h2>';

	html[h++] = "<table border='0' cellspacing='1' cellpadding='2' class='mh_tdborder' align='center'>";
	html[h++] = "<thead><tr class='mh_tdtitre'><td>Partage avec</td><td>Etat</td><td>Action</td></tr></thead>";
	html[h++] = "<tbody id=propositionsPartage></tbody></table>";

	html[h++] = "<p>Nouveau partage avec le troll <input id=partage_proposal_troll_id value=''>";
	html[h++] = "<a class=gogo href=\"javascript:changePartage('Proposer',document.getElementById('partage_proposal_troll_id').value);\">Proposer</a></p>";
	html[h++] = "</center>";

	console.log(html.join('\n'));

	return html.join('');
}

