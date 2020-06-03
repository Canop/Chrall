"use strict";
(function(chrall){

	chrall.saveMissions = function(){
		var missions = $('.mh_titre3').text().match(/\d+/g);
		// Remove obsolete missions
		for (var id in chrall.player().missions){
			if (!missions.includes(id)){
				delete chrall.player().missions[id];
			}
		}
		chrall.updateTroll();
	};

	chrall.addLinksAndUpdateMissions = function(){
		var missionId = $('div.titre2').text().match(/\d+/g);
		// Remove obsolete step
		delete chrall.player().missions[missionId];
		var row = $('img[src*="orange"]').closest('tr');
		var stepText = row.find('td').eq(1).text();
		if (0 < stepText.indexOf("monstre")) {
			addTroogleForMonster(row, stepText, missionId);
		}
		if (0 < stepText.indexOf("hampignon")) {
			addTroogleForMushroom(row, stepText);
		}
		chrall.updateTroll();
	};

	// Add a link to Troogle for the chosen text, including the current troll's current position
	function addTroogleLink(row, mainSearch){
		var url = "http://troogle.iktomi.eu/entities/?entity_search[search]=" + mainSearch + playerPositionParameters();
		var $link = $("<a/>", {'class': 'gogo', href: url, target: 'troogle', html: "Troogle"});
		row.find('td').eq(2).append('  ').append($link);
	}

	// Search parameters for the current troll's position
	function playerPositionParameters(){
		return "&entity_search[position_x]=" + chrall.player().x
				+ "&entity_search[position_y]=" + chrall.player().y
				+ "&entity_search[position_z]=" + chrall.player().z;
	}

	function addTroogleForMonster(row, text, missionId){
		var raceExtract = /de la race des '(.*?)'/i;
		var match = raceExtract.exec(text);
		var race = "";
		if (match) {
			race = match[1];
		}
		var minLevelExtract = /niveau.* (\d+) au moins/i;
		var minLevel = 0;
		var maxLevel = 100;
		match = minLevelExtract.exec(text);
		if (match) {
			minLevel = chrall.atoi(match[1]);
		}
		var levelRangeExtract = /niveau.* (\d+) \+ ou \-/i;
		match = levelRangeExtract.exec(text);
		if (match) {
			var center = chrall.atoi(match[1]);
			minLevel = center - 1;
			maxLevel = center + 1;
		}

		addTroogleLink(row, removeAccent(`@monstre ${race} level:${minLevel}..${maxLevel}`));
		chrall.player().missions[missionId] = {
			race: race,
			minLevel: minLevel,
			maxLevel: maxLevel,
			step: text
		};
	}

	function removeAccent(text){
		var accent = [
			/[\300-\306]/g, /[\340-\346]/g, // A, a
			/[\310-\313]/g, /[\350-\353]/g, // E, e
			/[\314-\317]/g, /[\354-\357]/g, // I, i
			/[\322-\330]/g, /[\362-\370]/g, // O, o
			/[\331-\334]/g, /[\371-\374]/g, // U, u
			/[\321]/g, /[\361]/g, // N, n
			/[\307]/g, /[\347]/g, // C, c
		];
		var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

		var str = text;
		for (var i = 0; i < accent.length; i++) {
			str = str.replace(accent[i], noaccent[i]);
		}

		return str;
	}


	function addTroogleForMushroom(row, text){
		var mainSearch = "@tresor:champignon";
		addTroogleLink(row, mainSearch);
	}

})(window.chrall = window.chrall || {});
