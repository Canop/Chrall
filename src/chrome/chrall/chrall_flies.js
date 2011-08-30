/**
 * cette fonction parcoure la table de mouches et renseigne le tableau flies de la classe Troll
 */ 
function Chrall_analyseFlies() {
	var flyRows = $("tr.mh_tdpage");
	player.cleanFlies();
    // parcours 
	for (var i=0;i<flyRows.length; i++) {
		var cells = $(flyRows[i]).find("td");
		var aFlyType = $(cells[2]).text().trim();
		var aFly = new Fly(aFlyType);
		player.addFly(aFly);
	}
}


function Chrall_analyseAndReformatFlies() {
	
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
			att++;
		} else if(aFlyType=="Miel"){
			reg++;
		} else if(aFlyType=="Nabolisants"){
			deg++;
		} else if(aFlyType=="Vertie"){
			esq++;
		}  else if(aFlyType=="Lunettes"){	
			vue++;
		} else if(aFlyType=="Telaite"){
			pv+=5;
		}
		  
	}
	
	var totaux="Att : +"+att+" | Esq : +"+esq+" | Deg : +"+deg+" | Arm : +"+arm+" | Tour : -"+cyc+" min | PV : +"+pv+" | Vue +"+vue+" | Reg : +"+reg;
	var html = '<br><table width="98%" border="0" cellspacing="1" cellpadding="5" align="CENTER" class="mh_tdborder"><tr class=mh_tdpage><td class=mh_tdtitre><b>Total</b></td><td><b>' + totaux + '</b></td></tr></table><br>';
	
	//var html="<table width=98% cellspacing=0 border=0 cellpadding=2 align=left><tbody><tr><td align=left><b>"+totaux+"</b></td></tr></tbody></table>";
	// insertion des bonus mouchesques
	$('form[name="ActionForm"]').prepend(html);

}
