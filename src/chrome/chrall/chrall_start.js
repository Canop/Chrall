
function Chrall_analyseAndReformatStartPage() {
	//> afin de ne pas avoir à scroller pour accéder à la zone de login on descend le bloc de bienvenue qui ne change jamais
	$("form").append("<br>");
	$($("table.mh_tdborder")[0]).appendTo("form");
	
	//> on décoche la case "Activer sa DLA"
	$('input[name=ab_activation]').attr('checked', false);
}
