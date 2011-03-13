

function Chrall_handleCdmPage() {
	alert("une cdm est cachée dans cette page");
	
	var cdm = $("table table table form").children().text();
	alert(cdm); // à vérifier
	
	html = "ICI!<script>";
	html += "function cdm_receive(answer) {";
	html += " alert(answer);";
	html += "}";
	html += "</script>";

	$("table table table form").append(html);
	
	$.ajax(
		{
			url: "http://localhost:9090/chrall/json?action=accept_cdm_jsonp&cdm=" + encodeURIComponent(text), // <- attention, ne marche que si le text est court...
			crossDomain: true,
			dataType: "jsonp"
		}
	);

}
