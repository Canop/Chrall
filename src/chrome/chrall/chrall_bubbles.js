/*
 * Après avoir testé une foultitude de librairies de bulles (jquery ou non), je me suis résolu à en écrire une qui 
 *  - soit rapide (la plupart rament dés qu'on a une trentaine de bulles...)
 *  - supporte un contenu fourni par requète JSONP
 *  - gère le positionnement automatiquement pour ne pas afficher bêtement les trucs en dehors de la zone visible ou les écraser
 *  - empêche les bulles de recouvrir la souris
 * 
 * Notes :
 *  - Le callback de l'appel JSONP a charge de remplir le $("#bubbleContent")
 *  - si on a besoin de plus de souplesse côté css, il faudra ajouter un div intermédiaire (dans la version actuelle vous aurez du mal à surcharger
 *        via la classe les styles définis dans #bubble)
 * 
 * TODO :
 * 	- gérer l'ascenseur afin que la bulle reste près de la souris
 */ 

var onBubbleTarget = false;
var onBubbleDiv = false;
var bubbleExists = false;
var bubbleCloseTimeoutID;

function hideBubble() {
	clearTimeout(bubbleCloseTimeoutID);
	if (bubbleExists && !onBubbleDiv) {
		$("#bubble").remove();
		bubbleExists = false;
	}
}
function showBubble(event, text, cssClass, hasAjaxContent) {
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
	if (hasAjaxContent) {
		html += ';" class="'+cssClass+'"><div class=bubbleTitle>'+text+'</div><div id=bubbleContent>en attente de gogochrall...</div></div>';
	} else {
		html += ';" class="'+cssClass+'"><div class=bubbleContent>'+text+'</div></div>';
	}
	$(html).mouseover(keepBubbleOpen).mouseout(letBubbleClose).appendTo('body');
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
	ajaxUrl // une url pour l'appel ajax jsonp optionnel (si pas d'ajaxUrl, pas d'appel ajax)
) {
	target.mouseenter(function(event) {
		if (onBubbleDiv || onBubbleTarget) return false;
		onBubbleTarget = true;
		if (ajaxUrl) {
			$.ajax(
				{
					url: ajaxUrl,
					crossDomain: true,
					dataType: "jsonp"
				}
			);
			showBubble.call(this, event, text, cssClass, true);
		} else {
			showBubble.call(this, event, text, cssClass, false);
		}
	});
	target.mouseout(function(){
		onBubbleTarget = false;
		bubbleCloseTimeoutID = setTimeout(hideBubble, 150);
	});
}

