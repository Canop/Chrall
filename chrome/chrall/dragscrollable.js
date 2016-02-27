"use strict";
/*
 * jQuery dragscrollable Plugin
 * version: 1.0 (25-Jun-2009) MODIFIEE
 * Copyright (c) 2009 Miquel Herrera
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 *
 * ATTENTION : CETTE VERSION A ETE SALEMENT MODIFIEE PAR CANOPEE POUR CHRALL - allez chercher la version
 *  originale pour vos besoins (Googlez "jQuery dragscrollable") !
 *
 */

var chrall = chrall || {};
chrall.scrollInProgress = false; // addition Canop

/**
 * Adds the ability to manage elements scroll by dragging
 * one or more of its descendant elements. Options parameter
 * allow to specifically select which inner elements will
 * respond to the drag events.
 *
 * options properties:
 * ------------------------------------------------------------------------
 *  dragSelector         | jquery selector to apply to each wrapped element
 *                       | to find which will be the dragging elements.
 *                       | Defaults to '>:first' which is the first child of
 *                       | scrollable element
 * ------------------------------------------------------------------------
 *  preventDefault       | Prevents the event to propagate further effectivey
 *                       | dissabling other default actions. Defaults to true
 * ------------------------------------------------------------------------
 *
 *  usage examples:
 *
 *  To add the scroll by drag to the element id=viewport when dragging its
 *  first child accepting any propagated events
 *	$('#viewport').dragscrollable();
 */

$.fn.dragscrollable = function( options ){

	var settings = $.extend({
		dragSelector:'>:first',
		preventDefault: true
	}, options || {});

	var dragscroll= {
		mouseDownHandler : function(event){
			chrall.scrollInProgress = true; // addition Canop
			chrall.hideOm(); // addition Canop

			// Initial coordinates will be the last when dragging
			event.data.lastCoord = {left: event.clientX, top: event.clientY};

			$.event.add( document, "mouseup", dragscroll.mouseUpHandler, event.data );
			$.event.add( document, "mousemove", dragscroll.mouseMoveHandler, event.data );
			if (event.data.preventDefault) {
				event.preventDefault();
				return false;
			}
		},
		mouseMoveHandler : function(event){ // User is dragging
			// How much did the mouse move?
			var delta = {
				left: (event.clientX - event.data.lastCoord.left),
				top: (event.clientY - event.data.lastCoord.top)
			};

			// Set the scroll position relative to what ever the scroll is now
			event.data.scrollable.scrollLeft(event.data.scrollable.scrollLeft() - delta.left);
			event.data.scrollable.scrollTop(event.data.scrollable.scrollTop() - delta.top);

			// Save where the cursor is
			event.data.lastCoord={left: event.clientX, top: event.clientY};
			if (event.data.preventDefault) {
				event.preventDefault();
				return false;
			}
		},
		mouseUpHandler : function(event){ // Stop scrolling
			chrall.scrollInProgress = false; // addition Canop
			$.event.remove( document, "mousemove", dragscroll.mouseMoveHandler);
			$.event.remove( document, "mouseup", dragscroll.mouseUpHandler);
			if (event.data.preventDefault) {
				event.preventDefault();
				return false;
			}
		}
	}

	// set up the initial events
	this.each(function(){
		// closure object data for each scrollable element
		var data = {scrollable : $(this), preventDefault : settings.preventDefault }
		// Set mouse initiating event on the desired descendant
		$(this).find(settings.dragSelector).bind('mousedown', data, dragscroll.mouseDownHandler);
	});
};

