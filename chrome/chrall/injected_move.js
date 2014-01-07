	/* TODO: les injected_xxx.js contiennent du code qui est exécuté directement, or ce n'est pas systématiquement pertinent, à nettoyer */
// code injecté et exécuté lorsque l'on affiche le formulaire de mouvement dans la frame d'action

(function(chrall) {

chrall.injectMove = function() {

	// TODO: pick a proper name for the args
	// TODO: check if we still need to pass through local storage now that the handling of the extension is different
	// TODO: rename file
	var todoArgs = localStorage['todo_args'];
	if (todoArgs) {
		localStorage.removeItem('todo_args');
		var xyz = todoArgs.split(' ');
		if (xyz.length == 3) {
			function ch_check(name, required) {
				radios = document.getElementsByName(name);
				for (var i in radios) {
					if (radios[i].value == required) radios[i].checked = true;
				}
			}

			ch_check('ai_DeplX', xyz[0]);
			ch_check('ai_DeplY', xyz[1]);
			ch_check('ai_DeplN', xyz[2]);
		}
	}
};

})(window.chrall = window.chrall || {});
