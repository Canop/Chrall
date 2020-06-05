"use strict";
var chrall = chrall || {};
//////////////////////////////////////////////////////////////////////// Characteristic
/**
 * une caractéristique est décomposée en :
 *  - diceNumber : un nombre de dés
 *  - diceSize : une taille de dés
 *  - physicalBonus
 *  - magicalBonus
 *
 * Le cas des caractéristiques sans dés (par exemple la vue) est simplement couvert par un nombre de dés à 0
 */
function Characteristic(diceNumber, diceSize, physicalBonus, magicalBonus, turnBonus){
	this.diceNumber = isNaN(diceNumber) ? 0 : diceNumber;
	this.diceSize = diceSize;
	this.physicalBonus = isNaN(physicalBonus) ? 0 : physicalBonus;
	this.magicalBonus = isNaN(magicalBonus) ? 0 : magicalBonus;
	this.turnBonus = isNaN(turnBonus) ? 0 : turnBonus;
}
chrall.Characteristic = Characteristic;
Characteristic.prototype.readRow = function(row){
	var cells = $(row).find("td");
	var s = $(cells[1]).text().trim();
	s = s.split('/')[0]; // pour éliminer la seconde partie dans 1 D3 / 2 D3
	var tokens = chrall.tokenize(s.replace('D', ' '));
	if (tokens.length >= 2) {
		this.diceNumber = parseInt(tokens[0]);
		this.diceSize = parseInt(tokens[1]);
	} else {
		this.diceNumber = 0;
		this.diceSize = 0;
	}
	this.physicalBonus = parseInt($(cells[2]).text().trim());
	this.magicalBonus = parseInt($(cells[3]).text().trim());
	return this;
};
Characteristic.prototype.getMean = function(){
	return (this.diceNumber + this.turnBonus) * (this.diceSize + 1) / 2 + this.physicalBonus + this.magicalBonus;
};
Characteristic.prototype.getCriticalMean = function(){
	return Math.floor((this.diceNumber + this.turnBonus) * 1.5) * (this.diceSize + 1) / 2 + this.physicalBonus + this.magicalBonus;
};

//////////////////////////////////////////////////////////////////////// Talent

/**
 * Params :
 *  - name
 *  - level (le niveau max de la compétence)
 *  - mastering (le pourcentage pour le niveau max)
 */
function Talent(){
}
chrall.Talent = Talent;
Talent.prototype.readRow = function($row){
	var $cells = $row.find("td");
	this.name = $cells.eq(1).find("a").text().trim();
	this.level = parseInt($cells.eq(-6).text()) || 1;
	this.mastering = parseInt($cells.eq(-5).text());

	if (this.name === 'Lancer de Potions'){
		this.range = Math.floor(2 + chrall.player().totalSight / 5);
	}
	if (this.name === 'Projectile Magique'){
		this.range = chrall.projoRange(chrall.player().totalSight);
	}
};

//////////////////////////////////////////////////////////////////////// Mouche

/**
 *    Une mouche
 * Params :
 *  - type ("Rivatant", "Telaite", etc.) : capitalisé de façon normale
 *  - name ou null
 *  - characName : le nom de la caractéristique impactée [->taip : pas urgent]
 */
function Fly(type, name){
	this.type = type;
	this.name = name ? name : null;
}
chrall.Fly = Fly;

//////////////////////////////////////////////////////////////////////// Thing

/**
 * les Things sont les trucs qu'on trouve dans les souterrains. Ils ont essentiellement
 *  un id, un nom et une position (les x, y et z directement).
 * Note : les champignons n'ont pas d'id visible dans la table reçue.
 * Params :
 *  - id
 *  - name
 */
function Thing(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
	this.icons = "";
}
chrall.Thing = Thing;
Thing.prototype.horizontalDistance = function(x, y){ // distance horizontale
	return Math.max(Math.abs(this.x - x), Math.abs(this.y - y));
};
Thing.prototype.setName = function(name){ // méthode surchargée pour les monstres et les lieux
	this.name = name;
};

//////////////////////////////////////////////////////////////////////// Cenotaphe

/**
 * Params :
 *  - trollId : l'id du troll décédé
 */
function Cenotaphe(x, y, z){
	Thing.call(this, x, y, z);
}
chrall.Cenotaphe = Cenotaphe;
Cenotaphe.prototype = new Thing();
Cenotaphe.prototype.setName = function(fullName){
	this.name = fullName;
	var i = fullName.lastIndexOf('(');
	var s = fullName.substring(i + 1, fullName.length - 1);
	this.trollId = chrall.atoi(s);
};


//////////////////////////////////////////////////////////////////////// Monstre

/**
 * Monster hérite de Thing.
 * Params :
 *  - fullName
 *  - isGowap
 *  - isSick (a priori pour les gowaps)
 */
function Monster(x, y, z){
	Thing.call(this, x, y, z);
}
chrall.Monster = Monster;
Monster.prototype = new Thing();
Monster.prototype.setName = function(fullName){
	this.fullName = fullName;
	this.isSick = false;
	var i1 = fullName.indexOf('[');
	var i2 = fullName.indexOf(']');
	if (i1 > 0 && i2 > i1) {
		this.name = fullName.substring(0, i1 - 1); // le -1 car il y a un espace à virer également
		this.ageTag = fullName.substring(i1 + 1, i2);
		// on va regarder si on a un deuxième truc entre crochets (maladie)
		var remainingString = fullName.substring(i2 + 1, fullName.length);
		i1 = remainingString.indexOf('[');
		i2 = remainingString.indexOf(']');
		if (i1 > 0 && i2 > i1) {
			// notons que ce test n'est pas super fiable... ça pourrait être autre chose... peut-être même un taggage par un joueur !
			// à terme il faudra utiliser le fait que le tag de maladie n'est pas dans le <a></a>
			this.isSick = true;
		}
	} else {
		this.name = fullName;
	}
	this.isGowap = this.name.indexOf("Gowap") == 0;
};

