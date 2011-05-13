
var emMonsterMonths = [
	"Phoenix",
	"Mouche",
	"Dindon",
	"Goblin",
	"Demon",
	"Limace",
	"Rat",
	"Hydre",
	"Ver",
	"Fungus",
	"Vouivre",
	"Gnu",
	"Scarabée"
];

var emCompos = [
	["Abishaii Noir","Serre d'un","Griffe du Sorcier"],
	["Abishaii Rouge","Aile d'un","Vision Lointaine"],
	["Abishaii Vert","œil d'un","Vision Accrue"],
	["Ankheg","Carapace d'un","Armure Ethérée"],
	["Araignée Géante","Mandibule d'une","Griffe du Sorcier"],
	["Banshee","Peau d'une","Bulle Anti-Magie"],
	["Barghest","Bave d'un","Explosion"],
	["Basilisk","œil d'un ","Analyse Anatomique"],
	["Boggart","Main d'un","Téléportation"],
	["Chimère","Sang d'une","Explosion"],
	["Diablotin","Cœur d'un","Explosion"],
	["Djinn","Tête d'un","Projection"],
	["Effrit","Cervelle d'un","Bulle Magique"],
	["Erinyes","Plume d'une","Augmentation de l'Esquive"],
	["Essaim Sanguinaire","Pattes d'un","Bulle Magique"],
	["Fungus Géant","Spore d'un","Vision Lointaine"],
	["Géant des Gouffres","Cervelle d'un","Flash Aveuglant"],
	["Gorgone","Chevelure d'une","Flash Aveuglant"],
	["Gritche","Epine d'un","Invisibilité"],
	["Grylle","Gueule d'un","Glue"],
	["Limace Géante","Mucus d'une","Glue"],
	["Loup-Garou","Bras d'un","Augmentation de l'Attaque"],
	["Manticore","Patte d'une","Augmentation des Dégâts"],
	["Marilith","Ecaille d'une","Vue Troublée"],
	["Naga","Ecaille d'un","Vue Troublée"],
	["Nécrochore","Os d'un","Téléportation"],
	["Nécrophage","Tête d'un","Faiblesse Passagère"],
	["Nuage d'Insectes","Chitine d'un","Invisibilité"],
	["Palefroi Infernal","Sabot d'un","Augmentation de l'Esquive"],
	["Phoenix","œil d'un","Voir le Caché"],
	["Plante Carnivore","Racine d'une","Télékinésie"],
	["Rocketeux","Tripes d'un","Armure Ethérée"],
	["Sagouin","Patte d'un","Bulle Magique"],
	["Shai","Tripes d'un","Voir le Caché"],
	["Sorcière","Verrue d'une","Sacrifice"],
	["Succube","Téton Aguicheur d'une","Téléportation"],
	["Tertre Errant","Cervelle d'un","Télékinésie"],
	["Titan","Griffe d'un","Augmentation de l'Attaque"],
	["Trancheur","Griffe d'un","Augmentation des Dégâts"],
	["Vampire","Canine d'un","Faiblesse Passagère"],
	["Vouivre","Venin d'une","Griffe du Sorcier"],
	["Yéti","Jambe d'un","Projection"],
	["Yuan-ti","Cervelle d'un","Invisibilité"],
	["Zombie","Cervelle Putréfiée d'un","Voir le Caché"]
];

function getEmMonsterDecoration(monsterName) { // attention : on peut recevoir le nom urlencodé
	var emn = " "+monsterName.replace('%20', ' ')+" ";
	for (var i=0; i<emMonsterMonths.length; i++) {
		if (~emn.indexOf(" "+emMonsterMonths[i]+" ")) {
			return "<br>Ce monstre peut lâcher un composant variable pour EM.";
		}
	}
	for (var i=0; i<emCompos.length; i++) {
		if (~emn.indexOf(" "+emCompos[i][0]+" ")) {
			return "<br>Compo EM : " + emCompos[i][1] + " " + emCompos[i][0] + " pour <i>" + emCompos[i][2] + "</i>.";
		}
	}
	return '';
}
