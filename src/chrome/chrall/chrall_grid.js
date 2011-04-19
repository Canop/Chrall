
// cellule dans la grille (correspond à une colonne du jeu : x et y fixés mais z variable)
function Cell() {
}
Cell.prototype.addPlace = function(o){
	if (!this.places) this.places = new Array();
	this.places.push(o);
}
Cell.prototype.addTroll = function(o){
	if (!this.trolls) this.trolls = new Array();
	this.trolls.push(o);
}
Cell.prototype.addMonster = function(o){
	if (!this.monsters) this.monsters = new Array();
	this.monsters.push(o);
}
Cell.prototype.addObject = function(o){
	if (!this.objects) this.objects = new Array();
	this.objects.push(o);
}
Cell.prototype.addMushroom = function(o){
	if (!this.mushrooms) this.mushrooms = new Array();
	this.mushrooms.push(o);
}
Cell.prototype.addCenotaph = function(o){
	if (!this.cenotaphs) this.cenotaphs = new Array();
	this.cenotaphs.push(o);
}



// une grille correspond à la vue passée (et donc de taille (2*vue+1)²)
function Grid(xp, yp, sight) {
	this.sight = sight;
	this.dx = xp-sight;
	this.dy = yp-sight;
	var c = 2*this.sight+1;
	this.cells = new Array(c);
	for (var i=0; i<c; i++) this.cells[i] = new Array(c);
	this.nbPlacesInView = 0;
	this.nbTrollsInView = 0;
	this.nbMonstersInView = 0;
	this.nbObjectsInView = 0;
	this.nbMushroomsInView = 0;
	this.nbCenotaphsInView = 0;
}

// renvoie la cellule de coordonnées passées.
// Renvoie undefined s'il n'y a rien
Grid.prototype.getCellOrNull = function(x, y) {
	return this.cells[x-this.dx][y-this.dy];
}

// renvoie la cellule de coordonnées passées.
// La crée si elle n'existe pas
Grid.prototype.getCellNotNull = function(x, y) {
	var c =  this.cells[x-this.dx][y-this.dy];
	if (!c) {
		c = new Cell();
		this.cells[x-this.dx][y-this.dy] = c;
	}
	return c;
}
