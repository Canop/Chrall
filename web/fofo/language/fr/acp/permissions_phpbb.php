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
* acp_permissions_phpbb (phpBB Permission Set) [French]
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

/**
*	MODDERS PLEASE NOTE
*
*	You are able to put your permission sets into a separate file too by
*	prefixing the new file with permissions_ and putting it into the acp
*	language folder.
*
*	An example of how the file could look like:
*
*	<code>
*
*	if (empty($lang) || !is_array($lang))
*	{
*		$lang = array();
*	}
*
*	// Adding new category
*	$lang['permission_cat']['bugs'] = 'Bugs';
*
*	// Adding new permission set
*	$lang['permission_type']['bug_'] = 'Bug Permissions';
*
*	// Adding the permissions
*	$lang = array_merge($lang, array(
*		'acl_bug_view'		=> array('lang' => 'Can view bug reports', 'cat' => 'bugs'),
*		'acl_bug_post'		=> array('lang' => 'Can post bugs', 'cat' => 'post'), // Using a phpBB category here
*	));
*
*	</code>
*/

// Define categories and permission types
$lang = array_merge($lang, array(
	'permission_cat'	=> array(
		'actions'		=> 'Actions',
		'content'		=> 'Contenu',
		'forums'		=> 'Forums',
		'misc'			=> 'Divers',
		'permissions'	=> 'Permissions',
		'pm'			=> 'Messages privés',
		'polls'			=> 'Sondages',
		'post'			=> 'Message',
		'post_actions'	=> 'Actions sur les messages',
		'posting'		=> 'Publication',
		'profile'		=> 'Profil',
		'settings'		=> 'Réglages',
		'topic_actions'	=> 'Actions sur les sujets',
		'user_group'	=> 'Utilisateurs &amp; groupes',
	),

	// With defining 'global' here we are able to specify what is printed out if the permission is within the global scope.
	'permission_type'	=> array(
		'u_'			=> 'Permissions des utilisateurs',
		'a_'			=> 'Permissions des administrateurs',
		'm_'			=> 'Permissions des modérateurs',
		'f_'			=> 'Permissions des forums',
		'global'		=> array(
			'm_'			=> 'Permissions des modérateurs globaux',
		),
	),
));

