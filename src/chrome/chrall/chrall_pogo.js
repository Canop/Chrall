// ce fichier sera supprimé en fin de pogo

var pogoTrolls = null;
var pogoTeamLabels = {
	'H': 'Hall’hyene',
	'P': 'Preux d’Hator'
};

// renvoie 'H', 'P' ou null
function getPogoTeam(numTroll) {
	if (!pogoTrolls) {
		pogoTrolls = {
			57760: 'P',
			85216: 'H',
			105317: 'P',
			105245: 'H',
			92236: 'H'
		};
	}
	return pogoTrolls[numTroll];
}
