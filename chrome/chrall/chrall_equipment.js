"use strict";
(function(chrall){

	function sortTable(table){
		var $rows = $(table).find("tr");
		$rows.sortElements(function(a, b){
			var leftText = a.children[3].textContent;
			var rightText = b.children[3].textContent;
			return leftText < rightText ? -1 : (leftText > rightText ? 1 : 0);
		});
	}

	chrall.sortEquipment = function(){
		if (!chrall.isOptionEnabled('gear-sort-items', 'yes')) {
			return;
		}
		var $tablesToSort = $("[id^=mh_objet_hidden]");
		$tablesToSort.each(function(i, table){
			sortTable(table);
		});
	};

})(window.chrall = window.chrall || {});