// User Permissions
$lang = array_merge($lang, array(
	'acl_u_viewprofile'	=> array('lang' => 'Peut voir les profils, la liste des membres et la liste des utilisateurs en ligne', 'cat' => 'profile'),
	'acl_u_chgname'		=> array('lang' => 'Peut modifier son nom d’utilisateur', 'cat' => 'profile'),
	'acl_u_chgpasswd'	=> array('lang' => 'Peut modifier son mot de passe', 'cat' => 'profile'),
	'acl_u_chgemail'	=> array('lang' => 'Peut modifier son adresse e-mail', 'cat' => 'profile'),
	'acl_u_chgavatar'	=> array('lang' => 'Peut modifier son avatar', 'cat' => 'profile'),
	'acl_u_chggrp'		=> array('lang' => 'Peut modifier son groupe d’utilisateurs par défaut', 'cat' => 'profile'),

	'acl_u_attach'		=> array('lang' => 'Peut insérer des fichiers', 'cat' => 'post'),
	'acl_u_download'	=> array('lang' => 'Peut télécharger des fichiers', 'cat' => 'post'),
	'acl_u_savedrafts'	=> array('lang' => 'Peut sauvegarder des brouillons', 'cat' => 'post'),
	'acl_u_chgcensors'	=> array('lang' => 'Peut désactiver la censure de mots', 'cat' => 'post'),
	'acl_u_sig'			=> array('lang' => 'Peut utiliser une signature', 'cat' => 'post'),

	'acl_u_sendpm'		=> array('lang' => 'Peut envoyer des messages privés', 'cat' => 'pm'),
	'acl_u_masspm'      => array('lang' => 'Peut envoyer des messages privés à plusieurs utilisateurs', 'cat' => 'pm'),
  'acl_u_masspm_group'=> array('lang' => 'Peut envoyer des messages privés aux groupes', 'cat' => 'pm'),
	'acl_u_readpm'		=> array('lang' => 'Peut lire ses messages privés', 'cat' => 'pm'),
	'acl_u_pm_edit'		=> array('lang' => 'Peut éditer ses messages privés', 'cat' => 'pm'),
	'acl_u_pm_delete'	=> array('lang' => 'Peut supprimer des messages privés de son dossier', 'cat' => 'pm'),
	'acl_u_pm_forward'	=> array('lang' => 'Peut transmettre des messages privés', 'cat' => 'pm'),
	'acl_u_pm_emailpm'	=> array('lang' => 'Peut envoyer des messages privés par e-mail', 'cat' => 'pm'),
	'acl_u_pm_printpm'	=> array('lang' => 'Peut imprimer des messages privés', 'cat' => 'pm'),
	'acl_u_pm_attach'	=> array('lang' => 'Peut insérer des fichiers dans les messages privés', 'cat' => 'pm'),
	'acl_u_pm_download'	=> array('lang' => 'Peut télécharger des fichiers dans les messages privés', 'cat' => 'pm'),
	'acl_u_pm_bbcode'	=> array('lang' => 'Peut utiliser le BBCode dans les messages privés', 'cat' => 'pm'),
	'acl_u_pm_smilies'	=> array('lang' => 'Peut utiliser les émoticônes dans les messages privés', 'cat' => 'pm'),
	'acl_u_pm_img'		=> array('lang' => 'Peut utiliser la balise BBCode [img] dans les messages privés', 'cat' => 'pm'),
	'acl_u_pm_flash'	=> array('lang' => 'Peut utiliser la balise BBCode [flash] dans les messages privés', 'cat' => 'pm'),

	'acl_u_sendemail'	=> array('lang' => 'Peut envoyer des e-mails', 'cat' => 'misc'),
	'acl_u_sendim'		=> array('lang' => 'Peut envoyer des messages instantanés', 'cat' => 'misc'),
	'acl_u_ignoreflood'	=> array('lang' => 'Peut ignorer la limite de flood', 'cat' => 'misc'),
	'acl_u_hideonline'	=> array('lang' => 'Peut masquer son statut en ligne', 'cat' => 'misc'),
	'acl_u_viewonline'	=> array('lang' => 'Peut voir les utilisateurs invisibles en ligne', 'cat' => 'misc'),
	'acl_u_search'		=> array('lang' => 'Peut rechercher sur le forum', 'cat' => 'misc'),
));

// Forum Permissions
$lang = array_merge($lang, array(
	'acl_f_list'		=> array('lang' => 'Peut voir les forums', 'cat' => 'post'),
	'acl_f_read'		=> array('lang' => 'Peut lire les messages', 'cat' => 'post'),
	'acl_f_post'		=> array('lang' => 'Peut rédiger de nouveaux sujets', 'cat' => 'post'),
	'acl_f_reply'		=> array('lang' => 'Peut répondre aux sujets', 'cat' => 'post'),
	'acl_f_icons'		=> array('lang' => 'Peut utiliser les icônes de sujets et de messages', 'cat' => 'post'),
	'acl_f_announce'	=> array('lang' => 'Peut publier des annonces', 'cat' => 'post'),
	'acl_f_sticky'		=> array('lang' => 'Peut publier des notes', 'cat' => 'post'),

	'acl_f_poll'		=> array('lang' => 'Peut créer des sondages', 'cat' => 'polls'),
	'acl_f_vote'		=> array('lang' => 'Peut voter dans les sondages', 'cat' => 'polls'),
	'acl_f_votechg'		=> array('lang' => 'Peut modifier un vote existant', 'cat' => 'polls'),

	'acl_f_attach'		=> array('lang' => 'Peut insérer des fichiers', 'cat' => 'content'),
	'acl_f_download'	=> array('lang' => 'Peut télécharger des fichiers', 'cat' => 'content'),
	'acl_f_sigs'		=> array('lang' => 'Peut utiliser une signature', 'cat' => 'content'),
	'acl_f_bbcode'		=> array('lang' => 'Peut utiliser le BBCode', 'cat' => 'content'),
	'acl_f_smilies'		=> array('lang' => 'Peut utiliser les émoticônes', 'cat' => 'content'),
	'acl_f_img'			=> array('lang' => 'Peut utiliser la balise BBCode [img]', 'cat' => 'content'),
	'acl_f_flash'		=> array('lang' => 'Peut utiliser la balise BBCode [flash]', 'cat' => 'content'),

	'acl_f_edit'		=> array('lang' => 'Peut éditer ses messages', 'cat' => 'actions'),
	'acl_f_delete'		=> array('lang' => 'Peut supprimer ses messages', 'cat' => 'actions'),
	'acl_f_user_lock'	=> array('lang' => 'Peut verrouiller ses sujets', 'cat' => 'actions'),
	'acl_f_bump'		=> array('lang' => 'Peut remonter des sujets', 'cat' => 'actions'),
	'acl_f_report'		=> array('lang' => 'Peut rapporter des messages', 'cat' => 'actions'),
	'acl_f_subscribe'	=> array('lang' => 'Peut surveiller des forums', 'cat' => 'actions'),
	'acl_f_print'		=> array('lang' => 'Peut imprimer des sujets', 'cat' => 'actions'),
	'acl_f_email'		=> array('lang' => 'Peut envoyer des sujets par e-mail', 'cat' => 'actions'),

	'acl_f_search'		=> array('lang' => 'Peut rechercher dans un forum', 'cat' => 'misc'),
	'acl_f_ignoreflood' => array('lang' => 'Peut ignorer la limite de flood', 'cat' => 'misc'),
	'acl_f_postcount'	=> array('lang' => 'Peut augmenter son compteur de messages<br /><em>Veuillez noter que ce réglage n’affecte que les nouveaux messages.</em>', 'cat' => 'misc'),
	'acl_f_noapprove'	=> array('lang' => 'Peut publier des messages sans approbation', 'cat' => 'misc'),
));

