

function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.clone = function() {
	return new Point(this.x, this.y);
}
Point.prototype.string = function() {
	return "("+this.x + ", " + this.y+")";
}


/**
 * calcule la distance standard entre deux points
 */
function Point_getDistance(a, b) {
    return Math.sqrt((b.x-a.x)*(b.x-a.x)+(b.y-a.y)*(b.y-a.y));
}

/**
 * @param p dans [0, 1]
 */
function Point_intermediate(a, b, p) {
    return new Point(
		a.x + p*(b.x-a.x),
		a.y + p*(b.y-a.y)
    );
}
