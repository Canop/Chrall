"use strict";
// traite une page du forum MH

$('a[href^="javascript:oT("]').each(
	function(){
		var link = $(this);
		var href = link.attr('href');
		var trollId = href.split('(')[1].split(')')[0];// la flemme de chercher une formule raisonnable... n'hésite pas à intervenir, Ô lecteur!

		// ligne suivante : 0 car on ne l'a pas...
		chrall.triggerBubble(link, '', "bub_troll", "https://chrall.dystroy.org/gogo/json?action=get_troll_info&asker="+0+"&trollId="+trollId, trollId);

		// les deux lignes suivantes permettent, si nécessaire et décommentées, la redirection des profils vers un autre serveur
		//var newJavascript='window.open("http://accro.mountyhall.com/mountyhall/View/PJView.php?ai_IDPJ='+trollId+'","DetailView","width=750,height=550,toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=1,scrollbars=1");';
		//link.attr('href', 'javascript:'+newJavascript);
	}
);

