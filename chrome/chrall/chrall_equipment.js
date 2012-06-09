
// Parcoure une liste texte complete de Bonus malus et renvoie une map en fonction des caracs avec comme valeur la somme des BM et la somme des BMM.
function mergeEquipmentBm(effects) {
	var map = new Object();
	for (var ie=0; ie<effects.length; ie++) {
		var nameAndValues = effects[ie].split(':');
		if (nameAndValues.length<2) {
			console.log('BM indéchiffrable : ');
			console.log(effects[ie]);
		} else {
			var bmName = nameAndValues[0].trim();
			var pattern = /\\/;
			var bmValuesAndUnit = nameAndValues[1];
			var bmValues = bmValuesAndUnit;
			// on essaye de détecter l'unité
			var unit = '';
			var tokens = bmValuesAndUnit.trim().split(' ');
			var lastToken=tokens[tokens.length-1];
			if (isNaN(parseInt(lastToken))) {
				unit = ' '+lastToken;
				bmValues = tokens.slice(0, tokens.length-1).join(' ');
			}
			bmValues = bmValues.split(pattern);
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
			map[bmName].unit = unit;
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
		
		s += name + " " + physValue + magValue + values.unit + "| ";
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
 
 
// Dans la page d'équipement, ajoute le total des Bonus Malus de l'équipement porté
// *** Obsolète depuis la modification de MH qui inclut ces totaux ***
function Chrall_analyseAndReformatEquipment() {
	var eqCells = $('table.TableEq td:contains("Etat")');
	var ids = {}; // clé : id matos
	var effects = []; // chaque élément de ce tableau est une chaine de la forme "nomEffet:valeurEffet"
	eqCells.each(function() {
		var $this = $(this);
		var id = $this.find('input[name="ai_IDObjet"]').val();
		if (id && !ids[id]) { // il y a un id, et c'est la première fois qu'on le rencontre (il pourrait être en double dans le cas d'une arme à 2 mains)
			var bcontent = $this.find('b');
			if (bcontent.length>0) effects = effects.concat(bcontent.text().split('|'));
			effects = effects.concat(
				$this.find('li').map(function(){
					return $(this).text();
				}).get()
			);
			ids[id]=true;
		}
	});

	var mapEqBm = mergeEquipmentBm(effects);
	
	//Construit la string des bonus malus cumule de l'equipement que l'on veut afficher dans la page
	var textTotalEqBm = constructTotalEquipmentBm(mapEqBm);
	
	var html = '<br><table width="98%" border="0" cellspacing="1" cellpadding="5" align="CENTER" class="mh_tdborder"><tr class=mh_tdpage><td class=mh_tdtitre><b>Total</b></td><td><b>' + textTotalEqBm + '</b></td></tr></table><br>';
	$('form[action="Play_action_Equipement.php"]').prepend(html);
}
	
