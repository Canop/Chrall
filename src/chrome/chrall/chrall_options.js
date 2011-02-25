


function Chrall_reformatOptionsView() {
	var standardOptionContainer = $("table table td")[1];
	var standardOptionTables = $(standardOptionContainer).find("table");

	var html="<ul class=tabs>";
	html += "<li><a href=#tabStandard>Options Standard</a></li>";
	html += "<li><a href=#tabChrall>Options Chrall</a></li>";
	html += "</ul>";
	html += "<div class=tab_container><br><br>";
	html += "<div id=tabStandard class=tab_content></div>";
	html += "<div id=tabChrall class=tab_content></div>";
	$(standardOptionContainer).prepend(html);
	
	//alert($(standardOptionTables[1]).html());
	
	$("div#tabStandard").append($(standardOptionTables[0]));
	$("div#tabStandard").append($(standardOptionTables[1]));
	$("div#tabStandard").append($(standardOptionTables[2]));
	$("div#tabStandard").append($(standardOptionTables[3]));
	
	//for (var i in standardOptionTables) $("div#tabStandard").append($(standardOptionTables[i]));
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
