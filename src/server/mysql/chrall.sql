

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `chrall`
--

-- --------------------------------------------------------

--
-- Structure de la table `cdm`
--

CREATE TABLE `cdm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `origine` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'U',
  `date_adition` int(11) NOT NULL,
  `num_monstre` int(11) NOT NULL,
  `nom_complet` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sha1` binary(20) DEFAULT NULL,
  `niveau_min` int(11) NOT NULL,
  `niveau_max` int(11) NOT NULL,
  `capacite_text` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
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
  `famille_text` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nombre_attaques_min` int(11) NOT NULL,
  `nombre_attaques_max` int(11) NOT NULL,
  `vitesse_deplacement_text` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `voir_le_cache_boolean` tinyint(4) NOT NULL,
  `attaque_a_distance_boolean` tinyint(4) NOT NULL,
  `dla_text` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `duree_tour_min` int(11) NOT NULL,
  `duree_tour_max` int(11) NOT NULL,
  `chargement_text` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bonus_malus_text` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `portee_du_pouvoir` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `niveau_min` (`niveau_min`,`niveau_max`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
