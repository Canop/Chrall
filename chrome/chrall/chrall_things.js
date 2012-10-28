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
function Characteristic() {
}
Characteristic.prototype.readRow = function(row) {
	var cells = $(row).find("td");
	var s = $(cells[1]).text().trim();
	s = s.split('/')[0]; // pour éliminer la seconde partie dans 1 D3 / 2 D3
	var tokens = Chrall_tokenize(s.replace('D', ' '));
	if (tokens.length>=2) {
		this.diceNumber = parseInt(tokens[0]);
		this.diceSize = parseInt(tokens[1]);
	} else {
		this.diceNumber = 0;
		this.diceSize = 0;
	}
	this.physicalBonus = parseInt($(cells[2]).text().trim());
	this.magicalBonus = parseInt($(cells[3]).text().trim());
	return this;
}
Characteristic.prototype.getMean = function() {
	return this.diceNumber * (this.diceSize+1)/2 + this.physicalBonus + this.magicalBonus;
}
Characteristic.prototype.getCriticalMean = function() {
	return Math.floor(this.diceNumber*1.5) * (this.diceSize+1)/2 + this.physicalBonus + this.magicalBonus;
}

//////////////////////////////////////////////////////////////////////// Talent

/**
 * Params :
 *  - name
 *  - level (le niveau max de la compétence)
 *  - mastering (le pourcentage pour le niveau max)
 */ 
function Talent() {
}
Talent.prototype.readRow = function(row) {
	var cells = $(row).find("td");
	if (cells.len<3) return; // c'est pas forcément le moyen le plus propre de gérer les exceptions...
	this.name = ($(cells[1])).find("a").text().trim();
	var tokens = Chrall_tokenize(($(cells[2])).text().trim());
	this.level = parseInt(tokens[2]);
	this.mastering = parseInt(tokens[3]);
}

//////////////////////////////////////////////////////////////////////// Mouche

/**
 *	Une mouche
 * Params :
 *  - type ("Rivatant", "Telaite", etc.) : capitalisé de façon normale
 *  - name ou null
 *  - characName : le nom de la caractéristique impactée [->taip : pas urgent]
 */
function Fly(type, name) {
	this.type = type;
	this.name = name ? name : null;
}

//////////////////////////////////////////////////////////////////////// Thing

/**
 * les Things sont les trucs qu'on trouve dans les souterrains. Ils ont essentiellement
 *  un id, un nom et une position (les x, y et z directement).
 * Note : les champignons n'ont pas d'id visible dans la table reçue.
 * Params :
 *  - id
 *  - name
 */
function Thing(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}
Thing.prototype.hdist = function(x, y) { // distance horizontale
	return Math.max(Math.abs(this.x-x), Math.abs(this.y-y));
}
Thing.prototype.setName = function(name) { // méthode surchargée pour les monstres et les lieux
	this.name = name;
}

//////////////////////////////////////////////////////////////////////// Cenotaphe

/**
 * Params :
 *  - trollId : l'id du troll décédé
 */
function Cenotaphe(x, y, z) {
	Thing.call(this, x, y, z);
}
Cenotaphe.prototype = new Thing(); // ça signifie que Monster est une sous-classe de Thing
Cenotaphe.prototype.setName = function(fullName){
	this.name = fullName;
	var i = fullName.lastIndexOf('(');
	var s = fullName.substring(i+1, fullName.length-1);
	this.trollId = atoi(s);
}


//////////////////////////////////////////////////////////////////////// Monstre

/**
 * Monster hérite de Thing.
 * Params :
 *  - fullName
 *  - isGowap
 *  - isSick (a priori pour les gowaps)
 */ 
function Monster(x, y, z) {
	Thing.call(this, x, y, z); // appel du constructeur de la super-classe (il n'y a pas de 'super' en javascript)
}
Monster.prototype = new Thing(); // ça signifie que Monster est une sous-classe de Thing
Monster.prototype.setName = function(fullName){
	this.fullName = fullName;
	this.isSick = false;
	var i1 = fullName.indexOf('[');
	var i2 = fullName.indexOf(']');
	if (i1>0 && i2>i1) {
		this.name = fullName.substring(0, i1-1); // le -1 car il y a un espace à virer également
		this.ageTag = fullName.substring(i1+1, i2);
		// on va regarder si on a un deuxième truc entre crochets (maladie)
		var remainingString = fullName.substring(i2+1, fullName.length);
		i1 = remainingString.indexOf('[');
		i2 = remainingString.indexOf(']');
		if (i1>0 && i2>i1) {
			// notons que ce test n'est pas super fiable... ça pourrait être autre chose... peut-être même un taggage par un joueur !
			// à terme il faudra utiliser le fait que le tag de maladie n'est pas dans le <a></a>
			this.isSick = true;
		}
	} else {
		this.name = fullName;
	}
	this.isGowap = this.name.indexOf("Gowap")==0;
}

