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
			console.log("WRITE");
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
	}

	function init(){
		var request = indexedDB.open("chrall", 2);
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
			if (db.objectStoreNames.contains("troll")) {
				db.deleteObjectStore("troll");
			}
			var trollstore = db.createObjectStore("troll", { keyPath:"num" });
			trollstore.createIndex("team", "team", { unique:false });
		}
		request.onerror = onerror;		
	}

	init();

})();
