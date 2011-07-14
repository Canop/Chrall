
/**
 * 
 * bugs restant :
 * - pas d'affichage du % sur les trucs genre "Connaissance de Analyse Anatomique : +2 %"
 * - CRITIQUE : mauvais traitement des armes à 2 mains (on lit deux fois). 
 * 
 */ 

// Parcoure une liste texte complete de Bonus malus et renvoie une map en fonction des caracs avec comme valeur la somme des BM et la somme des BMM.
function parseEquipmentBm(s) {
	var effects = s.split('|');
	var map = new Object();
	for (var ie=0; ie<effects.length; ie++) {
		var nameAndValues = effects[ie].split(':');
		if (nameAndValues.length<2) {
			console.log('BM indéchiffrable : ');
			console.log(effects[ie]);
		} else {
			var bmName = nameAndValues[0].trim();
			var pattern = /\\/;
			var bmValues = nameAndValues[1].trim().split(pattern);  //Sépare physique et magique
			//Si la carac n'existe pas deja on cree une nouvelle carac dans la map, sinon on additionne.
			if (!map[bmName]){
				if (bmValues.length>1){
					map[bmName] = [parseInt(bmValues[0]), parseInt(bmValues[1])];
				} else {
					map[bmName] = [parseInt(bmValues[0])];
				}
			} else{
				map[bmName][0] += parseInt(bmValues[0])
				//On ajoute le magique seulement si nécessaire.
				if (bmValues.length>1){
					if (map[bmName].length>1){
						map[bmName][1] += parseInt(bmValues[1]);
					} else{ //Attention au cas où le magique n'etait pas encore defini
						map[bmName][1] = parseInt(bmValues[1]);
					}
				}
			}
		}	
	}
	return map;
}


// Recoit une map contenant les BM pour toutes les carac impactees par l'équipement et renvoir un ligne texte listant tous les BM. 
function constructTotalEquipmentBm(map) {
		
	var s = "| ";
	
	//Pour l'avoir toujours dans le même ordre, on se permet la facilité avec une table un peu lourdes de toutes les carac, initialisée ici...
	//D'ailleurs, faudrait mettre l'ordre habituel
	var carac = ["ATT","DEG","ESQ","Armure", "PV", "REG", "MM", "RM", "TOUR", "Vue"];
	
	var addCaracToString = function(name, values) {
		var physValue = "";
		var magValue = "";
		var caracUnit= "";
		
		// Recupere les BM physiques.
		if ( values[0] >= 0 ){
			physValue = "+" + values[0] + " ";
		} else{
			physValue = values[0] + " ";
		}
		
		// Recupere les BM magiques.
		if (values[1]){
			if ( values[1] >= 0){
				magValue = "/+" + values[1] + " ";
			} else{
				magValue = values[1] + " ";
			}
		}
		
		/* Certaines carac ont une unité affichée*/
		if ( (name == 'MM') || (name == 'RM') ) {
			caracUnit = "% ";
		} else if ( name == 'TOUR') {
			caracUnit = "min ";
		}
			
		s += name + " " + physValue + magValue + caracUnit + "| ";
		values.done = true;
	};
	
	for (var i = 0; i<carac.length; i++) {
		// On ne reprend que les caracs impactées.
		if (map[carac[i]]){
			addCaracToString(carac[i], map[carac[i]]);
		}
	}
	// ensuite on s'occupe des autres caractéristiques (par exemples les augmentations de sorts et compétences)
	for (var key in map) {
		if (!map[key].done) {
			addCaracToString(key, map[key]);
		}
	}
	return s;
}
 
 
//Dans la page d'équipement, ajoute le total des Bonus Malus de l'équipement porté
function Chrall_analyseAndReformatEquipment() {
  
	// Recupere en string tous les bonus malus de l'equipement porte			   
	var textEqBm = $('table.TableEq td:contains("Etat") b, table.TableEq li').map(function(){
		return $(this).text();
	}).get().join('|');
	
	// Nettoie la string de tous les bonus malus recuperes pour ne garder que les noms des caracs et les valeurs				   
	textEqBm = textEqBm.replace(/([%]|min)/g,'').trim();
	
	// Parcourt la liste des bonus malus et recupere une map de chaque carac impactee par des bonus malus.
	// chaque carac référencant une petite table de deux entiers: le total pour la valeur physique et la valeur magique.
	// S'il n'y a pas de valeur magique, cette valeur n'est pas definie.
	var mapEqBm = parseEquipmentBm(textEqBm);
	
	//Construit la string des bonus malus cumule de l'equipement que l'on veut afficher dans la page
	var textTotalEqBm = constructTotalEquipmentBm(mapEqBm);
	
	var html = '<br><table width="98%" border="0" cellspacing="1" cellpadding="5" align="CENTER" class="mh_tdborder"><tr class=mh_tdpage><td class=mh_tdtitre><b>Total</b></td><td><b>' + textTotalEqBm + '</b></td></tr></table><br>';
	$('form[action="Play_action_Equipement.php"]').prepend(html);

}
	
