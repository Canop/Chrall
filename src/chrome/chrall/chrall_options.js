


function Chrall_reformatOptionsView() {
	var standardOptionContainer = $("table table td")[1];
	var standardOptionTables = $(standardOptionContainer).find("table");

	var html="<ul class=tabs>";
	html += "<li><a href=#tabStandard>Options Standard</a></li>";
	html += "<li><a href=#tabChrall>Options Chrall</a></li>";
	html += "</ul>";
	html += "<div class=tab_container><br><br>";
	html += " <div id=tabStandard class=tab_content></div>";
	html += " <div id=tabChrall class=tab_content>";
	html += "<h2>Qu'est-ce que Chrall</h2>";
	html += "<p>";
	html += "Chrall est une extension pour Chrome visant à enrichir l'interface du jeu. Elle ne modifie pas les autres pages que vous consultez.";
	html += "<br>Si vous souhaitez retrouver l'interface standard de Mounty Hall, vous pouvez la désactiver via le menu <i>Outils/Extensions</i> de Chrome.";
	html += "<br>Pour plus d'informations sur le projet Chrall : <a href=canop.org/chrall>canop.org/chrall</a>.";
	html += "</p>";
	html += "<h2>Outils Chrall</h2>";
	html += "<ul>";
	html += "<li><a target=nouvelOnglet href=\"http://canop.org:9090/chrall/puit\">Le Puits</a> dans lequel vous pouvez déverser vos CDM</li>";
	html += "</ul>";
	html += " </div>";
	html += "</div>";

	$(standardOptionContainer).prepend(html);
		
	$("div#tabStandard").append($(standardOptionTables[0]));
	$("div#tabStandard").append($(standardOptionTables[1]));
	$("div#tabStandard").append($(standardOptionTables[2]));
	$("div#tabStandard").append($(standardOptionTables[3]));
	
	$(".tab_content").hide();
	$("ul.tabs li:first").addClass("active").show();
	$(".tab_content:first").show(); 
	$("ul.tabs li").click(function() {
		$("ul.tabs li").removeClass("active");
		$(this).addClass("active");
		$(".tab_content").hide();
		var activeTab = $(this).find("a").attr("href");
		window.scroll(0, 0);
		$(activeTab).fadeIn("fast");
		return false;
	});
}
