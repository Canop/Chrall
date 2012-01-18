<?php
/**
*
* This file is part of French phpBB translation.
* Copyright (c) 2010 Maël Soucaze.
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; version 2 of the License.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License along
* with this program; if not, write to the Free Software Foundation, Inc.,
* 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*
* acp_database [French]
*
* @package   language
* @author    Maël Soucaze <maelsoucaze@gmail.com> (Maël Soucaze) http://mael.soucaze.com/
* @copyright (c) 2005 phpBB Group
* @license   http://opensource.org/licenses/gpl-2.0.php GNU General Public License
* @version   $Id$
*
*/

/**
* DO NOT CHANGE
*/
if (!defined('IN_PHPBB'))
{
	exit;
}

if (empty($lang) || !is_array($lang))
{
	$lang = array();
}

// DEVELOPERS PLEASE NOTE
//
// All language files should use UTF-8 as their encoding and the files must not contain a BOM.
//
// Placeholders can now contain order information, e.g. instead of
// 'Page %s of %s' you can (and should) write 'Page %1$s of %2$s', this allows
// translators to re-order the output of data while ensuring it remains correct
//
// You do not need this where single placeholders are used, e.g. 'Message %d' is fine
// equally where a string contains only two placeholders which are used to wrap text
// in a url you again do not need to specify an order e.g., 'Click %sHERE%s' is fine

// Database Backup/Restore
$lang = array_merge($lang, array(
	'ACP_BACKUP_EXPLAIN'	=> 'Vous pouvez sauvegarder ici toutes les données relatives à votre forum phpBB. Vous pouvez stocker l’archive de sauvegarde dans votre répertoire <samp>store/</samp> ou la télécharger directement. Selon la configuration de votre serveur, vous pouvez compresser cette archive dans un certain nombre de formats.',
	'ACP_RESTORE_EXPLAIN'	=> 'Cela exécutera une restauration complète de toutes les tables de phpBB à partir d’un fichier de sauvegarde. Si votre serveur le supporte, vous pouvez utiliser un fichier texte compressé en GZip ou BZip2 qui sera automatiquement décompressé. <strong>ATTENTION :</strong> cela écrasera toutes les données existantes. La restauration est un processus qui peut prendre un certain temps, veuillez ne pas vous déplacer de la page tant que l’opération n’est pas terminée. Les sauvegardes sont stockées dans le répertoire <samp>store/</samp> et sont supposées être réalisées par l’outil de restauration de phpBB. La restauration de bases de données qui n’ont pas été sauvegardées par ce système peuvent ne pas fonctionner.',

	'BACKUP_DELETE'		=> 'Le fichier de sauvegarde a été supprimé avec succès.',
	'BACKUP_INVALID'	=> 'Le fichier de sauvegarde que vous avez sélectionné est incorrect.',
	'BACKUP_OPTIONS'	=> 'Options de sauvegarde',
	'BACKUP_SUCCESS'	=> 'Le fichier de sauvegarde a été créé avec succès.',
	'BACKUP_TYPE'		=> 'Type de sauvegarde',

	'DATABASE'			=> 'Utilitaires de la base de données',
	'DATA_ONLY'			=> 'Données uniquement',
	'DELETE_BACKUP'		=> 'Supprimer la sauvegarde',
	'DELETE_SELECTED_BACKUP'	=> 'Êtes-vous sûr de vouloir supprimer la sauvegarde sélectionnée ?',
	'DESELECT_ALL'		=> 'Tout désélectionner',
	'DOWNLOAD_BACKUP'	=> 'Télécharger la sauvegarde',

	'FILE_TYPE'			=> 'Type de fichier',
	'FILE_WRITE_FAIL'	=> 'Impossible d’écrire le fichier dans le répertoire de stockage.',
	'FULL_BACKUP'		=> 'Complète',

	'RESTORE_FAILURE'		=> 'Le fichier de sauvegarde semble corrompu.',
	'RESTORE_OPTIONS'		=> 'Options de restauration',
	'RESTORE_SUCCESS'		=> 'La base de données a été restaurée avec succès.<br /><br />Votre forum devrait être tel qu’il était lorsque la sauvegarde a été réalisée.',

	'SELECT_ALL'			=> 'Tout sélectionner',
	'SELECT_FILE'			=> 'Sélectionner un fichier',
	'START_BACKUP'			=> 'Démarrer la sauvegarde',
	'START_RESTORE'			=> 'Démarrer la restauration',
	'STORE_AND_DOWNLOAD'	=> 'Stocker et télécharger',
	'STORE_LOCAL'			=> 'Stocker le fichier localement',
	'STRUCTURE_ONLY'		=> 'Structure uniquement',

	'TABLE_SELECT'		=> 'Sélection de la table',
	'TABLE_SELECT_ERROR'=> 'Vous devez sélectionner au moins une table.',
));

?>