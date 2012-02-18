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
* acp_profile [French]
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

// Custom profile fields
$lang = array_merge($lang, array(
	'ADDED_PROFILE_FIELD'	=> 'Le champ de profil personnalisé a été ajouté avec succès.',
	'ALPHA_ONLY'			=> 'Alphanumérique uniquement',
	'ALPHA_SPACERS'			=> 'Alphanumérique et espaces',
	'ALWAYS_TODAY'			=> 'Toujours la date actuelle',

	'BOOL_ENTRIES_EXPLAIN'	=> 'Saisissez vos options maintenant',
	'BOOL_TYPE_EXPLAIN'		=> 'Détermine le type, soit une case à cocher, soit un bouton radio. Les cases à cocher ne seront affichées que si cela est coché pour un utilisateur spécifique. Dans ce cas, la <strong>seconde</strong> option de langue sera utilisée. Les boutons radios seront affichés indépendamment de leur valeur.',

	'CHANGED_PROFILE_FIELD'		=> 'Le champ de profil a été modifié avec succès.',
	'CHARS_ANY'					=> 'N’importe quel caractère',
	'CHECKBOX'					=> 'Case à cocher',
	'COLUMNS'					=> 'Colonnes',
	'CP_LANG_DEFAULT_VALUE'		=> 'Valeur par défaut',
	'CP_LANG_EXPLAIN'			=> 'Description du champ',
	'CP_LANG_EXPLAIN_EXPLAIN'	=> 'La description de ce champ est affichée aux utilisateurs.',
	'CP_LANG_NAME'				=> 'Nom ou titre du champ affiché aux utilisateurs',
	'CP_LANG_OPTIONS'			=> 'Options',
	'CREATE_NEW_FIELD'			=> 'Créer un nouveau champ',
	'CUSTOM_FIELDS_NOT_TRANSLATED'	=> 'Au moins un champ de profil personnalisé n’a pas encore été traduit. Veuillez saisir l’information demandée en cliquant sur le lien “Traduire”.',

	'DEFAULT_ISO_LANGUAGE'			=> 'Langue par défaut [%s]',
	'DEFAULT_LANGUAGE_NOT_FILLED'	=> 'Les entrées de langue de la langue par défaut ne sont pas renseignées pour ce champ de profil.',
	'DEFAULT_VALUE'					=> 'Valeur par défaut',
	'DELETE_PROFILE_FIELD'			=> 'Supprimer le champ de profil',
	'DELETE_PROFILE_FIELD_CONFIRM'	=> 'Êtes-vous sûr de vouloir supprimer ce champ de profil ?',
	'DISPLAY_AT_PROFILE'			=> 'Afficher dans le panneau de contrôle de l’utilisateur',
	'DISPLAY_AT_PROFILE_EXPLAIN'	=> 'L’utilisateur peut modifier ce champ de profil dans le panneau de contrôle de l’utilisateur.',
	'DISPLAY_AT_REGISTER'			=> 'Afficher lors de l’inscription',
	'DISPLAY_AT_REGISTER_EXPLAIN'	=> 'Si cette option est activée, le champ sera affiché lors de l’inscription.',
	'DISPLAY_ON_VT'					=> 'Afficher sur l’écran du sujet',
	'DISPLAY_ON_VT_EXPLAIN'			=> 'Si cette option est activée, le champ sera affiché dans le mini-profil sur l’écran du sujet.',
	'DISPLAY_PROFILE_FIELD'			=> 'Afficher publiquement le champ de profil',
	'DISPLAY_PROFILE_FIELD_EXPLAIN'	=> 'Le champ de profil sera affiché dans tous les endroits autorisés par les réglages du chargement. Si vous souhaitez masquer le champ sur les pages des sujets, des profils et de la liste des membres, veuillez régler cela sur “Non”.',
	'DROPDOWN_ENTRIES_EXPLAIN'		=> 'Veuillez saisir à présent vos options. Chaque option doit être placée sur une ligne différente.',

	'EDIT_DROPDOWN_LANG_EXPLAIN'	=> 'Veuillez noter que vous pouvez modifier les options du texte et ajouter de nouvelles options à la fin. Il n’est pas conseillé d’ajouter de nouvelles options entre les options déjà existantes ou de supprimer des options, car cela pourrait attribuer des options erronées à vos utilisateurs qui seront, par exemple, mal redirigés sur un article.',
	'EMPTY_FIELD_IDENT'				=> 'Champ d’identification vide',
	'EMPTY_USER_FIELD_NAME'			=> 'Veuillez saisir le nom ou le titre du champ',
	'ENTRIES'						=> 'Entrées',
	'EVERYTHING_OK'					=> 'Tout semble correct',

	'FIELD_BOOL'				=> 'Booléen (oui/non)',
	'FIELD_DATE'				=> 'Date',
	'FIELD_DESCRIPTION'			=> 'Description du champ',
	'FIELD_DESCRIPTION_EXPLAIN'	=> 'La description de ce champ est visible aux utilisateurs.',
	'FIELD_DROPDOWN'			=> 'Liste déroulante',
	'FIELD_IDENT'				=> 'Identification du champ',
	'FIELD_IDENT_ALREADY_EXIST'	=> 'L’identification du champ que vous avez sélectionné existe déjà. Veuillez en choisir une autre.',
	'FIELD_IDENT_EXPLAIN'		=> 'L’identification du champ correspond au nom qui permet d’identifier le champ de profil dans la base de données et les templates.',
	'FIELD_INT'					=> 'Nombres',
	'FIELD_LENGTH'				=> 'Largeur de la barre de saisie',
	'FIELD_NOT_FOUND'			=> 'Le champ de profil est introuvable.',
	'FIELD_STRING'				=> 'Champ de texte simple',
	'FIELD_TEXT'				=> 'Zone de texte',
	'FIELD_TYPE'				=> 'Type de champ',
	'FIELD_TYPE_EXPLAIN'		=> 'Vous ne pourrez plus modifier ultérieurement le type de champ.',
	'FIELD_VALIDATION'			=> 'Validation du champ',
	'FIRST_OPTION'				=> 'Première option',

	'HIDE_PROFILE_FIELD'			=> 'Masquer le champ de profil',
	'HIDE_PROFILE_FIELD_EXPLAIN'	=> 'Masque le champ de profil à tous les autres utilisateurs, mise à part à l’utilisateur concerné, aux administrateurs et aux modérateurs qui pourront toujours voir ce champ. Si l’option d’affichage est désactivée dans le panneau de contrôle de l’utilisateur, l’utilisateur ne pourra pas voir ou modifier ce champ, seuls les administrateurs le pourront.',

	'INVALID_CHARS_FIELD_IDENT'	=> 'L’identification du champ ne peut contenir que des minuscules, des lettres situées entre a et z, puis _',
	'INVALID_FIELD_IDENT_LEN'	=> 'L’identification du champ ne doit pas dépasser 17 caractères',
	'ISO_LANGUAGE'				=> 'Langue [%s]',

	'LANG_SPECIFIC_OPTIONS'		=> 'Options spécifiques à la langue [<strong>%s</strong>]',

	'MAX_FIELD_CHARS'		=> 'Nombre maximum de caractères',
	'MAX_FIELD_NUMBER'		=> 'Nombre le plus élevé autorisé',
	'MIN_FIELD_CHARS'		=> 'Nombre minimum de caractères',
	'MIN_FIELD_NUMBER'		=> 'Nombre le plus faible autorisé',

	'NO_FIELD_ENTRIES'			=> 'Aucune entrée n’a été spécifiée',
	'NO_FIELD_ID'				=> 'Aucune identification de champ n’a été spécifiée.',
	'NO_FIELD_TYPE'				=> 'Aucun type de champ n’a été spécifié.',
	'NO_VALUE_OPTION'			=> 'Option égale à la valeur de non-saisie',
	'NO_VALUE_OPTION_EXPLAIN'	=> 'Correspond à la valeur de non-saisie. Si ce champ est obligatoire, l’utilisateur obtiendra une erreur s’il choisit l’option sélectionnée ici.',
	'NUMBERS_ONLY'				=> 'Nombres uniquement (0-9)',

	'PROFILE_BASIC_OPTIONS'		=> 'Options basiques',
	'PROFILE_FIELD_ACTIVATED'	=> 'Le champ de profil a été activé avec succès.',
	'PROFILE_FIELD_DEACTIVATED'	=> 'Le champ de profil a été désactivé avec succès.',
	'PROFILE_LANG_OPTIONS'		=> 'Options spécifiques à la langue',
	'PROFILE_TYPE_OPTIONS'		=> 'Options spécifiques au type de profil',

	'RADIO_BUTTONS'				=> 'Boutons radios',
	'REMOVED_PROFILE_FIELD'		=> 'Le champ de profil a été supprimé avec succès.',
	'REQUIRED_FIELD'			=> 'Champ obligatoire',
	'REQUIRED_FIELD_EXPLAIN'	=> 'Oblige de remplir ou de spécifier le champ de profil à un utilisateur ou un administrateur. Si l’option d’affichage est désactivée sur la page d’inscription, le champ ne devra être rempli que lorsque l’utilisateur modifiera son profil.',
	'ROWS'						=> 'Lignes',

	'SAVE'							=> 'Sauvegarder',
	'SECOND_OPTION'					=> 'Seconde option',
	'STEP_1_EXPLAIN_CREATE'			=> 'Vous pouvez saisir ici le premier paramètre basique de votre nouveau champ de profil. Cette information est obligatoire afin de poursuivre à la seconde étape dans laquelle vous pourrez définir les options restantes et où vous pourrez prévisualiser et améliorer votre champ de profil.',
	'STEP_1_EXPLAIN_EDIT'			=> 'Vous pouvez modifier ici les paramètres basiques de votre champ de profil. Les options nécessaires sont recalculées à la seconde étape.',
	'STEP_1_TITLE_CREATE'			=> 'Ajouter un champ de profil',
	'STEP_1_TITLE_EDIT'				=> 'Éditer le champ de profil',
	'STEP_2_EXPLAIN_CREATE'			=> 'Vous pouvez spécifier ici quelques options générales que vous pourrez ajuster.',
	'STEP_2_EXPLAIN_EDIT'			=> 'Vous pouvez modifier ici quelques options générales.<br /><strong>Veuillez noter que les modifications des champs de profil n’affecteront pas les champs de profil existants et complétés par vos utilisateurs.</strong>',
	'STEP_2_TITLE_CREATE'			=> 'Options spécifiques au type de profil',
	'STEP_2_TITLE_EDIT'				=> 'Options spécifiques au type de profil',
	'STEP_3_EXPLAIN_CREATE'			=> 'Depuis que vous avez installé plusieurs langues à votre forum, vous devez également remplir les éléments des langues. Le champ de profil fonctionnera avec la langue activée par défaut, vous pourrez également compléter les éléments des langues ultérieurement.',
	'STEP_3_EXPLAIN_EDIT'			=> 'Depuis que vous avez installé plusieurs langues à votre forum, vous pouvez également modifier ou ajouter les éléments restants des langues. Le champ de profil fonctionnera avec la langue activée par défaut.',
	'STEP_3_TITLE_CREATE'			=> 'Définitions des langues restantes',
	'STEP_3_TITLE_EDIT'				=> 'Définitions des langues',
	'STRING_DEFAULT_VALUE_EXPLAIN'	=> 'Veuillez saisir une phrase ou une valeur qui sera affichée par défaut. Laissez cela vide si vous souhaitez ne rien afficher.',

	'TEXT_DEFAULT_VALUE_EXPLAIN'	=> 'Veuillez saisir un texte ou une valeur qui sera affiché par défaut. Laissez cela vide si vous souhaitez ne rien afficher.',
	'TRANSLATE'						=> 'Traduire',

	'USER_FIELD_NAME'	=> 'Nom ou titre du champ affiché aux utilisateurs',

	'VISIBILITY_OPTION'				=> 'Options de visibilité',
));

?>