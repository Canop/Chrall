"use strict";
(function(chrall){

	chrall.addPartageLinkToAll = function(){
		var membersTable = $("[name='ActionForm']").get(0).children[0];
		var lines = membersTable.children[0].children;
		for (var lineIndex = 1; lineIndex < lines.length; lineIndex++) {
			var line = lines[lineIndex];
			var trollId = parseInt(line.children[1].textContent);
			if (chrall.playerId() == trollId) {
				continue
			}
			var $addLink = $("<a/>", {class: "gogo"}).text("Proposer partage");
			$addLink.click((function(trollId){
				return function(){
					chrall.sendPartageProposal(trollId);
				}
			})(trollId));
			$(line.children[2]).prepend($addLink);
		}
	}

})(window.chrall = window.chrall || {});
