


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
		//> envoi au serveur de la CDM
		$.ajax(
			{
				url: "http://canop.org:9090/chrall/json?action=accept_cdm_jsonp&cdm=" + encodeURIComponent(cdm), // <- attention, ne marche que si le text est court...
				crossDomain: true,
				dataType: "jsonp"
			}
		);
	}
	
	console.log("leaving Chrall_handleCdmPage");
}
