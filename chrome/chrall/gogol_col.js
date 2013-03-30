var gowapIcon;


function ChCol(x, y) {
	this.x = x;
	this.y = y;
	this.color = "blue";
	this.label = null;
	this.minZoomForLabel = 10;
	this.screenRect = new Rect();
}
ChCol.prototype.draw = function(carte) {
	this.screenRect.fill(carte.context, this.color);
	if (this.label!=null && this.minZoomForLabel<=carte.zoom) {
		carte.context.font = "14px Ubuntu, Verdana, Arial";
		carte.context.fillText(this.label, this.screenRect.x+this.screenRect.w+3, this.screenRect.y+this.screenRect.h*0.4+7);
	}
}
ChCol.prototype.computeScreenRect = function(carte) {
	this.screenRect.x = carte.zoom*(carte.originX+this.x);
	this.screenRect.y = carte.zoom*(carte.originY-this.y);
	this.screenRect.w = carte.zoom;
	this.screenRect.h = carte.zoom;
}

function ChLabel(x, y, z,  color, label) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.color = color;
	this.label = label;
}
ChLabel.prototype = new ChCol();
ChLabel.prototype.draw = function(carte) {
	this.screenRect.fill(carte.context, this.color);
	if (this.label!=null && this.minZoomForLabel<=carte.zoom) {
		carte.context.font = "14px Ubuntu, Verdana, Arial";
		carte.context.fillText(this.z+" "+this.label, this.screenRect.x+this.screenRect.w+3, this.screenRect.y+this.screenRect.h/2+7);
	}
}

function ChTroll(x, y, z, color, nom, vue) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.color = color;
	this.nom = nom;
	this.vue = vue; // la vue peut être à 0 si on ne la connait pas
	this.minZoomForLabel = 7;
}
ChTroll.prototype = new ChCol();
ChTroll.prototype.draw = function(carte) {
	carte.context.strokeStyle=this.color;
	if (carte.zoom>5) {
		this.screenRect.fill(carte.context, this.color);
		if (this.nom!=null && this.minZoomForLabel<=carte.zoom) {
			carte.context.save();
			carte.context.shadowBlur    = 2;
			carte.context.shadowColor   = 'white';
			carte.context.font = "14px Ubuntu, Verdana, Arial";
			carte.context.fillText(this.z+" "+this.nom, this.screenRect.x+this.screenRect.w+3, this.screenRect.y+this.screenRect.h/2+7);
			carte.context.restore();
		}
	} else {
		var d = 7;
		var cx = this.screenRect.x+this.screenRect.w/2;
		var cy = this.screenRect.y+this.screenRect.h/2;
		drawThinVerticalLine(carte.context, cx, cy-d, cy+d);
		drawThinHorizontalLine(carte.context, cx-d, cx+d, cy);
	}
	if (this.vue*carte.zoom>2) {
		var r = new Rect(
			this.screenRect.x-this.vue*carte.zoom, this.screenRect.y-this.vue*carte.zoom,
			this.screenRect.w*(2*this.vue+1), this.screenRect.h*(2*this.vue+1)
		);
		r.drawThin(carte.context);
	}
}

function ChTrou(x, y) {
	this.x = x;
	this.y = y;
	this.color = "black";
}
ChTrou.prototype = new ChCol();

function ChGrotte(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}
ChGrotte.prototype = new ChCol();


function ChGowap(x, y, z, nom) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.minZoomForLabel = 8;
	this.color = "#c99b1f";
	this.nom = nom;
//	if (!gowapIcon) {
//		gowapIcon = new Image();
//		gowapIcon.src = chrome.extension.getURL("cow_icon.png");
//	}
}
ChGowap.prototype = new ChCol();
ChGowap.prototype.draw = function(carte) {
	carte.context.strokeStyle=this.color;
	if (carte.zoom<2) {
		this.screenRect.fill(carte.context, this.color);
	} else if (carte.zoom<10) {
		var d = 7;
		var cx = this.screenRect.x+this.screenRect.w/2;
		var cy = this.screenRect.y+this.screenRect.h/2;
		drawThinVerticalLine(carte.context, cx, cy-d, cy+d);
		drawThinHorizontalLine(carte.context, cx-d, cx+d, cy);
	} else if (carte.zoom<30) {
		var l = 30;
		var d = (carte.zoom-l)/2;
		carte.context.drawImage(gowapIcon, this.screenRect.x+d, this.screenRect.y+d, l, l);
	} else if (carte.zoom<150) {
		carte.context.drawImage(gowapIcon, this.screenRect.x, this.screenRect.y, this.screenRect.w, this.screenRect.h);
	} else {
		var l = (carte.zoom+20)/2;
		var d = (carte.zoom-l)/2;
		carte.context.drawImage(gowapIcon, this.screenRect.x+d, this.screenRect.y+d, l, l);
	}
	if (this.nom!=null && this.minZoomForLabel<=carte.zoom) {
		carte.context.fillStyle = this.color;
		carte.context.font = "14px Ubuntu, Verdana, Arial";
		carte.context.fillText(this.z+" "+this.nom, this.screenRect.x+this.screenRect.w+3, this.screenRect.y+this.screenRect.h/2+7);
	}
}

