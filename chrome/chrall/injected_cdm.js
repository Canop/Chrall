"use strict";
// fonction appelée en JSONP par le serveur gogochrall
window.cdm_receive = function(answer) {
	document.getElementById('gogochrall').innerHTML = answer;
}
