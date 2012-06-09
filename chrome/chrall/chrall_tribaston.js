// ce fichier sera supprimé en fin de Tribaston

var TribastonTrolls = {
	56722: 'B',
	16950: 'B',
	32807: 'B',
	35464: 'B',
	80874: 'B',
	52039: 'B',
	58141: 'R',
	68029: 'R',
	80426: 'R',
	75273: 'R',
	67252: 'R',
	62064: 'R',
	74131: 'G',
	74241: 'G',
	13354: 'G',
	71497: 'G',
	69118: 'G',
	76089: 'G'
};

var TribastonTeamLabels = {
	'B': 'Blue',
	'G': 'Green',
	'R': 'Red'
};

// renvoie 'B', 'R', 'G' ou undefined
function getTribastonTeam(numTroll) {
	return TribastonTrolls[numTroll];
}
