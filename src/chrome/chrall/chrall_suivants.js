
// enrichit la page des ordres d'un suivant
function Chrall_handleFollowerOrders() {
	var html = '';
	html += '<center><br><canvas id=cartehall style="width:400px;height:400px;"></canvas><div id=posmark style="z-index:10;position:fixed;bottom:30;left:40;">pos</div></center>';
	$(html).appendTo($('form[name="form1"]'));
	var ch = new CarteHall("cartehall", "posmark");
	//~ ch.add((new Chemin(new Point(58, 98))).add(new Point(30, 50)).add(new Point(30, 10)));
	//~ ch.add((new Chemin(new Point(-21, -11))).add(new Point(-32, 17)).add(new Point(-39, 18)));
	ajouteTrous(ch);
	//~ ch.add(new ChGowap(-21, -11, -14, "Gowapwapwapbiddouwap"));
	//~ ch.add(new ChTroll(20, 14, -50, "blue", "Taipatrol S55", 6));
	//~ ch.add(new ChTroll(-30, 0, -12, "blue", "Propofol T48", 34));
	//~ ch.add(new ChGowap(58, 98, -54, "Ma'Gowap"));
	//~ ch.add(new ChTroll(10, 10, -20, "green", "Vous êtes ici", 9));
	ch.recomputeCanvasPosition();
	ch.redraw();
}
