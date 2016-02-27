"use strict";
var chrall = chrall || {};

function Point(x, y){
	this.x = x;
	this.y = y;
}
chrall.Point = Point;
Point.prototype.clone = function(){
	return new Point(this.x, this.y);
}
Point.prototype.string = function(){
	return "("+this.x + ", " + this.y+")";
}


