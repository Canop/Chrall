-- phpMyAdmin SQL Dump
-- version 3.3.7deb5build0.10.10.1
-- http://www.phpmyadmin.net
--
-- Serveur: localhost
-- Généré le : Mar 01 Mars 2011 à 23:22
-- Version du serveur: 5.1.49
-- Version de PHP: 5.3.3-1ubuntu9.3

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

DROP TABLE IF EXISTS `cdm`;
CREATE TABLE IF NOT EXISTS `cdm` (
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
  PRIMARY KEY (`id`),
  KEY `niveau_min` (`niveau_min`,`niveau_max`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=101 ;
