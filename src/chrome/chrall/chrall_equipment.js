
/* Premier script pour chrall de ma part (Dragtara).
Necessite très certainement d'etre optimise et adapte au "style" chrall. :)
TODO:
- Remplacer les tableaux par des classes.
- Initialiser à null les champs non définis pour les réutiliser plus tard. (Plus clair.)
- Se passer de typeof. ex: if ( variable ) 
- Utiliser des push et des join() pour construire les chaines de caractères de réponse.
*/

// Parcoure une liste texte complete de Bonus malus et renvoie une map en fonction des caracs avec comme valeur la somme des BM et la somme des BMM.
function parseEquipmentBm(s) {
	var tokens = s.split(new RegExp("[ ]+", "g"));  //Sépare caracs et valeurs
	var map = new Object();
	
	for (var i = 0; i<tokens.length; i += 2) {
	var bmName = tokens[i];
	
	var pattern = /\\/;
	var bmValues = tokens[i+1].split(pattern);  //Sépare physique et magique
	
		//Si la carac n'existe pas deja on cree une nouvelle carac dans la map, sinon on additionne.
   	if (typeof(map[bmName]) == 'undefined'){
   		if (typeof(bmValues[1]) !== 'undefined'){
   			map[bmName] = new Array(parseInt(bmValues[0],10),parseInt(bmValues[1],10));
   		}
   		else {
   			map[bmName] = new Array(parseInt(bmValues[0],10), undefined);
   		}
  	}
		else{
			map[bmName][0] += parseInt(bmValues[0],10);
			
			//On ajoute le magique seulement si nécessaire.
			if (typeof(bmValues[1]) !== 'undefined'){
				if (typeof(map[bmName][1]) !== 'undefined'){
					map[bmName][1] += parseInt(bmValues[1],10);
				}
				//Attention au cas où le magique n'etait pas encore defini
				else{
					map[bmName][1] = parseInt(bmValues[1],10);
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
	var carac = new Array("ATT","DEG","ESQ","Armure", "PV", "REG", "MM", "RM", "TOUR");
	
	for (var i = 0; i<carac.length; i++) {
		
		// On ne reprend que les caracs impactees.
		if (typeof(map[carac[i]]) !== 'undefined'){
			var physValue = "";
			var magValue = "";
			var caracUnit= "";
			
			// Recupere les BM physiques.
			if ( map[carac[i]][0] >= 0 ){
				physValue = "+" + map[carac[i]][0] + " ";
			}
			else{
				physValue = map[carac[i]][0] + " ";
			}
			
			// Recupere les BM magiques.
			if (typeof(map[carac[i]][1]) != 'undefined'){
				if ( map[carac[i]][1] >= 0){
					magValue = "/+" + map[carac[i]][1] + " ";
				}
				else{
					magValue = map[carac[i]][1] + " ";
				}
			}
			
			/* Certaines carac ont une unité affichée*/
			if ( (carac[i] == 'MM') || (carac[i] == 'RM') ) {
				caracUnit = "% ";
			}
			else if ( carac[i] == 'TOUR') {
				caracUnit = "min ";
			}
						
			s += carac[i] + " " + physValue + magValue + caracUnit + "| ";
		}
	}
	return s;
}
 
 
//Dans la page d'équipement, ajoute le total des Bonus Malus de l'équipement porté
function Chrall_analyseAndReformatEquipment() {
  
	// Recupere en string tous les bonus malus de l'equipement porte			   
	var textEqBm = $('table.TableEq td:contains("Etat") b, table.TableEq li').map(function(){
		return $(this).text();
	}).get().join(' ');
	
	// Nettoie la string de tous les bonus malus recuperes pour ne garder que les noms des caracs et les valeurs				   
	textEqBm = textEqBm.replace(/([:%\|]|min)/g,'').trim();
	
	// Parcourt la liste des bonus malus et recupere une map de chaque carac impactee par des bonus malus.
	// chaque carac référencant une petite table de deux entiers: le total pour la valeur physique et la valeur magique.
	// S'il n'y a pas de valeur magique, cette valeur n'est pas definie.
	var mapEqBm = parseEquipmentBm(textEqBm);
	
	//Construit la string des bonus malus cumule de l'equipement que l'on veut afficher dans la page
	var textTotalEqBm = constructTotalEquipmentBm(mapEqBm);
	
	var html = '<br><table width="98%" border="0" cellspacing="1" cellpadding="5" align="CENTER" class="mh_tdborder"><tr class=mh_tdpage><td class=mh_tdtitre><b>Total</b></td><td><b>' + textTotalEqBm + '</b></td></tr></table><br>';
	$('form[action="Play_action_Equipement.php"]').prepend(html);

}
	
