// enrichit la page d'actions
function Chrall_reformatOptionsView() {


	var standardOptionContainer = $($("table table td")[1]);
	var standardOptionTables = standardOptionContainer.find("table");

	var html = "\
	<ul class=tabs>\
		<li><a href=#tabStandard>Options Standard</a></li>\
		<li><a href=#tabChrall>Compte Chrall</a></li>\
		<li><a href=#tabOptionsChrall>Options Chrall</a></li>\
		<li><a href=#tabLinks>Liens</a></li>\
	</ul>\
	<div class=tab_container><br><br>\
	<div id=tabStandard class=tab_content></div>\
	<div id=tabChrall class=tab_content>\
	<h3>Qu'est-ce que Chrall?</h3>\
		<p class='informational-text'>Chrall est une extension pour Chrome visant à enrichir l'interface du jeu.</p>\
		<p class='informational-text'>Si vous souhaitez retrouver l'interface standard de Mounty Hall, vous pouvez la désactiver via le menu <i>Outils/Extensions</i> de Chrome.</p>\
		<p class='informational-text'>Pour plus d'informations sur le projet Chrall : <a target=newWin href=http://canop.org/chrall>canop.org/chrall</a>.</p>\
	<h3>Que fait Chrall exactement?</h3>\
		<p class='informational-text'>Chrall modifie les pages que vous recevez depuis *.mountyhall.com et quelques adresses alternatives du jeu (Chrall ne voit ni ne change les autres pages).</p>\
		<p class='informational-text'>Chrall affiche, sur la vue, des estimations des caractéristiques des monstres, en exploitant son bestiaire (lien plus bas). De même pour les trolls en exploitant des informations publiques (par exemple la liste des kills).</p>\
		<p class='informational-text'>Chrall transmet les CDM que vous effectuez à ce bestiaire, afin de l'enrichir (si vous l'acceptez).</p>\
	<h3>Compte Chrall</h3>\
		<p>Etat du compte Chrall : <b><span id=com_status_message></span></b></p>\
		<p class='informational-text'>Un compte Chrall vous permet de partager des informations avec d'autres joueurs. Il n'est nullement nécessaire d'avoir un compte sur Chrall pour exploiter l'extension. Ce compte n'a d'intérêt que si vous chassez avec d'autres.</p>\
		<p>Afin d'authentifier les requêtes provenant au serveur Chrall, votre <a href='http://sp.mountyhall.com/md5.php' target=newTab>mot de passe restreint</a> est nécessaire :</p>\
		<p><input type=password id=ch_mdp_restreint value=''></p>\
		<a class=gogo id=changeMdp>Modifier le mot de passe</a> &nbsp; <a id=activationButton class=gogo />\
		<p class='informational-text'>Notez que vous ne transmettez pas d'informations confidentielles tant que vous n'activez pas le compte.</p>\
		<p class='informational-text'>Si votre compte est actif, l'extension communique par défaut les données partagées avec le serveur canop.org mais vous pouvez spécifier un autre serveur si vous lui accordez confiance : </p>\
		<p>Serveur Chrall alternatif pour les données partagées : <input size=30 id=input_private_chrall_server></p>\
		<a href='#' class=gogo id=save_private_chrall_server>sauver</a> (laisser vide pour exploiter le serveur par défaut, n'utilisez un serveur alternatif que si vous lui faites pleine confiance)</p>\
	</div>\
	<div id=tabOptionsChrall class=tab_content>\
	<h3>Options</h3>\
		<p class='informational-text'>Modifiez ici le comportement de l'extension</p>\
	<div id=tabLinks class=tab_content>\
	</div>\
	</div>";

	standardOptionContainer.html(html);

	$("div#tabStandard").append($(standardOptionTables[0]));
	$("div#tabStandard").append($(standardOptionTables[1]));
	$("div#tabStandard").append($(standardOptionTables[2]));
	$("#tabLinks").append(Chrall_makeLinkOptionPage());

	$("#changeMdp").click(changeMdpRestreint);
	$("#activationButton").click(toggleActivation);
	refreshActivation();
	$("#input_private_chrall_server").val(localStorage['private_chrall_server']);
	$("#com_status_message").text(localStorage['com.status.message']);

	$(".tab_content").hide();
	if (localStorage['tab_options']) {
		$('ul.tabs li:has(a[href="#' + localStorage['tab_options'] + '"])').addClass("active").show();
		$('#' + localStorage['tab_options']).show();
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
	$('#save_private_chrall_server').click(function() {
		var s = $('#input_private_chrall_server').val();
		if (s.length > 3) {
			localStorage['private_chrall_server'] = s;
		} else {
			localStorage.removeItem('private_chrall_server');
		}
	});
}

function changeMdpRestreint() {
	var nm = document.getElementById('ch_mdp_restreint').value;
	if (nm.length != 32) {
		alert('Votre mot de passe restreint doit faire exactement 32 caractères.');
		return;
	}
	localStorage[mdpkey] = nm;
	Chrall_notify({text:"Mot de passe modifié"});
}

function isPasswordValid() {
	var mdpkey = 'troll.' + player.id + '.mdp';
	var mdp = localStorage[mdpkey];
	var mdpIsValid = mdp && (mdp.length == 32);
	return mdpIsValid;
}

function refreshActivation() {
	if (isPasswordValid()) {
		$('#activationButton').removeClass("invisible");
	} else {
		$('#activationButton').addClass("invisible");
	}

	if (compteChrallActif()) {
		$('#activationButton').text("Désactiver le compte");
	} else {
		$('#activationButton').text("Activer le compte");
	}
}

function toggleActivation() {
	var compteActif = compteChrallActif();
	if (compteActif) {
		Chrall_notify({ text: "Connexion au Compte désactivée"});
		localStorage["troll." + player.id + ".compteActif"] = "no";
		localStorage['com.status.message'] = 'Compte inexistant ou non connecté';
		$('#com_status_message').text(localStorage['com.status.message']);
	} else {
		Chrall_notify({ text: "Connexion au Compte activée"});
		localStorage["troll." + player.id + ".compteActif"] = "yes";
		initCommunications('check_account');
	}
	refreshActivation();
}
