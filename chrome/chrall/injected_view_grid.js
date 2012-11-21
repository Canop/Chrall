(function (chrall) {

	chrall.gridChangeDisplayByName = function (key, display, transient) {
		var os = document.getElementsByName(key);
		if (!display) { // mode d'inversion d'un objet unique, non persistent
			for (var i = 0; i < os.length; i++) {
				if (os[i].style.display == 'inline') {
					os[i].style.display = 'none';
				}
				else {
					os[i].style.display = 'inline';
				}
			}
		} else { // mode d'inversion de filtre global, persistent
			for (var i = 0; i < os.length; i++) {
				os[i].style.display = display;
			}
			if (!transient) {
				localStorage['grid_filter_' + key] = display;
			}
		}
	}

	chrall.updateTrollInfoInTable = function(partages) {
		if (chrall.isOptionDisabled('view-display-hit-points-ratio')) {return;}
		
		var partageInfo = {};
		for (var i = 0; i < partages.length; i++) {
			var partage = partages[i];
			var autreTroll = partage.AutreTroll;
			if (autreTroll) {
				partageInfo[parseInt(partage.IdAutreTroll)] = autreTroll;
			}
		}
		$(".pvBar").remove();
		var $trollTable = $("#table_trolls");
		var lines = $trollTable.get(0).children[0].children;
		for (i = 2; i < lines.length; i++) {
			var cells = lines[i].children;
			var trollId = parseInt(cells[2].textContent);
			var trollInfo = partageInfo[trollId];
			if (trollInfo) {
				var $pv = createPvBlock(trollInfo.PV_actuels, trollInfo.PV_max);
				$(cells[3]).append($pv);
			}
		}

	}

	// Private -- not linked to the chrall instance
	function createPvBlock(pvActuels, pvMax) {
		// To show long bars for trolls with many hit points
		// minimum width: 30 px (for 30 hit points)
		// maximum width: 300px (for (500 hit points)
		var maxWidth = 30 + (pvMax - 30) * 3.0 / 5.0;
		var multiplier = maxWidth / pvMax;

		var ratioPv = pvActuels / pvMax;
		var currentWidth = pvActuels * multiplier;

		var backgroundHue = 120 * ratioPv;

		var blockStyle = "border: 1px solid black; border-radius:3px; padding: 1px; display:inline-block; margin-left:1em; width:" + maxWidth + "px;";
		var pvStyle = "border-radius:2px; text-align:right; display:inline-block; width:" + currentWidth + "px; font-weight:bold;background-color:hsl(" + backgroundHue + ",90%,50%);";
		var $block = $("<span/>", {class: "pvBar", style: blockStyle});
		var $pv = $("<span/>", {text: "(" + pvActuels + "/" + pvMax + ")", style: pvStyle});
		$block.append($pv);
		return $block;
	}


})(window.chrall = window.chrall || {});

