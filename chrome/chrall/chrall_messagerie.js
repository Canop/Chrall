"use strict";
(function (chrall) {

	chrall.compactMessageTitle = function() {
		var $titleInput = $('input[name="Titre"]');
		if (0 == $titleInput.length) return;
		var titleText = $titleInput.val();
		
		// Numerify the number of 'Re : ' and 'Re(x) :'
		var replyCount = 0;
		var regexp = /Re : /g;
		if ("Re :" == titleText) {
			replyCount = -1;
		}
		var match = regexp.exec(titleText);
		while (match) {
			replyCount++;
			match = regexp.exec(titleText);
		}
		titleText = titleText.replace(/Re : /g, "");

		regexp = /Re\((\d+)\) : /g;
		match = regexp.exec(titleText);

		while (match) {
			replyCount += parseInt(match[1]);
			match = regexp.exec(titleText);
		}
		titleText = titleText.replace(/Re\((\d+)\) : /g, "");

		// Put the number of "Re:" after the standard headers
		match = /(.*\| ?)(.*)/.exec(titleText);
		var replyPrefix = 0 < replyCount ? ("Re(" + replyCount + ") : ") : ""
		if (null == match) {
			$titleInput.val(replyPrefix + titleText);
		} else {
			$titleInput.val(match[1] + replyPrefix + match[2]);
		}
	}

})(window.chrall = window.chrall || {});
