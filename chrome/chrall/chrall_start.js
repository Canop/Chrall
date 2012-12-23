(function (chrall) {
	chrall.analyseAndReformatStartPage = function () {
		//> afin de ne pas avoir à scroller pour accéder à la zone de login on descend le bloc de bienvenue qui ne change jamais
		var $form = $("form");
		$form.append("<br/>");
		$("table.mh_tdborder").appendTo($form);
	}
})(window.chrall = window.chrall || {});