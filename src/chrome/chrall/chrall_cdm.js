

function Chrall_handleBeforeCdmPage() {
	var html = '<span>';	
	html += '<br><input type=checkbox checked id=sendCdmAuto><label for="sendCdmAuto">Envoyer la CDM au serveur Chrall</label>';	
	// html += '<script>functiparent.chrall_send_cdm.value='+tokens[3]+';</script></script>';	
	html += '</span>';	
	$(html).appendTo('div.Action');
	console.log($('div.Action'));
	$('#sendCdmAuto').change(function(){
		chrome.extension.sendRequest({"send_cdm": this.value})
	});
}

function Chrall_handleCdmPage() {
	console.log("entering Chrall_handleCdmPage");
	
	//> récupération de la cdm (en prenant soin de séparer les lignes)
	// TODO : vérifier que ce n'est pas un échec
	var para = $($("table table table form p")[1]);	
	cdm = "";
	cdm += $(para.find("b")[0]).text();
	para.find("tr").each(function() {
		cdm += "\n"+$(this).text();
	});
	
	//> écriture du script de récupération de la réponse (mécanisme JSONP)
	html = "<div id=gogochrall></div>";
	html += "<script>";
	html += "function cdm_receive(answer) {";
	html += " document.getElementById('gogochrall').innerHTML = answer;";
	html += "}";
	html += "</script>";
	$("table table table form").append(html);
	
	if (cdm.substring("Monstre Ciblé fait partie")<0) {
		document.getElementById('gogochrall').innerHTML = "cdm ratée ? Pas d'envoi à gogochrall.";
	} else {
		//> on regarde d'abord si l'utilisateur a refusé qu'on envoie sa CDM
		chrome.extension.sendRequest(
			{"get_send_cdm": "Ou je te pête la gueule!"},
			function(answer) {
				if (answer.send_cdm) {
					//> envoi au serveur de la CDM
					$.ajax(
						{
							url: "http://canop.org:9090/chrall/json?action=accept_cdm_jsonp&author="+player.id+"&cdm=" + encodeURIComponent(cdm), // <- attention, ne marche que si le text est court...
							crossDomain: true,
							dataType: "jsonp"
						}
					);					
				} else {
					document.getElementById('gogochrall').innerHTML = "Conformément à votre souhait, la CDM n'a pas été envoyée au serveur Chrall. Sniff...";
				}
			}
	}
	
	console.log("leaving Chrall_handleCdmPage");
}
