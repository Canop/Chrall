


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
	html += "<h2>Que fait Chrall exactement</h2>";
	html += "<p>";
	html += "Chrall modifie les pages que vous recevez depuis games.mountyhall.com (Chrall ne s'intéresse pas aux autres pages)."
	html += "<br>Chrall affiche, sur la vue, des estimations des caractéristiques des monstres, en exploitant son bestiaire (lien plus bas)."
	html += "<br>Chrall transmet les CDM que vous effectuez à ce bestiaire, afin de l'enrichir."
	html += "<br>Aucune autre information, et en particulier aucune information pouvant donner un avantage illégitime à un autre joueur n'est transmise"
	html += " (donc pas de transmission des AA, des blessures des monstres, des coups, des infos de vos trolls, etc.)."
	html += "</p>";
	html += "<h2>Outils Chrall</h2>";
	html += "<ul>";
	html += "<li><a target=nouvelOnglet href=\"http://canop.org:9090/chrall/puits\">Le Puits</a> dans lequel vous pouvez déverser vos CDM</li>";
	html += "<li><a target=nouvelOnglet href=\"http://canop.org:9090/chrall/bestiaire\">Le Bestiaire</a> qui vous dira en retour ce qu'il sait des monstres</li>";
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
