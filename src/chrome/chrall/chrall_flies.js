/**
 * cette fonction parcours la table de mouches et renseigne le tableau flies de la classe Troll
 */ 
function Chrall_analyseFlies() {
	var flyRows = $("tr.mh_tdpage");

    // parcours 
	for (var i=0;i<flyRows.length; i++) {
		var cells = $(flyRows[i]).find("td");
		var aFlyType = $(cells[2]).text().trim();

		var aFly = new Fly(aFlyType);
		player.addFly(aFly);
	}
	alert(player.flies.length+" mouches");
	
}


function Chrall_analyseAndReformatFlies() {
	//> on vire la bannière "Mounty Hall la terre des trolls" 
	
	$($("tr")[0]).append("<tr>TOOOOOOOTOOOO</tr>");

	//> on vire le titre
	$($("table")[2]).remove();
	
	// analyse du tableau de mouches
	//Chrall_analyseFlies($($("table.mh_tdborder")[0]).text());
	Chrall_analyseFlies();
	
	// calcul des totaux 
	//	TOUR : -140 min | Armure : +10 | ATT : +8 | REG : +7 | DEG : +9 | Vue : +5 | ESQ : +6
	var att=0,esq=0,deg=0,vue=0,pv=0,arm=0,reg=0,cyc=0;
	
	for(var i=0;i<player.flies.length; i++){
		aFly=player.flies[i];
		if()
	}
	
	// insertion des bonus mouchesque.
	//$("tr.mh_tdtitre").append("<tr class=mh_tdpage>Total des bonus de mouches : </tr>");

}
