
function Position(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}


/**
 * les Things sont les trucs qu'on trouve dans les souterrains. Ils ont essentiellement
 *  un id, un nom et une position (pour l'instant les x, y et z directement)
 * Params :
 *  - id
 *  - fullName
 *  - name
 *  - x
 *  - y
 *  - z
 */
function Thing() {
}


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
