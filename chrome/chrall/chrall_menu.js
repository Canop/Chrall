"use strict";
(function(chrall){

	/*
	 * agit sur la frame de gauche (le "menu" de MH)
	 */
	chrall.handleMenuPage = function(){
		var player = chrall.player();
		//> lecture et transmission au background du numéro du troll et de sa position
		var trollId = $('a').eq(0).attr('onclick').replace('EnterPJView(', '');
		var infoMenuDiv = $('div.infoMenu');
		var html = infoMenuDiv.html();
		var ibr1 = html.indexOf('<br>');
		var ibr2 = html.lastIndexOf('<br>');
		var t1 = html.substring(0, ibr1);
		var t2 = html.substring(ibr1 + 4, ibr2);
		var t3 = html.substring(ibr2 + 4);
		html = '<span id=ch_menu_dla>' + t1 + '</span><br><span id=ch_menu_position>';
		if (ibr1 != ibr2) {
			html += t2 + '</span><br><span id=ch_menu_pocketHall>';
		}
		html += t3 + '</span>';
		infoMenuDiv.html(html);
		var locationString = t2.indexOf('X=') >= 0 ? t2 : t3;
		var infoTokens = chrall.tokenize(locationString);
		var px = infoTokens[1];
		var py = infoTokens[3];
		var pz = infoTokens[5];

		player.id = parseInt(trollId);
		player.x = parseInt(px);
		player.y = parseInt(py);
		player.z = parseInt(pz);
		player.save();
	};

})(window.chrall = window.chrall || {});
