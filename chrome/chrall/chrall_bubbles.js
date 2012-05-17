(function (chrall) {

	/*
	 * Après avoir testé une foultitude de librairies de bulles (jquery ou non), je me suis résolu à en écrire une qui
	 *  - soit rapide (la plupart rament dés qu'on a une trentaine de bulles...) et fiable
	 *  - supporte un contenu fourni en temps réel par requète JSONP
	 *  - gère le positionnement automatiquement pour ne pas afficher bêtement les trucs en dehors de la zone visible ou les écraser
	 *  - empêche les bulles de recouvrir la souris (indispensable si on a un lien)
	 *
	 * Usage :
	 *  Deux méthodes publiques
	 *  - la méthode bubble. C'est celle là qu'il faut appeler si toutes vos cibles sont déjà connues.
	 *  - la méthode chrall.bubbleLive si des cibles de bulles peuvent apparaitre par la suite (page générée dynamiquement)
	 *
	 * Notes :
	 *  - Le callback de l'appel JSONP s'appelle grid_receive (on changera sans doute ça)
	 *  - le serveur JSONP répond un objet de la form {RequestId: "truc", Html: "machin"}
	 *  - si on a besoin de plus de souplesse côté css, il faudra ajouter un div intermédiaire (dans la version actuelle vous aurez du mal à surcharger
	 *        via la classe les styles définis dans #bubble)
	 *
	 * La licence est celle de chrall (en gros : vous êtes libre).
	 */

	var onBubbleTarget = false;
	var onBubbleDiv = false;
	var bubbleExists = false;
	var bubbleCloseTimeoutID;
	var bubbleTarget;


	chrall.hideBubble = function () {
		clearTimeout(bubbleCloseTimeoutID);
		if (bubbleExists && !onBubbleDiv) {
			$("#bubble").remove();
			bubbleExists = false;
		}
	}
	function surroundContentIfNeeded(leftCol, $bubbleContent, $bubbleDiv, cssClass) {
		if (leftCol) {
			var $table = $('<table/>', {'class' : cssClass});
			var $tr = $('<tr/>');
			$table.append($tr);
			var $rightCol = $('<td/>');
			$rightCol.append($bubbleContent);
			var $leftCol = $('<td/>', { valign: 'top'}).html(leftCol);
			$tr.append($leftCol).append($rightCol);
			$bubbleDiv.append($table);
		} else {
			$bubbleDiv.append($bubbleContent);
		}
	}

	chrall.showBubble = function (target, event, text, cssClass, ajaxRequestId, leftCol) {
		cssClass = chrall.isOptionEnabled('bubble-use-mountyhall-styles') ? 'mh_tdtitre' : cssClass;
		if (bubbleExists) chrall.hideBubble();
		var $bubbleContent;
		var tPosX = event.pageX - pageXOffset;
		var w = document.body.clientWidth;
		var style = "";
		if (tPosX < w / 2) {
			style += "left:" + (tPosX + 30);
		}
		else {
			style += "right:" + (w - tPosX + 30);
		}
		style += ";"
		var tPosY = event.pageY - pageYOffset;
		var h = document.body.clientHeight;
		if (tPosY < h / 2) {
			style += "top:" + (tPosY + 20);
		}
		else {
			style += "bottom:" + (h - tPosY + 20);
		}
		var $bubbleDiv = $("<div/>", {id : 'bubble', class: cssClass, style: style});

		if (ajaxRequestId && ajaxRequestId != null) {
			var bubbleRequestId = document.getElementById('bubbleRequestId');
			if (target.attr('id')) {
				// Store the target id in the bubble request div, so that it can be retrieved later and used to find
				// where to cache the ajax response
				$(bubbleRequestId).attr('cacheId', target.attr('id'));
			}
			bubbleRequestId.value = ajaxRequestId; // je ne sais pas pourquoi mais utiliser $('#bubbleRequestId').val ne marche pas bien
			if (text) {
				$bubbleDiv.append($('<div/>', {class:'bubbleTitle'}).html(text));
			}
			$bubbleContent = $('<div/>', {id: 'bubbleContent'}).text('en attente de gogochrall...');
			surroundContentIfNeeded(leftCol, $bubbleContent, $bubbleDiv, cssClass);
		} else {
			$bubbleContent = $('<div/>', {id: 'bubbleContent'});
			$bubbleContent.html(text);
			surroundContentIfNeeded(leftCol, $bubbleContent, $bubbleDiv, cssClass);
		}
		bubbleTarget = target;
		$bubbleDiv.mouseover(chrall.keepBubbleOpen).mouseout(chrall.letBubbleClose).prependTo('body');
		bubbleExists = true;
	}

	chrall.keepBubbleOpen = function () {
		onBubbleDiv = true;
	}
	chrall.letBubbleClose = function () {
		onBubbleDiv = false;
		chrall.hideBubble();
	}


	chrall.triggerBubble = function (target, // un objet jquery, par exemple  $("a.ch_monster")
									 text, // le contenu de la bulle
									 cssClass, // une classe css ajoutée à la bulle
									 ajaxUrl, // une url pour l'appel ajax jsonp optionnel (si pas d'ajaxUrl, pas d'appel ajax)
									 ajaxRequestId) {
		target.mouseenter(function(event) {
			if (scrollInProgress || onBubbleDiv || onBubbleTarget) return false;
			onBubbleTarget = true;
			if (ajaxUrl) {
				$.ajax(
						{
							url: ajaxUrl,
							crossDomain: true,
							dataType: "jsonp"
						}
				);
				chrall.showBubble.call(this, $(this), event, text, cssClass, ajaxRequestId);
			} else {
				chrall.showBubble.call(this, $(this), event, text, cssClass);
			}
		});
		target.mouseout(function(event) {
			onBubbleTarget = false;
			chrall.hideBubble();
			//bubbleCloseTimeoutID = setTimeout(chrall.hideBubble, 150);  <= remettre cette ligne si on veut permettre le passage de la souris dans la bulle sans qu'elle se ferme
		});
	}

// pour un ajout dynamique similaire au live de jquery.
	chrall.bubbleLive = function (selector, cssClass, getArgs // fonction prenant en argument un objet jquery résultat de $(selector) et renvoyant une map avec text, ajaxUrl, ajaxRequestId (plus en optionnel leftCol)
			) {
		$(selector).live(
				'mouseenter',
				function(event) {
					var target = $(this);
					if (scrollInProgress || onBubbleDiv || onBubbleTarget) return false;
					onBubbleTarget = true;
					var args = getArgs(target);
					if (args.ajaxUrl) {
						if (target.attr('cached_bubble_value')) {
							var cached_bubble_value = target.attr('cached_bubble_value');
							chrall.showBubble.call(this, target, event, cached_bubble_value, cssClass, null, args.leftCol);
						} else {
							$.ajax(
									{
										url: args.ajaxUrl,
										crossDomain: true,
										dataType: "jsonp"
									}
							);
							chrall.showBubble.call(this, target, event, args.text, cssClass, args.ajaxRequestId, args.leftCol);
						}
					} else {
						chrall.showBubble.call(this, target, event, args.text, cssClass, null, args.leftCol);
					}

				}
		).live(
				'mouseout', function(event) {
					onBubbleTarget = false;
					chrall.hideBubble();
				}
		);
	}

})(window.chrall = window.chrall || {});