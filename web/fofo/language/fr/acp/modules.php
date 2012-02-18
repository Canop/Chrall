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
* acp_modules [French]
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
	'ACP_MODULE_MANAGEMENT_EXPLAIN'	=> 'Vous pouvez gérer ici l’ensemble des modules. Veuillez noter que le PCA détient une structure à trois niveaux de menu (Catégorie -> Catégorie -> Module) alors que les autres détiennent une structure à deux niveaux de menu (Catégorie -> Module), ce qui doit être conservé. Veuillez également prendre conscience que vous pouvez vous bloquer si vous désactivez ou supprimez les modules responsables de la gestion des modules.',
	'ADD_MODULE'					=> 'Ajouter un module',
	'ADD_MODULE_CONFIRM'			=> 'Êtes-vous sûr de vouloir ajouter ce module avec le mode sélectionné ?',
	'ADD_MODULE_TITLE'				=> 'Ajouter un module',

	'CANNOT_REMOVE_MODULE'	=> 'Impossible de supprimer le module, il possède des sous-modules. Veuillez supprimer ou déplacer tous les sous-modules avant d’effectuer cette opération.',
	'CATEGORY'				=> 'Catégorie',
	'CHOOSE_MODE'			=> 'Sélectionner le mode du module',
	'CHOOSE_MODE_EXPLAIN'	=> 'Sélectionner les modes du module qui seront utilisés.',
	'CHOOSE_MODULE'			=> 'Sélectionner un module',
	'CHOOSE_MODULE_EXPLAIN'	=> 'Sélectionner le fichier qui sera utilisé par ce module.',
	'CREATE_MODULE'			=> 'Créer un nouveau module',

	'DEACTIVATED_MODULE'	=> 'Module désactivé',
	'DELETE_MODULE'			=> 'Supprimer le module',
	'DELETE_MODULE_CONFIRM'	=> 'Êtes-vous sûr de vouloir supprimer ce module ?',

	'EDIT_MODULE'			=> 'Éditer le module',
	'EDIT_MODULE_EXPLAIN'	=> 'Vous pouvez saisir ici les réglages spécifiques au module.',

	'HIDDEN_MODULE'			=> 'Module invisible',

	'MODULE'					=> 'Module',
	'MODULE_ADDED'				=> 'Le module a été ajouté avec succès.',
	'MODULE_DELETED'			=> 'Le module a été supprimé avec succès.',
	'MODULE_DISPLAYED'			=> 'Module affiché',
	'MODULE_DISPLAYED_EXPLAIN'	=> 'Si vous ne souhaitez pas afficher ce module mais que vous souhaitez l’utiliser, réglez ceci sur <samp>Non</samp>.',
	'MODULE_EDITED'				=> 'Le module a été édité avec succès.',
	'MODULE_ENABLED'			=> 'Module activé',
	'MODULE_LANGNAME'			=> 'Nom de la langue du module',
	'MODULE_LANGNAME_EXPLAIN'	=> 'Saisissez le nom du module qui sera affiché. Utilisez une variable de langue si le nom est utilisé par le fichier de langue.',
	'MODULE_TYPE'				=> 'Type de module',

	'NO_CATEGORY_TO_MODULE'	=> 'Impossible de modifier la catégorie en module. Veuillez supprimer ou déplacer tous les sous-modules avant d’effectuer cette opération.',
	'NO_MODULE'				=> 'Aucun module n’a été trouvé.',
	'NO_MODULE_ID'			=> 'Aucune identification du module n’a été spécifiée.',
	'NO_MODULE_LANGNAME'	=> 'Aucun nom de la langue du module n’a été spécifié.',
	'NO_PARENT'				=> 'Aucun parent',

	'PARENT'				=> 'Parent',
	'PARENT_NO_EXIST'		=> 'Le parent n’existe pas.',

	'SELECT_MODULE'			=> 'Sélectionner un module',
));

?>