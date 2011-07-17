function Chrall_reformatOptionsView() {
	var standardOptionContainer = $("table table td")[1];
	var standardOptionTables = $(standardOptionContainer).find("table");
	
	var mdpkey = 'troll.'+player.id+'.mdp';
	var mdp = localStorage[mdpkey];
	var mdpIsValid = mdp && (mdp.length==32);
	var compteActif = compteChrallActif();
	var clefCompteActif='"troll.'+player.id+'.compteActif"';
	
	var activationButtonHtml = " &nbsp; <a id=activationButton class=gogo";
	if (!mdpIsValid) activationButtonHtml += " invisible";
	activationButtonHtml += " href='javascript:localStorage[\"tab_options\"]=\"tabChrall\";localStorage["+clefCompteActif+"]=\"";
	activationButtonHtml += compteActif ? "no" : "yes";
	activationButtonHtml += "\";document.location.href=\"Play_option.php\";'>";
	activationButtonHtml += compteActif ? "Désactiver le compte" : "Activer le compte";
	activationButtonHtml += "</a>";

	var html= "<script type=\"text/javascript\">";	
	html += "function setGrille(){";
	html += "var expdate = new Date();";
	html += "expdate.setTime (expdate.getTime() + ( 365 * 24 * 60 * 60 * 1000));";
	html += "if(document.getElementById('chk_vueGrille').checked){";
	html += "document.cookie = \"vueGrille=false\" + \"; expires=\" + expdate.toGMTString();";
	html += "}else{";
	html += "document.cookie = \"vueGrille=true\" + \"; expires=\" + expdate.toGMTString();";
	html += "}";
	html += "}";
	html += "function ReadCookie(name) {"; // ici, il y a duplication de code (avec chrall_general), pas trouvé mieux pour l'instant :/
	html += "var nameEQ = name + \"=\";";
	html += "var ca = document.cookie.split(';');";
	html += "for(var i=0;i < ca.length;i++) {";
	html +=	"var c = ca[i];";
	html +=	"while (c.charAt(0)==' ') c = c.substring(1,c.length);";
	html += "if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);";
	html +=	"}";
	html +=	"return null;";
	html += "}";
	html += "function checkVueGrille(){";
	html += "if(ReadCookie(\"vueGrille\") == null || ReadCookie(\"vueGrille\") == \"true\"){";
	html += "document.getElementById('chk_vueGrille').checked = false;";
	html += "return true;";
	html += "}";
	html += "document.getElementById('chk_vueGrille').checked = true;";
	html += "return false;";
	html += "}";
	html += "window.onload=checkVueGrille();";
	html += "</script>";
	html += "<ul class=tabs>";
	html += "<li><a href=#tabStandard>Options Standard</a></li>";
	html += "<li><a href=#tabChrall>Options Chrall</a></li>";
	html += "</ul>";
	html += "<div class=tab_container><br><br>";
	html += " <div id=tabStandard class=tab_content></div>";
	html += " <div id=tabChrall class=tab_content>";
	html += "<h2>Qu'est-ce que Chrall</h2>";
	html += "<p>";
	html += "Chrall est une extension pour Chrome visant à enrichir l'interface du jeu.";
	html += "<br>Si vous souhaitez retrouver l'interface standard de Mounty Hall, vous pouvez la désactiver via le menu <i>Outils/Extensions</i> de Chrome.";
	html += "<br>Pour plus d'informations sur le projet Chrall : <a target=newWin href=http://canop.org/chrall>canop.org/chrall</a>.";
	html += "</p>";
	html += "<h2>Que fait Chrall exactement</h2>";
	html += "<p>";
	html += "Chrall modifie les pages que vous recevez depuis *.mountyhall.com et quelques adresses alternatives du jeu (Chrall ne voit ni ne change les autres pages)."
	html += "<br>Chrall affiche, sur la vue, des estimations des caractéristiques des monstres, en exploitant son bestiaire (lien plus bas). De même pour les trolls en exploitant des informations publiques (par exemple la liste des kills)."
	html += "<br>Chrall transmet les CDM que vous effectuez à ce bestiaire, afin de l'enrichir (si vous l'acceptez)."
	html += "</p>";
	html += "<h2>Outils Chrall</h2>";
	html += "<ul>";
	html += "<li><a target=nouvelOnglet href=\""+GOGOCHRALL+"puits\">Le Puits</a> dans lequel vous pouvez déverser vos CDM</li>";
	html += "<li><a target=nouvelOnglet href=\""+GOGOCHRALL+"bestiaire\">Le Bestiaire</a> qui vous dira en retour ce qu'il sait des monstres</li>";
	html += "</ul>";
	html += "<h2>Compte Chrall</h2>";
	html += "<p>Etat du compte Chrall : <b><span id=com_status_message>"+localStorage['com.status.message']+"</span></b></p>";
	html += "<p>Un compte Chrall vous permet de partager des informations avec d'autres joueurs. Il n'est nullement nécessaire d'avoir un compte sur Chrall pour exploiter l'extension. Ce compte n'a d'intérêt que si vous chassez avec d'autres.</p>";
	html += "<p>Afin d'authentifier les requêtes provenant au serveur Chrall, votre <a href='http://sp.mountyhall.com/md5.php' target=newTab>mot de passe restreint</a> est nécessaire :";
	html += "<script>function changeMdpRestreint(){";
	html += " var nm=document.getElementById('ch_mdp_restreint').value;";
	html += " if (nm.length!=32) { alert('Votre mot de passe restreint doit faire exactement 32 caractères.'); return;}";
	html += " localStorage['"+mdpkey+"']=nm;";
	html += " document.getElementById('activationButton').display='inline';";
	html += "}</script>";
	html += "<br><input type=password id=ch_mdp_restreint value=''>";	
	html += "<a class=gogo href='javascript:changeMdpRestreint();localStorage[\"tab_options\"]=\"tabChrall\";document.location.href=\"Play_option.php\";'>Modifier le mot de passe</a>";
	html += activationButtonHtml;
	html += "</p>";
	html += "<p>Fournir votre mot de passe restreint peut (devrait) vous poser des problèmes si vous jouez un troll ennemi de la Canopée. Dans ce cas, et si vous avez des compétences informatiques, n'hésitez pas à venir causer sur <a target=newWin href=\"http://canop.org/chrall/fofo/\">le canofofo</a> afin de voir si vous pourriez héberger un serveur afin d'éviter que votre groupe de chasse ne me confie vos données privées.</p>";
	html += "<p>Notez que vous ne transmettez pas d'informations confidentielles au serveur Chrall tant que vous n'activez pas le compte.</p>";
	html += "<h2>Configuration Chrall</h2>";
	html += "<p>Désactiver la grille (vue classique de MH) <input type='checkbox' id='chk_vueGrille' name='chk_vueGrille' onclick='setGrille()';></p>";
	html += " </div>";
	html += "</div>";

	$(standardOptionContainer).prepend(html);
		
	$("div#tabStandard").append($(standardOptionTables[0]));
	$("div#tabStandard").append($(standardOptionTables[1]));
	$("div#tabStandard").append($(standardOptionTables[2]));
	$("div#tabStandard").append($(standardOptionTables[3]));

	$(".tab_content").hide();
	if (localStorage['tab_options']) {
		$('ul.tabs li:has(a[href="#'+localStorage['tab_options']+'"])').addClass("active").show();
		$('#'+localStorage['tab_options']).show();
		localStorage.removeItem('tab_options');
	} else {
		$("ul.tabs li:first").addClass("active").show();
		$(".tab_content:first").show();
	}
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
