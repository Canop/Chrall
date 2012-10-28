

function Chrall_handleBeforeCdmPage() {
	var html = '<span>';	
	html += '<br><input type=checkbox checked id=sendCdmAuto><label for="sendCdmAuto">Envoyer la CDM au serveur Chrall</label>';	
	html += '</span>';
	$(html).appendTo('div.Action');
	$('#sendCdmAuto').change(function(){
		chrome.extension.sendMessage({"send_cdm": this.value})
	});
}

function Chrall_handleCdmPage() {	
	//> récupération de la cdm (en prenant soin de séparer les lignes)
	// TODO : vérifier que ce n'est pas un échec
	var para = $("table table table form p");	
	var cdm = "";
	for (var ip=0; ip<para.length; ip++) {
		var p = $(para[ip]);
		var t = p.find("table");
		if (t.length>0) {
			// c'est le bon paragraphe, composé d'une ligne en gras et d'un tableau
			cdm += $(p.find("b")[0]).text(); // contient l'intitullé du monstre
			t.find("tr").each(function() {
				cdm += "\n"+$(this).text();
			});
			break;
		}
	}

		
	//> écriture du script de récupération de la réponse (mécanisme JSONP)
	html = "<div id=gogochrall></div>";
	$("table table table form").append(html);
	
	if (cdm.substring("Monstre Ciblé fait partie")<0) {
		document.getElementById('gogochrall').innerHTML = "cdm ratée ? Pas d'envoi à gogochrall.";
	} else {
		//> on regarde d'abord si l'utilisateur a refusé qu'on envoie sa CDM
		chrome.extension.sendMessage(
			{"get_send_cdm": "Ou je te pête la gueule!"},
			function(answer) {
				if (answer.send_cdm) {
					//> envoi au serveur de la CDM
					chrall.jsonp(chrall.serveurPublic()+"json?action=accept_cdm_jsonp&author="+player.id+"&cdm="+encodeURIComponent(cdm)+"&seconds="+findMHSeconds());
				} else {
					document.getElementById('gogochrall').innerHTML = "Conformément à votre souhait, la CDM n'a pas été envoyée au serveur Chrall. Sniff...";
				}
			}
		);
	}
	
}
