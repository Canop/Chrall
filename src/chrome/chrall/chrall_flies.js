/**
 * cette fonction parcoure la table de mouches et renseigne le tableau flies de la classe Troll
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
}


function Chrall_analyseAndReformatFlies() {

	//> on vire le titre
	$($("table")[2]).remove();
	
	// analyse du tableau de mouches
	Chrall_analyseFlies();
	
	// calcul des totaux 
	var att=0,esq=0,deg=0,vue=0,pv=0,arm=0,reg=0,cyc=0;
	var aFlyType;
	for(var i=0;i<player.flies.length; i++){
		aFlyType=player.flies[i].type;
		
		if(aFlyType=="Rivatant"){
			cyc+=20;
		} else if(aFlyType=="Xidant"){
			arm++;
		} else if(aFlyType=="Crobate"){
			esq++;
		} else if(aFlyType=="Miel"){
			reg++;
		} else if(aFlyType=="Nabolisants"){
			deg++;
		} else if(aFlyType=="Vertie"){
			att++;
		}  else if(aFlyType=="Lunettes"){	
			vue++;
		} else if(aFlyType=="Telaite"){
			pv+=5;
		}
		  
	}
	
	var totaux="att +"+att+" / esq +"+esq+" / deg +"+deg+" / arm +"+arm+" / Tour +"+cyc+" min / pv +"+pv+" / vue +"+vue+" / reg +"+reg;
	
	var html="<table width=98% cellspacing=0 border=0 cellpadding=2 align=left><tbody><tr><td align=left><b>"+totaux+"</b></td></tr></tbody></table>";
	// insertion des bonus mouchesques
	$('form[name="ActionForm"]').parent().prepend(html);

}
