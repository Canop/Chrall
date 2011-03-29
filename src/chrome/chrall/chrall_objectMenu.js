/*
 * La méthode objectMenu, la seule publique, permet d'ajouter un menu (en fait un div
 *  dont le contenu est fourni par l'appelant) qui s'affiche sous un objet (testé pour
 *  un td mais ça doit marcher avec tout ce qui est fixe et assez large).
 */ 

var onOmTarget = false;
var onOmMenu = false;
var omExists = false;
var omCloseTimeoutID;
var omTarget;
var omMenu;

function hideOm() {
	clearTimeout(omCloseTimeoutID);
	if (omExists && !onOmMenu) {
		$("#objectMenu").remove();
		omExists = false;
	}
}
function showOm(target, text) {
	var pos =target.offset();
	if (omExists) hideOm();
	var html = '<div id="objectMenu" style="';
	html += "left:"+pos.left+"px;";
	html += "top:"+(pos.top+target.innerHeight())+"px;";
	html += "width:"+(target.width()-1)+"px;";
	html += "background-color:"+target.css("background-color")+";";
	html += '">'+text+'</div>';
	omMenu = $(html);
	omTarget = target;
	omMenu.mouseover(keepOmOpen).mouseout(letOmClose).appendTo('body');
	omExists = true;
}
function keepOmOpen() {
	onOmMenu = true;
}
function letOmClose(event) {
	if (!onOmMenu) return;
	if (omMenu) {
		// si l'on entre dans un objet du menu (par exemple un lien) l'évenement MouseOut est envoyé, on doit donc filtrer ce cas
		var pos = omMenu.offset();
		if (
			event.pageX>pos.left
			&& event.pageX<pos.left+omMenu.width()
			&& event.pageY>pos.top
			&& event.pageY<pos.top+omMenu.height()
		) {
			return;
		}
	}
	onOmMenu = false;
	hideOm();
}

function objectMenu(
	target,  // un objet jquery, par exemple  $("#myObject")
	html // le contenu du menu
) {
	target.mouseenter(function(event) {
		if (onOmMenu || onOmTarget) return false;
		onOmTarget = true;
		showOm.call(this, $(this), html);
	});
	target.mouseout(function(){
		// si l'on entre dans un objet du menu (par exemple un lien) l'évenement MouseOut est envoyé, on doit donc filtrer ce cas
		var pos = omTarget.offset();
		if (
			event.pageX>pos.left
			&& event.pageX<pos.left+omTarget.width()
			&& event.pageY>pos.top
			&& event.pageY<pos.top+omTarget.height()
		) {
			return;
		}
		onOmTarget = false;
		omCloseTimeoutID = setTimeout(hideOm, 150);
	});
}
