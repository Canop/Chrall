function grid_changeDisplayByName(key, display, transient) {
	var os = document.getElementsByName(key);
	if (!display) { // mode d'inversion d'un objet unique, non persistent
		for (var i = 0; i < os.length; i++) {
			if (os[i].style.display == 'inline') {
				os[i].style.display = 'none';
			}
			else {
				os[i].style.display = 'inline';
			}
		}
	} else { // mode d'inversion de filtre global, persistent
		for (var i = 0; i < os.length; i++) {
			os[i].style.display = display;
		}
		if (!transient) {
			localStorage['grid_filter_' + key] = display;
		}
	}
}
