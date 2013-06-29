(function (chrall){

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

	chrall.hideBubble = function (){
		clearTimeout(bubbleCloseTimeoutID);
		if (bubbleExists && !onBubbleDiv) {
			$("#bubble").remove();
			bubbleExists = false;
		}
		$(window).off("copy", chrall.clipboardOverride);
		console.log_trace("clipboard override disabled");
	};

	function surroundContentIfNeeded(leftCol, $bubbleContent, $bubbleDiv, cssClass){
		if (leftCol) {
			var $table = $('<table/>', {'class': cssClass});
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

	chrall.showBubble = function (target, event, text, cssClass, ajaxRequestId, leftCol){
		cssClass = chrall.isOptionEnabled('bubble-use-mountyhall-styles') ? 'mh_tdtitre' : cssClass;
		if (bubbleExists) {
			chrall.hideBubble();
		}
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
		var $bubbleDiv = $("<div/>", {id: 'bubble', class: cssClass, style: style});

		if (ajaxRequestId && ajaxRequestId != null) {
			var $bubbleRequestId = $('#bubbleRequestId');
			$bubbleRequestId.val(ajaxRequestId);
			if (text) {
				$bubbleDiv.append($('<div/>', {class: 'bubbleTitle'}).html(text));
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

		chrall.nbBubbles = chrall.nbBubbles || 0;
		if (chrall.nbBubbles++ < 6) {
			$bubbleDiv.append($("<div/>", { id: "bubbleCopyMessage", style: "font-size: 75%; max-width:30em"})
					.text("Pour copier l'info via CTRL-C, le focus doit être mis dans la frame (e.x. clic sur la barre d'options, ...	)"));
		}
		chrall.copiableContent = $("#bubble");
		$(window).on("copy", chrall.clipboardOverride);
		if (target.attr("x")) {
			// C'est une destination possible, on va la mémoriser et on fera qq chose avec si clipboardOverride
			chrall.possibleDestination = {
				x:    target.attr("x"),
				y:    target.attr("y"),
				z:    target.attr("z"),
				id:   target.attr("id"),
				text: target.text()
			};
		}
	};

	chrall.keepBubbleOpen = function (){
		onBubbleDiv = true;
	};

	chrall.letBubbleClose = function (){
		onBubbleDiv = false;
		chrall.hideBubble();
	};

	/**
	 *
	 * @param target un objet jquery, par exemple  $("a.ch_monster")
	 * @param text le contenu de la bulle
	 * @param cssClass une classe css ajoutée à la bulle
	 * @param ajaxUrl une url pour l'appel ajax jsonp optionnel (si pas d'ajaxUrl, pas d'appel ajax)
	 * @param ajaxRequestId
	 */
	chrall.triggerBubble = function (target, text, cssClass, ajaxUrl, ajaxRequestId){
		target.mouseenter(function (event){
			if (scrollInProgress || onBubbleDiv || onBubbleTarget) {
				return false;
			}
			onBubbleTarget = true;
			if (ajaxUrl) {
				chrall.jsonp(ajaxUrl);
				chrall.showBubble.call(this, $(this), event, text, cssClass, ajaxRequestId);
			} else {
				chrall.showBubble.call(this, $(this), event, text, cssClass);
			}
		});
		target.mouseout(function (event){
			onBubbleTarget = false;
			chrall.hideBubble();
			//bubbleCloseTimeoutID = setTimeout(chrall.hideBubble, 150);  <= remettre cette ligne si on veut permettre le passage de la souris dans la bulle sans qu'elle se ferme
		});
	};

	/**
	 * pour un ajout dynamique similaire au live de jquery
	 * @param selector objet jquery résultat de $(selector)
	 * @param cssClass
	 * @param getArgs
	 * @return map avec text, ajaxUrl, ajaxRequestId (plus en optionnel leftCol)
	 */
	chrall.bubbleLive = function (selector, cssClass, getArgs){
		$(selector).live(
				'mouseenter',
				function (event){
					var target = $(this);
					if (scrollInProgress || onBubbleDiv || onBubbleTarget) {
						return false;
					}
					onBubbleTarget = true;
					var args = getArgs(target);
					if (args.ajaxUrl) {
						chrall.jsonp(args.ajaxUrl);
						chrall.showBubble.call(this, target, event, args.text, cssClass, args.ajaxRequestId, args.leftCol);
					} else {
						chrall.showBubble.call(this, target, event, args.text, cssClass, null, args.leftCol);
					}
				}
		).live(
				'mouseout', function (event){
					onBubbleTarget = false;
					chrall.hideBubble();
				}
		);
	};

	chrall.clipboardOverride = function (e){
		console.log_trace("clipboard override called");
		if (null === chrall.copiableContent || undefined === chrall.copiableContent) {
			return true;
		}
		var $div = $("<div/>", { style: "opacity: 0;position: absolute;top: -10000px;right: 0;"});
		var $clone = chrall.copiableContent.clone();
		$clone.find("#bubbleCopyMessage").remove();
		$div.append($clone);
		$(document.body).append($div);
		var rng = document.createRange();
		rng.selectNodeContents($div.get(0));
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(rng);
		setTimeout(function (){
			$div.remove()
		}, 100);
		chrall.notifyUser({text: "Contenu de l'info-bulle copié dans le clipboard"});
		chrall.copiableContent = null;
		if (chrall.possibleDestination) {
			localStorage["possibleDestination"] = JSON.stringify(chrall.possibleDestination);
		}
		return true;
	};

	chrall.receiveBubbleContent = function (answer){
		// on vérifie que la réponse correspond à la bulle actuelle (et pas à une bulle fermée)
		var $bubbleRequestId = $('#bubbleRequestId');
		if ($bubbleRequestId.val() != answer.RequestId) {
			console.log_trace('answer received to old request : ' + answer.RequestId + " current: " + $bubbleRequestId.val());
			return;
		}
		var $div = $('#bubbleContent');
		if ($div) { // il n'y a plus de div si la bulle est close
			$div.html(answer.Html);
		}
	};

})(window.chrall = window.chrall || {});
