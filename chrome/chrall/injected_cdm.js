"use strict";
// fonction appelée en JSONP par le serveur gogochrall
var chrall = chrall || {};
chrall.cdm_receive = function(answer) {
	document.getElementById('gogochrall').innerHTML = answer;
}
