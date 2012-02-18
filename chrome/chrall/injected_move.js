
// code injecté et exécuté lorsque l'on affiche le formulaire de mouvement dans la frame d'action

function ch_check(name, input) {
	radios = document.getElementsByName(name);
	for (var i in radios) {
		if (radios[i].value==input.value) radios[i].checked=true;
	}
	input.value=0; // on nettoie pour éviter que des DE lancés par d'autres biais soient pollués
}
ch_check('ai_DeplX', parent.chrall_de_dx);
ch_check('ai_DeplY', parent.chrall_de_dy);
ch_check('ai_DeplN', parent.chrall_de_dz);
