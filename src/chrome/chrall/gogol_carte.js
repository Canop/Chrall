
function CarteHall(canvasId, posmarkid) {
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");
	this.posmarkdiv = document.getElementById(posmarkid);
	this.screenRect = new Rect();
	this.rect = new Rect(); // le rectangle englobant le contenu que l'on veut montrer
	this.originX=0; // coin haut gauche de la grotte au centre de l'écran
	this.originY=0;
    this.objects = new Array();
    this.scales = new Array();
    this.scales[0]=1;
    for (var i=1; i<40; i++) {
		this.scales.push(Math.ceil(1.15*this.scales[i-1]));
	}
	this.scale = 1;
	this.zoom = this.scales[this.scale];
	this.mouseIsDown=false;
	this.zoomEnabled = false;
	var _this = this;
	this.canvas.addEventListener("mousedown", function(e) {_this.mouseDown(e)}, false);
	this.canvas.addEventListener("mouseup", function(e) {_this.mouseUp(e)}, false);
	this.canvas.addEventListener("mouseleave", function(e) {_this.mouseLeave(e)}, false);
	this.canvas.addEventListener("mousemove", function(e) {_this.mouseMove(e)}, false);
	window.onmousewheel = document.onmousewheel = function(e) {_this.mouseWheel(e)};
	var that = this;
}

CarteHall.prototype.add = function(o) {
	this.objects.push(o);
	return o;
}

CarteHall.prototype.computeOptimalZoom = function() {

}

CarteHall.prototype.recomputeCanvasPosition = function() {
	var obj = this.canvas;
	var pos = $(this.canvas).position();
	this.canvas_position_x = pos.left;
	this.canvas_position_y = pos.top;
    this.screenRect.x = 0;
    this.screenRect.y = 0;
    this.screenRect.w = this.canvas.clientWidth;
    this.screenRect.h = this.canvas.clientHeight;
    this.originX = (this.screenRect.w/2)/this.zoom;
    this.originY = (this.screenRect.h/2)/this.zoom;
    this.zoomChangedSinceLastRedraw = false;
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
}

CarteHall.prototype.drawGrid = function() {
	var x0 = this.zoom*(this.originX);
    var y0 = this.zoom*(this.originY);
    var w = this.screenRect.w;
    var h = this.screenRect.h;
	if (this.zoom>5) {
		this.context.strokeStyle="#CDCDCD";
		for (var x=(x0%this.zoom); x<w; x+=this.zoom) {
			drawThinVerticalLine(this.context, x, 0, h);
		}
		for (var y=(y0%this.zoom); y<h; y+=this.zoom) {
			drawThinHorizontalLine(this.context, 0, w, y);
		}
	}
	this.context.strokeStyle="#787878";
	drawThinHorizontalLine(this.context, 0, w, y0);
	drawThinVerticalLine(this.context, x0, 0, h);
}

CarteHall.prototype.redraw = function() {
    if (this.drawInProgress) {
        this.redrawStacked = true;
        return;
    }
    this.redrawStacked = false;
    try {
        this.drawInProgress = true;
        this.context.fillStyle='white';//"#e5decb";
        this.context.fillRect(0, 0, this.screenRect.w, this.screenRect.h);
        var n=this.objects.length;
        this.drawGrid();
        for (var i=0; i<n; i++) {
			var o = this.objects[i];
			o.computeScreenRect(this);
			//if (Rect_intersect(o.screenRect, this.screenRect)) {
				o.draw(this);
			//}
		}
        
    } finally {
        this.drawInProgress = false;
    }
    if (this.redrawStacked) {
        setTimeout(this.redraw, 40); 
    }
}
CarteHall.prototype.mouseWheel = function(e) {
	if (this.mouseIsDown || !this.zoomIsEnabled) return;
	var delta = 0;
	if (!e) e=window.e;
	if (e.wheelDelta) {
		delta = e.wheelDelta / 120;
	} else if (e.detail) {
		delta = -e.detail / 3;
	}
	var oldZoom = this.zoom;
	if (delta>0 && this.scale<this.scales.length-1) {
		this.zoom = this.scales[++this.scale];
	} else if (this.scale>0){
		this.zoom = this.scales[--this.scale];
	}
	var zr = (1/this.zoom-1/oldZoom);
	this.zoomChangedSinceLastRedraw = true;
	this.originX += (e.pageX-this.canvas_position_x)*zr;
	this.originY += (e.pageY-this.canvas_position_y)*zr;
	this.redraw();
}
CarteHall.prototype.mouseDown = function(e) {
	this.mouseIsDown = true;
	this.dragStartPageX = e.pageX;
	this.dragStartPageY = e.pageY;
	this.dragStartOriginX = this.originX;
	this.dragStartOriginY = this.originY;
	this.zoomChangedSinceLastRedraw = true;
	this.redraw();
}
CarteHall.prototype.mouseUp = function(e) {
	this.mouseIsDown = false;
	if (this.onClick) {
		var x = Math.floor((e.pageX-this.canvas_position_x)/this.zoom-this.originX);
		var y = Math.floor(this.originY-(e.pageY-this.canvas_position_y)/this.zoom);
		this.onClick(x, y);
	}
}

CarteHall.prototype.mouseLeave = function(e) {
	this.mouseIsDown = false;
	this.redraw();
}

CarteHall.prototype.mouseMove = function(e) {
	var x = Math.floor((e.pageX-this.canvas_position_x)/this.zoom-this.originX);
	var y = Math.floor(this.originY-(e.pageY-this.canvas_position_y)/this.zoom);
	this.posmarkdiv.innerHTML='X='+x+' &nbsp; Y='+y;
	if (!this.mouseIsDown) return;
	var dx = (e.pageX-this.dragStartPageX)/this.zoom;
	var dy = (e.pageY-this.dragStartPageY)/this.zoom;
	this.originX = this.dragStartOriginX + dx;
	this.originY = this.dragStartOriginY + dy;
	this.redraw();
}


CarteHall.prototype.naturalToScreen = function(naturalPoint, screenPoint) {
    screenPoint.x = this.zoom*(this.originX+naturalPoint.x+0.5);
    screenPoint.y = this.zoom*(this.originY-naturalPoint.y+0.5);
};

CarteHall.prototype.screenToNatural = function(screenPoint, naturalPoint) {
    naturalPoint.x = screenPoint.x/this.zoom - this.originX;    
    naturalPoint.y = screenPoint.y/this.zoom - this.originY;
};

CarteHall.prototype.screenRectToNaturalRect = function(screenRect, naturalRect) {
    naturalRect.x = screenRect.x/this.zoom - this.originX;    
    naturalRect.y = screenRect.y/this.zoom - this.originY;
    naturalRect.w = screenRect.w/this.zoom;
    naturalRect.h = screenRect.h/this.zoom;
};

CarteHall.prototype.naturalRectToScreenRect = function(naturalRect, screenRect) {
    screenRect.x = this.zoom*(this.originX+naturalRect.x);
    screenRect.y = this.zoom*(this.originY-naturalRect.y);
    screenRect.w = this.zoom*naturalRect.w;
    screenRect.h = this.zoom*naturalRect.h;
};
