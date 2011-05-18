/**
 * convertit une chaine du genre "ATT : +3 DEG : -9 en une map 
 */ 
function parseEffects(s) {
	var map = new Object();
	var tokens = Chrall_tokenize(s);
	for (var i=0; i<tokens.length;i++) console.log(" i="+i+" token="+tokens[i]);
	for (var i=0; i<tokens.length-1;) {
		var name = tokens[i++].trim();
		if (name=='%') name = tokens[i++].trim();
		var value = parseInt(tokens[i++]);
		console.log(name);
		console.log(value);
		if ((name.length>0) && value)	map[name] = value;
	}
	console.log(map);
	return map;
}

/**
 * représente en gros une ligne dans le tableau standard des bonus malus
 */
function BmEffect(name, theoricalEffectsAsString, decumul, type, durationAsString) {
	this.name = name;
	this.thEffects = parseEffects(theoricalEffectsAsString);
	this.decumul = decumul;
	this.type = type;
	this.duration = parseInt(Chrall_tokenize(durationAsString)[0]);
}

function CharBmEffect(type, value) {
	this.sum = new Object();
	this.count = new Object();
	this.sum[type] = value;
	this.count[type] = 1;
}
CharBmEffect.prototype.add = function(type, value, hasDecumul) {
	if (this.count[type]) {
		if (hasDecumul) {
			this.sum[type] += decumul(this.count[type]++, value);
		} else {
			this.sum[type] += value;
			this.count[type]++
		}
	} else {
		this.sum[type] = value;
		this.count[type] = 1;	
	}
}
CharBmEffect.prototype.str = function() {
	return itoa(this.sum['Physique']) + "/" + itoa(this.sum['Magie']);
}
CharBmEffect.prototype.strMag = function() {
	var v = 0;
	if (this.sum['Physique']) v+=this.sum['Physique'];
	if (this.sum['Magie']) v+=this.sum['Magie'];
	return v+" %";
}

function Chrall_analyseAndReformatBM() {
	var effects = new Array();
	$('table table table.mh_tdborder tr.mh_tdpage').each(function() {
		var cells = $(this).find("td");
		//for (var i=0; i<cells.length;i++) console.log(" i="+i+" cell="+$(cells[i]).text());
		effects.push(new BmEffect(
			$(cells[0]).text().trim(),
			$(cells[2]).text().trim(),
			$(cells[3]).html().indexOf('bullet_red.jpg')>=0, // marqueur du décumul
			$(cells[4]).text().trim(),
			$(cells[5]).text().trim()
		));
	});
	const NB_TURNS_MAX = 20;
	var lines = new Array();
	for (var turn=0; turn<NB_TURNS_MAX; turn++) {
		var bm = new Object(); // contient pour chaque nom (exemple : "Armure") le compte et les valeurs d'effets séparés par type ('Physique' ou 'Magie')
		var nb = 0;
		for (var i in effects) {
			var e = effects[i];
			if (turn <= e.duration) {
				nb++;
				for (var name in e.thEffects) {
					if (bm[name]) {
						bm[name].add(e.type, e.thEffects[name], e.decumul);
					} else {
						bm[name] = new CharBmEffect(e.type, e.thEffects[name]);
					}
				}
			}
		}
		if (nb==0) break;
		var line = "";
		for (var name in bm) {
			if (line.length>0) line += " | ";
			line += name + " : " + ((name=='MM'||name=='RM') ? bm[name].strMag() : bm[name].str());
		}
		lines.push(line);
	}
	if (lines.length>0) {
		var nbIdenticalLines = 0;
		if (lines.length==NB_TURNS_MAX) {
			for (var i=NB_TURNS_MAX-1; i-->0;) {
				if (lines[i]==lines[i+1]) nbIdenticalLines++;
				else break;
			}
		}
		var html = "";
		html += '<br><table border="0" cellspacing="1" cellpadding="5" align="center" class="mh_tdborder">';
		html += '<tr><td align="center" class=mh_tdtitre>DLA</td><td class=mh_tdtitre>Effet total</td></tr>';
		for (var turn=0; turn<lines.length-nbIdenticalLines; turn++) {
			html += "<tr class=mh_tdpage><td align=center>";
			if (nbIdenticalLines>0 && turn==lines.length-nbIdenticalLines-1) {
				if (turn==0) {
					html += "En cours et suivantes";
				} else {
					html += "Suivantes";
				}
			} else {
				html += turnName(turn);
			}
			html += "</td><td>";
			html += lines[turn];
			html += "</td></tr>";
		}
		html += "</table>";
		$(html).appendTo($('form[name="ActionForm"]'));
	}
}
