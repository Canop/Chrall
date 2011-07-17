
// Verifie simplement si l'action "Creuser" est presente, et affiche que c'est possible s'il y a lieu.
// Pas besoin de verifier d'abord que la DLA est activee.
function Chrall_displayDiggingIsPossible() {
	if ($('option:contains("Creuser")').length > 0) {
		$('select + br').remove();
		var htmlDiggingIsPossible = '<div><font color="#FF9933"><b>Il est possible de creuser!<b></font></div>';
		$('select').after(htmlDiggingIsPossible);
	}
}

function Chrall_addMenuOutilsIfPossible() {
	if ($(document).width() < 808+200) return; // 808 : taille de l'image de fond que je ne veux pas recouvrir
	var html = '<div id=menuOutilsChrall>';
	html += '<span class=titre>Outils : </span>';
	html += '<a target=bestiaire href="http://canop.org:8000/chrall/bestiaire">Bestiaire</a>';
	html += '<a target=killometre href="http://canop.org/chrall/killometre.html">Kill-O-Mètre</a>';
	html += '<a target=canofofo href="http://canop.org/chrall/fofo">Forum Chrall</a>';
	html += '<a target=fofomh href="http://www.mountyhall.com/Forum/">Forum Mounty-Hall</a>';
	html += '<a target=mountypedia href="http://mountypedia.mountyhall.com/">MountyPedia</a>';
	html += '<a target=mappy href="http://trolls.ratibus.net/mountyhall/itineraireBis.php?x1='+player.x+'&y1='+player.y+'&n1='+player.z+'">MappyTrolls</a>';
	html += '</div>';
	$('body').append(html);
}

http://canop.org/chrall/fofo/
function Chrall_handleActionPage() {
	//> on va essayer de lire les PA disponibles
	var sentence = $('b:contains("Il me reste ")');
	if (sentence.length>0) {
		var tokens = Chrall_tokenize(sentence.text());
		try {
			rpa = parseInt(tokens[3]);
			$('<script>parent.chrall_pa_restant.value='+tokens[3]+';</script>').appendTo($('body'));
			chrome.extension.sendRequest({"pa": rpa});
		} catch(error) {
			console.log(error);
		}
	} else {
		// a priori si on n'a pas cette phrase c'est qu'on n'a pas activé
		$('<script>parent.chrall_pa_restant.value=0;</script>').appendTo($('body'));
		chrome.extension.sendRequest({"pa": -1}); // -1 pour signaler que la session n'est pas active
	}
	
	Chrall_addMenuOutilsIfPossible();
	Chrall_displayDiggingIsPossible();
	
	$('body').css('overflow', 'hidden'); // supprime l'ascenseur tout moche de la frame Actions
}


