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
* acp_language [French]
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

$lang = array_merge($lang, array(
	'ACP_FILES'						=> 'Fichiers de langue de l’administration',
	'ACP_LANGUAGE_PACKS_EXPLAIN'	=> 'Vous pouvez installer, modifier et supprimer ici des archives de langue. L’archive de langue par défaut est marquée par un astérisque (*).',

	'EMAIL_FILES'			=> 'Modèles d’e-mails',

	'FILE_CONTENTS'				=> 'Contenu du fichier',
	'FILE_FROM_STORAGE'			=> 'Fichier du répertoire de stockage',

	'HELP_FILES'				=> 'Fichiers d’aide',

	'INSTALLED_LANGUAGE_PACKS'	=> 'Archives de langue installées',
	'INVALID_LANGUAGE_PACK'		=> 'L’archive de langue que vous avez sélectionné semble incorrecte. Veuillez la vérifier et la transférer de nouveau si nécessaire.',
	'INVALID_UPLOAD_METHOD'		=> 'La méthode de transfert que vous avez sélectionné est incorrecte. Veuillez essayer avec une méthode différente.',

	'LANGUAGE_DETAILS_UPDATED'			=> 'Les informations concernant la langue ont été mises à jour avec succès.',
	'LANGUAGE_ENTRIES'					=> 'Entrées de langue',
	'LANGUAGE_ENTRIES_EXPLAIN'			=> 'Vous pouvez modifier ici les clés de langue qui sont déjà existantes ou qui ne sont pas traduites.<br /><strong>Note :</strong> une fois que vous avez modifié un fichier de langue, le fichier modifié sera stocké dans un répertoire séparé afin que vous puissiez le télécharger. Les modifications ne seront visibles aux utilisateurs qu’après avoir remplacé les fichiers de langue originaux par les fichiers de langue modifiés en les transférant sur votre espace Internet.',
	'LANGUAGE_FILES'					=> 'Fichiers de langue',
	'LANGUAGE_KEY'						=> 'Clé de langue',
	'LANGUAGE_PACK_ALREADY_INSTALLED'	=> 'Cette archive de langue est déjà installée.',
	'LANGUAGE_PACK_DELETED'				=> 'L’archive de langue <strong>%s</strong> a été supprimée avec succès. Tous les utilisateurs qui utilisaient cette langue utilisent à présent la langue par défaut du forum.',
	'LANGUAGE_PACK_DETAILS'				=> 'Informations sur l’archive de langue',
	'LANGUAGE_PACK_INSTALLED'			=> 'L’archive de langue <strong>%s</strong> a été installée avec succès.',
	'LANGUAGE_PACK_ISO'					=> 'ISO',
	'LANGUAGE_PACK_LOCALNAME'			=> 'Nom national',
	'LANGUAGE_PACK_NAME'				=> 'Nom',
	'LANGUAGE_PACK_NOT_EXIST'			=> 'L’archive de langue que vous avez sélectionné n’existe pas.',
	'LANGUAGE_PACK_USED_BY'				=> 'Utilisée par (incluant les robots)',
	'LANGUAGE_VARIABLE'					=> 'Variable de langue',
	'LANG_AUTHOR'						=> 'Auteur de l’archive de langue',
	'LANG_ENGLISH_NAME'					=> 'Nom anglais',
	'LANG_ISO_CODE'						=> 'Code ISO',
	'LANG_LOCAL_NAME'					=> 'Nom national',

	'MISSING_LANGUAGE_FILE'		=> 'Fichier de langue manquant : <strong style="color:red">%s</strong>',
	'MISSING_LANG_VARIABLES'	=> 'Variables de langue manquantes',
	'MODS_FILES'				=> 'Fichiers de langue des MODs',

	'NO_FILE_SELECTED'				=> 'Vous n’avez spécifié aucun fichier de langue.',
	'NO_LANG_ID'					=> 'Vous n’avez spécifié aucune archive de langue.',
	'NO_REMOVE_DEFAULT_LANG'		=> 'Vous ne pouvez pas supprimer l’archive de langue par défaut.<br />Si vous souhaitez supprimer cette archive de langue, veuillez avant tout modifier la langue par défaut de votre forum.',
	'NO_UNINSTALLED_LANGUAGE_PACKS'	=> 'Aucune archive de langue n’est pas installée',

	'REMOVE_FROM_STORAGE_FOLDER'		=> 'Supprimer du répertoire de stockage',

	'SELECT_DOWNLOAD_FORMAT'	=> 'Sélectionner le format de téléchargement',
	'SUBMIT_AND_DOWNLOAD'		=> 'Envoyer et télécharger le fichier',
	'SUBMIT_AND_UPLOAD'			=> 'Envoyer et transférer le fichier',

	'THOSE_MISSING_LANG_FILES'			=> 'Les fichiers de langue suivants sont absents du répertoire de langue %s',
	'THOSE_MISSING_LANG_VARIABLES'		=> 'Les variables de langue suivantes sont absentes de l’archive de langue <strong>%s</strong>',

	'UNINSTALLED_LANGUAGE_PACKS'	=> 'Archives de langue n’étant pas installées',

	'UNABLE_TO_WRITE_FILE'		=> 'Le fichier n’a pas pu être écrit sur %s.',
	'UPLOAD_COMPLETED'			=> 'Le transfert a été réalisé avec succès.',
	'UPLOAD_FAILED'				=> 'Le transfert a échoué pour une raison inconnue. Veuillez remplacer manuellement le fichier approprié.',
	'UPLOAD_METHOD'				=> 'Méthode de transfert',
	'UPLOAD_SETTINGS'			=> 'Réglages du transfert',

	'WRONG_LANGUAGE_FILE'		=> 'Le fichier de langue que vous avez sélectionné est incorrect.',
));

?>