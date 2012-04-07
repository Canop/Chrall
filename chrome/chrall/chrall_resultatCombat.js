
// notons que le code qui suit est super sensible, il pêtera à la moindre modif (genre nettoyage) du html généré par MH
function Chrall_analyseResultatCombat() {
	if (!chrall.compteChrallActif()) return;
	var text = $('body').text();
	var lines = text.split('\n');
	
	var result = {};
	for (var i=lines.length; i-->0;) {
		var line = lines[i];
		if (line.indexOf("Résultat du Combat :")==0) {
			result.Type = line.substring("Résultat du Combat :".length, line.length);
		} else if (line.indexOf("Vous avez attaqué")==0) { // quasiment tout est sur cette ligne, faut faire des acrobaties...
			result.TypeCible = line.indexOf("le Trõll")>0 ? 'troll' : 'monstre';
			var i0 = line.indexOf("(");
			var i1 = line.indexOf(")");
			if (i1>i0 && i0>0) {
				result.NumCible = parseInt(line.substring(i0+1, i1));
			}
			i0 = line.indexOf("Vous avez donc");
			result.Esquive = parseInt(line.substring(i0-3, i0).trim());
			i0 = line.indexOf("points de dégâts.");
			var d = parseInt(line.substring(i0-4, i0).trim());
			if (d && !isNaN(d)) result.Degats = d;
			i0 = line.indexOf("points de vie.");
			if (i0>0) {
				var pv = parseInt(line.substring(i0-4, i0).trim());
				if (pv && !isNaN(pv)) result.PV = pv;
			}
		} else if (line.indexOf("Page générée")>0) {
			var t = Chrall_tokenize(line);	
			var d = new Date(atoi(t[2]), atoi(t[1])-1, atoi(t[0]), atoi(t[3]), atoi(t[4]), atoi(t[5]));
			result.Date = d.getTime()/1000;
		}
	}	
	result.Succes = text.indexOf("TOUCHÉ")>0;
	chrall.sendToChrallServer(
		"combat",
		{"Action":result}
	);
}


function testeFauxResultatCombat() {
	var result = {};
	result.Type="Coup de Boule";
	result.TypeCible='monstre';
	result.NumCible=666;
	result.Esquive=44;
	result.Degats=100;
	result.PV=89;
	result.Succes = true;
	chrall.sendToChrallServer(
		"combat", {"Action":result}
	);
}

