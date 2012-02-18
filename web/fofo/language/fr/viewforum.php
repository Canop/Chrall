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
* viewforum [French]
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
	'ACTIVE_TOPICS'			=> 'Sujets actifs',
	'ANNOUNCEMENTS'			=> 'Annonces',

	'FORUM_PERMISSIONS'		=> 'Permissions du forum',

	'ICON_ANNOUNCEMENT'		=> 'Annonce',
	'ICON_STICKY'			=> 'Note',

	'LOGIN_NOTIFY_FORUM'	=> 'Vous avez été averti à partir de ce forum, veuillez vous connecter afin de le consulter.',

	'MARK_TOPICS_READ'		=> 'Marquer les sujets comme lus',

	'NEW_POSTS_HOT'			=> 'Nouveaux messages [ Populaires ]',	// Not used anymore
	'NEW_POSTS_LOCKED'		=> 'Nouveaux messages [ Verrouillés ]',	// Not used anymore
	'NO_NEW_POSTS_HOT'		=> 'Aucun nouveau message [ Populaire ]',	// Not used anymore
	'NO_NEW_POSTS_LOCKED'	=> 'Aucun nouveau message [ Verrouillé ]',	// Not used anymore
	'NO_READ_ACCESS'		=> 'Vous n’avez pas les permissions appropriées afin de lire les sujets de ce forum.',
	'NO_UNREAD_POSTS_HOT'		=> 'Aucun message non lu [ Populaire ]',
	'NO_UNREAD_POSTS_LOCKED'	=> 'Aucun message non lu [ Verrouillé ]',

	'POST_FORUM_LOCKED'		=> 'Le forum est verrouillé',

	'TOPICS_MARKED'			=> 'Les sujets de ce forum sont à présent marqués comme lus.',

	'UNREAD_POSTS_HOT'		=> 'Messages non lus [ Populaires ]',
	'UNREAD_POSTS_LOCKED'	=> 'Messages non lus [ Verrouillés ]',

	'VIEW_FORUM'			=> 'Voir le forum',
	'VIEW_FORUM_TOPIC'		=> '1 sujet',
	'VIEW_FORUM_TOPICS'		=> '%d sujets',
));

?>