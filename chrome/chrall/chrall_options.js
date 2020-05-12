"use strict";
(function(chrall){

	function doBindings(){
		$('#save_private_chrall_server').click(function(){
			var s = $('#input_private_chrall_server').val();
			if (s.length > 3) {
				localStorage['private_chrall_server'] = s;
			} else {
				localStorage.removeItem('private_chrall_server');
			}
		});

		$(".toggle-option").each(function(){
			var id = $(this).attr("id");
			var checked = chrall.isOptionEnabled(id);
			this.checked = checked;
			$(this).change(toggleOption);
		});
		$(".toggle-option-default-active").each(function(){
			var id = $(this).attr("id");
			this.checked = chrall.isOptionEnabled(id, "yes");
			$(this).change(toggleOption);
		});
		$(".integer-option").each(function(){
			var $this = $(this);
			var id = $this.attr("id");
			var defaultValue = parseInt($this.attr("default"));
			var value = chrall.integerOption(id, defaultValue);
			$this.val(value);
			$this.bind("propertychange keyup input paste", function(){
				var $this = $(this);
				var id = $this.attr("id");

				var value = parseInt($this.val());
				var min = parseInt($this.attr("min"));
				var max = parseInt($this.attr("max"));
				var defaultValue = parseInt($this.attr("default"));
				value = isNaN(value) ? defaultValue : value;
				value = value < min ? min : value;
				value = value > max ? max : value;
				localStorage[id] = value;
			});
		});
	}

	// ajoute quelques pages aux options
	chrall.reformatOptionsView = function(){

		var addedPages = {
			"Options Chrall": "\
			<h3 class='option-section'>Qu'est-ce que Chrall?</h3>\
			<div class='option-section'>\
				<p class='informational-text'>Chrall est une extension pour Chrome visant à enrichir l'interface du jeu.</p>\
				<p class='informational-text'>Si vous souhaitez retrouver l'interface standard de Mounty Hall, vous pouvez la désactiver via le menu <i>Outils/Extensions</i> de Chrome.</p>\
				<p class='informational-text'>Pour plus d'informations sur le projet Chrall : <a target=newWin href=https://chrall.dystroy.org>chrall.dystroy.org</a>.</p>\
			</div>\
			<p/>\
			<h3 class='option-section'>Que fait Chrall exactement?</h3>\
			<div class='option-section'>\
				<p class='informational-text'>Chrall modifie les pages que vous recevez depuis *.mountyhall.com et quelques adresses alternatives du jeu. Chrall enrichit également <a href=https://dystroy.org/miaou>le chat Miaou</a> pour y ajouter des fonctions de modification de Chrall. Chrall ne voit ni ne change les autres pages.</p>\
				<p class='informational-text'>Chrall affiche, sur la vue, des estimations des caractéristiques des monstres, en exploitant son bestiaire (lien plus bas). De même pour les trolls en exploitant des informations publiques (par exemple la liste des kills).</p>\
				<p class='informational-text'>Chrall transmet les CDM que vous effectuez à ce bestiaire, afin de l'enrichir (si vous l'acceptez).</p>\
			</div>\
			<p/>\
			<h3 class='option-section'>Vue</h3>\
			<div class='option-section'>\
				<p class='informational-text'>Modifiez ici le comportement de l'extension en ce qui concerne l'affichage de la vue (grille 2D et tables). Chaque option est susceptible de ralentir la vitesse d'affichage de la grille. Choisissez les plus pertinentes.</p>\
				<div style='display:block'><input id='view-disable-grid-view' type='checkbox' class='toggle-option'><span class='option-description'>Désactiver la grille 2D</span></div>\
				<div style='display:block'><input id='view-grid-compact-names' type='checkbox' class='toggle-option'><span class='option-description'>Compacter les noms dans la grille 2D</span>\
					<p class='informational-text sub-informational-text'>Longueur maximale: <input id='view-grid-compact-names-length' type='text' class='integer-option' min='5' max='20' default='20'/></p>\
				</div>\
				<div style='display:block'><input id='view-grid-compact-monster-stacks' type='checkbox' class='toggle-option-default-active'><span class='option-description'>Compacter les piles de monstres dans la grille 2D</span>\
					<p class='informational-text sub-informational-text'>Compacte les piles de monstres dont le nom est identique. Ceci permet d'avoir une vue plus dégagée lorsqu'on est à proximité d'un tas de gowaps ou d'essaims cratériens. Le nom\
					utilisé est le nom de monstre compacté si l'option a été sélectionnée.</p></div>\
				<div style='display:block'><input id='view-grid-vertical-distance-hint' type='checkbox' class='toggle-option'><span class='option-description'>Ajuster la taille des noms en fonction de la distance verticale</span></div>\
				<div style='display:block'><input id='view-show-distance-in-view' type='checkbox' class='toggle-option'><span class='option-description'>Afficher la distance en PA (via DE) dans les tables</span></div>\
				<div style='display:block'><input id='view-display-hit-points-ratio' type='checkbox' class='toggle-option'><span class='option-description'>Afficher la barre de points de vie dans les tables (uniquement pour les partages actifs).</span></div>\
				<div style='display:block'><input id='view-display-monster-level' type='checkbox' class='toggle-option-default-active'><span class='option-description'>Afficher un nival pour les monstres (calculé sur base de son type, son âge, son template).</span></div>\
				<div style='display:block'><input id='view-display-colored-cell' type='checkbox' class='toggle-option-default-active'><span class='option-description'>Affichage des cases colorées configurées avec Miaou (une vue importante baisse les perfomances).</span></div>\
				<div style='display:block'><input id='view-sort-items-per-type' type='checkbox' class='toggle-option'><span class='option-description'>Trier les items par type dans la grille 2D (caverne par caverne).</span></div>\
			</div>\
			<br/>\
			<h3 class='option-section'>Equipement</h3>\
			<div class='option-section'>\
				<p class='informational-text'>Modifiez ici le comportement de l'extension en ce qui concerne le matériel, les suivants,...</p>\
				<div style='display:block'><input id='gear-sort-items' type='checkbox' class='toggle-option-default-active'><span class='option-description'>Trier l'équipement par ordre alphabétique</span></div>\
			</div>\
			<br/>\
			<h3 class='option-section'>Divers</h3>\
			<div class='option-section'>\
				<p class='informational-text'>Options sans catégorie propre.</p>\
				<div style='display:block'><input id='bubble-use-mountyhall-styles' type='checkbox' class='toggle-option'><span class='option-description'>Utiliser les styles MountyHall pour les info-bulles</span></div>\
				<div style='display:block'><input id='cdm-send-to-chrall' type='checkbox' class='toggle-option-default-active'><span class='option-description'>Envoyer les résultats de CdM au serveur Chrall</span></div>\
				<div style='display:block'><input id='form-memoize' type='checkbox' class='toggle-option-default-active'><span class='option-description'>Mémoriser et restaurer automatiquement les dernières options choisies pour les sorts/compétences</span>\
					<p class='informational-text sub-informational-text'>Lors du traitement d'une action, pré-sélectionne automatiquement les menus déroulants, remplit automatiquement les champs de texte et les cases à cocher\
			sur base de la dernière action du même type efffectuée. Retenter une même action est dès lors plus facile (ex: pour une bidouille, description, etc... seront pré-remplies)</p></div>\
			</div>",

			"Liens": chrall.makeLinkOptionPage()

		};

		$.each(addedPages, function(key, page){
			$("#menu-evt ul").append(
				$("<li data-wrapperels=span data-shadow=true>").append(
					$("<a href=#>").text(key).click(function(){
						$('#menu-evt a').removeClass('ui-btn-active ui-state-persist');
						$(this).addClass('ui-btn-active ui-state-persist');
						$("#titre2").text(key).nextAll().remove();
						$("#titre2").after(page);
						doBindings();
					})
				)
			);
		});

	};

	function toggleOption(){
		var id = $(this).attr('id');
		localStorage[id] = this.checked ? "yes" : "no";
	}

})(window.chrall = window.chrall || {});
