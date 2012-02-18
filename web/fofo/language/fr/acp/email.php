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
* acp_email [French]
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

// Email settings
$lang = array_merge($lang, array(
	'ACP_MASS_EMAIL_EXPLAIN'		=> 'Vous pouvez envoyer ici un e-mail à tous vos utilisateurs ou aux groupes d’utilisateurs <strong>ayant activés la réception des e-mails de masse</strong>. Pour cela, un e-mail sera envoyé à l’adresse e-mail fournie par l’administrateur et une copie sera adressée à tous les destinataires. Le réglage par défaut n’inclut que 50 destinataires par e-mail car plus il y a de destinataires, plus le temps d’attente est important. Il est normal que l’envoi d’un e-mail de masse prenne du temps, vous serez averti lorsque l’opération sera terminée.',
	'ALL_USERS'						=> 'Tous les utilisateurs',

	'COMPOSE'				=> 'Composer',

	'EMAIL_SEND_ERROR'		=> 'Des erreurs sont survenues lors de l’envoi de l’e-mail. Pour plus d’informations, veuillez consulter l’%shistorique des erreurs%s.',
	'EMAIL_SENT'			=> 'Ce message a été envoyé.',
	'EMAIL_SENT_QUEUE'		=> 'Ce message a été placé en file d’attente.',

	'LOG_SESSION'			=> 'Historique de la session e-mail vers l’historique des erreurs critiques',

	'SEND_IMMEDIATELY'		=> 'Envoyer immédiatement',
	'SEND_TO_GROUP'			=> 'Envoyer au groupe',
	'SEND_TO_USERS'			=> 'Envoyer aux utilisateurs',
	'SEND_TO_USERS_EXPLAIN'	=> 'Les noms sélectionnés ici écraseront n’importe quel groupe sélectionné ci-dessus. Saisissez chaque nom d’utilisateur sur une nouvelle ligne.',
	
	'MAIL_HIGH_PRIORITY'	=> 'Élevée',
	'MAIL_LOW_PRIORITY'		=> 'Faible',
	'MAIL_NORMAL_PRIORITY'	=> 'Normale',
	'MAIL_PRIORITY'			=> 'Priorité de l’e-mail',
	'MASS_MESSAGE'			=> 'Votre message',
	'MASS_MESSAGE_EXPLAIN'	=> 'Veuillez noter que vous ne devez saisir que du texte brut. Toutes les balises seront automatiquement supprimées lors de l’envoi.',
	
	'NO_EMAIL_MESSAGE'		=> 'Vous devez saisir un message.',
	'NO_EMAIL_SUBJECT'		=> 'Vous devez spécifier le sujet de votre message.',
));

?>