//////////////////////////////////////////////////////////////////////// Troll (en Français : Troll)

/**
 * Troll hérite de Thing.
 * Params :
 *  - level
 *  - race
 * 	- guildeName
 *  - dlaTime (millisecondes depuis 1970)
 *  - pv
 *  - pvMax
 *  - turnDuration (en secondes)
 *  - strainBase (la fatigue de base)
 *  - strainMalus (le malus de fatigue)
 *  - isIntangible
 *  - px
 *  - pxPerso
 * 	- pi
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
function Troll(x, y, z) {
	Thing.call(this, x, y, z); 
	this.isIntangible = false;
}

Troll.prototype = new Thing();
/**
 * getDla(0) est la DLA en cours (getDla() est pareil)
 * getDla(1) est le prochain cumul
 * getDla(2) est le cumul suivant
 * je vous laisse deviner pour la suite
 */

Troll.prototype.getDla = function(nbTurnsToAdd) {
	if (!nbTurnsToAdd) return new Date(this.dlaTime);
	return new Date(this.dlaTime).add({seconds: nbTurnsToAdd*this.turnDuration}); // surcharge de Date définie dans date-fr-FR.js
}

Troll.prototype.addFly = function(fly) {
	if (!this.flies) this.flies = new Array();
	this.flies.push(fly);
}

Troll.prototype.cleanFlies = function() {
	this.flies = new Array();
}

Troll.prototype.addTalent = function(t) {
	if (!this.talents) this.talents = new Object();
	this.talents[t.name]=t;
}

// permet de construire un troll à partir d'un autre dont le prototype est incomplet (reçu en json depuis le script de fond, pas les méthodes)
Troll.prototype.fillFrom = function(src) {
	// d'abord les champs de base
	for (var key in src) {
		this[key]=src[key];
	}
}

// sauvegarde localement les infos du troll. Utilisé en particulier pour le passage entre frames
Troll.prototype.save = function() {
	if (!this.id) {
		console.info('no id -> troll non sauvable : from ' + chrall.pageName());
		return;
	}
	localStorage['last_saved_troll_id'] = this.id;
	localStorage['troll.'+this.id] = JSON.stringify(this);
}

Troll.prototype.restore = function() {
	if (!this.id) {
		var storedId = localStorage['last_saved_troll_id'];
		if (!storedId || "" == storedId) {
			console.log_debug("No troll to restore");
			return;
		}
		this.id = parseInt(storedId);
	}
	var json = localStorage['troll.'+this.id];
	if (!json) {
		chrall.log_warn('troll ' + this.id + ' non trouvé');
		return;
	}
	this.fillFrom($.parseJSON(json));
}

//////////////////////////////////////////////////////////////////////// Place (lieu)

/**
 * Place hérite de Thing.
 * Params :
 *  - isHole (trou de météorite)
 *  - hasLink (si oui on le construit automatiquement)
 */ 
function Place(x, y, z) {
	Thing.call(this, x, y, z);
}
Place.prototype = new Thing();

Place.prototype.setName = function(fullName){
	this.name = fullName;
	this.isHole = fullName.indexOf("Trou de Météorite")>=0;
}


//////////////////////////////////////////////////////////////////////// LabySquare (case du labyrinthe)

/**
 * LabySquare hérite de Thing.
 * Sert pour les murs et couloirs rencontrés dans les Pocket Hall de type labyrinthe
 * Params :
 *  - isCouloir (on peut se déplacer dedans)
 *  - isMur (on rebondit dessus)
 */ 
function LabySquare(x, y, z) {
	Thing.call(this, x, y, z);
}
LabySquare.prototype = new Thing();

LabySquare.prototype.setName = function(fullName){
	this.name = fullName;
	this.isCouloir = fullName.indexOf("Couloir")>=0;
	this.isMur = fullName.indexOf("Mur")>=0;
}
