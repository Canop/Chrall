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

		case "Balayage" :
			var att = player.attac.getMean()+player.attac.physicalBonus+player.attac.magicalBonus;
			var html = "Jet de déstabilisation moyen : " + att;
			html += "<br>Si le jet de déstabilisation est strictement supérieur au jet de stabilité, le défenseur se retrouve à terre.";
			html += "<br>De plus, si le jet de déstabilisation est strictement supérieur à deux fois le jet de stabilité, le défenseur active les possibles pièges sur la case.";
			html += "<br>Un Trõll <i>à terre</i> dispose d'un Point d'Action de moins lorsqu'il active un tour.";
			html += "<br>Pour se relever, le Trõll doit utiliser l'action <i>se relever</i> qui coûte 2 PA.";
			return html;
			
		case "Balluchonnage" :
			return "<table><tr><td>Balluchonner</td><td> : 1 PA</td></tr><tr><td>Déballuchonner</td><td> : 2 PA</td></tr></table>";
			
		case "Bidouille" :
			var html = "<table><tr><td>Permet de Bidouiller</td></tr>";
			html += "<tr><td><b>Un trésor</b> : complète le nom d'un objet de votre inventaire avec le texte de son choix.</td></tr>";
			html += "<tr><td><b>Une bidouille</b> : crée un objet de toutes pièces, en lui donnant un nom et une description (poids en fonction du nombre de PA utilisé).</td></tr>";
			html += "</table>";
			return html;
		
		case "Botte Secrète" :
			var des_att = Math.floor(player.attac.diceNumber/2);
			var att = des_att * 3.5 + Math.floor((player.attac.physicalBonus+player.attac.magicalBonus)/2);
			var deg = des_att * 2 + Math.floor((player.damage.physicalBonus+player.damage.magicalBonus)/2);
			var degCrit = deg + Math.floor(des_att/2)*2;
			return "<table><tr><td>Attaque moyenne</td><td> : " + att + "</td></tr><tr><td>Dégâts moyens</td><td>  : " + deg+ " / " + degCrit + "</td></tr></table>50 % de l'armure physique de la cible est ignorée.";
		
		case "Camouflage" :
			var html = "Déplacement : un jet de compétence (à 75% du niveau du sortilège) est nécessaire pour conserver le Camouflage (Ce jet ne coûte aucun PA et ne rapporte pas de PX).";
			html += "<br>Attaque de la part du Tomawak : le Camouflage est automatiquement rompu.";
			html += "<br>Projectile Magique : un jet de compétence (à 25% du niveau du sortilège) est nécessaire pour conserver le Camouflage (Ce jet ne coûte aucun PA et ne rapporte pas de PX).";
			return html;
			
		case "Charger" :
			var computeRange = function(pv) {
				var s = Math.ceil(pv/10) + player.regeneration.diceNumber;
				if (s>49) return 8;
				else if (s>39) return 7;
				else if (s>30) return 6;
				else if (s>22) return 5;
				else if (s>15) return 4;
				else if (s>9) return 3;
				else if (s>4) return 2;
				return 1;
			}
			var maxRange = computeRange(player.pvMax);
			var range = computeRange(player.pv);
			range -= Math.floor((player.strainBase+player.strainMalus)/5); // malus de fatigue
			if (range<0) range = 0;
			var html = "<table><tr><td>Portée maximale</td><td> : "+maxRange+(maxRange>1 ? " cases" : " case") + "</td></tr>";
			html += "<tr><td>Portée actuelle</td><td> : "+range+(range>1 ? " cases" : " case") + "</td></tr>";
			html += "<tr><td>Attaque moyenne</td><td> : " + player.attac.getMean() + "</td></tr>";
			html += "<tr><td>Dégâts moyens</td><td> : " + player.damage.getMean() + " / " + player.damage.getCriticalMean() + "</td></tr>";
			html += "</table>";
			return html;
		
		case "Connaissance des Monstres" :
			return "Pour 1 PA vous pouvez analyser un monstre dans votre vue.";

		case "Construire un Piège" :
			var att = 3.5*player.attac.diceNumber + player.attac.magicalBonus;
			var degDices = Math.floor((player.dodge.diceNumber+player.sight.diceNumber)/2);
			var html = "Piège à feu :<table>";
			html += "<tr><td>Dégâts non résistés : " + degDices + " D3</td><td> Moyenne : " + (degDices*2) + " PV</td></tr>";
			html += "<tr><td colspan=2>En cas de Résistance Magique, les dégâts sont divisés par deux.</td></tr>";
			html += "</table>";	
			return html;
			
		case "Contre-Attaquer" :
			var des_att = Math.floor(player.attac.diceNumber/2);
			var att = des_att * 3.5 + Math.floor((player.attac.physicalBonus+player.attac.magicalBonus)/2);
			var html = "<table>";
			html += "<tr><td>Attaque moyenne</td><td> : " + att + "</td></tr>";
			html += "<tr><td>Dégâts moyens</td><td> : " + player.damage.getMean() + " / " + player.damage.getCriticalMean() + "</td></tr>";
			html += "</table>";
			return html;

		case "Coup de Butoir" :
			var compLevel = player.talents[name].level;
			var damageBonus = 2*Math.min(Math.floor(player.damage.diceNumber/2), compLevel*3);
			var html = "<table><tr><td>Niveau</td><td> : "+compLevel+"</td></tr>";
			html += "<tr><td>Attaque moyenne</td><td> : " + player.attac.getMean() + "</td></tr>";
			html += "<tr><td>Dégâts moyens</td><td> : " + (player.damage.getMean()+damageBonus) + " / " + (player.damage.getCriticalMean()+damageBonus) + "</td></tr>";
			html += "</table>";
			return html;

		case "Course" :
			var html = "Permet d'activer le mode [Course] et d'avoir une chance de se déplacer pour 0PA par la suite";
			html += "<table><tr><td>Un jet caché sous course/2 doit être réussi, sinon coût normal du déplacement</td></tr>";
			html += "<tr><td>Le troll doit être seul sur la caverne pour activer le mode</td></tr>";			
			html += "<tr><td>Le troll sort du mode [Course] s'il s'arrete (1PA) ou s'il subit une perte de PV</td></tr>";
			html += "<tr><td>Actions possibles en mode [Course] : se déplacer / DE / arrêter de courir</td></tr>";
			html += "</table>";
			return html;
			
		case "Déplacement Eclair" :
			return "Diminue de 1 PA le coup d'un déplacement par rapport à un déplacement normal.";

		case "Ecriture Magique" :
			return "Une EM vous coûtera 5 PA mais surtout de nombreux investissements et des recherches savantes qui ne tiendraient pas dans une petite bulle...";
		
		case "Frénésie":
			var html = "Frapper deux fois en un seul tour avec les caractéristiques suivantes pour les deux attaques :<table>";
			html += "<tr><td>Attaque moyenne</td><td> : " + player.attac.getMean() + "</td></tr>";
			html += "<tr><td>Dégâts moyens</td><td> : " + player.damage.getMean() + " / " + player.damage.getCriticalMean() + "</td></tr>";
			html += "<tr><td>Esquive réduite à zéro jusqu'à la prochaine DLA.</td></tr>";
			html += "</table>";
			return html;
			
		case "Golemologie" :
			return "Je n'ai pas trouvé d'information sur Wikipédia concernant la golémologie mais par contre voici ce qu'ils ont sur la Polémologie :<br><i>La polémologie (littéralement « science de la guerre ») est une discipline fondée après la Seconde Guerre mondiale par le sociologue français Gaston Bouthoul (1896-1980).<br>Elle étudie les facteurs dits « polémogènes » : les corrélations éventuelles entre les explosions de violence et des phénomènes économiques, culturels, psychologiques et surtout démographiques récurrents.</i>";

		case "Identification des Champignons" :
			var s = player.sight.diceNumber+player.sight.physicalBonus;
			var html = "<table>";
			html += "<tr><td>Portée horizontale</td><td> : " + Math.floor(s/2) + "</td></tr>";
			html += "<tr><td>Portée verticale</td><td> : " + Math.floor(Math.ceil(s/2)/2) + "</td></tr>";
			html += "</table>";	
			return html;
		
		case "Insultes" :
			return "Portée : une case à l'horizontal";
			
		case "Lancer de Potions" :
			var p = Math.floor(2+player.totalSight/5);
			var cppc = player.talents[name].mastering + player.concentration;
			var html = "<table>";
			html += "<tr><td>Portée (à l'horizontale)</td><td> : " + p + (p>1 ? " cases" : " case") + "</td></tr>";
			for (d=1; d<=s && d<=p && d<=20; d++) {
				var bv = Math.min(10, (1-d)*10 + player.totalSight);
				html += "<tr><td>Jet de toucher à "+ d+ (d>1 ? " cases" : " case") + "</td><td> : " + (cppc+bv) + " %</td></tr>";
			} 
			html += "</table>";	
			html += "Ce calcul est fait pour votre concentration actuelle ("+player.concentration+" %).";
			html += "<br>En vous concentrant vous augmentez d'autant votre jet de toucher.";
			html += "<br>Si vous ratez ce jet, la potion est perdue sans effet.";
			return html;

		case "Miner" :
			var html = "<table>";
			html += "<tr><td>Portée horizontale</td><td> : " + Math.floor(player.totalSight*2) + "</td></tr>";
			html += "<tr><td>Portée verticale</td><td> : " + Math.floor((player.totalSight/2)*2) + "</td></tr>";
			html += "</table>";	
			return html;

		case "Parer" :
			var parade = 3.5*Math.floor(player.attac.diceNumber/2) + Math.floor((player.attac.physicalBonus+player.attac.magicalBonus)/2);
			var html = "<table>";
			html += "<tr><td>Jet de parade moyen</td><td> : " + parade + "</td></tr>";
			html += "<tr><td>\"Esquive\" moyenne totale</td><td> : " + (player.dodge.getMean() + parade) + "</td></tr>";
			html += "</table>";
			return html;
			
		case "Pistage" :
			var html = "<table>";
			html += "<tr><td>Portée horizontale</td><td> : " + (2*player.totalSight) + "</td></tr>";
			html += "<tr><td>Portée verticale</td><td> : " + 2*Math.ceil(player.totalSight/2) + "</td></tr>";
			html += "</table>";	
			return html;
	
		case "Régénération Accrue" :
			var desRA = Math.floor(player.pvMax/20);
			var html = "<table>";
			html += "<tr><td>Régénération Accrue</td><td> : " + desRA + " D3</td></tr>";
			html += "<tr><td>Moyenne</td><td> : " + (desRA*2) + "</td></tr>";
			html += "</table>";
			return html;
	
		case "Retraite" :
			return "Si l'on vous frappe, vous prenez votre retraite.<br>Sauf si c'est une botte secrète : ils sont fourbes les skrims.";
		
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
			var html = "<table>";
			html += "<tr><td>Portée horizontale</td><td> : " + Math.floor(player.totalSight/2) + "</td></tr>";
			html += "<tr><td>Portée verticale</td><td> : " + Math.floor(player.totalSight/4) + "</td></tr>"; // c'est sûr ça ?
			html += "</table>";	
			return html

		case "Armure Ethérée" :
			var a = player.regeneration.diceNumber;
			var html = "<table>";
			html += "<tr><td>Premier AE</td><td> : armure +" + a + "</td></tr>";
			html += "<tr><td>Deuxième AE</td><td> : armure +" + decumul(1, a) + "</td></tr>";
			html += "<tr><td>Troisième AE</td><td> : armure +" + decumul(2, a) + "</td></tr>";
			html += "<tr><td>Quatrième AE</td><td> : armure +" + decumul(3, a) + "</td></tr>";
			html += "<tr><td>Cinquième AE</td><td> : armure +" + decumul(4, a) + "</td></tr>";
			html += "<tr><td>Sixième et suivants</td><td> : armure +" + decumul(5, a) + "</td></tr>";
			html += "</table>";
			return html;

		case "Augmentation de l´Attaque" :
			var a = 1 + Math.floor((player.attac.diceNumber-3)/2);
			var html = "<table>";
			html += "<tr><td>Premier ADA</td><td> : attaque +" + a + "</td></tr>";
			html += "<tr><td>Deuxième ADA</td><td> : attaque +" + decumul(1, a) + "</td></tr>";
			html += "<tr><td>Troisième ADA</td><td> : attaque +" + decumul(2, a) + "</td></tr>";
			html += "<tr><td>Quatrième ADA</td><td> : attaque +" + decumul(3, a) + "</td></tr>";
			html += "<tr><td>Cinquième ADA</td><td> : attaque +" + decumul(4, a) + "</td></tr>";
			html += "<tr><td>Sixième et suivants</td><td> : attaque +" + decumul(5, a) + "</td></tr>";
			html += "</table>";
			return html;

		case "Augmentation de l´Esquive" :
			var a = 1 + Math.floor((player.dodge.diceNumber-3)/2);
			var html = "<table>";
			html += "<tr><td>Premier ADE</td><td> : esquive +" + a + "</td></tr>";
			html += "<tr><td>Deuxième ADE</td><td> : esquive +" + decumul(1, a) + "</td></tr>";
			html += "<tr><td>Troisième ADE</td><td> : esquive +" + decumul(2, a) + "</td></tr>";
			html += "<tr><td>Quatrième ADE</td><td> : esquive +" + decumul(3, a) + "</td></tr>";
			html += "<tr><td>Cinquième ADE</td><td> : esquive +" + decumul(4, a) + "</td></tr>";
			html += "<tr><td>Sixième et suivants</td><td> : esquive +" + decumul(5, a) + "</td></tr>";
			html += "</table>";
			return html;

		case "Augmentation des Dégats" :
			var a = 1 + Math.floor((player.damage.diceNumber-3)/2);
			var html = "<table>";
			html += "<tr><td>Premier ADD</td><td> : dégâts +" + a + "</td></tr>";
			html += "<tr><td>Deuxième ADD</td><td> : dégâts +" + decumul(1, a) + "</td></tr>";
			html += "<tr><td>Troisième ADD</td><td> : dégâts +" + decumul(2, a) + "</td></tr>";
			html += "<tr><td>Quatrième ADD</td><td> : dégâts +" + decumul(3, a) + "</td></tr>";
			html += "<tr><td>Cinquième ADD</td><td> : dégâts +" + decumul(4, a) + "</td></tr>";
			html += "<tr><td>Sixième et suivants</td><td> : dégâts +" + decumul(5, a) + "</td></tr>";
			html += "</table>";
			return html;
		
		case "Bulle Anti-Magie" :
			var html = "Fournit une augmentation de 100% à la Résistance Magique pendant 2 tours<br>mais la Maîtrise Magique subit une diminution de 100% pendant 4 tours";
			html += "<br>En raison du décumul le deuxième BAM augmente votre Résistance Magique de 67%.";
			return html;

		case "Bulle Magique" :
			var html = "Fournit une augmentation de 100% à la Maîtrise Magique pendant 2 tours<br>mais la Résistance Magique subit une diminution de 100% pendant 4 tours";
			html += "<br>En raison du décumul le deuxième BuM augmente votre Maîtrise Magique de 67%.";
			return html;
			
		case "Explosion" :
			var des = 1 + Math.floor((player.damage.diceNumber+Math.floor(player.pvMax/10))/2); // faut-il bien prendre en compte les bonus ?
			var html = "<table>";
			html += "<tr><td>Dégâts infligés si non résistée</td><td> : " + des + " D3</td></tr>";
			html += "<tr><td>Moyenne</td><td> : " + (2*des) + " PV</td></tr>";
			html += "</table>";	
			return html;
			
		case "Faiblesse Passagère" :
			var a = 1 + Math.floor((Math.floor((player.pv-30)/10)+player.damage.diceNumber-3)/2);
			var html = "Affecte les monstres et trolls sur la case ou sur la case voisine d'un malus soumis au décumul :<table>";
			html += "<tr><td>Premier FP</td><td> : dégâts -" + a + "</td></tr>";
			html += "<tr><td>Deuxième FP</td><td> : dégâts -" + decumul(1, a) + "</td></tr>";
			html += "<tr><td>Troisième FP</td><td> : dégâts -" + decumul(2, a) + "</td></tr>";
			html += "<tr><td>Quatrième FP</td><td> : dégâts -" + decumul(3, a) + "</td></tr>";
			html += "<tr><td>Cinquième FP</td><td> : dégâts -" + decumul(4, a) + "</td></tr>";
			html += "<tr><td>Sixième et suivants</td><td> : dégâts -" + decumul(5, a) + "</td></tr>";
			html += "</table>";
			return html;
			
		case "Flash Aveuglant" :
			var a = 1 + Math.floor(player.totalSight/5);
			var html = "Affecte les monstres et trolls sur la case d'un malus à l'attaque, à l'esquive et à la vue :<table>";
			html += "<tr><td>Premier FA</td><td> : -" + a + "</td></tr>";
			html += "<tr><td>Deuxième FA</td><td> : -" + decumul(1, a) + "</td></tr>";
			html += "<tr><td>Troisième FA</td><td> : -" + decumul(2, a) + "</td></tr>";
			html += "<tr><td>Quatrième FA</td><td> : -" + decumul(3, a) + "</td></tr>";
			html += "<tr><td>Cinquième FA</td><td> : -" + decumul(4, a) + "</td></tr>";
			html += "<tr><td>Sixième et suivants</td><td> : -" + decumul(5, a) + "</td></tr>";
			html += "</table>";
			return html;
			
		case "Glue" :
			var html = "<table>";
			html += "<tr><td>Portée (à l'horizontale uniquement)</td><td> : " + Math.floor(1+player.totalSight/3) + "</td></tr>";
			html += "</table>";	
			return html;

		case "Griffe du Sorcier" :
			var att = 3.5*player.attac.diceNumber + player.attac.magicalBonus;
			var deg = 2*Math.floor(player.damage.diceNumber/2) + player.damage.magicalBonus;
			var dur = 1 + Math.floor(player.sight.diceNumber/5);
			var vir = 1 + Math.floor(player.pvMaxSansBMM/30) + Math.floor(player.regeneration.diceNumber/3);
			var html = "<table>";
			html += "<tr><td>Attaque</td><td> : " + att + "</td></tr>";
			html += "<tr><td>Dégâts de la frappe</td><td> : " + deg + " PV</td></tr>";
			html += "<tr><td>Durée du poison</td><td> : " + dur + (dur>1?" tours":" tour") + "</td></tr>";
			html += "<tr><td>Virulence du poison</td><td> : " + vir + " D3 PV par tour</td></tr>";
			html += "</table>";	
			html += "En cas de Résistance Magique, les effets du poison sont<br>divisés par deux et durent deux fois moins longtemps.";
			return html;

		case "Hypnotisme" :
			var esq = player.dodge.diceNumber;
			var html = "<table>";
			html += "<tr><td>Hypnose pleine</td><td> : Esquive -" + Math.floor(esq*1.5) + " dés</td></tr>";
			html += "<tr><td>Hypnose réduite</td><td> : Esquive -" + Math.floor(esq/3) + " dés</td></tr>";
			html += "</table>";	
			return html;

		case "Identification des trésors" :
			return "Je doute pouvoir vous apprendre quelque chose sur ce sujet...";

		case "Invisibilité" :
			return "Avec 3 PA vous pouvez gagner une invisibilité qui durera tant<br>que vous ne perdrez pas de PV et que vous ne bougerez pas.<br>... surtout ne pas pêter !";
		
		case "Lévitation" :
			var h = 1.4 + Math.min(Math.floor((player.sight.diceNumber+player.damage.magicalBonus)/5) + Math.floor(player.mm/600), 0);
			return "Altitude de lévitation : " + h + " cm du sol";
		
		case "Projection" :
			return "La créature ciblée (Troll ou Monstre) par le lanceur du Sortilège sera projetée par un champ de force magique vers une zone voisine. La direction de la projection est aléatoire et la victime sera désorientée. La conséquence de cette désorientation est qu'elle perdra 1 D6 en esquive pour le tour en cours.";
		
		case "Projectile Magique" :
			var s = player.totalSight;
			// ici j'utilise une boucle pour calculer la portée. C'est pas long (probablement pas plus que d'appeler Math.exp) mais c'est pas beau
			//  donc si quelqu'un a une formule directe je suis preneur !
			var range = 30;
			var threeshold = 1;
			var step = 4;
			for (var i=0; i<range; i++) { // si on atteind 30... ben c'est qu'on a trop de vue!
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
			return html;

		case "Puissance Magique" :
			var html = "Le sort Puissance Magique permet à votre Trõll de disposer d'un bonus de dés de dégâts sur tous vos sortilèges d'attaque égal à 20% des dés de dégâts du sort utilisé. Ce bonus dure deux tours et s'accompagne d'un malus aux dés d'attaque égal à 20% des dés d'attaque du sortilège utilisé";
			return html;

		case "Rafale Psychique" :
			var deg = player.damage.diceNumber * 2 + player.damage.magicalBonus;
			var html = "<table>";
			html += "<tr><td>Dégâts directs</td><td> : " + deg + "</td></tr>";
			html += "<tr><td>Malus de régénération</td><td> : " + player.damage.diceNumber + " PV durant 2 tours</td></tr>";
			html += "</table>";
			return html;
			
		case "Sacrifice" :
			var html = "Vous pouvez soigner un troll situé sur votre case ou une case voisine.";
			html += "<br>Cela vous coûte 1D3 PV + 1D3 par tranche entière de 5 points de vie soignés.";
			html += "<br>Un sacrifice optimal finit donc par 4 ou 9 (par exemple 79 PV).";
			return html;

		case "Siphon des âmes" :
			var att = 3.5*player.attac.diceNumber + player.attac.magicalBonus;
			var deg = 2*player.regeneration.diceNumber + player.damage.magicalBonus;
			var nec = player.regeneration.diceNumber;
			var html = "<table>";
			html += "<tr><td>Attaque</td><td> : " + att + "</td></tr>";
			html += "<tr><td>Dégâts de la frappe</td><td> : " + deg + " PV</td></tr>";
			html += "<tr><td>Nécrose : Attaque</td><td> :  -" + nec + " durant deux tours</td></tr>";
			html += "</table>";	
			html += "En cas de Résistance Magique, les dégâts sont divisés par deux<br>de même que les effets et la durée de la nécrose.";
			return html;

		case "Télékinésie" :
			var p = Math.floor(player.totalSight/2);
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
			return html;
		
		case "Téléportation" :
			var s = player.sight.diceNumber;
			var f = function(mm) {
				var d = Math.ceil((Math.sqrt(19+8*(Math.floor(mm/5)+3))-7)/2);
				var dh = (d+20+s);
				var dv = Math.floor(d/3+3);
				var html = "<table>";
				html += "<tr><td>Portée horizontale</td><td> : " + dh + "</td><td>&rArr; &nbsp; "+(player.x-dh)+" &le; X &le; "+(player.x+dh)+"</td><td>| &nbsp; "+(player.y-dh)+" &le; Y &le; "+(player.y+dh)+"</td></tr>";
				html += "<tr><td>Portée verticale</td><td> : " + dv + "</td><td>&rArr; &nbsp; "+(player.z-dv)+" &le; N &le; "+Math.min(0, player.z+dv)+"</td></tr>";
				html += "</table>";
				return html;
			}
			if (player.talents["Bulle Magique"]) {
				html = f(player.mm);
				html += "<br>Si vous n'avez pas fait de BuM, en faire une donnerait :";
				html += f(player.mm+player.baseMm);
				html += "<br>Si vous n'avez pas fait de BuM, en faire deux donnerait :";
				html += f(player.mm+1.67*player.baseMm);
				return html
			} else {
				return f(player.mm);
			}
			
		
		case "Vampirisme" :
			var diceAttVamp= Math.floor(player.damage.diceNumber*2/3);
			var attMagicalBonus="+0";
			var degMagicalBonus="+0";
			if (player.attac.magicalBonus > 0 ) {
				attMagicalBonus = "+" + player.attac.magicalBonus;
			} else {
				attMagicalBonus = player.attac.magicalBonus;
			}
			if (player.damage.magicalBonus > 0 ) {
				degMagicalBonus = "+" + player.damage.magicalBonus;
			} else {
				degMagicalBonus = player.damage.magicalBonus;
			}
			var att = 3.5*diceAttVamp + player.attac.magicalBonus;
			var deg = player.damage.diceNumber * 2 + player.damage.magicalBonus;
			var degCrit = Math.floor(player.damage.diceNumber*1.5)*2 + player.damage.magicalBonus;
			var html = "<table>";
			html += "<tr><td>Attaque moyenne</td><td> : " + att + "</td><td>(" + diceAttVamp + "D6 " + attMagicalBonus + ")"+"</td></tr>";
			html += "<tr><td>Dégâts moyens</td><td> : " + deg + " / " + degCrit + "</td><td>(" + player.damage.diceNumber + "D3 " + degMagicalBonus + ")"+"</td></tr>";
			html += "</table>";
			// Canop : Les commentaires ci dessous sont incomplets (exemple si moins de 10 dés de dégâts) et ne font au final
			// que reprendre moins clairement ce qui est accessible en cliquant sur le lien. Je supprime tout.
			//~ html += "L'armure physique de la cible est ignorée.";
			//~ html += "<br>PV gagnés par vampirisme : moitié des dégâts réellement infligés.<br>";
			//~ html += "Maximum de PV regagnés: nombre de dés de dégâts, et pas plus que les PV restant de la cible.<br>";
			//~ html += "Jet de Résistance : permet de ne subir que la moitié des dégats.";
			return html;

		case "Vision Accrue" :
			var a = Math.floor(player.sight.diceNumber/2);
			var html = "<table>";
			html += "<tr><td>Premier VA</td><td> : vue +" + a + "</td></tr>";
			html += "<tr><td>Deuxième VA</td><td> : vue +" + decumul(1, a) + "</td></tr>";
			html += "<tr><td>Troisième VA</td><td> : vue +" +decumul(2, a) + "</td></tr>";
			html += "<tr><td>Quatrième VA</td><td> : vue +" + decumul(3, a) + "</td></tr>";
			html += "<tr><td>Cinquième VA</td><td> : vue +" + decumul(4, a) + "</td></tr>";
			html += "<tr><td>Sixième et suivants</td><td> : vue +" + decumul(5, a) + "</td></tr>";
			html += "</table>";
			if (player.race=="Tomawak") {
				html += "Vision Accrue augmente la portée du Projectile Magique mais pas l'attaque ni les dégâts.";
			}
			return html;
			
		case "Voir le Caché" :
			var s = player.totalSight;
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
