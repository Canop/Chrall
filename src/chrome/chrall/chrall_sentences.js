/*
Un délire...

Ce fichier disparaitra probablement avant la release officielle...

*/

function SentenceHolder(sentence) {
	this.sentence = sentence;
	this.tags = new Array();
}
var sentenceHolders = new Array();

function Chrall_addSentence(sentence, tags) {
	var sh = new SentenceHolder(sentence);
	for (var i=1;  i<arguments.length; i++) sh.tags.push(arguments[i]);
	sentenceHolders.push(sh);
}

function Chrall_initSentences() {
	Chrall_addSentence("Quel malheur !", "nok");
	Chrall_addSentence("Sapristi !", "nok");
	Chrall_addSentence("Pas bon... pas bon...", "nok");
	Chrall_addSentence("Pas glop !", "nok");
	Chrall_addSentence("Fichtre !", "nok");
	Chrall_addSentence(" :( ", "nok");
	Chrall_addSentence(" ... ", "nok");
	Chrall_addSentence("frappeur décérébré", "Kastar", "synonyme");
	Chrall_addSentence("boulet", "Tom", "synonyme");
	Chrall_addSentence("Tominet", "Tom", "synonyme");
	Chrall_addSentence("Skrimounet", "Skrim", "synonyme");
	Chrall_addSentence("Krétinus Brutalis", "Kastar", "synonyme");
	Chrall_addSentence("Kastor", "Kastar", "synonyme");
	Chrall_addSentence("escrimeur", "Skrim", "synonyme");
	Chrall_addSentence("danseur", "Skrim", "synonyme");
	Chrall_addSentence("encaisseur", "Durakuir", "synonyme");
	Chrall_addSentence("imbouffable", "Durakuir", "synonyme");
	Chrall_addSentence("rocher", "Durakuir", "synonyme");
	Chrall_addSentence("... D'un autre côté votre compétence de race, elle, elle n'a pas de malus :)", "pas d'AM");
	Chrall_addSentence("Suggestion : réincarnation !", "pas d'AM");
	Chrall_addSentence("Pfffff.... quelle idée de pas avoir AM !", "pas d'AM");
	Chrall_addSentence("C'est pas cool, hein...", "pas d'AM");
	Chrall_addSentence("De toutes façons l'AM c'est très surfait, hein...", "pas d'AM");
	Chrall_addSentence("C'est la vie...", "pas d'AM");
	Chrall_addSentence("... Bah, les kastars ils sont moins beaux que vous...", "pas d'AM");
	Chrall_addSentence("Vérifiez mais je crois que vous n'avez pas la compétence nécessaire.", "pas d'AM");
	Chrall_addSentence("Combien de PI pour apprendre AM ?", "pas d'AM");
	Chrall_addSentence("La prochaine fois que vous choisirez une race, vous irez faire un tour sur le forum avant...", "pas d'AM");
}

function Chrall_getSentence(tags) {
	if (sentenceHolders.length==0) Chrall_initSentences();
	var sb = Math.floor(Math.random()*sentenceHolders.length);
	for (var sc=sentenceHolders.length; sc-->0;) {
		var sh = sentenceHolders[(sb+sc*23)%sentenceHolders.length]; // vérifier que la liste ne soit pas de longueur multiple de 23
		var ok = true;
		for (var rti=0; rti<arguments.length; rti++) {
			if (sh.tags.indexOf(arguments[rti])<0) {
				ok = false;
				break;
			}
		}
		if (ok) return sh.sentence;
	}
	return "rien à déclarer";
}




