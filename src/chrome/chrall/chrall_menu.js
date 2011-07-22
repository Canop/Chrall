/*
 * agit sur la frame de gauche (le "menu" de MH)
 */ 

function Chrall_handleMenuPage() {
	//> lecture et transmission au background du numéro du troll et de sa position
	var trollId = $('input[name="ai_IdPJ"]').val();
	var infoMenuDiv = $('div.infoMenu');
	var html = infoMenuDiv.html();
	var ibr1 = html.indexOf('<br>');
	var ibr2 = html.lastIndexOf('<br>');
	var t1 = html.substring(0, ibr1);
	var t2 = html.substring(ibr1+4, ibr2);
	var t3 = html.substring(ibr2+4);
	html = '<span id=ch_menu_dla>'+t1+'</span><br><span id=ch_menu_position>';
	if (ibr1 != ibr2) html += t2+'</span><br><span id=ch_menu_pocketHall>';
	html += t3+'</span>'
	infoMenuDiv.html(html);
	
	if (ibr1 != ibr2) t2 = t3; 
	var infoTokens = Chrall_tokenize(t2);
	var px = infoTokens[1];
	var py = infoTokens[3];
	var pz = infoTokens[5];
	player.x = parseInt(px);
	player.y = parseInt(py);
	player.z = parseInt(pz);
	chrome.extension.sendRequest({
		"trollId": parseInt(trollId),
		"position": {"x":player.x, "y":player.y, "z":player.z}
		//TODO "pocketHall": t3 or Hall... Who catches the request?
	});
}
