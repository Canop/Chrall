function Chrall_notify(options) {

	var delay = options['delay'] ? options['delay'] : 4000;

	// besoin d'un div où placer les notifications
	if (!$("#chrall_notify_wrapper").length) {
		$("html").prepend("<div id='chrall_notify_wrapper'></div>");
	}

	var notificationId = "notification_" + new Date().getTime();
	var icon_html = options['icon'] ? '<span class="icon"><img src="' + (options['icon']) + '" /></span>' : '';

	// Injection de la notif (au dessus des autres éventuelles)
	$("#chrall_notify_wrapper").prepend('<div class="chrall_notify" id="' + notificationId + '" style="display:none">' + icon_html + options["text"] + '</div>');

	// Affichage
	$("div#" + notificationId).slideDown("fast").delay(delay).slideUp("fast", function() {$(this).remove()});
}
