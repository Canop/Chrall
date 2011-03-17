
/**
 * renvoie le baratin informatif à afficher dans une bulle lorsque la souris passe au dessus du nom
 *  d'une compétence.
 * 
 * Note pour les interventions : prière de conserver l'ordre alphabétique.
 */
function getBubbleContentForCompetence(name) {
	switch (name) {
		
		case "Accélération du Métabolisme" :
			html = "";
			for (var i=0; i<playerAmAbstract.length; i++) {
				if (i>0) html+="<br>";
				html += playerAmAbstract[i];
			}
			return html;
		
		case "Balluchonnage" :
			return "<table><tr><td>Balluchonner</td><td> : 1 PA</td></tr><tr><td>Déballuchonner</td><td> : 2 PA</td></tr></table>";
		
		case "Botte Secrète" :
			var des_att = Math.floor(player.attac.diceNumber/2);
			var att = des_att * 3.5 + Math.floor((player.attac.physicalBonus+player.attac.magicalBonus)/2);
			var deg = des_att * 2 + Math.floor((player.damage.physicalBonus+player.damage.magicalBonus)/2);
			var degCrit = deg + Math.floor(des_att/2)*2;
			return "<table><tr><td>Attaque moyenne</td><td> : " + att + "</td></tr><tr><td>Dégâts moyens</td><td>  : " + deg+ " / " + degCrit + "</td></tr></table>50 % de l'armure physique de la cible est ignorée."; // TODO : ajouter en critique
		
		case "Charger" :
			var range = Math.floor((player.pv/10+player.regeneration.diceNumber)/5)+1; 
			range -= Math.floor((player.strainBase+player.strainMalus)/5); // malus de fatigue
			if (range<0) range = 0;
			var html = "<table><tr><td>Portée</td><td> : "+range+"</td></tr>";
			html += "<tr><td>Attaque moyenne</td><td> : " + player.attac.getMean() + "</td></tr>";
			html += "<tr><td>Dégâts moyens</td><td> : " + player.damage.getMean() + " / " + player.damage.getCriticalMean() + "</td></tr>";
			html += "</table>";
			return html;
		
		case "Connaissance des Monstres" :
			return "Coût : 1 PA"; // TODO indiquer la portée (implique analyser la vue)

		case "Coup de Butoir" :
			var compLevel = player.talents[name].level;
			var damageDicesBonus = 2*Math.min(Math.floor(player.damage.diceNumber/2), compLevel*3);
			var html = "<table><tr><td>Niveau</td><td> : "+compLevel+"</td></tr>";
			html += "<tr><td>Attaque moyenne</td><td> : " + player.attac.getMean() + "</td></tr>";
			html += "<tr><td>Dégâts moyens</td><td> : " + (player.damage.getMean()+damageDicesBonus) + " / " + (player.damage.getCriticalMean()+damageDicesBonus) + "</td></tr>";
			html += "</table>";
			return html;
			
		case "Déplacement Eclair" :
			return "Diminue de 1 PA le coup d'un déplacement par rapport à un déplacement normal.";

		case "Insulte" :
			return "Portée : une case à l'horizontal";

		case "Parer" :
			var parade = 3.5*Math.floor(player.attac.diceNumber/2) + Math.floor((player.attac.physicalBonus+player.attac.magicalBonus)/2);
			var html = "<table>";
			html += "<tr><td>Jet de parade</td><td> : " + parade + "</td></tr>";
			html += "<tr><td>\"Esquive\" totale</td><td> : " + (player.dodge.getMean() + parade) + "</td></tr>";
			html += "</table>";
			return html;
			
		case "Pistage" :
			var s = player.sight.diceNumber+player.sight.physicalBonus;
			var html = "<table>";
			html += "<tr><td>Portée horizontale</td><td> : " + (2*s) + "</td></tr>";
			html += "<tr><td>Portée verticale</td><td> : " + 2*Math.ceil(s/2) + "</td></tr>";
			html += "</table>";	
			return html
	
		case "Retraite" :
			return "Si l'on vous frappe, vous prenez votre retraite. Sauf si c'est une botte secrète : c'est fourbe les skrims...";
		
		default :
			return "<i>Il faudrait qu'une bonne âme s'occupe de programmer l'aide relative à ce talent</i>";
	}
}


/**
 * renvoie le baratin informatif à afficher dans une bulle lorsque la souris passe au dessus du nom
 *  d'un sort.
 * 
 * Note pour les interventions : prière de conserver l'ordre alphabétique.
 */
function getBubbleContentForSort(name) {
	switch (name) {
		
		case "Augmentation des Dégats" :
			var a = 1 + Math.floor((player.damage.diceNumber-3)/2);
			var html = "<table>";
			html += "<tr><td>Premier ADD</td><td> : dégâts +" + a + "</td></tr>";
			html += "<tr><td>Deuxième ADD</td><td> : dégâts +" + Math.floor(a*0.66) + "</td></tr>";
			html += "<tr><td>Troisième ADD</td><td> : dégâts +" + Math.floor(a*0.4) + "</td></tr>";
			html += "<tr><td>Quatrième ADD</td><td> : dégâts +" + Math.floor(a*0.25) + "</td></tr>";
			html += "<tr><td>Cinquième ADD</td><td> : dégâts +" + Math.floor(a*0.15) + "</td></tr>";
			html += "<tr><td>Sixième et suivants</td><td> : dégâts +" + Math.floor(a*0.1) + "</td></tr>";
			html += "</table>";
			return html;
		
		case "Bulle Magique" :
			return "Fournit une augmentation de 100% à la Maîtrise Magique pendant 2 tours<br>mais la Résistance Magique subit une diminution de 100% pendant 4 tours";
					
		case "Hypnotisme" :
			return "On m'a dit que c'était utile... il faudra que j'essaye un jour...";

		case "Identification des trésors" :
			return "Je doute pouvoir vous aprendre quelque chose sur ce sujet...";
		
		case "Invisibilité" :
			return "Avec 3 PA vous pouvez gagner une invisibilité qui durera tant<br>que vous ne perdrez pas de PV et que vous ne bougerez pas.<br>... surtout ne pas pêter !";

		case "Téléportation" :
			var d = Math.ceil((Math.sqrt(19+8*((player.mm/5)+3))-7)/2);
			var s = player.sight.diceNumber+player.sight.physicalBonus;
			var html = "<table>";
			html += "<tr><td>Portée horizontale</td><td> : " + (d+20+s) + "</td></tr>";
			html += "<tr><td>Portée verticale</td><td> : " + Math.floor(d/3+3) + "</td></tr>";
			html += "</table>";		
			return html
		
		case "Vampirisme" :
			var att = 3.5*2*Math.floor(player.damage.diceNumber/3) + player.attac.magicalBonus;
			var deg = player.damage.diceNumber * 2 + player.damage.magicalBonus;
			var degCrit = Math.floor(player.damage.diceNumber*1.5)*2 + player.damage.magicalBonus;
			var html = "<table>";
			html += "<tr><td>Attaque moyenne</td><td> : " + att + "</td></tr>";
			html += "<tr><td>Dégâts moyens</td><td> : " + deg + " / " + degCrit + "</td></tr>";
			html += "</table>";
			html += "L'armure physique de la cible est ignorée.";
			html += "<br>PV gagnés par vampirisme : moitié des dégâts réellement infligés.<br>Un Jet de Résistance : permet de ne subir que la moitié des dégats.";
			return html;

		default :
			return "<i>Sans doute un sort que le pauv' développeur n'a pas...<br>A votre bon coeur m'sieursdames!</i>";
	}
}
