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
* acp_groups [French]
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
	'ACP_GROUPS_MANAGE_EXPLAIN'		=> 'Depuis ce panneau, vous pouvez administrer tous vos groupes d’utilisateurs. Vous pouvez également supprimer, créer et éditer les groupes déjà existants. De plus, vous pouvez choisir les responsables des groupes, ouvrir, fermer et masquer les statuts des groupes et régler le nom et la description d’un groupe.',
	'ADD_USERS'						=> 'Ajouter des utilisateurs',
	'ADD_USERS_EXPLAIN'				=> 'Vous pouvez ajouter ici de nouveaux utilisateurs au groupe. Vous pouvez également sélectionner ce groupe afin qu’il devienne le nouveau groupe par défaut des utilisateurs sélectionnés. De plus, vous pouvez les nommer en tant que responsables du groupe. Veuillez saisir chaque nom d’utilisateur sur une ligne séparée.',

	'COPY_PERMISSIONS'				=> 'Copier les permissions de',
	'COPY_PERMISSIONS_EXPLAIN'		=> 'Une fois créé, ce groupe aura les mêmes permissions que le groupe que vous avez sélectionné ici.',
	'CREATE_GROUP'					=> 'Créer un nouveau groupe',

	'GROUPS_NO_MEMBERS'				=> 'Ce groupe n’a aucun membre',
	'GROUPS_NO_MODS'				=> 'Aucun responsable de groupe n’a été spécifié',

	'GROUP_APPROVE'					=> 'Approuver le membre',
	'GROUP_APPROVED'				=> 'Approuver les membres',
	'GROUP_AVATAR'					=> 'Avatar du groupe',
	'GROUP_AVATAR_EXPLAIN'			=> 'Cette image sera affichée dans le panneau de contrôle des groupes.',
	'GROUP_CLOSED'					=> 'Fermé',
	'GROUP_COLOR'					=> 'Couleur du groupe',
	'GROUP_COLOR_EXPLAIN'			=> 'Définit la couleur dans laquelle les noms d’utilisateurs des membres apparaîtront. Laissez cela vide afin de conserver la couleur du membre par défaut.',
	'GROUP_CONFIRM_ADD_USER'		=> 'Êtes-vous sûr de vouloir ajouter l’utilisateur %1$s au groupe ?',
	'GROUP_CONFIRM_ADD_USERS'		=> 'Êtes-vous sûr de vouloir ajouter les utilisateurs %1$s au groupe ?',
	'GROUP_CREATED'					=> 'Le groupe a été créé avec succès.',
	'GROUP_DEFAULT'					=> 'Définir comme groupe par défaut pour les membres',
	'GROUP_DEFS_UPDATED'			=> 'Le groupe par défaut a été réglé pour tous les membres sélectionnés.',
	'GROUP_DELETE'					=> 'Supprimer le membre du groupe',
	'GROUP_DELETED'					=> 'Le groupe a été supprimé et tous ses membres ont été transférés dans le groupe par défaut avec succès.',
	'GROUP_DEMOTE'					=> 'Rétrograder le responsable du groupe',
	'GROUP_DESC'					=> 'Description du groupe',
	'GROUP_DETAILS'					=> 'Informations sur le groupe',
	'GROUP_EDIT_EXPLAIN'			=> 'Vous pouvez éditer ici un groupe existant. Vous pouvez modifier son nom, sa description et son type (ouvert, fermé, etc.). Vous pouvez également régler certaines options du groupe comme sa couleur, son rang, etc. Les modifications effectuées ici écraseront les réglages des utilisateurs. Veuillez noter que si les permissions des utilisateurs le permettent, les membres d’un groupe pourront écraser l’avatar du groupe.',
	'GROUP_ERR_USERS_EXIST'			=> 'Les utilisateurs spécifiés sont déjà membres de ce groupe.',
	'GROUP_FOUNDER_MANAGE'			=> 'Gestion par les fondateurs uniquement',
	'GROUP_FOUNDER_MANAGE_EXPLAIN'	=> 'Limiter la gestion de ce groupe aux fondateurs uniquement. Les utilisateurs ayant les permissions du groupe peuvent voir ce groupe, ainsi que ses membres.',
	'GROUP_HIDDEN'					=> 'Invisible',
	'GROUP_LANG'					=> 'Langue du groupe',
	'GROUP_LEAD'					=> 'Responsables du groupe',
	'GROUP_LEADERS_ADDED'			=> 'Les nouveaux responsables du groupe ont été ajoutés avec succès.',
	'GROUP_LEGEND'					=> 'Afficher le groupe dans la légende',
	'GROUP_LIST'					=> 'Membres actuels',
	'GROUP_LIST_EXPLAIN'			=> 'Ceci est la liste complète de tous les membres actuels de ce groupe. Vous pouvez supprimer ses membres (excepté dans certains groupes spéciaux) ou en ajouter de nouveaux.',
	'GROUP_MEMBERS'					=> 'Membres du groupe',
	'GROUP_MEMBERS_EXPLAIN'			=> 'Ceci est la liste complète de tous les membres de ce groupe d’utilisateurs. Ils sont classés par responsables, membres en attente et membres existants. Vous pouvez gérer ici tous les membres de ce groupe ainsi que leurs rôles. Pour supprimer un responsable tout en le conservant dans le groupe, utilisez plutôt la rétrogradation au lieu de la suppression. De même, pour promouvoir un membre existant en responsable, utilisez la promotion.',
	'GROUP_MESSAGE_LIMIT'			=> 'Limite des messages privés par dossier des groupes',
	'GROUP_MESSAGE_LIMIT_EXPLAIN'	=> 'Ce réglage écrasera la limite des messages privés par dossier des utilisateurs. Une valeur de <samp>0</samp> signifie que la limite des messages privés par dossier des utilisateurs sera utilisée.',
	'GROUP_MODS_ADDED'				=> 'Les nouveaux responsables du groupe ont été ajoutés avec succès.',
	'GROUP_MODS_DEMOTED'			=> 'Les responsables du groupe ont été rétrogradés avec succès.',
	'GROUP_MODS_PROMOTED'			=> 'Les membres du groupe ont été promus avec succès.',
	'GROUP_NAME'					=> 'Nom du groupe',
	'GROUP_NAME_TAKEN'				=> 'Le nom du groupe que vous avez saisi est déjà utilisé, veuillez en sélectionner un autre.',
	'GROUP_OPEN'					=> 'Ouvert',
	'GROUP_PENDING'					=> 'Membres en attente',
	'GROUP_MAX_RECIPIENTS'         => 'Nombre maximum de destinataires autorisés dans un message privé',
  'GROUP_MAX_RECIPIENTS_EXPLAIN'   => 'Le nombre maximum de destinataires autorisés dans un message privé. Si la valeur <samp>0</samp> est saisie, le réglage de la largeur du forum sera utilisée.',
  'GROUP_OPTIONS_SAVE'			=> 'Options larges de groupe',
	'GROUP_PROMOTE'					=> 'Promouvoir en responsable du groupe',
	'GROUP_RANK'					=> 'Rang du groupe',
	'GROUP_RECEIVE_PM'				=> 'Groupe autorisé à recevoir des messages privés',
	'GROUP_RECEIVE_PM_EXPLAIN'		=> 'Veuillez noter que les groupes invisibles ne sont pas autorisés à recevoir des messages privés.',
	'GROUP_REQUEST'					=> 'Demande',
	'GROUP_SETTINGS_SAVE'			=> 'Réglages du groupe',
	'GROUP_SKIP_AUTH'				=> 'Exempter le responsable du groupe de ses permissions',
	'GROUP_SKIP_AUTH_EXPLAIN'		=> 'Si cela est activé, le responsable du groupe n’héritera plus des permissions de son groupe.',
	'GROUP_TYPE'					=> 'Type du groupe',
	'GROUP_TYPE_EXPLAIN'			=> 'Cela détermine quels utilisateurs peuvent rejoindre ou voir ce groupe.',
	'GROUP_UPDATED'					=> 'Les préférences du groupe ont été mises à jour avec succès.',
	
	'GROUP_USERS_ADDED'				=> 'Les nouveaux utilisateurs ont été ajoutés au groupe avec succès.',
	'GROUP_USERS_EXIST'				=> 'Les utilisateurs que vous avez sélectionné sont déjà membres de ce groupe.',
	'GROUP_USERS_REMOVE'			=> 'Les utilisateurs ont été supprimés de ce groupe et transférés dans le groupe par défaut avec succès.',

	'MAKE_DEFAULT_FOR_ALL'	=> 'Définir comme groupe par défaut pour tous les membres',
	'MEMBERS'				=> 'Membres',

	'NO_GROUP'					=> 'Aucun groupe n’a été spécifié.',
	'NO_GROUPS_CREATED'			=> 'Aucun groupe n’a été crée.',
	'NO_PERMISSIONS'			=> 'Ne pas copier les permissions',
	'NO_USERS'					=> 'Vous n’avez spécifié aucun utilisateur.',
	'NO_USERS_ADDED'			=> 'Aucun utilisateur n’a été ajouté au groupe.',
	'NO_VALID_USERS'			=> 'Vous n’avez spécifié aucun utilisateur éligible pour cette action.',

	'SPECIAL_GROUPS'			=> 'Groupes prédéfinis',
	'SPECIAL_GROUPS_EXPLAIN'	=> 'Les groupes prédéfinis sont des groupes spéciaux, ils ne peuvent ni être supprimés, ni être directement modifiés. Cependant, vous pouvez y ajouter des utilisateurs et y modifier les réglages de base.',

	'TOTAL_MEMBERS'				=> 'Membres',

	'USERS_APPROVED'				=> 'Les utilisateurs ont été approuvés avec succès.',
	'USER_DEFAULT'					=> 'Utilisateur par défaut',
	'USER_DEF_GROUPS'				=> 'Groupes définis concernant l’utilisateur',
	'USER_DEF_GROUPS_EXPLAIN'		=> 'Représentent les groupes créés par vous-même ou par un autre administrateur du forum. Vous pouvez y gérer ses membres, éditer ses propriétés ou même le supprimer.',
	'USER_GROUP_DEFAULT'			=> 'Définir comme groupe par défaut',
	'USER_GROUP_DEFAULT_EXPLAIN'	=> 'Si vous sélectionnez <samp>Oui</samp> ici, ce groupe sera le groupe par défaut de tous les utilisateurs.',
	'USER_GROUP_LEADER'				=> 'Définir comme responsable du groupe',
));

?>