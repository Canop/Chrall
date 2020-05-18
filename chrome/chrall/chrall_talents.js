"use strict";
var chrall = chrall || {};

/**
 * renvoie le baratin informatif à afficher dans une bulle lorsque la souris passe au dessus du nom
 *  d'une compétence.
 */
chrall.getTalentBubbleContent= (name) => {
	var bubbler = chrall.talentBubblers[name];
	if (!bubbler) return "compétence inconnue de Chrall";
	var	player = chrall.player(),
		level = player.talents[name] ? player.talents[name].level : undefined;
	return bubbler(player, level);
};

/**
 * Calcule la portee du projectile magique en fonction de la vue
 */
chrall.projoRange = (view) => {
	return Math.ceil((Math.sqrt(8 * view + 49) - 7) / 2);
};

/**
 * Retourne un objet contenant les degats/degats critique du projo
 */
chrall.projoDamage = (diffRange) => {
	var damages = {};
	var projectileDamageDiceNumber = Math.floor(chrall.player().sight.diceNumber * chrall.player().magicalDamageMultiplier);
	damages.damage = 2 * (Math.floor(projectileDamageDiceNumber * 0.5) + diffRange) + chrall.player().damage.magicalBonus;
	damages.damageCrit = damages.damage + 2 * Math.floor(projectileDamageDiceNumber * 0.25);
	return damages;
};

/**
 * Retourne la vue necessaire pour atteindre la portee
 */
chrall.projoRequiredSight = (range) => {
	return 1 + (range * range + 5 * range - 6) / 2;
};

/**
 * Retourne le jet de toucher pour lancer de potions
 */
chrall.potionJetToucher = (range) => {
	return chrall.player().talents["Lancer de Potions"].mastering + chrall.player().concentration + Math.min(10, (1 - range) * 10 + chrall.player().totalSight);
};

