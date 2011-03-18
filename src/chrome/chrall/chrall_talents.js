
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
			
		case "Attaque Précise" :
			var compLevel = player.talents[name].level;
			var attacBonus = 3.5*Math.min(Math.floor(player.attac.diceNumber/2), compLevel*3);
			var html = "<table><tr><td>Niveau</td><td> : "+compLevel+"</td></tr>";
			html += "<tr><td>Attaque moyenne</td><td> : " + (player.attac.getMean()+attacBonus) + "</td></tr>";
			html += "<tr><td>Dégâts moyens</td><td> : " + player.damage.getMean() + " / " + player.damage.getCriticalMean() + "</td></tr>";
			html += "</table>";
			return html;
			
		
		case "Balluchonnage" :
			return "<table><tr><td>Balluchonner</td><td> : 1 PA</td></tr><tr><td>Déballuchonner</td><td> : 2 PA</td></tr></table>";
		
		case "Botte Secrète" :
			var des_att = Math.floor(player.attac.diceNumber/2);
			var att = des_att * 3.5 + Math.floor((player.attac.physicalBonus+player.attac.magicalBonus)/2);
			var deg = des_att * 2 + Math.floor((player.damage.physicalBonus+player.damage.magicalBonus)/2);
			var degCrit = deg + Math.floor(des_att/2)*2;
			return "<table><tr><td>Attaque moyenne</td><td> : " + att + "</td></tr><tr><td>Dégâts moyens</td><td>  : " + deg+ " / " + degCrit + "</td></tr></table>50 % de l'armure physique de la cible est ignorée."; // TODO : ajouter en critique
		
		case "Camouflage" :
			var html = "Déplacement : un jet de compétence (à 75% du niveau du sortilège) est nécessaire pour conserver le Camouflage (Ce jet ne coûte aucun PA et ne rapporte pas de PX).";
			html += "<br>Attaque de la part du Tomawak : le Camouflage est automatiquement rompu.";
			html += "<br>Projectile Magique : un jet de compétence (à 25% du niveau du sortilège) est nécessaire pour conserver le Camouflage (Ce jet ne coûte aucun PA et ne rapporte pas de PX).";
			return html;
			
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

		case "Construire un Piège" :
			return "Tout laisse penser que le développeur de chrall n'a jamais construit de piège...";

		case "Coup de Butoir" :
			var compLevel = player.talents[name].level;
			var damageBonus = 2*Math.min(Math.floor(player.damage.diceNumber/2), compLevel*3);
			var html = "<table><tr><td>Niveau</td><td> : "+compLevel+"</td></tr>";
			html += "<tr><td>Attaque moyenne</td><td> : " + player.attac.getMean() + "</td></tr>";
			html += "<tr><td>Dégâts moyens</td><td> : " + (player.damage.getMean()+damageBonus) + " / " + (player.damage.getCriticalMean()+damageBonus) + "</td></tr>";
			html += "</table>";
			return html;
			
		case "Déplacement Eclair" :
			return "Diminue de 1 PA le coup d'un déplacement par rapport à un déplacement normal.";

		case "Golemologie" :
			return "Je n'ai pas trouvé d'information sur Wikipédia concernant la golémologie mais par contre voici ce qu'ils ont sur la Polémologie :<br><i>La polémologie (littéralement « science de la guerre ») est une discipline fondée après la Seconde Guerre mondiale par le sociologue français Gaston Bouthoul (1896-1980).<br>Elle étudie les facteurs dits « polémogènes » : les corrélations éventuelles entre les explosions de violence et des phénomènes économiques, culturels, psychologiques et surtout démographiques récurrents.</i>";

		case "Insultes" :
			return "Portée : une case à l'horizontal";
			
		case "Lancer de Potions" :
			var s = player.sight.diceNumber+player.sight.physicalBonus;
			var p = Math.floor(2+s/5);
			var cppc = player.talents[name].mastering + player.concentration;
			var html = "<table>";
			html += "<tr><td>Portée (à l'horizontal)</td><td> : " + p + (p>1 ? " cases" : " case") + "</td></tr>";
			for (d=1; d<=s && d<=p && d<=20; d++) {
				var bv = Math.min(10, (1-d)*10 + s);
				html += "<tr><td>Jet de toucher à "+ d+ (d>1 ? " cases" : " case") + "</td><td> : " + (cppc+bv) + " %</td></tr>";
			} 
			html += "</table>";	
			html += "Ce calcul est fait pour votre concentration actuelle ("+player.concentration+" %).";
			html += "<br>En vous concentrant vous augmentez d'autant votre jet de toucher.";
			html += "<br>Si vous ratez ce jet, la potion est perdue sans effet.";
			return html
			
			return "Sapristi ! Il faut que je parse la concentration...";

		case "Miner" :
			return "Permet d'une part de localiser les filons de minerais et d'autre part d'exploiter les filons découverts.";

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
			return "Si l'on vous frappe, vous prenez votre retraite.<br>Sauf si c'est une botte secrète : ils sont fourbes les skrims...";
		
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
		
		case "Analyse Anatomique" :
			var s = player.sight.diceNumber+player.sight.physicalBonus;
			var html = "<table>";
			html += "<tr><td>Portée horizontale</td><td> : " + Math.floor(s/2) + "</td></tr>";
			html += "<tr><td>Portée verticale</td><td> : " + Math.floor(s/4) + "</td></tr>"; // c'est sûr ça ?
			html += "</table>";	
			return html

		case "Armure Ethérée" :
			var a = player.regeneration.diceNumber;
			var html = "<table>";
			html += "<tr><td>Premier AE</td><td> : armure +" + a + "</td></tr>";
			html += "<tr><td>Deuxième AE</td><td> : armure +" + Math.floor(a*0.66) + "</td></tr>";
			html += "<tr><td>Troisième AE</td><td> : armure +" + Math.floor(a*0.4) + "</td></tr>";
			html += "<tr><td>Quatrième AE</td><td> : armure +" + Math.floor(a*0.25) + "</td></tr>";
			html += "<tr><td>Cinquième AE</td><td> : armure +" + Math.floor(a*0.15) + "</td></tr>";
			html += "<tr><td>Sixième et suivants</td><td> : armure +" + Math.floor(a*0.1) + "</td></tr>";
			html += "</table>";
			return html;

		case "Augmentation de l´Attaque" :
			var a = 1 + Math.floor((player.attac.diceNumber-3)/2);
			var html = "<table>";
			html += "<tr><td>Premier ADA</td><td> : attaque +" + a + "</td></tr>";
			html += "<tr><td>Deuxième ADA</td><td> : attaque +" + Math.floor(a*0.66) + "</td></tr>";
			html += "<tr><td>Troisième ADA</td><td> : attaque +" + Math.floor(a*0.4) + "</td></tr>";
			html += "<tr><td>Quatrième ADA</td><td> : attaque +" + Math.floor(a*0.25) + "</td></tr>";
			html += "<tr><td>Cinquième ADA</td><td> : attaque +" + Math.floor(a*0.15) + "</td></tr>";
			html += "<tr><td>Sixième et suivants</td><td> : attaque +" + Math.floor(a*0.1) + "</td></tr>";
			html += "</table>";
			return html;

		case "Augmentation de l´Esquive" :
			var a = 1 + Math.floor((player.dodge.diceNumber-3)/2);
			var html = "<table>";
			html += "<tr><td>Premier ADE</td><td> : esquive +" + a + "</td></tr>";
			html += "<tr><td>Deuxième ADE</td><td> : esquive +" + Math.floor(a*0.66) + "</td></tr>";
			html += "<tr><td>Troisième ADE</td><td> : esquive +" + Math.floor(a*0.4) + "</td></tr>";
			html += "<tr><td>Quatrième ADE</td><td> : esquive +" + Math.floor(a*0.25) + "</td></tr>";
			html += "<tr><td>Cinquième ADE</td><td> : esquive +" + Math.floor(a*0.15) + "</td></tr>";
			html += "<tr><td>Sixième et suivants</td><td> : esquive +" + Math.floor(a*0.1) + "</td></tr>";
			html += "</table>";
			return html;

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
		
		case "Bulle Anti-Magie" :
			return "Fournit une augmentation de 100% à la Résistance Magique pendant 2 tours<br>mais la Maîtrise Magique subit une diminution de 100% pendant 4 tours";

		case "Bulle Magique" :
			return "Fournit une augmentation de 100% à la Maîtrise Magique pendant 2 tours<br>mais la Résistance Magique subit une diminution de 100% pendant 4 tours";
					
		case "Glue" :
			var s = player.sight.diceNumber+player.sight.physicalBonus;
			var html = "<table>";
			html += "<tr><td>Portée (à l'horizontale uniquement)</td><td> : " + Math.floor(1+s/3) + "</td></tr>";
			html += "</table>";	
			return html

		case "Hypnotisme" :
			return "On m'a dit que c'était utile... il faudra que j'essaye un jour...";

		case "Identification des trésors" :
			return "Je doute pouvoir vous aprendre quelque chose sur ce sujet...";
		
		case "Projectile Magique" :
			var s = player.sight.diceNumber+player.sight.physicalBonus;
			// ici j'utilise une boucle pour calculer la portée. C'est pas long (probablement pas plus que d'appeler Math.exp) mais c'est pas beau
			//  donc si quelqu'un a une formule directe je suis preneur !
			var range = 30;
			var threeshold = 1;
			var step = 4;
			for (var i=0; i<range; i++) { // si on atteind 30... ben c'est qu'on a trop de vue!
				console.log("vue<"+threeshold+" => portée="+i);
				if (s<threeshold) {
					range = i;
					break;
				}
				threeshold += step;
				step++; 
			}			
			var html = "<table>";
			html += "<tr><td>Portée</td><td> : " + range + " cases</td></tr>";
			var att = 3.5*player.sight.diceNumber + player.attac.magicalBonus;
			html += "<tr><td>Attaque moyenne</td><td> : " + att + "</td></tr>";
			for (d=0; d<=range; d++) {
				var deg = 2*(Math.floor(player.sight.diceNumber/2)+range-d) + player.damage.magicalBonus;
				var degCrit = 2*(Math.floor(player.sight.diceNumber*0.75)+range-d) + player.damage.magicalBonus;
				if (d==0) html += "<tr><td>Dégâts moyens sur votre case";
				else html += "<tr><td>Dégâts moyens à "+ d+ (d>1 ? " cases" : " case");
				html += "</td><td> : " + deg + " / " + degCrit + "</td></tr>";
			} 
			
			html += "</table>";		
			return html
			
		case "Invisibilité" :
			return "Avec 3 PA vous pouvez gagner une invisibilité qui durera tant<br>que vous ne perdrez pas de PV et que vous ne bougerez pas.<br>... surtout ne pas pêter !";

		case "Télékinésie" :
			var s = player.sight.diceNumber + player.sight.physicalBonus;
			var p = Math.floor(s/2);
			var f = function(p) {
				if (p<0) return " sont trop lourds pour votre vue.";
				var h = " sont ciblables ";
				if (p==0) return h+"sur votre case.";
				if (p==1) return h+"à une case.";
				return h+"à "+p+" cases.";
			}
			html ="Les trésors d'une Plum' et Très Léger"+f(p+2);
			html+="<br>Les trésors Léger"+f(p+1);
			html+="<br>Les trésors Moyen"+f(p);
			html+="<br>Les trésors Lourd"+f(p-1);
			html+="<br>Les trésors Très Lourd et d'une Ton'"+f(p-2);
			return html
		
		case "Téléportation" :
			var d = Math.ceil((Math.sqrt(19+8*(Math.floor(player.mm/5)+3))-7)/2);
			var s = player.sight.diceNumber;
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

		case "Vision Accrue" :
			var a = Math.floor(player.sight.diceNumber/2);
			var html = "<table>";
			html += "<tr><td>Premier VA</td><td> : vue +" + a + "</td></tr>";
			html += "<tr><td>Deuxième VA</td><td> : vue +" + Math.floor(a*0.66) + "</td></tr>";
			html += "<tr><td>Troisième VA</td><td> : vue +" + Math.floor(a*0.4) + "</td></tr>";
			html += "<tr><td>Quatrième VA</td><td> : vue +" + Math.floor(a*0.25) + "</td></tr>";
			html += "<tr><td>Cinquième VA</td><td> : vue +" + Math.floor(a*0.15) + "</td></tr>";
			html += "<tr><td>Sixième et suivants</td><td> : vue +" + Math.floor(a*0.1) + "</td></tr>";
			html += "</table>";
			if (player.race=="Tomawak") {
				html += "Vision Accrue augmente la portée du Projectile Magique mais pas l'attaque ni les dégâts.";
			}
			return html;
			
		case "Voir le Caché" :
			var s = player.sight.diceNumber+player.sight.physicalBonus;
			// flemme de chercher une formule, j'implémente tous les tests de la doc...
			var range;
			if (s>34) range=5;
			else if (s>21) range=4;
			else if (s>11) range=3;
			else if (s>5) range=2;
			else if (s>2) range=1;
			else range=0;
			html = "Permet de voir et cibler les trolls et monstres ";
			if (range==0) {
				html += "sur votre case<br>(ce serait mieux si vous voyiez un peu mieux le visible pour commencer)."
			} else {
				html += "jusqu'à "+ range + (range>1 ? " cases." : " case.");
			}
			html += "<br>Permet également de voir les autres éléments cachés du jeu à une portée de 1 case.";
			return html;
			
		case "Vue Troublée" :
			var s = player.sight.diceNumber;
			var html = "Vue -" + Math.floor(s/3) + " cases";
			html += "<br>Un jet de RM réussi divise par deux ce malus soumis par ailleurs au décumul.";	
			return html

		default :
			return "<i>Sans doute un sort que le pauv' développeur n'a pas...<br>A votre bon coeur m'sieursdames!</i>";
	}
}
