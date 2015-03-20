// répond aux messages venant des content scripts


// les requetes sont de la forme {cmd:"someword", other data}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	//~ console.log("received request from content script:", request);
		
	var cdb = bgchrall.cdb, cmd = request.cmd || request;
	switch (cmd) {
	case "set trolls":
		cdb.setTrolls(request.trolls, function(){
			sendResponse("ok");
		});
		return true;
	case "set cells":
		cdb.setCells(request.cells, function(){
			sendResponse("ok");
		});
		return true;
	case "get trolls":
		cdb.getTrolls(sendResponse);
		return true;
	case "get troll":
		cdb.getTroll(request.num, sendResponse);
		return true;
	case "get cell":
		cdb.getCell(request.pos, sendResponse);
		return true;
	default:
		console.log("Command not understood:", request.cmd);
	}
});
