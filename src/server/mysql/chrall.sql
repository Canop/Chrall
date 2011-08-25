SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Base de données: `chrall`
--

-- --------------------------------------------------------

--
-- Structure de la table `action`
--

CREATE TABLE IF NOT EXISTS `action` (
  `date_action` int(11) NOT NULL,
  `type_action` varchar(200) character set utf8 collate utf8_unicode_ci NOT NULL,
  `auteur` int(11) NOT NULL,
  `type_cible` enum('troll','monstre') character set utf8 collate utf8_unicode_ci NOT NULL,
  `num_cible` int(11) NOT NULL,
  `succes` enum('oui','non') character set utf8 collate utf8_unicode_ci NOT NULL,
  `degats` int(11) NOT NULL,
  `pv` int(11) NOT NULL,
  `esquive` int(11) NOT NULL,
  KEY `type_action` (`type_action`,`auteur`,`type_cible`,`num_cible`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `appel_soap`
--

CREATE TABLE IF NOT EXISTS `appel_soap` (
  `troll` int(11) NOT NULL,
  `pour` int(11) NOT NULL,
  `date` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  KEY `troll` (`troll`,`pour`,`date`,`type`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `cdm`
--

CREATE TABLE IF NOT EXISTS `cdm` (
  `id` int(11) NOT NULL auto_increment,
  `origine` char(1) collate utf8_unicode_ci NOT NULL default 'U',
  `author` int(11) NOT NULL,
  `date_adition` int(11) NOT NULL,
  `num_monstre` int(11) NOT NULL,
  `nom` varchar(100) collate utf8_unicode_ci NOT NULL,
  `age` varchar(100) collate utf8_unicode_ci NOT NULL,
  `nom_complet` varchar(100) collate utf8_unicode_ci NOT NULL,
  `sha1` binary(20) NOT NULL,
  `niveau_min` int(11) NOT NULL,
  `niveau_max` int(11) NOT NULL,
  `capacite_text` varchar(255) collate utf8_unicode_ci default NULL,
  `points_de_vie_min` int(11) NOT NULL,
  `points_de_vie_max` int(11) NOT NULL,
  `des_attaque_min` int(11) NOT NULL,
  `des_attaque_max` int(11) NOT NULL,
  `des_esquive_min` int(11) NOT NULL,
  `des_esquive_max` int(11) NOT NULL,
  `des_degats_min` int(11) NOT NULL,
  `des_degats_max` int(11) NOT NULL,
  `des_regeneration_min` int(11) NOT NULL,
  `des_regeneration_max` int(11) NOT NULL,
  `armure_min` int(11) NOT NULL,
  `armure_max` int(11) NOT NULL,
  `vue_min` int(11) NOT NULL,
  `vue_max` int(11) NOT NULL,
  `maitrise_magique_min` int(11) NOT NULL,
  `maitrise_magique_max` int(11) NOT NULL,
  `resistance_magique_min` int(11) NOT NULL,
  `resistance_magique_max` int(11) NOT NULL,
  `famille_text` varchar(100) collate utf8_unicode_ci NOT NULL,
  `nombre_attaques` int(11) NOT NULL,
  `vitesse_deplacement_text` varchar(100) collate utf8_unicode_ci NOT NULL,
  `voir_le_cache_boolean` tinyint(4) NOT NULL,
  `attaque_a_distance_boolean` tinyint(4) NOT NULL,
  `dla_text` varchar(50) collate utf8_unicode_ci NOT NULL,
  `duree_tour_min` int(11) NOT NULL,
  `duree_tour_max` int(11) NOT NULL,
  `chargement_text` varchar(100) collate utf8_unicode_ci NOT NULL,
  `bonus_malus_text` varchar(255) collate utf8_unicode_ci NOT NULL,
  `portee_du_pouvoir_text` varchar(255) collate utf8_unicode_ci NOT NULL,
  `blessure` int(11) NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `sha1` (`sha1`),
  KEY `caracs1` (`niveau_min`,`niveau_max`,`des_attaque_min`,`des_attaque_max`,`des_esquive_min`,`des_esquive_max`,`des_degats_min`,`des_degats_max`,`des_regeneration_min`,`des_regeneration_max`,`armure_min`,`armure_max`,`vue_min`,`vue_max`),
  KEY `nom_complet` (`nom_complet`),
  KEY `famille_text` (`famille_text`),
  KEY `caracs2` (`maitrise_magique_min`,`maitrise_magique_max`,`resistance_magique_min`,`resistance_magique_max`,`nombre_attaques`,`voir_le_cache_boolean`,`attaque_a_distance_boolean`,`duree_tour_min`,`duree_tour_max`),
  KEY `author` (`author`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=5505 ;

-- --------------------------------------------------------

--
-- Structure de la table `compte`
--

CREATE TABLE IF NOT EXISTS `compte` (
  `id` int(11) NOT NULL,
  `statut` enum('ok','off','soap_error','bad_pwd') collate utf8_unicode_ci NOT NULL,
  `mdp_restreint` char(32) collate utf8_unicode_ci NOT NULL,
  `pv_max` int(11) NOT NULL,
  `pv_actuels` int(11) NOT NULL,
  `prochain_tour` int(16) NOT NULL,
  `duree_tour` int(11) NOT NULL,
  `pa` int(11) NOT NULL,
  `mise_a_jour` int(11) NOT NULL,
  `fatigue` int(11) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `z` int(11) NOT NULL,
  `vue` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `note`
--

CREATE TABLE IF NOT EXISTS `note` (
  `id` int(11) NOT NULL auto_increment,
  `auteur` int(11) NOT NULL,
  `id_sujet` int(11) NOT NULL,
  `x_sujet` int(11) NOT NULL,
  `y_sujet` int(11) NOT NULL,
  `z_sujet` int(11) NOT NULL,
  `alerte` enum('non','oui') collate utf8_unicode_ci NOT NULL,
  `partage` tinyint(4) NOT NULL,
  `date_changement` int(11) NOT NULL,
  `type_sujet` enum('rien','monstre','grotte','troll','guilde') collate utf8_unicode_ci NOT NULL,
  `contenu` varchar(255) collate utf8_unicode_ci NOT NULL,
  `diplo` enum('neutre','ami','ennemi') collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `auteur` (`auteur`,`id_sujet`,`x_sujet`,`y_sujet`,`z_sujet`,`alerte`,`partage`,`date_changement`,`type_sujet`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=6 ;

-- --------------------------------------------------------

--
-- Structure de la table `observation`
--

CREATE TABLE IF NOT EXISTS `observation` (
  `auteur` int(11) NOT NULL,
  `num` int(11) NOT NULL,
  `date` int(11) NOT NULL,
  `type` enum('troll','monstre','lieu','tresor') collate utf8_unicode_ci NOT NULL,
  `nom` varchar(100) collate utf8_unicode_ci NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `z` int(11) NOT NULL,
  UNIQUE KEY `auteur` (`auteur`,`num`,`type`),
  KEY `x` (`x`,`y`,`z`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `partage`
--

CREATE TABLE IF NOT EXISTS `partage` (
  `troll_a` int(11) NOT NULL,
  `troll_b` int(11) NOT NULL,
  `statut_a` enum('on','off') collate utf8_unicode_ci NOT NULL default 'on',
  `statut_b` enum('on','off') collate utf8_unicode_ci NOT NULL default 'off',
  PRIMARY KEY  (`troll_a`,`troll_b`),
  UNIQUE KEY `troll_a` (`troll_a`,`troll_b`,`statut_a`,`statut_b`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
