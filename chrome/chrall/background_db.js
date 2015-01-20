// bgchrall.cdb : base de données persistante dans le browser
// partagée entre les domaines, accessible par messaging depuis
// les content scripts
var bgchrall = bgchrall || {};
(function(){
	var	db, cdb = bgchrall.cdb = {};
		
	// construit l'objet public CDB
	function wrapIdb(){
		// change the team of the troll, add it if necessary
		cdb.uspsertTroll = function(num, team, cb){
			console.log("WRITE");
			var	trans = db.transaction(["troll"], "readwrite"),
				s = trans.objectStore("troll");
			trans.oncomplete = cb;
			s.get(num).onsuccess = function(e){
				var troll = e.target.result || {num:+num};
				troll.team = team;
				s.put(troll);
			}
		}
		// clear all troll infos then add the trolls and their teams
		// trolls is an array of {num:1234,team:'R'}
		cdb.setTrolls = function(trolls, cb){
			var	trans = db.transaction(["troll"], "readwrite"),
				s = trans.objectStore("troll");
			trans.oncomplete = cb;
			s.clear();
			trolls.forEach(function(troll){
				s.add({num:+troll.num, team:troll.team});
			});
		}
		cdb.getTroll = function(num, cb){
			db.transaction(["troll"]).objectStore("troll").get(num).onsuccess = function(e){
				cb(e.target.result);
			}
		}
		cdb.getTrolls = function(cb){
			var trolls = [];
			db.transaction(["troll"]).objectStore("troll").openCursor().onsuccess = function(e){
				var cursor = e.target.result;
				if (cursor) {
					trolls.push(cursor.value);
					cursor.continue();
				} else {
					console.log("will send trolls:", trolls);
					cb(trolls);
				}
			}
		}
		// clear all cell infos then add the cells and their teams
		// cells is an array of {pos:"-54,22",team:'R'} ou {pos:"-8,-3,-33",team:'R'} 
		cdb.setCells = function(cells, cb){
			console.log("WRITE CELLS");
			var	trans = db.transaction(["cell"], "readwrite"),
				s = trans.objectStore("cell");
			trans.oncomplete = cb;
			s.clear();
			cells.forEach(function(cell){
				s.add({pos:cell.pos, team:cell.team});
			});
		}
		cdb.getCell = function(pos, cb){
			db.transaction(["cell"]).objectStore("cell").get(pos).onsuccess = function(e){
				cb(e.target.result);
			}
		}
	}

	function init(){
		var request = indexedDB.open("chrall", 4);
		request.onsuccess = function(e){
			db = e.target.result;
			db.onerror = function(e){
				console.log("Erreur BD locale Chrall :", e);
			}
			wrapIdb();
			console.log("Chrall DB OK");
		}
		request.onupgradeneeded = function(e){
			var db = e.target.result;
			e.target.transaction.onerror = onerror;
			if (e.oldVersion < 2) {
				if (db.objectStoreNames.contains("troll")) {
					db.deleteObjectStore("troll");
				}
				var trollstore = db.createObjectStore("troll", { keyPath:"num" });
				trollstore.createIndex("team", "team", { unique:false });
			}
			if (e.oldVersion < 4) {
				if (db.objectStoreNames.contains("cell")) {
					db.deleteObjectStore("cell");
				}
				var cellstore = db.createObjectStore("cell", { keyPath:"pos" });
				cellstore.createIndex("team", "team", { unique:false });
			}
		}
		request.onerror = onerror;		
	}

	init();

})();
