// code injecté et exécuté lorsque l'on affiche le formulaire de mouvement dans la frame d'action

var todoArgs = localStorage['todo_args'];
if (todoArgs) {
	localStorage.removeItem('todo_args');
	var xyz = todoArgs.split(' ');
	if (xyz.length==3) {
		function ch_check(name, required) {
			radios = document.getElementsByName(name);
			for (var i in radios) {
				if (radios[i].value==required) radios[i].checked=true;
			}
		}
		ch_check('ai_DeplX', xyz[0]);
		ch_check('ai_DeplY', xyz[1]);
		ch_check('ai_DeplN', xyz[2]);
	}
}