//////////////////////////////////////////////////////////////////////// Troll (en Français : Troll)

/**
 * Troll hérite de Thing.
 * Params :
 *  - level
 *  - race
 *     - guildeName
 *  - dlaTime (secondes depuis 1970)
 *  - pv
 *  - pvMax
 *  - turnDuration (en secondes)
 *  - strainBase (la fatigue de base)
 *  - strainMalus (le malus de fatigue)
 *  - isIntangible
 *  - px
 *  - pxPerso
 *     - pi
 *  - availablePi : les pi non encore consommés en amélioration
 *  - flies : le tableau des mouches
 *  - concentration
 *  - les characteristics...
 *  - mm, rm, baseMm, baseRm
 *  - pa (les pa restant, pas souvent disponibles)
 *  - sessionActive (booléen)
 *  - cellIsFree (pour le malus de déplacement de case occupée)
 *  - totalSight (parce que suivant les cas on n'a pas toujours le détail)
 */
function Troll(x, y, z){
	Thing.call(this, x, y, z);
	this.isIntangible = false;
	this.magicalAttackMultiplier = 1;
	this.magicalDamageMultiplier = 1;
	this.talents = {};
	this.missions = {};
}
chrall.Troll = Troll;
Troll.prototype = new Thing();
/**
 * getDla(0) est la DLA en cours (getDla() est pareil)
 * getDla(1) est le prochain cumul
 * getDla(2) est le cumul suivant
 * je vous laisse deviner pour la suite
 */

Troll.prototype.getDla = function(nbTurnsToAdd){
	if (!nbTurnsToAdd) {
		return new Date(this.dlaTime*1000);
	}
	return new Date(this.dlaTime*1000).add({seconds: nbTurnsToAdd * this.turnDuration}); // surcharge de Date définie dans date-fr-FR.js
};

Troll.prototype.addFly = function(fly){
	if (!this.flies) {
		this.flies = new Array();
	}
	this.flies.push(fly);
};

Troll.prototype.cleanFlies = function(){
	this.flies = new Array();
};

Troll.prototype.addTalent = function(t){
	this.talents[t.name] = t;
};

// permet de construire un troll à partir d'un autre dont le prototype est incomplet (reçu en json depuis le script de fond, pas les méthodes)
Troll.prototype.fillFrom = function(src){
	// d'abord les champs de base
	for (var key in src) {
		this[key] = src[key];
	}
};

// sauvegarde localement les infos du troll. Utilisé en particulier pour le passage entre frames
Troll.prototype.save = function(){
	if (!this.id) {
		console.info('no id -> troll non sauvable : from ' + chrall.pageName());
		return;
	}
	localStorage['last_saved_troll_id'] = this.id;
	localStorage['troll.' + this.id] = JSON.stringify(this);
};

Troll.prototype.restore = function(){
	if (!this.id) {
		var storedId = localStorage['last_saved_troll_id'];
		if (!storedId || "" == storedId) {
			console.log_debug("No troll to restore");
			return;
		}
		this.id = parseInt(storedId);
	}
	var json = localStorage['troll.' + this.id];
	if (!json) {
		chrall.log_warn('troll ' + this.id + ' non trouvé');
		return;
	}
	this.fillFrom($.parseJSON(json));
};

Troll.prototype.adjustMultiplier = function(percentageDelta){
	return (100.0 + percentageDelta) / 100;
};
Troll.prototype.adjustMagicalAttackMultiplier = function(percentageDelta){
	this.magicalAttackMultiplier = this.adjustMultiplier(percentageDelta);
};
Troll.prototype.adjustMagicalDamageMultiplier = function(percentageDelta){
	this.magicalDamageMultiplier = this.adjustMultiplier(percentageDelta);
};


//////////////////////////////////////////////////////////////////////// Place (lieu)

/**
 * Place hérite de Thing.
 * Params :
 *  - isHole (trou de météorite)
 *  - hasLink (si oui on le construit automatiquement)
 */
function Place(x, y, z){
	Thing.call(this, x, y, z);
}
chrall.Place = Place;
Place.prototype = new Thing();

Place.prototype.setName = function(fullName){
	this.name = fullName;
	this.isHole = fullName.indexOf("Trou de Météorite") >= 0;
};


//////////////////////////////////////////////////////////////////////// LabySquare (case du labyrinthe)

/**
 * LabySquare hérite de Thing.
 * Sert pour les murs et couloirs rencontrés dans les Pocket Hall de type labyrinthe
 * Params :
 *  - isCouloir (on peut se déplacer dedans)
 *  - isMur (on rebondit dessus)
 */
function LabySquare(x, y, z){
	Thing.call(this, x, y, z);
}
chrall.LabySquare = LabySquare;
LabySquare.prototype = new Thing();

LabySquare.prototype.setName = function(fullName){
	this.name = fullName;
	this.isCouloir = fullName.indexOf("Couloir") >= 0;
	this.isMur = fullName.indexOf("Mur") >= 0;
};
