/*
 * agit sur la frame de gauche (le "menu" de MH)
 */ 

function Chrall_handleMenuPage() {
	//> lecture et transmission au background du numéro du troll
	var trollId = $('input[name="ai_IdPJ"]').val();
	//console.log('menu : trollId='+trollId);
	//$('<script>parent.chrall_troll_id.value=+trollId+;</script>').appendTo($('body'));
	chrome.extension.sendRequest({"trollId": parseInt(trollId)});
}
