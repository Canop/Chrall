/**
 *
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
		//console.log("hideOm");
		$("#objectMenu").remove();
		omExists = false;
	}
}
function showOm(target, text) {
	var pos =target.offset();
	//console.log("showOm");
	if (omExists) hideOm();
	var html = '<div id="objectMenu" style="';
	html += "left:"+pos.left+"px;";
	html += "top:"+(pos.top+target.innerHeight())+"px;";
	html += "width:"+(target.width()-1)+"px;";
	html += "background-color:"+target.css("background-color")+";";
	html += '">'+text+'</div>';
	omMenu = $(html);
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
			//console.log("FAUX POSITIF");
			return;
		}
	}
	//console.log("letOmClose");
	onOmMenu = false;
	hideOm();
}

function objectMenu(
	target,  // un objet jquery, par exemple  $("#myObject")
	html // le contenu du menu
) {
	target.mouseenter(function(event) {
		//console.log("mouseenter");
		if (onOmMenu || onOmTarget) return false;
		onOmTarget = true;
		showOm.call(this, $(this), html);
	});
	target.mouseout(function(){
		//console.log("mouseout");
		onOmTarget = false;
		omCloseTimeoutID = setTimeout(hideOm, 150);
	});
}