chrall.talentBubblers = {

	// ----------------------------------------
	// Compétences
	// Prière de conserver l'ordre alphabétique
	// ----------------------------------------

	"Accélération du Métabolisme": (player)=>{
		return chrall.playerAmAbstract.join("<br>");
	},

	"Attaque Précise": (player, compLevel)=>{
		var attacBonus = 3.5 * Math.min(Math.floor(player.attac.diceNumber / 2), compLevel * 3);
		var html = "<table><tr><td>Niveau</td><td> : " + compLevel + "</td></tr>";
		html += "<tr><td>Attaque moyenne</td><td> : " + (player.attac.getMean() + attacBonus) +
				"</td></tr>";
		html += "<tr><td>Dégâts moyens</td><td> : " + player.damage.getMean() + " / " +
				player.damage.getCriticalMean() + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Balayage": (player)=>{
		var att = player.attac.getMean();
		var html = "Jet de déstabilisation moyen : " + att;
		html += "<br>Si le jet de déstabilisation est strictement supérieur au jet de stabilité, le défenseur se retrouve à terre.";
		html += "<br>De plus, si le jet de déstabilisation est strictement supérieur à deux fois le jet de stabilité,";
		html += " le défenseur active les possibles pièges sur la case.";
		html += "<br>Un Trõll <i>à terre</i> dispose d'un Point d'Action de moins lorsqu'il active un tour.";
		html += "<br>Pour se relever, le Trõll doit utiliser l'action <i>se relever</i> qui coûte 2 PA.";
		return html;
	},

	"Balluchonnage": (player)=>{
		return "<table><tr><td>Balluchonner</td><td> : 1 PA</td></tr><tr><td>Déballuchonner</td><td> : 2 PA</td></tr></table>"
	},

	"Bidouille": (player)=>{
		var html = "<table><tr><td>Permet de Bidouiller</td></tr>";
		html += "<tr><td><b>Un trésor</b> : complète le nom d'un objet de votre inventaire avec le texte de son choix.</td></tr>";
		html += "<tr><td><b>Une bidouille</b> : crée un objet de toutes pièces, en lui donnant un nom et une descriptions";
		html += " (poids en fonction du nombre de PA utilisé).</td></tr>";
		html += "</table>";
		return html;
	},

	"Botte Secrète": (player)=>{
		var des_att = Math.floor(2 * player.attac.diceNumber / 3);
		var att = des_att * 3.5 + Math.floor((player.attac.physicalBonus + player.attac.magicalBonus) / 2);
		var des_deg = Math.floor(player.attac.diceNumber /  2)
		var deg = des_deg * 2 + Math.floor((player.damage.physicalBonus + player.damage.magicalBonus) / 2);
		var degCrit = deg + Math.floor(des_deg / 2) * 2;
		return "<table><tr><td>Attaque moyenne</td><td> : " + att +
			"</td></tr><tr><td>Dégâts moyens</td><td>  : " + deg + " / " + degCrit +
			"</td></tr></table>50 % de l'armure totale de la cible est ignorée.";
	},

	"Camouflage": (player)=>{
		var html = "Déplacement : un jet de compétence (à 75% du niveau du sortilège) est nécessaire pour conserver le Camouflage";
		html += " (Ce jet ne coûte aucun PA et ne rapporte pas de PX).";
		html += "<br>Attaque de la part du Tomawak : le Camouflage est automatiquement rompu.";
		html += "<br>Projectile Magique : un jet de compétence (à 25% du niveau du sortilège)";
		html += " est nécessaire pour conserver le Camouflage (Ce jet ne coûte aucun PA et ne rapporte pas de PX).";
		return html;
	},

	"Charger": (player)=>{
		var computeRange = function(pv){
			var s = Math.ceil(pv / 10) + player.regeneration.diceNumber;
			var result = 1;
			if (s>49) result = 8;
			else if (s>39) result = 7;
			else if (s>30) result = 6;
			else if (s>22) result = 5;
			else if (s>15) result = 4;
			else if (s>9) result = 3;
			else if (s>4) result = 2;
			var totalSight = Math.max(0, player.totalSight); // La portée de la vue, ou 0 si négative
			result = Math.min(result, totalSight); // La charge ne peut pas dépasser la VUE
			return result;
		};
		// Il est toujours possible de charger à 1 case
		// (quelle que soit la fatigue) à moins que le maxRange soit de 0
		var maxRange = computeRange(player.pvMax);
		var minRange = Math.min(maxRange, 1);
		var range = computeRange(player.pv);
		range -= Math.floor((player.strainBase + player.strainMalus) / 5); // malus de fatigue
		range = Math.max(range, minRange);
		var html = "<table><tr><td>Portée maximale</td><td> : " + maxRange + (maxRange > 1 ? " cases" : " case") + "</td></tr>";
		html += "<tr><td>Portée actuelle</td><td> : " + range + (range > 1 ? " cases" : " case") + "</td></tr>";
		html += "<tr><td>Attaque moyenne</td><td> : " + player.attac.getMean() + "</td></tr>";
		html += "<tr><td>Dégâts moyens</td><td> : " + player.damage.getMean() + " / " + player.damage.getCriticalMean() + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Connaissance des Monstres": (player)=>{
		return "Pour 1 PA vous pouvez analyser un monstre dans votre vue.";
	},

	"Construire un Piège": (player)=>{
		var degDices = Math.floor((player.dodge.diceNumber + player.sight.diceNumber) / 2);
		var html = "Piège à feu :<table>";
		html += "<tr><td>Dégâts non résistés : " + degDices + " D3</td>";
		html += "<td> Moyenne : " + (degDices * 2) + " PV</td></tr>";
		html += "<tr><td colspan=2>En cas de Résistance Magique, les dégâts sont divisés par deux.</td></tr>";
		html += "</table>";
		return html;
	},

	"Contre-Attaquer": (player)=>{
		var des_att = Math.floor(player.attac.diceNumber / 2);
		var att = des_att * 3.5 + Math.floor((player.attac.physicalBonus + player.attac.magicalBonus) / 2);
		var html = "<table>";
		html += "<tr><td>Attaque moyenne</td><td> : " + att + "</td></tr>";
		html += "<tr><td>Dégâts moyens</td><td> : " + player.damage.getMean() + " / " +
				player.damage.getCriticalMean() + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Coup de Butoir": (player, compLevel)=>{
		var damageBonus = 2 * Math.min(Math.floor(player.damage.diceNumber / 2), compLevel * 3);
		var html = "<table><tr><td>Niveau</td><td> : " + compLevel + "</td></tr>";
		html += "<tr><td>Attaque moyenne</td><td> : " + player.attac.getMean() + "</td></tr>";
		html += "<tr><td>Dégâts moyens</td><td> : " + (player.damage.getMean() + damageBonus) + " / " +
			(player.damage.getCriticalMean() + damageBonus) + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Course": (player)=>{
		var html = "Permet d'activer le mode [Course] et d'avoir une chance de se déplacer pour 0PA par la suite";
		html += "<table><tr><td>Un jet caché sous course/2 doit être réussi, sinon coût normal du déplacement</td></tr>";
		html += "<tr><td>Le troll doit être seul sur la caverne pour activer le mode</td></tr>";
		html += "<tr><td>Le troll sort du mode [Course] s'il s'arrete (1PA) ou s'il subit une perte de PV</td></tr>";
		html += "<tr><td>Actions possibles en mode [Course] : se déplacer / DE / arrêter de courir</td></tr>";
		html += "</table>";
		return html;
	},

	"Déplacement Eclair": (player)=>{
		return "Diminue de 1 PA le coup d'un déplacement par rapport à un déplacement normal.";
	},

	"Ecriture Magique": (player)=>{
		var html = "Une EM vous coûtera 5 PA mais surtout de nombreux investissements";
		html += " et des recherches savantes qui ne tiendraient pas dans une petite bulle...";
		return html;
	},

	"Frénésie": (player)=>{
		var html = "Frapper deux fois en un seul tour avec les caractéristiques suivantes pour les deux attaques :<table>";
		html += "<tr><td>Attaque moyenne</td><td> : " + player.attac.getMean() + "</td></tr>";
		var dmg = player.damage.getMean() + " / " + player.damage.getCriticalMean();
		html += "<tr><td>Dégâts moyens</td><td> : " + dmg + "</td></tr>";
		html += "<tr><td>Esquive réduite à zéro jusqu'à la prochaine DLA.</td></tr>";
		html += "</table>";
		return html;
	},

	"Golemologie": (player)=>{
		return "Un golémologue peut-il remplir cette bulle ?";
	},

	"Identification des Champignons": (player)=>{
		var s = player.sight.diceNumber + player.sight.physicalBonus;
		var html = "<table>";
		html += "<tr><td>Portée horizontale</td><td> : " + Math.floor(s / 2) + "</td></tr>";
		html += "<tr><td>Portée verticale</td><td> : " + Math.floor(Math.ceil(s / 2) / 2) + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Insultes": (player)=>{
		return "Portée : une case à l'horizontal";
	},

	"Lancer de Potions": (player)=>{
		var	p = Math.floor(2 + player.totalSight / 5),
			cppc = player.talents["Lancer de Potions"].mastering + player.concentration,
			s = player.sight.diceNumber + player.sight.physicalBonus,
			html = "<table>";
		html += "<tr><td>Portée (à l'horizontale)</td>";
		html += "<td> : " + p + (p > 1 ? " cases" : " case") + "</td></tr>";
		for (let d = 1; d <= s && d <= p && d <= 20; d++) {
			var bv = Math.min(10, (1 - d) * 10 + player.totalSight);
			html += "<tr><td>Jet de toucher à " + d + (d > 1 ? " cases" : " case");
			html +=	"</td><td> : " + (cppc + bv) + " %</td></tr>";
		}
		html += "</table>";
		html += "Ce calcul est fait pour votre concentration actuelle (" + player.concentration +" %).";
		html += "<br>En vous concentrant vous augmentez d'autant votre jet de toucher.";
		html += "<br>Si vous ratez ce jet, la potion est perdue sans effet.";
		return html;
	},

	"Miner": (player)=>{
		var html = "<table>";
		html += "<tr><td>Portée horizontale</td><td> : " + Math.floor(player.totalSight * 2) + "</td></tr>";
		html += "<tr><td>Portée verticale</td><td> : " + Math.floor((player.totalSight / 2) * 2) + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Parer": (player)=>{
		var bonusAttaque = player.attac.physicalBonus + player.attac.magicalBonus;
		var parade = 3.5 * Math.floor(player.attac.diceNumber / 2) + Math.floor(bonusAttaque / 2);
		var html = "<table>";
		html += "<tr><td>Jet de parade moyen</td><td> : " + parade + "</td></tr>";
		html += "<tr><td>\"Esquive\" moyenne totale</td><td> : " + (player.dodge.getMean() + parade) + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Pistage": (player)=>{
		var html = "<table>";
		html += "<tr><td>Portée horizontale</td><td> : " + (2 * player.totalSight) + "</td></tr>";
		html += "<tr><td>Portée verticale</td><td> : " + 2 * Math.ceil(player.totalSight / 2) +
				"</td></tr>";
		html += "</table>";
		return html;
	},

	"Régénération Accrue": (player)=>{
		var desRA = Math.floor(2 * player.pvMax / 30);
		var html = "<table>";
		html += "<tr><td>Régénération Accrue</td><td> : " + desRA + " D3</td></tr>";
		html += "<tr><td>Moyenne</td><td> : " + (desRA * 2) + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Retraite": (player)=>{
		return "Si l'on vous frappe, vous prenez votre retraite.<br>Sauf si c'est une botte secrète : ils sont fourbes les skrims.";
	},
	
	"S'interposer": (player)=>{
		var stab = 3.5 * Math.floor(2 * (player.dodge.diceNumber + player.regeneration.diceNumber) / 3) +  player.dodge.physicalBonus + player.dodge.magicalBonus;
		var html = "<table>";
		html += "<tr><td>Jet de stabilité moyen</td><td> : " + stab + "</td></tr>";
		html += "</table>";
		return html;
	},
	
	"Baroufle": (player)=>{
		var html = "Liste des sons qui procurent un effet proportionnel à la puissance dans la mélodie (bonus/malus sur la durée, ou directs)";
		html += "<br><table><tr><td>Badaboum: </td><td>att +1</td></tr>";
		html += "<tr><td>Booong: </td><td>deg +1 / esq -1</td></tr>";
		html += "<tr><td>Gaaaw: </td><td>Fatigue +1</td></tr>";
		html += "<tr><td>Huitsch: </td><td>deg -1</td></tr>";
		html += "<tr><td>Kliketiiik: </td><td>esq -1 / concentration -1</td></tr>";
		html += "<tr><td>Krouiiik: </td><td>concentration -2</td></tr>";
		html += "<tr><td>Kssksss: </td><td>esq +1</td></tr>";
		html += "<tr><td>Praaaouuut: </td><td>reg-1</td></tr>";
		html += "<tr><td>Tuutuuuut: </td><td>att -1</td></tr>";
		html += "<tr><td>Whoooom: </td><td>concentration +2</td></tr>";
		html += "<tr><td>Zbouing : </td><td>reg +1</td></tr>";
		html += "</table>";
		html += "<br>Liste des sons dont l'effet se déclenche à partir d'un seuil (variations sur bonus/malus, ou effets directs sur le public)";
		html += "<br><table><tr><td>Sssrileur: </td><td>seuil 6, rend visible</td></tr>";
		html += "<tr><td>Tagadagada: </td><td>seuil 2, rend l'effet actif pendant 2 tours</td></tr>";
		html += "<tr><td>Ytseukayndof: </td><td>seuil 2, rend les bonus magiques</td></tr>";
		html += "<tr><td>Whaaag: </td><td>seuil 4, rend l'effet actif dans les cavernes voisines</td></tr>";
		html += "</table>";

		html += "<br>Puissance de la mélodie";
		html += "<br>La puissance d'une note est déterminée par sa position dans la mélodie:";
		html += "<br><table><tr><td>Note 1: +1</td></tr>";
		html += "<tr><td>Note 2: +2</td></tr>";
		html += "<tr><td>Note 3: +3 (total: 6)</td></tr>";
		html += "<tr><td>Note 4: +4 (total: 10)</td></tr>";
		html += "<tr><td>Note 5: +5 (total: 15)</td></tr>";
		html += "<tr><td>Note 6: +6 (total: 21)</td></tr>";
		html += "</table>";
		return html;
	},


	// ----------------------------------------
	// Sortilèges
	// Prière de conserver l'ordre alphabétique
	// ----------------------------------------

	"Analyse Anatomique": (player)=>{
		var html = "<table>";
		html += "<tr><td>Portée horizontale</td><td> : " + Math.floor(player.totalSight / 2) + "</td></tr>";
		html += "<tr><td>Portée verticale</td><td> : " + Math.floor(player.totalSight / 4) + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Armure Ethérée": (player)=>{
		var a = player.regeneration.diceNumber;
		var html = "<table>";
		html += "<tr><td>Premier AE</td><td> : armure +" + a + "</td></tr>";
		html += "<tr><td>Deuxième AE</td><td> : armure +" + chrall.decumul(1, a) + "</td></tr>";
		html += "<tr><td>Troisième AE</td><td> : armure +" + chrall.decumul(2, a) + "</td></tr>";
		html += "<tr><td>Quatrième AE</td><td> : armure +" + chrall.decumul(3, a) + "</td></tr>";
		html += "<tr><td>Cinquième AE</td><td> : armure +" + chrall.decumul(4, a) + "</td></tr>";
		html += "<tr><td>Sixième et suivants</td><td> : armure +" + chrall.decumul(5, a) + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Augmentation de l´Attaque": (player)=>{
		var a = 1 + Math.floor((player.attac.diceNumber - 3) / 2);
		var html = "<table>";
		html += "<tr><td>Premier ADA</td><td> : attaque +" + a + "</td></tr>";
		html += "<tr><td>Deuxième ADA</td><td> : attaque +" + chrall.decumul(1, a) + "</td></tr>";
		html += "<tr><td>Troisième ADA</td><td> : attaque +" + chrall.decumul(2, a) + "</td></tr>";
		html += "<tr><td>Quatrième ADA</td><td> : attaque +" + chrall.decumul(3, a) + "</td></tr>";
		html += "<tr><td>Cinquième ADA</td><td> : attaque +" + chrall.decumul(4, a) + "</td></tr>";
		html += "<tr><td>Sixième et suivants</td><td> : attaque +" + chrall.decumul(5, a) + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Augmentation de l´Esquive": (player)=>{
		var a = 1 + Math.floor((player.dodge.diceNumber - 3) / 2);
		var html = "<table>";
		html += "<tr><td>Premier ADE</td><td> : esquive +" + a + "</td></tr>";
		html += "<tr><td>Deuxième ADE</td><td> : esquive +" + chrall.decumul(1, a) + "</td></tr>";
		html += "<tr><td>Troisième ADE</td><td> : esquive +" + chrall.decumul(2, a) + "</td></tr>";
		html += "<tr><td>Quatrième ADE</td><td> : esquive +" + chrall.decumul(3, a) + "</td></tr>";
		html += "<tr><td>Cinquième ADE</td><td> : esquive +" + chrall.decumul(4, a) + "</td></tr>";
		html += "<tr><td>Sixième et suivants</td><td> : esquive +" + chrall.decumul(5, a) + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Augmentation des Dégats": (player)=>{
		var html = "<table>";
		var bonusDices = [0, 0, 0, 0, 0, 0];
		['Premiere ADD', 'Deuxième ADD', 'Troisième ADD', 'Quatrième VA', 'Cinquième VA', 'Sixième et suivantes'].forEach(function (count, i){
			html += `<tr><th colspan="2">${count} (+${chrall.decumul(i, 100)}%)</th></tr>`;
			bonusDices[0] = bonusDices[0] + chrall.decumul(i, 1 + player.damage.diceNumber / 5);
			html += `<tr><td>AN, AP, Charge, CA, Frénésie, RP, Vampi</td><td>+${bonusDices[0]}D3 (+${bonusDices[0] * 2})</td></tr>`;
			if (player.talents['Coup de Butoir']){
				bonusDices[1] = bonusDices[1] + chrall.decumul(i, 1 + (player.damage.diceNumber + Math.min(3 * player.damage.diceNumber / 2, player.talents['Coup de Butoir'].level * 3)) / 5);
				html += `<tr><td>Coup de Butoir</td><td>+${bonusDices[1]}D3 (+${bonusDices[1] * 2})</td></tr>`;
			}
			if (player.talents['Explosion']){
				bonusDices[2] = bonusDices[2] + chrall.decumul(i, 1 + (player.damage.diceNumber + player.pvMax / 10) / 10);
				html += `<tr><td>Explosion</td><td>+${bonusDices[2]}D3 (+${bonusDices[2] * 2})</td></tr>`;
			}
			if (player.talents['Griffe du Sorcier']){
				bonusDices[3] = bonusDices[3] + chrall.decumul(i, 1 + player.damage.diceNumber / 10);
				html += `<tr><td>Griffe du Sorcier</td><td>+${bonusDices[3]}D3 (+${bonusDices[3] * 2})</td></tr>`;
			}
			if (player.talents['Projectile Magique']){
				bonusDices[4] = bonusDices[4] + chrall.decumul(i, 1 + chrall.player().sight.diceNumber / 10);
				html += `<tr><td>Projectile Magique</td><td>+${bonusDices[4]}D3 (+${bonusDices[4] * 2})</td></tr>`;
			}
			if (player.talents['Siphon des âmes']){
				bonusDices[5] = bonusDices[5] + chrall.decumul(i, 1 + player.regeneration.diceNumber / 5);
				html += `<tr><td>Siphon des âmes</td><td>+${bonusDices[5]}D3 (+${bonusDices[5] * 2})</td></tr>`;
			}
		});
		html += "</table>";
		return html;
	},

	"Bulle Anti-Magie": (player)=>{
		var html = "Fournit une augmentation de 100% à la Résistance Magique pendant 2 tours<br>mais la Maîtrise Magique subit une diminution de 100% pendant 4 tours";
		html += "<br>En raison du décumul le deuxième BAM augmente votre Résistance Magique de 67%.";
		return html;
	},

	"Bulle Magique": (player)=>{
		var html = "Fournit une augmentation de 100% à la Maîtrise Magique pendant 2 tours";
		html += "<br>mais la Résistance Magique subit une diminution de 100% pendant 4 tours";
		html += "<br>En raison du décumul le deuxième BuM augmente votre Maîtrise Magique de 67%.";
		return html;
	},

	"Explosion": (player)=>{
		var des = 1 + Math.floor((player.damage.diceNumber + Math.floor(player.pvMax / 10)) / 2);
		var html = "<table>";
		html += "<tr><td>Dégâts infligés si non résistée</td><td> : " + des + " D3</td></tr>";
		html += "<tr><td>Moyenne</td><td> : " + (2 * des) + " PV</td></tr>";
		html += "</table>";
		return html;
	},

	"Faiblesse Passagère": (player)=>{
		var a = 1 + Math.floor((Math.floor((player.pv - 30) / 10) + player.damage.diceNumber - 3) / 2);
		var html = "Affecte le monstre ou troll ciblé (sur la case ou une voisine) d'un malus soumis au décumul :<table>";
		html += "<tr><td>Premier FP</td><td> : dégâts -" + a + "</td></tr>";
		html += "<tr><td>Deuxième FP</td><td> : dégâts -" + chrall.decumul(1, a) + "</td></tr>";
		html += "<tr><td>Troisième FP</td><td> : dégâts -" + chrall.decumul(2, a) + "</td></tr>";
		html += "<tr><td>Quatrième FP</td><td> : dégâts -" + chrall.decumul(3, a) + "</td></tr>";
		html += "<tr><td>Cinquième FP</td><td> : dégâts -" + chrall.decumul(4, a) + "</td></tr>";
		html += "<tr><td>Sixième et suivants</td><td> : dégâts -" + chrall.decumul(5, a) + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Flash Aveuglant": (player)=>{
		var a = 1 + Math.floor(player.sight.diceNumber / 5);
		var html = "Affecte les monstres et trolls sur la case d'un malus à l'attaque, à l'esquive et à la vue :<table>";
		html += "<tr><td>Premier FA</td><td> : -" + a + "</td></tr>";
		html += "<tr><td>Deuxième FA</td><td> : -" + chrall.decumul(1, a) + "</td></tr>";
		html += "<tr><td>Troisième FA</td><td> : -" + chrall.decumul(2, a) + "</td></tr>";
		html += "<tr><td>Quatrième FA</td><td> : -" + chrall.decumul(3, a) + "</td></tr>";
		html += "<tr><td>Cinquième FA</td><td> : -" + chrall.decumul(4, a) + "</td></tr>";
		html += "<tr><td>Sixième et suivants</td><td> : -" + chrall.decumul(5, a) + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Glue": (player)=>{
		var html = "<table>";
		var range = Math.floor(1 + player.totalSight / 3);
		html += "<tr><td>Portée (à l'horizontale uniquement)</td><td> : " + range + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Griffe du Sorcier": (player)=>{
		var clawDiceNumber = Math.floor(player.attac.diceNumber * player.magicalAttackMultiplier);
		var att = 3.5 * clawDiceNumber + player.attac.magicalBonus;
		var clawDamageDiceNumber = Math.floor(player.damage.diceNumber * player.magicalDamageMultiplier);
		var deg = 2 * Math.floor(clawDamageDiceNumber / 2) + player.damage.magicalBonus;
		var dur = 1 + Math.floor(player.sight.diceNumber / 5);
		var vir = 1 + Math.floor(player.pvMaxSansBMM / 30) +
				Math.floor(player.regeneration.diceNumber / 3);
		var html = "<table>";
		html += "<tr><td>Attaque</td><td> : " + att + "</td></tr>";
		html += "<tr><td>Dégâts de la frappe</td><td> : " + deg + " PV</td></tr>";
		html += "<tr><td>Durée du poison</td><td> : " + dur + (dur > 1 ? " tours" : " tour") + "</td></tr>";
		html += "<tr><td>Virulence du poison</td><td> : " + vir + " D3 PV par tour</td></tr>";
		html += "</table>";
		html += "En cas de Résistance Magique, les effets du poison sont<br>divisés par deux et durent deux fois moins longtemps.";
		return html;
	},

	"Hypnotisme": (player)=>{
		var esq = player.dodge.diceNumber;
		var html = "<table>";
		html += "<tr><td>Hypnose pleine</td><td> : Esquive -" + Math.floor(esq * 1.5) + " dés</td></tr>";
		html += "<tr><td>Hypnose réduite</td><td> : Esquive -" + Math.floor(esq / 3) + " dés</td></tr>";
		html += "</table>";
		return html;
	},

	"Identification des Trésors": (player)=>{
		return "Ce sort permet, parait-il, d'identifier des trésors.";
	},

	"Invisibilité": (player)=>{
		var html = "Avec 3 PA vous pouvez gagner une invisibilité qui durera tant<br>";
		html += "que vous ne perdrez pas de PV et que vous ne bougerez pas.<br>... surtout ne pas pêter !";
		return html;
	},

	"Lévitation": (player)=>{
		var h = 1.4 + Math.min(Math.floor((player.sight.diceNumber + player.damage.magicalBonus) / 5)
			+ Math.floor(player.mm / 600), 0);
		return "Altitude de lévitation : " + h + " cm du sol";
	},

	"Précision Magique": (player)=>{
		var html = "Le sort Précision Magique permet à votre Trõll de disposer d'un bonus de dés d'attaque \
			sur tous vos sortilèges d'attaque égal à 20% des dés d'attaque du sort utilisé. \
			Ce bonus dure deux tours et s'accompagne d'un malus aux dés de dégâts égal à 20% \
			des dés de dégâts du sortilège utilisé\
			<table>\
			<tr><td>1<sup>ère</sup> PreM</td><td>Attaque magique +20%</td><td>Dégâts magique -20%</td></tr>\
			<tr><td>2<sup>ème</sup> PreM</td><td>Attaque magique +" + chrall.decumul(1, 20) +
			"%</td><td>Dégâts magiques -" + chrall.decumul(1, 20) + "%</td></tr>\
			<tr><td>3<sup>ème</sup> PreM</td><td>Attaque magique +" + chrall.decumul(2, 20) +
			"%</td><td>Dégâts magiques -" + chrall.decumul(2, 20) + "%</td></tr>\
			<tr><td>4<sup>ème</sup> PreM</td><td>Attaque magique +" + chrall.decumul(3, 20) +
			"%</td><td>Dégâts magiques -" + chrall.decumul(3, 20) + "%</td></tr>\
			<tr><td>5<sup>ème</sup> PreM</td><td>Attaque magique +" + chrall.decumul(4, 20) +
			"%</td><td>Dégâts magiques -" + chrall.decumul(4, 20) + "%</td></tr>\
			</table>";
		return html;
	},

	"Projection": (player)=>{
		var html = "La créature ciblée (Troll ou Monstre) par le lanceur du Sortilège sera projetée";
		html += " par un champ de force magique vers une zone voisine.";
		html += "La direction de la projection est aléatoire et la victime sera désorientée.";
		html += " La conséquence de cette désorientation est qu'elle perdra 1 D6 en esquive pour le tour en cours.";
		return html;
	},

	"Projectile Magique": (player)=>{
		var range = chrall.projoRange(player.totalSight);
		player.talents["Projectile Magique"].range = range;
		var html = `<tr><td>Portée</td><td> : ${range} cases (${chrall.projoRequiredSight(range + 1)} de vue totale augmentera la portée)</td></tr>`;
		var projectileDiceNumber = Math.floor(player.sight.diceNumber * player.magicalAttackMultiplier);
		var att = 3.5 * projectileDiceNumber + player.attac.magicalBonus;
		html += `<tr><td>Attaque moyenne</td><td> : ${att} (${projectileDiceNumber} D6 ${chrall.itoa(player.attac.magicalBonus)})</td></tr>`;
		for (var d = 0; d <= range; d++) {
			var damages = chrall.projoDamage(range - d);
			if (d === 0) {
				html += "<tr><td>Dégâts moyens sur votre case";
			} else {
				html += `<tr><td>Dégâts moyens à ${d} case${(d > 1 ? 's' : '')}`;
			}
			html += `</td><td> : ${damages.damage} / ${damages.damageCrit}</td></tr>`;
		}
		return `<table>${html}</table>`;
	},

	"Puissance Magique": (player)=>{
		var html = "Le sort Puissance Magique permet à votre Trõll de disposer d'un bonus de dés de dégâts \
			sur tous vos sortilèges d'attaque égal à 20% des dés de dégâts du sort utilisé. \
			Ce bonus dure deux tours et s'accompagne d'un malus aux dés d'attaque égal à 20% \
			des dés d'attaque du sortilège utilisé\
			<table>\
			<tr><td>1<sup>ère</sup> PuM</td><td>Attaque magique -20%</td><td>Dégâts magiques +20%</td></tr>\
			<tr><td>2<sup>ème</sup> PuM</td><td>Attaque magique -" + chrall.decumul(1, 20) +
			"%</td><td>Dégâts magiques +" + chrall.decumul(1, 20) + "%</td></tr>\
			<tr><td>3<sup>ème</sup> PuM</td><td>Attaque magique -" + chrall.decumul(2, 20) +
			"%</td><td>Dégâts magiques +" + chrall.decumul(2, 20) + "%</td></tr>\
			<tr><td>4<sup>ème</sup> PuM</td><td>Attaque magique -" + chrall.decumul(3, 20) +
			"%</td><td>Dégâts magiques +" + chrall.decumul(3, 20) + "%</td></tr>\
			<tr><td>5<sup>ème</sup> PuM</td><td>Attaque magique -" + chrall.decumul(4, 20) +
			"%</td><td>Dégâts magiques +" + chrall.decumul(4, 20) + "%</td></tr>\
			</table>";
		return html;
	},

	"Rafale Psychique": (player)=>{
		var deg = Math.floor(player.damage.diceNumber * player.magicalDamageMultiplier) * 2 +
				player.damage.magicalBonus;
		var html = "<table>";
		html += "<tr><td>Dégâts directs</td><td> : " + deg + "</td></tr>";
		html += "<tr><td>Malus de régénération</td><td> : " + player.damage.diceNumber +
				" PV durant 2 tours</td></tr>";
		html += "</table>";
		return html;
	},

	"Sacrifice": (player)=>{
		var html = "Vous pouvez soigner un troll situé sur votre case ou une case voisine.";
		html += "<br>Cela vous coûte 1D3 PV + 1D3 par tranche entière de 5 points de vie soignés.";
		html += "<br>Un sacrifice optimal finit donc par 4 ou 9 (par exemple 79 PV).";
		return html;
	},

	"Siphon des âmes": (player)=>{
		var siphonDiceNumber = Math.floor(player.attac.diceNumber * player.magicalAttackMultiplier);
		var att = 3.5 * siphonDiceNumber + player.attac.magicalBonus;
		var siphonDamageDiceNumber = Math.floor(player.regeneration.diceNumber * player.magicalDamageMultiplier);
		var deg = 2 * siphonDamageDiceNumber + player.damage.magicalBonus;
		var nec = player.regeneration.diceNumber;
		var html = "<table>";
		html += "<tr><td>Attaque</td><td> : " + att + "</td></tr>";
		html += "<tr><td>Dégâts de la frappe</td><td> : " + deg + " PV</td></tr>";
		html += "<tr><td>Nécrose : Attaque</td><td> :  -" + nec + " durant deux tours</td></tr>";
		html += "</table>";
		html += "En cas de Résistance Magique, les dégâts sont divisés par deux<br>de même que les effets et la durée de la nécrose.";
		return html;
	},

	"Télékinésie": (player)=>{
		var p = Math.floor(player.totalSight / 2);
		var f = function(p){
			if (p < 0) return " sont trop lourds pour votre vue.";
			var h = " sont ciblables ";
			if (p == 0) return h + "sur votre case.";
			if (p == 1) return h + "à une case.";
			return h + "à " + p + " cases.";
		}
		var html = "Les trésors d'une Plum' et Très Léger" + f(p + 2);
		html += "<br>Les trésors Léger" + f(p + 1);
		html += "<br>Les trésors Moyen" + f(p);
		html += "<br>Les trésors Lourd" + f(p - 1);
		html += "<br>Les trésors Très Lourd et d'une Ton'" + f(p - 2);
		return html;
	},

	"Téléportation": (player)=>{
		var s = player.sight.diceNumber;
		var f = function(pi){
			var d = Math.ceil((Math.sqrt(19 + 8 * (Math.floor(pi / 5) + 3)) - 7) / 2);
			var dh = (d + 20 + s);
			var dv = Math.floor(d / 3 + 3);
			var html = "<table>";
			html += "<tr><td>Portée horizontale</td><td> : " + dh + "</td><td>&rArr; &nbsp; " +
				(player.x - dh) + " &le; X &le; " + (player.x + dh) +
				"</td><td>| &nbsp; " +
				(player.y - dh) + " &le; Y &le; " + (player.y + dh) + "</td></tr>";
			html += "<tr><td>Portée verticale</td><td> : " + dv + "</td><td>&rArr; &nbsp; " +
				(player.z - dv) +
				" &le; N &le; " + Math.min(0, player.z + dv) + "</td></tr>";
			html += "</table>";
			return html;
		}
		
		return f(player.pi);
		
	},

	"Vampirisme": (player)=>{
		var attMagicalBonus = "+0";
		var degMagicalBonus = "+0";
		var diceAttVamp = Math.floor(player.damage.diceNumber * 2 / 3);
		diceAttVamp = Math.floor(player.magicalAttackMultiplier * diceAttVamp);
		if (player.attac.magicalBonus > 0) {
			attMagicalBonus = "+" + player.attac.magicalBonus;
		} else {
			attMagicalBonus = player.attac.magicalBonus;
		}
		if (player.damage.magicalBonus > 0) {
			degMagicalBonus = "+" + player.damage.magicalBonus;
		} else {
			degMagicalBonus = player.damage.magicalBonus;
		}
		var att = 3.5 * diceAttVamp + player.attac.magicalBonus;
		var damageDiceNumber = Math.floor(player.magicalDamageMultiplier * player.damage.diceNumber);
		var deg = damageDiceNumber * 2 + player.damage.magicalBonus;
		var degCrit = Math.floor(damageDiceNumber * 1.5) * 2 + player.damage.magicalBonus;
		var html = "<table>";
		html += "<tr><td>Attaque moyenne</td><td> : " + att + "</td><td>(" + diceAttVamp + "D6 "
			+ attMagicalBonus + ")" + "</td></tr>";
		html += "<tr><td>Dégâts moyens</td><td> : " + deg + " / " + degCrit + "</td><td>(" +
			damageDiceNumber + "D3 " + degMagicalBonus + ")" + "</td></tr>";
		html += "</table>";
		return html;
	},

	"Vision Accrue": (player)=>{
		var a = Math.floor(player.sight.diceNumber / 2);
		var tempTotalSight = player.totalSight;
		var range = chrall.projoRange(player.totalSight);
		var html = ['Premiere VA', 'Deuxième VA', 'Troisième VA', 'Quatrième VA', 'Cinquième VA', 'Sixième et suivantes'].map(function (count, i){
			tempTotalSight += chrall.decumul(i, a);
			var bonusProjo = '';
			if (player.race === 'Tomawak'){
				bonusProjo = `, Projectile Magique +${chrall.projoRange(tempTotalSight) - range}D3`;
			}
			return `<tr><td>${count}</td><td> : +${chrall.decumul(i, a)} (${tempTotalSight} cases${bonusProjo})</td></tr>`;
		}).join('');
		return `<table>${html}</table>`;
	},

	"Voir le Caché": (player)=>{
		var s = player.totalSight;
		// flemme de chercher une formule, j'implémente tous les tests de la doc...
		var range = 0;
		if (s > 22) range = 5;
		else if (s > 15) range = 4;
		else if (s > 9) range = 3;
		else if (s > 4) range = 2;
		else if (s > 0) range = 1;
		var html = "Permet de voir et cibler les trolls et monstres ";
		if (range == 0) {
			html += "sur votre case<br>(ce serait mieux si vous voyiez un peu mieux le visible pour commencer)."
		} else {
			html += "jusqu'à " + range + (range > 1 ? " cases." : " case.");
		}
		html += "<br>Permet également de voir les autres éléments cachés du jeu à une portée de 1 case.";
		return html;
	},

	"Vue Troublée": (player)=>{
		var s = player.sight.diceNumber;
		var html = "Vue -" + Math.floor(s / 3) + " cases";
		html += "<br>Un jet de RM réussi divise par deux ce malus soumis par ailleurs au décumul.";
		return html;
	},
};
