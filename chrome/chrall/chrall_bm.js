"use strict";
(function(chrall){

	/**
	 * convertit une chaine du genre "ATT : +0\-5 | ESQ : -6 | Fatigue : +15 | Vision Accrue : -80 %" en une map
	 */
	function parseEffects(s){
		var map = {};
		s.split(' | ').forEach(function (bm) {
			var effect = bm.split(' : ');
			if (effect.length !== 2) {
				console.warn('invalid bm:', bm);
			} else {
				map[effect[0]] = effect[1].split('\\').map(function (v) {
					return parseInt(v);
				}).filter(function (v) {
					return v !== 0;
				})[0];
			}
		});
		return map;
	}

	/**
	 * représente en gros une ligne dans le tableau standard des bonus malus
	 */
	function BmEffect(name, theoricalEffectsAsString, decumul, type, durationAsString){
		this.name = name;
		this.thEffects = parseEffects(theoricalEffectsAsString);
		this.decumul = decumul;
		this.type = type;
		this.duration = parseInt(chrall.tokenize(durationAsString)[0]);
	}

	function CharBmEffect(name){
		this.sum = {
			Physique: 0,
			Magique: 0
		};
		this.count = {
			Physique: 0,
			Magique: 0
		};
		this.name = name;
	}

	CharBmEffect.prototype.add = function(type, value, hasDecumul){
		this.sum[type] += (hasDecumul) ? chrall.decumul(this.count[type], value) : value;
		this.count[type]++;
	};

	CharBmEffect.prototype.str = function(){
		var sum = chrall.itoa((this.sum['Physique'] || 0) + (this.sum['Magique'] || 0));
		switch(this.name){
			case 'TOUR':
				return sum + ' min';
			case 'PVMax':
			case 'Fatigue':
			case 'Vue':
			case 'PV':
				return sum;
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Armure':
				return `${chrall.itoa(this.sum['Physique'])}\\${chrall.itoa(this.sum['Magique'])}`;
			default:
				return sum + ' %';
		}
	};

	function createBmEffect(tr){
		var cells = $(tr).find('td'),
			isActive = cells.closest('table').attr('id') === 'bmm';

		return new BmEffect(
			cells.eq(0).text().trim(),
			cells.eq(2).text().trim(),
			isActive ? cells.eq(3).html().indexOf('bullet_red.jpg') >= 0 : false, // marqueur du décumul (false pour bm non actifs)
			cells.eq(isActive ? 4 : 3).text().trim(),
			cells.eq(isActive ? 5 : 4).text().trim()
		);
	}

	chrall.analyseAndReformatBM = function(){
		var effects = $('#bmm').add($('#ibmm')).find('tr.mh_tdpage').map(function(){
			return createBmEffect(this);
		}).get();
		const NB_TURNS_MAX = 20;
		var lines = [];
		var name, turn, i;
		for (turn = 0; turn < NB_TURNS_MAX; turn++) {
			// bm contient pour chaque nom (exemple : "Armure")
			// le compte et les valeurs d'effets séparés par type ('Physique' ou 'Magique')
			var	bm = {},
				nb = 0;
			for (i in effects) {
				var e = effects[i];
				if (turn <= e.duration) {
					nb++;
					for (name in e.thEffects) {
						if (!bm[name]) {
							bm[name] = new CharBmEffect(name);
						}
						bm[name].add(e.type, e.thEffects[name], e.decumul);
					}
				}
			}
			if (nb == 0) {
				break;
			}
			var line = [];
			for (name in bm) {
				line.push(name + " : " + bm[name].str());
			}
			lines.push(line.join(' | '));
		}
		if (lines.length > 0) {
			var nbIdenticalLines = 0;
			if (lines.length == NB_TURNS_MAX) {
				for (i = NB_TURNS_MAX - 1; i-- > 0;) {
					if (lines[i] == lines[i + 1]) {
						nbIdenticalLines++;
					} else {
						break;
					}
				}
			}
			var html = "";
			html += '<br><table border="0" cellspacing="1" cellpadding="5" align="center" class="mh_tdborder" style="margin-top:10px;">';
			html += '<tr><td align="center" class="mh_tdtitre">DLA</td><td align="center" class="mh_tdtitre">Effet total</td></tr>';
			for (turn = 0; turn < lines.length - nbIdenticalLines; turn++) {
				html += "<tr class=mh_tdpage><td align=center>";
				if (nbIdenticalLines > 0 && turn == lines.length - nbIdenticalLines - 1) {
					if (turn == 0) {
						html += "En cours et suivantes";
					} else {
						html += "Suivantes";
					}
				} else {
					html += chrall.turnName(turn);
				}
				html += "</td><td>";
				html += lines[turn];
				html += "</td></tr>";
			}
			html += "</table>";
			$('#footer1').before(html);
		}
	}

})(window.chrall = window.chrall || {});



