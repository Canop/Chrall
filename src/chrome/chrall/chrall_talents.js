
/**
 * renvoie le baratin informatif à afficher dans une bulle lorsque la souris passe au dessus du nom
 *  d'une compétence.
 * 
 * Note pour les interventions : prière de conserver l'ordre alphabétique.
 */
function getBubbleContentForCompetence(name) {
	
	switch (name.trim()) {
		
		case "Balluchonnage" :
			return "Balluchonner : 1 PA<br>Déballuchonner : 2 PA";
		
		case "Botte Secrète" :
			var des_att = Math.floor(player.attac.diceNumber/2);
			var att = des_att * 3.5 + Math.floor((player.attac.physicalBonus+player.attac.magicalBonus)/2);
			var deg = des_att * 2 + Math.floor((player.damage.physicalBonus+player.damage.magicalBonus)/2);
			var degCrit = deg + Math.floor(des_att/2)*2;
			return "Attaque moyenne : " + att + "<br>Dégâts moyens : " + deg+ " / " + degCrit + "<br>50 % de l'armure physique de la cible est ignorée."; // TODO : ajouter en critique
		
		case "Charger" :
			//var range = player.
			// zut, j'ai pas encore fait le parsage des pv
			return "sabre au clair";
		
		default :
			return "<i>Il faudrait qu'une bonne âme s'occupe de programmer l'aide relative à ce talent</i>";
	}
}
