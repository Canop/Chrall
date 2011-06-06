/*
 * La méthode objectMenu, la seule publique, permet d'ajouter un ou deux menu(s) (en fait un div
 *  dont le contenu est fourni par l'appelant) au dessus et au dessous d'un objet.
 * 
 * 
 * 
 * TODO : tester si les performances restent correctes avec http://cherne.net/brian/resources/jquery.hoverIntent.html
 * 
 */ 

var onOmTarget = false;
var onOmTopMenu = false;
var onOmBottomMenu = false;
var omExists = false;
var omEnterTimeoutID;
var omCloseTimeoutID;
var omTarget;
var omTopMenu = null;
var omBottomMenu = null;


function eventIsOver(event, o) {
	// FIXME il y a un problème de décalage vertical de quelques pixels que je ne comprends pas (sur le haut de la zone au moins)
	if ((!o) || o==null) return false;
	var pos = o.offset();
	var ex = event.pageX;
	var ey = event.pageY;
	//~ console.log("pos.top="+pos.top);
	//~ console.log("e.pageY="+event.pageY);
	if (
		ex>=pos.left
		&& ex<=pos.left+o.width()
		&& ey>=pos.top
		&& ey<=pos.top+o.height()
	) {
		return true;
	}
	return false;
}

function checkHideOm() {
	if (onOmTarget||onOmTopMenu||onOmBottomMenu) return;
	// avant de fermer, on va laisser le temps de vérifier qu'on n'est pas tout de suite passé
	// dans un autre objet (par exemple depuis la cible vers un menu)
	clearTimeout(omCloseTimeoutID);
	omCloseTimeoutID = setTimeout(function() {
		if (onOmTarget || onOmTopMenu || onOmBottomMenu) return;
		hideOm();
	}, 200);
}
function hideOm() {
	if (omTopMenu!=null) {
		omTopMenu.remove();
		omTopMenu = null;
	}
	if (omBottomMenu!=null) {
		omBottomMenu.remove();
		omBottomMenu = null;
	}
}

function showOm(target, text_top, text_bottom) {
	var pos =target.offset();
	hideOm();
	omTarget = target;
	onOmTopMenu = false;
	onOmBottomMenu = false;
	if (text_top && text_top.length>0 && (pos.top-pageYOffset)>65) { /* remarque : le test sur la position est heuristique et surtout lié à mon cas d'usage précis */
		var html = '<div id="objectMenu_top" style="';
		html += "left:"+pos.left+"px;";
		html += "bottom:"+(document.body.clientHeight-pos.top-5)+"px;";
		html += "width:"+(target.width()-1)+"px;";
		html += "background-color:"+target.css("background-color")+";";
		html += '">'+text_top+'</div>';
		omTopMenu = $(html);
		// la ligne suivante est en commentaire pour que le passage de la souris sur le "menu" du haut n'empêche pas
		//  sa fermeture. On pourra rendre ce comportement paramétrable
		//omTopMenu.mouseover(enterTopMenu).mouseout(leaveTopMenu);
		omTopMenu.appendTo('body');
	}
	if (text_bottom && text_bottom.length>0) {
		var html = '<div id="objectMenu_bottom" style="';
		html += "left:"+pos.left+"px;";
		html += "top:"+(pos.top+target.innerHeight())+"px;";
		html += "width:"+(target.width()-1)+"px;";
		html += "background-color:"+target.css("background-color")+";";
		html += '">'+text_bottom+'</div>';
		omBottomMenu = $(html);
		omBottomMenu.mouseover(enterBottomMenu).mouseout(leaveBottomMenu);
		omBottomMenu.appendTo('body');
	}
}
function enterTopMenu() {
	onOmTopMenu = true;
}
function leaveTopMenu(event) {
	if (!onOmTopMenu) return;
	// si l'on entre dans un objet du menu (par exemple un lien) l'évenement MouseOut est envoyé, on doit donc filtrer ce cas
	if (eventIsOver(event, omTopMenu)) return;
	onOmTopMenu = false;
	checkHideOm();
}
function enterBottomMenu() {
	onOmBottomMenu = true;
}
function leaveBottomMenu(event) {
	if (!onOmBottomMenu) return;
	// si l'on entre dans un objet du menu (par exemple un lien) l'évenement MouseOut est envoyé, on doit donc filtrer ce cas
	if (eventIsOver(event, omBottomMenu)) return;
	onOmBottomMenu = false;
	checkHideOm();
}

function objectMenu(
	target,  // un objet jquery, par exemple  $("#myObject")
	html_top, // le contenu du menu au dessus (ou '')
	html_bottom // le contenu du menu en dessous (ou '')
) {
	target.mouseenter(function(event) {
		if (scrollInProgress || onOmTopMenu || onOmBottomMenu) return false;
		onOmTarget = true;
		showOm($(this), html_top, html_bottom);
	});
	target.mouseout(function(event){
		//console.log('target.mouseout');
		if (eventIsOver(event, omTarget)) return;
		//console.log('eventIsOver false');
		onOmTarget = false;
		checkHideOm();
	});
}


function objectMenuLive(
	selector,  // un sélecteur jquery, par exemple  "#myObject"
	getArgs // fonction prenant en argument un objet jquery résultat de $(selector) et renvoyant une map avec html_top, html_bottom
) {
	$(selector).live(
		'mouseenter', function(event) {
			var target = $(this);
			var args = getArgs(target);
			if (scrollInProgress || onOmTopMenu || onOmBottomMenu) return false;
			onOmTarget = true;
			showOm(target, args.html_top, args.html_bottom);
		}
	).live(
		'mouseout', function(event){
			if (eventIsOver(event, omTarget)) return;
			onOmTarget = false;
			checkHideOm();
		}
	);
}
