
--
-- Base de données: `chrall`
--

-- --------------------------------------------------------

--
-- Structure de la table `cdm`
--

CREATE TABLE IF NOT EXISTS `cdm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `origine` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'U',
  `date_adition` int(11) NOT NULL,
  `num_monstre` int(11) NOT NULL,
  `nom` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `age` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `nom_complet` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sha1` binary(20) NOT NULL,
  `niveau_min` int(11) NOT NULL,
  `niveau_max` int(11) NOT NULL,
  `capacite_text` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
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
  `famille_text` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `nombre_attaques` int(11) NOT NULL,
  `vitesse_deplacement_text` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `voir_le_cache_boolean` tinyint(4) NOT NULL,
  `attaque_a_distance_boolean` tinyint(4) NOT NULL,
  `dla_text` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `duree_tour_min` int(11) NOT NULL,
  `duree_tour_max` int(11) NOT NULL,
  `chargement_text` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `bonus_malus_text` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `portee_du_pouvoir_text` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sha1` (`sha1`),
  KEY `caracs1` (`niveau_min`,`niveau_max`,`des_attaque_min`,`des_attaque_max`,`des_esquive_min`,`des_esquive_max`,`des_degats_min`,`des_degats_max`,`des_regeneration_min`,`des_regeneration_max`,`armure_min`,`armure_max`,`vue_min`,`vue_max`),
  KEY `nom_complet` (`nom_complet`),
  KEY `famille_text` (`famille_text`),
  KEY `caracs2` (`maitrise_magique_min`,`maitrise_magique_max`,`resistance_magique_min`,`resistance_magique_max`,`nombre_attaques`,`voir_le_cache_boolean`,`attaque_a_distance_boolean`,`duree_tour_min`,`duree_tour_max`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=84 ;
