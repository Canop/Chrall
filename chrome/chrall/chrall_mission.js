(function(chrall) {

	chrall.addTroogleLinks = function() {
		var $mission_lines = $("[name='ActionForm'] tr");
		$mission_lines.each(function() {
			var stepText = this.childNodes[1].textContent;
			if (0 < stepText.indexOf("monstre")) {
				addTroogleForMonster(this, stepText);
				return;
			}
			if (0 < stepText.indexOf("hampignon")) {
				addTroogleForMushroom(this, stepText);
				return;
			}
		});
	};

	// Add a link to Troogle for the chosen text, including the current troll's current position
	function addTroogleLink(row, mainSearch) {
		var url = "http://troogle.iktomi.eu/entities/?entity_search[search]=" + mainSearch + playerPositionParameters();
		var $link = $("<a/>", {'class': 'gogo', href: url, target: 'troogle', html: "Troogle"});
		var actionNode = row.childNodes[2];
		$(actionNode).append("  ").append($link);
	}

	// Search parameters for the current troll's position
	function playerPositionParameters() {
		return "&entity_search[position_x]=" + chrall.player().x
				+ "&entity_search[position_y]=" + chrall.player().y
				+ "&entity_search[position_z]=" + chrall.player().z;
	}

	function addTroogleForMonster(row, text) {
		var mainSearch = "@monstre ";
		var raceExtract = /de la race des "(.*?)"/i;
		var match = raceExtract.exec(text);
		if (match) {
			mainSearch += match[1];
		}
		var minLevelExtract = /niveau.* (\d+) au moins/i;
		var minLevel = 0;
		var maxLevel = 100;
		match = minLevelExtract.exec(text);
		if (match) {
			minLevel = atoi(match[1]);
		}
		var levelRangeExtract = /niveau.* (\d) \+ ou \-/i;
		match = levelRangeExtract.exec(text);
		if (match) {
			var center = atoi(match[1]);
			minLevel = center - 1;
			maxLevel = center + 1;
		}

		mainSearch += " level:" + minLevel + ".." + maxLevel;
		addTroogleLink(row, mainSearch);
	}

	function addTroogleForMushroom(row, text) {
		var mainSearch = "@tresor:champignon";
		addTroogleLink(row, mainSearch);
	}

})(window.chrall = window.chrall || {});