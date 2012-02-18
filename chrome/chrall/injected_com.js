
function formatDuration(seconds) {
	if (seconds==0) return "";
	var h = Math.floor(seconds/(3600));
	seconds -= h*(3600);
	var m = Math.floor(seconds/(60));
	return h+(m<10?"h0":"h")+m;
}

function formatDate(timestamp) {
	if (timestamp==0) return "";
	var d = new Date(timestamp);
	return d.getDate()+"/"+(d.getMonth()<9?("0"+(d.getMonth()+1)):(d.getMonth()+1))+" "+d.getHours()+"h"+(d.getMinutes()<10?("0"+d.getMinutes()):d.getMinutes());
}

function receiveFromChrallServer(message) {
	console.log("Message entrant :");
	console.log(message);
	if (message.Error.length>0) {
		localStorage["com.status.message"]="Compte en erreur ou problème authentification";
	} else {
		localStorage["com.status.message"]=message.Text;
	}
	var span_resultat_maj_vue = document.getElementById("resultat_maj_vue");
	if (message.MiPartages && message.MiPartages.length>0 && typeof(updateTablesPartage)=="function") updateTablesPartage(message.MiPartages);
	if (message.TextMajVue && span_resultat_maj_vue) span_resultat_maj_vue.innerHTML = message.TextMajVue;
	if (message.Actions && message.Actions.length>0 && typeof(addActionsToMonsterEvents)=="function") addActionsToMonsterEvents(message.Actions);
	var com_status_message_span = document.getElementById("com_status_message");
	if (com_status_message_span) com_status_message_span.innerHTML = localStorage["com.status.message"];
}
