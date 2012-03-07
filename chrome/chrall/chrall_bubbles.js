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
 *  - la méthode bubbleLive si des cibles de bulles peuvent apparaitre par la suite (page générée dynamiquement)
 * 
 * Notes :
 *  - Le callback de l'appel JSONP s'appelle grid_receive (on changera sans doute ça)
 *  - le serveur JSONP répond un objet de la form {RequestId: "truc", Html: "machin"}
 *  - si on a besoin de plus de souplesse côté css, il faudra ajouter un div intermédiaire (dans la version actuelle vous aurez du mal à surcharger
 *        via la classe les styles définis dans #bubble)
 * 
 * La licence est celle de chrall (en gros : vous êtes libre).
 */ 

var bubbleInitDone = false;
var onBubbleTarget = false;
var onBubbleDiv = false;
var bubbleExists = false;
var bubbleCloseTimeoutID;
var bubbleTarget;


function hideBubble() {
	clearTimeout(bubbleCloseTimeoutID);
	if (bubbleExists && !onBubbleDiv) {
		$("#bubble").remove();
		bubbleExists = false;
	}
}
function showBubble(target, event, text, cssClass, ajaxRequestId, leftCol) {
	if (bubbleExists) hideBubble();
	var html = '<div id="bubble" style="';
	var tPosX = event.pageX-pageXOffset;
	var w=document.body.clientWidth;
	if (tPosX<w/2)	html += "left:"+(tPosX+30);
	else 			html += "right:"+(w-tPosX+30);
	html += ";"
	var tPosY = event.pageY-pageYOffset;
	var h = document.body.clientHeight;
	if (tPosY<h/2)	html += "top:"+(tPosY+20);
	else 			html += "bottom:"+(h-tPosY+20);
	if (ajaxRequestId && ajaxRequestId!=null) {
		document.getElementById('bubbleRequestId').value = ajaxRequestId; // je ne sais pas pourquoi mais utiliser $('#bubbleRequestId').val ne marche pas bien
		html += ';" class="'+cssClass+'">';
		if (text) html += '<div class=bubbleTitle>'+text+'</div>';
		if (leftCol) {
			html += '<table border=0><tr><td valign=top>'+leftCol+'</td><td valign=top><div id=bubbleContent>en attente de gogochrall...</div></td></tr></table></div>';
		} else {
			html += '<div id=bubbleContent>en attente de gogochrall...</div></div>';			
		}
	} else {
		html += ';" class="'+cssClass+'"><div class=bubbleContent>'+text+'</div></div>';
	}
	bubbleTarget = target;
	$(html).mouseover(keepBubbleOpen).mouseout(letBubbleClose).prependTo('body');
	bubbleExists = true;
}
function keepBubbleOpen() {
	onBubbleDiv = true;
}
function letBubbleClose() {
	onBubbleDiv = false;
	hideBubble();
}


function bubble(
	target,  // un objet jquery, par exemple  $("a.ch_monster")
	text, // le contenu de la bulle
	cssClass, // une classe css ajoutée à la bulle
	ajaxUrl, // une url pour l'appel ajax jsonp optionnel (si pas d'ajaxUrl, pas d'appel ajax)
	ajaxRequestId
) {
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
			showBubble.call(this, $(this), event, text, cssClass, ajaxRequestId);
		} else {
			showBubble.call(this, $(this), event, text, cssClass);
		}
	});
	target.mouseout(function(event){
		onBubbleTarget = false;
		hideBubble();
		//bubbleCloseTimeoutID = setTimeout(hideBubble, 150);  <= remettre cette ligne si on veut permettre le passage de la souris dans la bulle sans qu'elle se ferme
	});
}

// pour un ajout dynamique similaire au live de jquery.
function bubbleLive(
	selector,
	cssClass,
	getArgs // fonction prenant en argument un objet jquery résultat de $(selector) et renvoyant une map avec text, ajaxUrl, ajaxRequestId (plus en optionnel leftCol)
) {
	$(selector).live(
		'mouseenter', function(event) {
			var target = $(this);
			var args = getArgs(target);
			if (scrollInProgress || onBubbleDiv || onBubbleTarget) return false;
			onBubbleTarget = true;
			if (args.ajaxUrl) {
				$.ajax(
					{
						url: args.ajaxUrl,
						crossDomain: true,
						dataType: "jsonp"
					}
				);
				showBubble.call(this, target, event, args.text, cssClass, args.ajaxRequestId, args.leftCol);
			} else {
				showBubble.call(this, target, event, args.text, cssClass, null, args.leftCol);
			}
			
		}
	).live(
		'mouseout', function(event){
			onBubbleTarget = false;
			hideBubble();
		}
	);
}

