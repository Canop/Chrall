
// classe dont les instances représentent des liens externes
function ExternalLink(name, displayedByDefault, href, description) {
	this.display = displayedByDefault;
	this.name = name;
	this.href = href;
	this.description = description;
}

// renvoie une map category->[]link
// FIXME  : le lien vers mappyTroll n'a pas la position
function Chrall_getExternalLinks(){
	var links = {
		"Chrall": [
			new ExternalLink("Forum Chrall", true, "http://canop.org/chrall/fofo", "Un forum pour discuter des bugs, des fonctionnalités et du développement de votre extension favorite."),
			new ExternalLink("Bestiaire", true, "http://canop.org:8000/chrall/bestiaire", "Ce bestiaire permet de rechercher les monstres apparentés à votre cible, au cas où la bulle ne vous renseignerait pas."),
			new ExternalLink("Kill-O-Mètre", false, "http://canop.org/chrall/killometre.html", "Le Kill-O-Mètre classe les trolls en fonctions de leur kills, qualitativement et quantitativement. Il vous permet de connaitre les orientations d'un troll qui n'est pas dans votre vue."),
			new ExternalLink("Chrall", false, "http://canop.org/chrall/", "La page d'accueil de Chrall, avec ses divers liens, en particulier pour le développement ou pour enrichir le bestiaire.")
		],
		"Mounty-Hall": [
			new ExternalLink("Forum MH", true, "http://www.mountyhall.com/Forum/", "Le forum indispensable."),
			new ExternalLink("Règles", false, "http://www.mountyhall.com/MH_Rules/Rules_1.php", "Même un vieux joueur a parfois besoin de vérifier une formule."),
			new ExternalLink("Annuaire", false, "http://www.mountyhall.com/ListeTrolls.php", "La liste de tous les trolls, avec une fonction de recherche.")
		],
		"Les autres outils et références": [
			new ExternalLink("MountyPedia", true, "http://mountypedia.mountyhall.com", "L'encyclopédie contributive. Elle est complète ou alors il faut que vous la complétiez."),
			new ExternalLink("Champis", false, "http://deudam.nathas.net/env.php?id=0", "Tout pour le mycologue éclairé, par Deudam."),
			new ExternalLink("Carte", false, "http://trolls.ratibus.net/mountyhall/vue_lieux.php", "La cartographie du Hall par les Bricol'Trolls."),
			new ExternalLink("MappyTrolls", false, 'http://trolls.ratibus.net/mountyhall/itineraireBis.php?x1='+player.x+'&y1='+player.y+'&n1='+player.z, "Calculateur d'itinéraire, automatiquement initialisé avec votre position actuelle."),
			new ExternalLink("Anatrolliseur", false, "http://mountyhall.dispas.net/dynamic/outils_anatrolliseur.php", "Le simulateur de croissance de troll des Psyko'Chasseurs."),
			new ExternalLink("Cachette", false, "http://mountyhall.dispas.net/dynamic/outils_capitan.php?", "Aide à la recherche de cachette de Capitan par les Psyko'Chasseurs."),
			new ExternalLink("Troc", false, "http://troc.mountyhall.com/index.php", "Le Troc de l'Hydre, pour l'échange de composants."),
			new ExternalLink("Le Matos", false, "http://lematos.free.fr/MH/matos/index.php", "Les caractéristiques de base de toutes les équipements."),
			//~ new ExternalLink("", false, "", "")
		],
	};
	for (var cat in links) {
		var catLinks = links[cat];
		for (var i=0; i<catLinks.length; i++) {
			var stored = localStorage['dysplayLink_'+catLinks[i].name];
			//console.log('Stored for ' + catLinks[i].name + ' : ' + stored);
			if (stored) {
				catLinks[i].display = stored=='yes';
			}
		}
	}
	return links;
}

// construit le html de sélection des liens à afficher
function Chrall_makeLinkOptionPage() {
	var links = Chrall_getExternalLinks();
	html = '<p>Cochez les liens que vous voulez avoir toujours présents sur votre écran.</p>';
	for (var cat in links) {
		html += '<h2>'+cat+'</h2>';
		var catLinks = links[cat];
		for (var i=0; i<catLinks.length; i++) {
			var link = catLinks[i];
			html += '<p><input name="'+link.name+'" class=externalLinkActivator type=checkbox';
			if (link.display) html += ' checked';
			html += '>';
			html += '<a target=extern href="'+link.href+'">'+link.name+'</a> : ';
			html += link.description;
		html += '</p>';
		}
	}
	html += '<p><input type=button onClick="top.document.location.href=\'http://games.mountyhall.com/mountyhall/MH_Play/Play.php\';" value="Appliquer les modifications"></p>';
	$('input.externalLinkActivator').live('change', function() {
		//console.log($(this));
		var name = $(this).attr('name');
		var checked = $(this).attr('checked');
		localStorage['dysplayLink_'+name]=checked?'yes':'no';
		//console.log(localStorage);
	});
	return html;
}

// appelée depuis la frame "Action", construit la div des liens externes
function Chrall_makeLinksDiv() {
	var NB_LINES_MAX = 6;
	var linkArray = [];
	var links = Chrall_getExternalLinks();
	for (var cat in links) {
		var catLinks = links[cat];
		for (var i=0; i<catLinks.length; i++) {
			var link = catLinks[i];
			if (link.display) linkArray.push(link);
		}
	}
	var nbCols = Math.ceil(linkArray.length/NB_LINES_MAX);
	var nbItemsPerCol = Math.ceil(linkArray.length/nbCols);
	var width = 40 + nbCols*70;
	if ($(document).width()<808+width) return; // 808 : taille de l'image de fond que je ne veux pas recouvrir
	var i=0;
	var html = '<div id=menuOutilsChrall>';
	html += '<table cellspacing=2 cellpadding=2>';
	for (var r=0; r<nbItemsPerCol; r++) {
		html += '<tr>';
		for (var c=0; c<nbCols; c++) {
			html += '<td nowrap>';
			if (i<linkArray.length) {
				var link = linkArray[i++];
				html += '<a target=extern href="'+link.href+'">'+link.name+'</a>';
			}
			html += '</td>';
		}
		html += '</tr>';
	}
	html += '</table>';
	html += '</div>';
	$('body').append(html);
	console.log('width:'+width);
}
