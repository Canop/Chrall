
/**
 * Trace une ligne horizontale épaisse d'un pixel écran (contourne un problème des canvas).
 * 
 * @param c : le contexte 2D du canvas
 * @param x1, x2, y : coordonnées écran
 */
function drawThinHorizontalLine(c, x1, x2, y) {
	c.lineWidth = 1;
	var adaptedY = Math.floor(y)+0.5;
	c.beginPath();
	c.moveTo(x1, adaptedY);
	c.lineTo(x2, adaptedY);
	c.stroke();
}

/**
 * Trace une ligne verticale épaisse d'un pixel écran (contourne un problème des canvas).
 * 
 * @param c : le contexte 2D du canvas
 * @param x1, x2, y : coordonnées écran
 */
function drawThinVerticalLine(c, x, y1, y2) {
	c.lineWidth = 1;
	var adaptedX = Math.floor(x)+0.5;
	c.beginPath();
	c.moveTo(adaptedX, y1);
	c.lineTo(adaptedX, y2);
	c.stroke();
}

// dessine un rectangle dont les bords ont exactement un pixel de large (avec le strokeStyle courant)
Rect.prototype.drawThin = function(c) {
	drawThinHorizontalLine(c, this.x, this.x+this.w, this.y);
	drawThinHorizontalLine(c, this.x, this.x+this.w, this.y+this.h);
	drawThinVerticalLine(c, this.x, this.y, this.y+this.h);
	drawThinVerticalLine(c, this.x+this.w, this.y, this.y+this.h);
}

/*
renvoie true ssi l'intersection entre les deux rectangles est non nulle
*/
function Rect_intersect(r1, r2) {
    return r1.x<=r2.x+r2.w && r2.x<=r1.x+r1.w && r1.y<=r2.y+r2.h && r2.y<=r1.y+r1.h;
}

function Rect_maxRect(w, h) {
    var z = Math.max(w, h);
    var rect = new Rect(0, 0, w/z, h/z);
    rect.x = (1-rect.w)/2;
    rect.y = (1-rect.h)/2;
    return rect;
}

function Rect(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}


Rect.prototype.string = function() {
    return 'Rect('+this.x+', '+this.y+', '+this.w+', '+this.h+')';
}

Rect.prototype.contains = function(x, y) {
    return x>=this.x && x<=this.x+this.w && y>=this.y && y<=this.y+this.h;
};

/**
 * pour un rectangle d'affichage : indique s'il occupe une portion de l'écran assez significative pour qu'on doive le représenter
 */
Rect.prototype.isBigEnough = function() {
    return this.w>3 && this.h>3/* && this.w*this.h>10*/;
};

Rect.prototype.fill = function(c, fillStyle) {
    c.fillStyle=fillStyle;
    c.fillRect(this.x, this.y, this.w, this.h);
};

/**
 * dessine un rectangle aux bords arrondis.
 * 
 * Doc de arcTo : http://dev.w3.org/html5/2dcontext/ 
*/
Rect.prototype.makePath = function(c, radius) {
    c.beginPath();
    c.moveTo(this.x, this.y+radius);
    c.arcTo(this.x, this.y+this.h, this.x+radius, this.y+this.h, radius);
    c.arcTo(this.x+this.w, this.y+this.h, this.x+this.w, this.y+radius, radius);
    c.arcTo(this.x+this.w, this.y, this.x+radius, this.y, radius);
    c.arcTo(this.x, this.y, this.x, this.y+radius, radius);
};

/**
 * élargit si nécessaire le rectangle de telle sorte qu'il contienne le point p
 */ 
Rect.prototype.makeContain = function(p) {
    if (p.x<this.x) {
        this.w += this.x-p.x;
        this.x=p.x;
    } else if (p.x>this.x+this.w) {
        this.w=p.x-this.x;
    }
    if (p.y<this.y) {
        this.h += this.y-p.y;
        this.y=p.y;
    } else if (p.y>this.y+this.h) {
        this.h=p.y-this.y;
    }
};

Rect.prototype.clone = function() {
    return new Rect(this.x, this.y, this.w, this.h);
};

