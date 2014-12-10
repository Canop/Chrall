// facade de la base de données persistante dans le browser
//  (laquelle n'est pas en content script)

window.chrall = window.chrall || {};
(function (cdb) {
	
	// change the team of the troll, add it if necessary
	cdb.uspsertTroll = function(num, team, cb){
		chrome.runtime.sendMessage({cmd:"upsert troll", num:num, team:team}, cb);
	}

	// clear all troll infos then add the trolls and their teams
	// trolls is an array of {num:1234,team:'R'}
	cdb.setTrolls = function(trolls, cb){
		chrome.runtime.sendMessage({cmd:"set trolls", trolls:trolls}, cb);
	}

	// renvoie un troll trouvé par son numéro
	cdb.getTroll = function(num, cb){
		chrome.runtime.sendMessage({cmd:"get troll", num:num}, cb);
	}

	// renvoie un tableau de tous les trolls
	cdb.getTrolls = function(cb){
		chrome.runtime.sendMessage("get trolls", cb);
	}

})(window.chrall.cdb = {});
