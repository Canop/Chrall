
function Chrall_preparePlay2Inputs() {
	var html = '';
	html += '<input type=hidden id=chrall_pa_restant value=0>'; // rempli par la petite frame d'action en bas de l'écran [champ non utilisé actuellement]
	html += '<input type=hidden id=chrall_de_dx value=0>'; // rempli par le menu de la grille
	html += '<input type=hidden id=chrall_de_dy value=0>'; // rempli par le menu de la grille
	html += '<input type=hidden id=chrall_de_dz value=0>'; // rempli par le menu de la grille
	$(html).appendTo($('body'));
}
