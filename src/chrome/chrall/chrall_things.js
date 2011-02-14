
function Point(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}
Point.prototype.hdist = function(x, y) { // distance horizontale
	return Math.max(Math.abs(this.x-x), Math.abs(this.y-y));
}


/**
 * les Things sont les trucs qu'on trouve dans les souterrains. Ils ont essentiellement
 *  un id, un nom et une position (pour l'instant les x, y et z directement)
 * Params :
 *  - id
 *  - fullName
 *  - name
 */
function Thing() {
}
Thing.prototype = new Point(); // oui, je sais, c'est pas bien beau du point de vue sémantique...

/**
 * Monster hérite de Thing.
 * Params :
 *  - fullName
 */ 
function Monster() {
}
Monster.prototype = new Thing();
Monster.prototype.setName = function(fullName){
	this.fullName = fullName;
	var i1 = fullName.indexOf('[');
	var i2 = fullName.indexOf(']');
	if (i1>0 && i2>i1) {
		this.name = fullName.substring(0, i1-1); // le -1 car il y a un espace à virer également
		this.ageTag = fullName.substring(i1+1, i2);
	} else {
		this.name = fullName;
	}
}


/**
 * Troll hérite de Thing.
 * Params :
 *  - level
 *  - race
 * 	- guildeName
 */ 
function Troll() {
}
Troll.prototype = new Thing();