// Moderator Permissions
$lang = array_merge($lang, array(
	'acl_m_edit'		=> array('lang' => 'Peut éditer les messages', 'cat' => 'post_actions'),
	'acl_m_delete'		=> array('lang' => 'Peut supprimer les messages', 'cat' => 'post_actions'),
	'acl_m_approve'		=> array('lang' => 'Peut approuver les messages', 'cat' => 'post_actions'),
	'acl_m_report'		=> array('lang' => 'Peut fermer et supprimer les rapports', 'cat' => 'post_actions'),
	'acl_m_chgposter'	=> array('lang' => 'Peut modifier l’auteur d’un message', 'cat' => 'post_actions'),

	'acl_m_move'	=> array('lang' => 'Peut déplacer les sujets', 'cat' => 'topic_actions'),
	'acl_m_lock'	=> array('lang' => 'Peut verrouiller les sujets', 'cat' => 'topic_actions'),
	'acl_m_split'	=> array('lang' => 'Peut diviser les sujets', 'cat' => 'topic_actions'),
	'acl_m_merge'	=> array('lang' => 'Peut fusionner les sujets', 'cat' => 'topic_actions'),

	'acl_m_info'	=> array('lang' => 'Peut voir les informations d’un message', 'cat' => 'misc'),
	'acl_m_warn'	=> array('lang' => 'Peut distribuer des avertissements<br /><em>Ce réglage n’est assigné que globalement. Ce n’est pas basé au forum.</em>', 'cat' => 'misc'), // This moderator setting is only global (and not local)
	'acl_m_ban'		=> array('lang' => 'Peut gérer les bannissements<br /><em>Ce réglage n’est assigné que globalement. Ce n’est pas basé au forum.</em>', 'cat' => 'misc'), // This moderator setting is only global (and not local)
));

