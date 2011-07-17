function Chrall_handleMovePage() {
	var script = "";
	script += "function ch_check(name, input) {";
	script += " radios = document.getElementsByName(name);";
	script += " for (var i in radios) {";
	script += "  if (radios[i].value==input.value) radios[i].checked=true;";
	script += " }";
	script += " input.value=0;"; // on nettoie pour éviter que des DE lancés par d'autres biais soient pollués
	script += "}";
	script += "ch_check('ai_DeplX', parent.chrall_de_dx);";
	script += "ch_check('ai_DeplY', parent.chrall_de_dy);";
	script += "ch_check('ai_DeplN', parent.chrall_de_dz);";
	$('<script>'+script+'</script>').appendTo($('body'));
}
