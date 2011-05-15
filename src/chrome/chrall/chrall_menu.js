/*
 * agit sur la frame de gauche (le "menu" de MH)
 */ 

function Chrall_handleMenuPage() {
	//> lecture et transmission au background du numéro du troll et de sa position
	var trollId = $('input[name="ai_IdPJ"]').val();
	var infoMenuDiv = $('div.infoMenu');
	var html = infoMenuDiv.html();
	var ibr = html.indexOf('<br>');
	var t1 = html.substring(0, ibr-1);
	var t2 = html.substring(ibr+4);
	infoMenuDiv.html('<span id=ch_menu_dla>'+t1+'</span><br><span id=ch_menu_dla>'+t2+'</span>');
	var infoTokens = Chrall_tokenize(t2);
	var px = infoTokens[1];
	var py = infoTokens[3];
	var pz = infoTokens[5];
	chrome.extension.sendRequest({
		"trollId": parseInt(trollId),
		"position": {"x":px, "y":py, "z":pz}
	});
}
