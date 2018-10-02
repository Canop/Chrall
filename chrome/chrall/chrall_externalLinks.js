"use strict";

(function(chrall){
	//
	// classe dont les instances représentent des liens externes
	function ExternalLink(name, displayedByDefault, href, description){
		this.display = displayedByDefault;
		this.name = name;
		this.href = href;
		this.description = description;
	}

	// renvoie une map category->[]link
	function getExternalLinks(){
		var player = chrall.player();
		var links = {
			"Chrall": [
				new ExternalLink("Miaou",
					true,
					"https://dystroy.org/miaou/167?Chrall",
					"Miaou est le meilleur endroit pour obtenir du support sur Chrall"
				),
				new ExternalLink("Bestiaire",
					true,
					"https://chrall.dystroy.org/gogo/bestiaire",
					"Ce bestiaire permet de rechercher les monstres apparentés à votre cible,"
					+ " au cas où la bulle ne vous renseignerait pas."
				),
				//new ExternalLink("Kill-O-Mètre",
				//	false,
				//	"https://canop.org/chrall/killometre.html",
				//	"Le Kill-O-Mètre classe les trolls en fonctions de leur kills,"
				//	+ " qualitativement et quantitativement. Il vous permet de connaitre les orientations"
				//	+ " d'un troll qui n'est pas dans votre vue."
				//),
				new ExternalLink("Chrall",
					false,
					"https://chrall.dystroy.org/gogo/",
					"La page d'accueil de Chrall, avec ses divers liens,"
					+ " en particulier pour le développement ou pour enrichir le bestiaire."
				)
			],
			"Mounty-Hall": [
				new ExternalLink("Forum MH",
					true,
					"https://www.mountyhall.com/Forum/",
					"Le forum indispensable."
				),
				new ExternalLink("Règles",
					false,
					"https://www.mountyhall.com/MH_Rules/Rules_1.php",
					"Même un vieux joueur a parfois besoin de vérifier une formule."
				),
				new ExternalLink("Annuaire",
					false,
					"https://www.mountyhall.com/ListeTrolls.php",
					"La liste de tous les trolls, avec une fonction de recherche."
				)
			],
			"Les autres outils et références": [
				new ExternalLink("MountyPedia",
					true,
					"http://mountypedia.mountyhall.com",
					"L'encyclopédie contributive. Elle est complète ou alors il faut que vous la complétiez."
				),
				new ExternalLink("Champis",
					false,
					"http://deudam.nathas.net/env.php?id=0",
					"Tout pour le mycologue éclairé, par Deudam."
				),
				new ExternalLink("Carte",
					false,
					"http://trolls.ratibus.net/mountyhall/vue_lieux.php",
					"La cartographie du Hall par les Bricol'Trolls."
				),
				new ExternalLink("MappyTrolls",
					false,
					'http://trolls.ratibus.net/mountyhall/itineraireBis.php?x1=' + player.x + '&y1=' + player.y + '&n1=' + player.z,
					"Calculateur d'itinéraire, automatiquement initialisé avec votre position."
				),
				new ExternalLink("Anatrolliseur",
					false,
					"http://mountyhall.dispas.net/dynamic/outils_anatrolliseur.php",
					"Le simulateur de croissance de troll des Psyko'Chasseurs."
				),
				new ExternalLink("Cachette",
					false,
					"http://mountyhall.dispas.net/dynamic/outils_capitan.php?",
					"Aide à la recherche de cachette de Capitan par les Psyko'Chasseurs."
				),
				new ExternalLink("Troc",
					false,
					"http://troc.mountyhall.com/index.php",
					"Le Troc de l'Hydre, pour l'échange de composants."
				),
				new ExternalLink("Le Matos",
					false,
					"http://lematos.free.fr/MH/matos/index.php",
					"Les caractéristiques de base de toutes les équipements."
				)
			]
		};
		for (var cat in links) {
			var catLinks = links[cat];
			for (var i = 0; i < catLinks.length; i++) {
				var stored = localStorage['dysplayLink_' + catLinks[i].name];
				if (stored) {
					catLinks[i].display = stored == 'yes';
				}
			}
		}
		return links;
	}

	// construit le html de sélection des liens à afficher
	chrall.makeLinkOptionPage = function(){
		var links = getExternalLinks();
		var $linkOptions = $('<div style="text-align:left">', {
			text :"Cochez les liens que vous voulez avoir toujours présents sur votre écran"
		});
		for (var cat in links) {
			$linkOptions.append($('<h2/>', {text: cat}));
			var catLinks = links[cat];
			for (var i = 0; i < catLinks.length; i++) {
				var link = catLinks[i];
				var checkbox = $('<input/>', { name : link.name, class: "externalLinkActivator", type: "checkbox", checked: link.display});
				checkbox.change(function(){
					var name = $(this).attr('name');
					localStorage['dysplayLink_' + name] = this.checked ? 'yes' : 'no';
					var actionFrame = $('frame[name="Action"]', window.frames.frameElement.parentElement)[0];
					var outilsDiv = $('#menuOutilsChrall', actionFrame.contentDocument);
					outilsDiv.replaceWith(chrall.makeLinksDiv());
				});
				$("<p/>").appendTo($linkOptions)
				.append(checkbox)
				.append($('<a/>', {target: 'extern', href: link.href, text: link.name}))
				.append($("<span>").css("margin", "2px").text(link.description));
			}
		}
		return $linkOptions;
	}

	// appelée depuis la frame "Action", construit la div des liens externes
	chrall.makeLinksDiv = function(){
		var NB_LINES_MAX = 6;
		var linkArray = [];
		var links = getExternalLinks();
		for (var cat in links) {
			var catLinks = links[cat];
			for (var i = 0; i < catLinks.length; i++) {
				var link = catLinks[i];
				if (link.display) linkArray.push(link);
			}
		}
		var nbCols = Math.ceil(linkArray.length / NB_LINES_MAX);
		var nbItemsPerCol = Math.ceil(linkArray.length / nbCols);
		i = 0;
		var html = '<div id=menuOutilsChrall>';
		html += '<table cellspacing=2 cellpadding=2>';
		for (var r = 0; r < nbItemsPerCol; r++) {
			html += '<tr>';
			for (var c = 0; c < nbCols; c++) {
				html += '<td nowrap>';
				if (i < linkArray.length) {
					link = linkArray[i++];
					html += '<a target=extern href="' + link.href + '">' + link.name + '</a>';
				}
				html += '</td>';
			}
			html += '</tr>';
		}
		html += '</table>';
		html += '</div>';
		return html;
	}

})(window.chrall = window.chrall||{});
