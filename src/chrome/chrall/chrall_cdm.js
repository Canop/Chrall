


function Chrall_handleCdmPage() {
	console.log("entering Chrall_handleCdmPage");
	alert("Si tu vois cette alerte, signale le à Denys");
	
	var cdm = $("table table table form").children().text(); // utiliser :contains pour trouver la cdm ?
	
	html = "Si tu lis ce texte, dis le à Denys, please<script>";
	html += "function cdm_receive(answer) {";
	html += " alert(answer);";
	html += "}";
	html += "</script>";

	alert(cdm); // à vérifier

	$("table table table form").append(html);
	
	$.ajax(
		{
			url: "http://canop.org:9090/chrall/json?action=accept_cdm_jsonp&cdm=" + encodeURIComponent(cdm), // <- attention, ne marche que si le text est court...
			crossDomain: true,
			dataType: "jsonp"
		}
	);
	console.log("leaving Chrall_handleCdmPage");

}
