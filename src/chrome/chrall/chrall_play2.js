
function Chrall_preparePlay2Inputs() {
	var html = '';
	html += '<input type=hidden id=chrall_de_dx value=0>';
	html += '<input type=hidden id=chrall_de_dy value=0>';
	html += '<input type=hidden id=chrall_de_dz value=0>';
	$(html).appendTo($('body'));
}
