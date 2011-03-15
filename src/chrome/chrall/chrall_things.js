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
function Characteristic(row) {
}
Characteristic.prototype.readRow = function(row) {
	var cells = $(row).find("td");
	var s = $(cells[1]).text().trim();
	var tokens = Chrall_tokenize(s.replace('D', ' '));
	//for (var i=0; i<tokens.length; i++) alert(tokens[i]); 
	if (tokens.length>=2) {
		this.diceNumber = parseInt(tokens[0]);
		this.diceSize = parseInt(tokens[1]);
	} else {
		this.diceNumber = 0;
		this.diceSize = 0;
	}
	this.physicalBonus = parseInt($(cells[2]).text().trim());
	this.magicalBonus = parseInt($(cells[3]).text().trim());
	//~ alert(this.diceNumber);
	//~ alert(this.diceSize);
	return this;
}
Characteristic.prototype.getMean = function() {
	return this.diceNumber * (this.diceSize+1)/2 + this.physicalBonus + this.magicalBonus;
}
Characteristic.prototype.getCriticalMean = function() {
	return Math.floor(this.diceNumber*1.5) * (this.diceSize+1)/2 + this.physicalBonus + this.magicalBonus;
}

//////////////////////////////////////////////////////////////////////// Mouche

/**
 *	Une mouche
 * Params :
 *  - type ("Rivatant", "Telaite", etc.) : capitalisé de façon normale
 *  - name ou null
 *  - characName : le nom de la caractéristique impactée [->taip : pas urgent]
 *  - physicalBonus  [->taip : pas urgent]
 *  - magicalBonus  [->taip : pas urgent]
 */
function Fly(type, name) {
	this.type = type;
	this.name = name ? name : null;
	// <= insérer ici la détermination de la charac et du bonus
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
 *  - dla (instance de Date)
 *  - turnDuration (en secondes)
 *  - strainBase (la fatigue de base)
 *  - strainMalus (le malus de fatigue)
 *  - isIntangible
 *  - px
 *  - pxPerso
 * 	- pi
 *  - availablePi : les pi non encore consommés en amélioration
 *  - flies : le tableau des mouches
 *  - actionPoints : les PA restant
 *  - les characteristics...
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
	if (!nbTurnsToAdd) return this.dla;
	return this.dla.clone().add({seconds: nbTurnsToAdd*this.turnDuration});
}
Troll.prototype.addFly = function(fly) {
	if (!this.flies) this.flies = new Array();
	this.flies.push(fly);
}

//////////////////////////////////////////////////////////////////////// Place (lieu)

/**
 * Place hérite de Thing.
 * Params :
 *  - isHole (trou de météorite)
 */ 
function Place(x, y, z) {
	Thing.call(this, x, y, z);
}
Place.prototype = new Thing();

Place.prototype.setName = function(fullName){
	this.name = fullName;
	this.isHole = fullName.indexOf("Trou de Météorite")>=0;
}
