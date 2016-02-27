"use strict";
(function(chrall){

	// modifie la frame d'action en bas lorsque l'action en cours de paramétrage est le minage
	chrall.handleBeforeMinage = function(){
		var player = chrall.player();
		if (player.totalSight) {
			var hs = Math.floor(player.totalSight / 2);
			var vs = Math.floor(Math.ceil(player.totalSight / 2) / 2);
			var html = '<br>Zone fouillée :';
			html += '<b><br>' + (player.x - hs) + ' &le; X &le; ' + (player.x + hs);
			html += '<br>' + (player.y - hs) + ' &le; Y &le; ' + (player.y + hs);
			html += '<br>' + (player.z - vs) + ' &le; N &le; ' + ((player.z + vs) > -1 ? -1 : (player.z + vs)) + '</b>';
			$('div.action').append(html);
		}
	};

	chrall.handleMinagePage = function(){
		var player = chrall.player();
		if (player.totalSight) {
			var hs = Math.floor(player.totalSight / 2);
			var vs = Math.floor(Math.ceil(player.totalSight / 2) / 2);
			var html = '<br>Zone fouillée :';
			html += '<b><br>' + (player.x - hs) + ' &le; X &le; ' + (player.x + hs);
			html += '<br>' + (player.y - hs) + ' &le; Y &le; ' + (player.y + hs);
			html += '<br>' + (player.z - vs) + ' &le; N &le; ' + ((player.z + vs) > -1 ? -1 : (player.z + vs)) + '</b>';
			$("table table table form").append(html);
		}
	};

})(window.chrall = window.chrall || {});
