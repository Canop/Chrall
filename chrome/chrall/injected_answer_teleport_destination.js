function Chrall_suggestDestinations(destinations) {
	var div = $('<div align="center" />')
	var select = $('<select/>');
	div.append(select)
	select.append($('<option>Destinations pr&eacute;d&eacute;finies</option>'))
	for (i in destinations) {
		select.append($('<option/>', { value : i }).text(destinations[i].Description));
	}
	select.bind("change", function(event) {
		var index = parseInt(event.target.value);
		if (undefined == index) {
			return;
		}
		var destination = destinations[index];
		$("[name=ai_OrigineX]").val(destination.X);
		$("[name=ai_OrigineY]").val(destination.Y);
		$("[name=ai_OrigineN]").val(destination.Z);
	})

	$(".Action").after(div);
}
