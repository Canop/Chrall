"use strict";
/*
 * ce script lance les actions (les autres ne contiennent que des classes et des fonctions appelées depuis ici).
 * Il contient aussi les variables globales.
 */

var chrall = chrall || {};
chrall.playerAmAbstract = [];

// note : pour l'instant il faut que ces valeurs de départ soient cohérentes avec le css (display='block' ou display='none');
// Par ailleurs attention à un détail : les clés suivantes sont à la fois des clés dans le code et les labels dans l'ihm
chrall.viewFilters = {
	"trolls": true,
	"monstres": true,
	"gowaps": true,
	"lieux": true,
	"trésors": false,
	"champignons": false,
	"cénotaphes": false,
	"intangibles": true,
	"3D": true
};

console.info("pageName=[" + chrall.pageName() + "]");

if (!chrall.isOptionDisabled("form-memoize")) {
	chrall.restoreFormElements();
	chrall.listenOnFormElements();
}

switch (chrall.pageName()) {
case "PlayStart.php":
	chrall.analyseAndReformatStartPage();
	break;
case "Play_profil.php":
	chrall.initCommunications();
	chrall.analyseAndReformatProfile();
	break;
case "Play_vue.php":
	chrall.analyseAndReformatView();
	chrall.initCommunications('get_partages');
	chrall.bindCopy_tablePartages();
	break;
case "Play_BM.php":
	chrall.analyseAndReformatBM();
	break;
case "Play_equipement.php":
	chrall.sortEquipment();
	break;
case "Play_evenement.php":
	chrall.addBubblesToLinks();
	break;
case "Play_action.php": // c'est la frame en bas qui contient le menu d'action
	chrall.listenForChangeLocation('action');
	chrall.handleActionPage();
	break;
case "Play_option.php":
case "Play_o_Interface.php":
case "Play_o_css.php":
case "Play_o_Divers.php":
case "Play_o_Divers1.php":
case "Play_o_Divers2.php":
case "Play_o_MMC1.php":
	chrall.initCommunications('check_account');
	chrall.reformatOptionsView();
	break;
case "Play_a_Competence16.php": // préparation de CDM (le formulaire de choix du monstre)
	break;
case "Play_a_Competence16b.php": // résultat de cdm
	chrall.handleCdmPage();
	break;
case "Play_a_Competence18b.php": // résultat d'insulte
	chrall.analyseResultatInsulte();
	break;
case "Play_a_Competence18.php": // préparation d'insulte
	chrall.prepareInsulte();
	break;
case "Play_a_Competence29.php": // préparation de minage (le formulaire dans la frame d'action)
	chrall.handleBeforeMinage();
	break;
case "Play_a_Competence29b.php": // résultat de minage
	chrall.handleMinagePage();
	break;
case "Play.php": // c'est le frameset qui engloble tout
	chrall.preparePlayInputs();
	break;
case "Play_menu.php": // c'est la frame de gauche
	chrall.handleMenuPage();
	break;
case "Play2.php": // c'est le frameset qui engloble tout ce qui n'est pas la colonne menu de gauche
	break;
case "Play_a_Move.php":
	chrall.listenForChangeLocation('action');
	chrall.injectMove();
	break;
case "PJView.php":
	chrall.analyseAndReformatPJView();
	break;
case "PJView_Events.php":
	chrall.analysePJEventsView();
	chrall.addBubblesToLinks();
	break;
case "Play_news.php":
	chrall.addBubblesToLinks();
	break;
case "MonsterView.php":
	chrall.analyseAndReformatMonsterView();
	chrall.addInfosToMonsterEvents();
	chrall.addBubblesToLinks();
	break;
case "Play_a_Combat.php": //  résultat de combat
	chrall.analyseResultatCombat();
	break;
case "FO_Ordres.php":
	chrall.handleFollowerOrders();
	break;
case "FO_NewOrder.php":
	chrall.fillFollowerNewOrderForm();
	chrall.askDestinations();
	break;
case "Play_a_Sort13.php":
	// chrall.askDestinations(); supprimé car bug
	chrall.warnOnTp();
	break;
case "Guilde_Membres.php":
	chrall.addPartageLinkToAll();
	break;
case "MH_Messagerie.php":
	chrall.compactMessageTitle();
	break;
case "Mission_Liste.php":
	chrall.saveMissions();
	break;
case "Mission_Etape.php":
	chrall.addLinksAndUpdateMissions();
	break;
}