// Admin Permissions
$lang = array_merge($lang, array(
	'acl_a_board'		=> array('lang' => 'Peut modifier les réglages du forum et vérifier les mises à jour', 'cat' => 'settings'),
	'acl_a_server'		=> array('lang' => 'Peut modifier les réglages du serveur et de la communication', 'cat' => 'settings'),
	'acl_a_jabber'		=> array('lang' => 'Peut modifier les réglages de Jabber', 'cat' => 'settings'),
	'acl_a_phpinfo'		=> array('lang' => 'Peut voir les réglages de PHP', 'cat' => 'settings'),

	'acl_a_forum'		=> array('lang' => 'Peut gérer les forums', 'cat' => 'forums'),
	'acl_a_forumadd'	=> array('lang' => 'Peut ajouter de nouveaux forums', 'cat' => 'forums'),
	'acl_a_forumdel'	=> array('lang' => 'Peut supprimer des forums', 'cat' => 'forums'),
	'acl_a_prune'		=> array('lang' => 'Peut délester des forums', 'cat' => 'forums'),

	'acl_a_icons'		=> array('lang' => 'Peut modifier les icônes de sujets et de messages et les émoticônes', 'cat' => 'posting'),
	'acl_a_words'		=> array('lang' => 'Peut modifier la censure de mots', 'cat' => 'posting'),
	'acl_a_bbcode'		=> array('lang' => 'Peut définir de nouvelles balises BBCode', 'cat' => 'posting'),
	'acl_a_attach'		=> array('lang' => 'Peut modifier les réglages relatifs aux pièces jointes', 'cat' => 'posting'),

	'acl_a_user'		=> array('lang' => 'Peut gérer les utilisateurs<br /><em>Ceci inclut également l’affichage du navigateur des utilisateurs dans la liste des utilisateurs en ligne.</em>', 'cat' => 'user_group'),
	'acl_a_userdel'		=> array('lang' => 'Peut supprimer et délester des utilisateurs', 'cat' => 'user_group'),
	'acl_a_group'		=> array('lang' => 'Peut gérer les groupes', 'cat' => 'user_group'),
	'acl_a_groupadd'	=> array('lang' => 'Peut ajouter de nouveaux groupes', 'cat' => 'user_group'),
	'acl_a_groupdel'	=> array('lang' => 'Peut supprimer des groupes', 'cat' => 'user_group'),
	'acl_a_ranks'		=> array('lang' => 'Peut gérer les rangs', 'cat' => 'user_group'),
	'acl_a_profile'		=> array('lang' => 'Peut gérer les champs de profil personnalisés', 'cat' => 'user_group'),
	'acl_a_names'		=> array('lang' => 'Peut gérer les noms interdits', 'cat' => 'user_group'),
	'acl_a_ban'			=> array('lang' => 'Peut gérer les bannissements', 'cat' => 'user_group'),

	'acl_a_viewauth'	=> array('lang' => 'Peut voir les masques de permissions', 'cat' => 'permissions'),
	'acl_a_authgroups'	=> array('lang' => 'Peut modifier les permissions de groupes individuels', 'cat' => 'permissions'),
	'acl_a_authusers'	=> array('lang' => 'Peut modifier les permissions d’utilisateurs individuels', 'cat' => 'permissions'),
	'acl_a_fauth'		=> array('lang' => 'Peut modifier les permissions des forums', 'cat' => 'permissions'),
	'acl_a_mauth'		=> array('lang' => 'Peut modifier les permissions des modérateurs', 'cat' => 'permissions'),
	'acl_a_aauth'		=> array('lang' => 'Peut modifier les permissions des administrateurs', 'cat' => 'permissions'),
	'acl_a_uauth'		=> array('lang' => 'Peut modifier les permissions des utilisateurs', 'cat' => 'permissions'),
	'acl_a_roles'		=> array('lang' => 'Peut gérer les rôles', 'cat' => 'permissions'),
	'acl_a_switchperm'	=> array('lang' => 'Peut utiliser d’autres permissions', 'cat' => 'permissions'),

	'acl_a_styles'		=> array('lang' => 'Peut gérer les styles', 'cat' => 'misc'),
	'acl_a_viewlogs'	=> array('lang' => 'Peut voir les historiques', 'cat' => 'misc'),
	'acl_a_clearlogs'	=> array('lang' => 'Peut effacer les historiques', 'cat' => 'misc'),
	'acl_a_modules'		=> array('lang' => 'Peut gérer les modules', 'cat' => 'misc'),
	'acl_a_language'	=> array('lang' => 'Peut gérer les archives de langues', 'cat' => 'misc'),
	'acl_a_email'		=> array('lang' => 'Peut envoyer un e-mail de masse', 'cat' => 'misc'),
	'acl_a_bots'		=> array('lang' => 'Peut gérer les robots', 'cat' => 'misc'),
	'acl_a_reasons'		=> array('lang' => 'Peut gérer les rapports et les raisons', 'cat' => 'misc'),
	'acl_a_backup'		=> array('lang' => 'Peut sauvegarder et restaurer la base de données', 'cat' => 'misc'),
	'acl_a_search'		=> array('lang' => 'Peut gérer l’indexation et les réglages de la recherche', 'cat' => 'misc'),
));

?>