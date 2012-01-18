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
* mcp [French]
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
	'ACTION'				=> 'Action',
	'ACTION_NOTE'			=> 'Action/note',
	'ADD_FEEDBACK'			=> 'Ajouter une remarque',
	'ADD_FEEDBACK_EXPLAIN'	=> 'Veuillez compléter le formulaire suivant afin d’ajouter une remarque. N’utilisez que du texte brut. L’HTML, le BBCode, etc. ne sont pas autorisés.',
	'ADD_WARNING'			=> 'Ajouter un avertissement',
	'ADD_WARNING_EXPLAIN'	=> 'Veuillez compléter le formulaire suivant afin de distribuer un avertissement à cet utilisateur. N’utilisez que du texte brut, l’HTML, le BBCode, etc. n’est pas autorisé.',
	'ALL_ENTRIES'			=> 'Toutes les entrées',
	'ALL_NOTES_DELETED'		=> 'Toutes les notes sur cet utilisateur ont été supprimées avec succès.',
	'ALL_REPORTS'			=> 'Tous les rapports',
	'ALREADY_REPORTED'		=> 'Ce message a déjà été rapporté.',
	'ALREADY_REPORTED_PM'	=> 'Ce message privé a déjà été rapporté.',
	'ALREADY_WARNED'		=> 'Un avertissement a déjà été prononcé sur ce message.',
	'APPROVE'				=> 'Approuver',
	'APPROVE_POST'			=> 'Approuver le message',
	'APPROVE_POST_CONFIRM'	=> 'Êtes-vous sûr de vouloir approuver ce message ?',
	'APPROVE_POSTS'			=> 'Approuver les messages',
	'APPROVE_POSTS_CONFIRM'	=> 'Êtes-vous sûr de vouloir approuver les messages sélectionnés ?',

	'CANNOT_MOVE_SAME_FORUM'=> 'Vous n’êtes pas autorisé à déplacer le sujet vers ce forum car il existe déjà dans celui-ci.',
	'CANNOT_WARN_ANONYMOUS'	=> 'Vous ne pouvez pas distribuer d’avertissements aux visiteurs.',
	'CANNOT_WARN_SELF'		=> 'Vous ne pouvez pas vous distribuer d’avertissements.',
	'CAN_LEAVE_BLANK'		=> 'Ceci peut être laissé vide.',
	'CHANGE_POSTER'			=> 'Modifier le rédacteur',
	'CLOSE_PM_REPORT'		=> 'Fermer le rapport de MP',
	'CLOSE_PM_REPORT_CONFIRM'	=> 'Êtes-vous sûr de vouloir fermer le rapport de MP sélectionné ?',
	'CLOSE_PM_REPORTS'		=> 'Fermer les rapports de MP',
	'CLOSE_PM_REPORTS_CONFIRM'	=> 'Êtes-vous sûr de vouloir fermer les rapports de MP sélectionnés ?',
	'CLOSE_REPORT'			=> 'Fermer le rapport',
	'CLOSE_REPORT_CONFIRM'	=> 'Êtes-vous sûr de vouloir fermer le rapport sélectionné ?',
	'CLOSE_REPORTS'			=> 'Fermer les rapports',
	'CLOSE_REPORTS_CONFIRM'	=> 'Êtes-vous sûr de vouloir fermer les rapports sélectionnés ?',

	'DELETE_PM_REPORT'			=> 'Supprimer le rapport de MP',
	'DELETE_PM_REPORT_CONFIRM'	=> 'Êtes-vous sûr de vouloir supprimer le rapport de MP sélectionné ?',
	'DELETE_PM_REPORTS'			=> 'Supprimer les rapports de MP',
	'DELETE_PM_REPORTS_CONFIRM'	=> 'Êtes-vous sûr de vouloir supprimer les rapports de MP sélectionnés ?',
	'DELETE_POSTS'				=> 'Supprimer les messages',
	'DELETE_POSTS_CONFIRM'		=> 'Êtes-vous sûr de vouloir supprimer ces messages ?',
	'DELETE_POST_CONFIRM'		=> 'Êtes-vous sûr de vouloir supprimer ce message ?',
	'DELETE_REPORT'				=> 'Supprimer le rapport',
	'DELETE_REPORT_CONFIRM'		=> 'Êtes-vous sûr de vouloir supprimer le rapport sélectionné ?',
	'DELETE_REPORTS'			=> 'Supprimer les rapports',
	'DELETE_REPORTS_CONFIRM'	=> 'Êtes-vous sûr de vouloir supprimer les rapports sélectionnés ?',
	'DELETE_SHADOW_TOPIC'		=> 'Supprimer la redirection du sujet',
	'DELETE_TOPICS'				=> 'Supprimer les sujets sélectionnés',
	'DELETE_TOPICS_CONFIRM'		=> 'Êtes-vous sûr de vouloir supprimer ces sujets ?',
	'DELETE_TOPIC_CONFIRM'		=> 'Êtes-vous sûr de vouloir supprimer ce sujet ?',
	'DISAPPROVE'				=> 'Désapprouver',
	'DISAPPROVE_REASON'			=> 'Raison de la désapprobation',
	'DISAPPROVE_POST'			=> 'Désapprouver le message',
	'DISAPPROVE_POST_CONFIRM'	=> 'Êtes-vous sûr de vouloir désapprouver ce message ?',
	'DISAPPROVE_POSTS'			=> 'Désapprouver les messages',
	'DISAPPROVE_POSTS_CONFIRM'	=> 'Êtes-vous sûr de vouloir désapprouver les messages sélectionnés ?',
	'DISPLAY_LOG'				=> 'Afficher les entrées précédentes',
	'DISPLAY_OPTIONS'			=> 'Options d’affichage',

	'EMPTY_REPORT'					=> 'Vous devez saisir une description lorsque vous sélectionnez cette raison.',
	'EMPTY_TOPICS_REMOVED_WARNING'	=> 'Veuillez noter qu’un ou plusieurs sujets ont été supprimés de la base de données car ils étaient ou devenaient vides.',

	'FEEDBACK'				=> 'Remarque',
	'FORK'					=> 'Copier',
	'FORK_TOPIC'			=> 'Copier le sujet',
	'FORK_TOPIC_CONFIRM'	=> 'Êtes-vous sûr de vouloir copier ce sujet ?',
	'FORK_TOPICS'			=> 'Copier les sujets sélectionnés',
	'FORK_TOPICS_CONFIRM'	=> 'Êtes-vous sûr de vouloir copier les sujets sélectionnés ?',
	'FORUM_DESC'			=> 'Description',
	'FORUM_NAME'			=> 'Nom du forum',
	'FORUM_NOT_EXIST'		=> 'Le forum que vous avez sélectionné n’existe pas.',
	'FORUM_NOT_POSTABLE'	=> 'Il n’est pas possible de publier des messages dans ce forum.',
	'FORUM_STATUS'			=> 'Statut du forum',
	'FORUM_STYLE'			=> 'Style du forum',

	'GLOBAL_ANNOUNCEMENT'	=> 'Annonce globale',

	'IP_INFO'				=> 'Informations sur l’adresse IP',
	'IPS_POSTED_FROM'		=> 'Adresses IP utilisées par cet utilisateur',

	'LATEST_LOGS'				=> 'Les 5 derniers évènements',
	'LATEST_REPORTED'			=> 'Les 5 derniers rapports',
	'LATEST_REPORTED_PMS'		=> 'Les 5 derniers rapports de MP',
	'LATEST_UNAPPROVED'			=> 'Les 5 derniers messages en attente d’approbation',
	'LATEST_WARNING_TIME'		=> 'Le dernier avertissement publié',
	'LATEST_WARNINGS'			=> 'Les 5 derniers avertissements',
	'LEAVE_SHADOW'				=> 'Conserver sur place une redirection du sujet',
	'LIST_REPORT'				=> '1 rapport',
	'LIST_REPORTS'				=> '%d rapports',
	'LOCK'						=> 'Verrouiller',
	'LOCK_POST_POST'			=> 'Verrouiller le message',
	'LOCK_POST_POST_CONFIRM'	=> 'Êtes-vous sûr de vouloir empêcher l’édition de ce message ?',
	'LOCK_POST_POSTS'			=> 'Verrouiller les messages sélectionnés',
	'LOCK_POST_POSTS_CONFIRM'	=> 'Êtes-vous sûr de vouloir empêcher l’édition des messages sélectionnés ?',
	'LOCK_TOPIC_CONFIRM'		=> 'Êtes-vous sûr de vouloir verrouiller ce sujet ?',
	'LOCK_TOPICS'				=> 'Verrouiller les sujets sélectionnés',
	'LOCK_TOPICS_CONFIRM'		=> 'Êtes-vous sûr de vouloir verrouiller tous les sujets sélectionnés ?',
	'LOGS_CURRENT_TOPIC'		=> 'Consulte actuellement l’historique de :',
	'LOGIN_EXPLAIN_MCP'			=> 'Vous devez vous connecter afin de modérer ce forum.',
	'LOGVIEW_VIEWTOPIC'			=> 'Voir le sujet',
	'LOGVIEW_VIEWLOGS'			=> 'Voir l’historique du sujet',
	'LOGVIEW_VIEWFORUM'			=> 'Voir le forum',
	'LOOKUP_ALL'				=> 'Rechercher toutes les IP',
	'LOOKUP_IP'					=> 'Rechercher une IP',

	'MARKED_NOTES_DELETED'		=> 'Toutes les notes que vous avez sélectionné sur l’utilisateur ont été supprimées avec succès.',

	'MCP_ADD'						=> 'Ajouter un avertissement',

	'MCP_BAN'					=> 'Bannissement',
	'MCP_BAN_EMAILS'			=> 'Bannir des adresses e-mails',
	'MCP_BAN_IPS'				=> 'Bannir des adresses IP',
	'MCP_BAN_USERNAMES'			=> 'Bannir des noms d’utilisateurs',

	'MCP_LOGS'						=> 'Historique des modérateurs',
	'MCP_LOGS_FRONT'				=> 'Page principale',
	'MCP_LOGS_FORUM_VIEW'			=> 'Historique des forums',
	'MCP_LOGS_TOPIC_VIEW'			=> 'Historique des sujets',

	'MCP_MAIN'						=> 'Principal',
	'MCP_MAIN_FORUM_VIEW'			=> 'Voir le forum',
	'MCP_MAIN_FRONT'				=> 'Page principale',
	'MCP_MAIN_POST_DETAILS'			=> 'Informations sur le message',
	'MCP_MAIN_TOPIC_VIEW'			=> 'Voir le sujet',
	'MCP_MAKE_ANNOUNCEMENT'			=> 'Modifier en “Annonce”',
	'MCP_MAKE_ANNOUNCEMENT_CONFIRM'	=> 'Êtes-vous sûr de vouloir modifier ce sujet en “Annonce” ?',
	'MCP_MAKE_ANNOUNCEMENTS'		=> 'Modifier en “Annonces”',
	'MCP_MAKE_ANNOUNCEMENTS_CONFIRM'=> 'Êtes-vous sûr de vouloir modifier les sujets sélectionnés en “Annonces” ?',
	'MCP_MAKE_GLOBAL'				=> 'Modifier en “Annonce globale”',
	'MCP_MAKE_GLOBAL_CONFIRM'		=> 'Êtes-vous sûr de vouloir modifier ce sujet en “Annonce globale” ?',
	'MCP_MAKE_GLOBALS'				=> 'Modifier en “Annonces globales”',
	'MCP_MAKE_GLOBALS_CONFIRM'		=> 'Êtes-vous sûr de vouloir modifier les sujets sélectionnés en “Annonces globales” ?',
	'MCP_MAKE_STICKY'				=> 'Modifier en “Note”',
	'MCP_MAKE_STICKY_CONFIRM'		=> 'Êtes-vous sûr de vouloir modifier ce sujet en “Note” ?',
	'MCP_MAKE_STICKIES'				=> 'Modifier en “Notes”',
	'MCP_MAKE_STICKIES_CONFIRM'		=> 'Êtes-vous sûr de vouloir modifier les sujets sélectionnés en “Notes” ?',
	'MCP_MAKE_NORMAL'				=> 'Modifier en “Sujet standard”',
	'MCP_MAKE_NORMAL_CONFIRM'		=> 'Êtes-vous sûr de vouloir modifier ce sujet en “Sujet standard” ?',
	'MCP_MAKE_NORMALS'				=> 'Modifier en “Sujets standards”',
	'MCP_MAKE_NORMALS_CONFIRM'		=> 'Êtes-vous sûr de vouloir modifier les sujets sélectionnés en “Sujets standards” ?',

	'MCP_NOTES'						=> 'Notes sur l’utilisateur',
	'MCP_NOTES_FRONT'				=> 'Page principale',
	'MCP_NOTES_USER'				=> 'Informations sur l’utilisateur',

	'MCP_POST_REPORTS'				=> 'Rapports prononcés sur ce message',

	'MCP_PM_REPORTS'				=> 'MP rapportés',
	'MCP_PM_REPORT_DETAILS'			=> 'Informations sur le rapport de MP',
	'MCP_PM_REPORTS_CLOSED'			=> 'Rapports de MP fermés',
	'MCP_PM_REPORTS_CLOSED_EXPLAIN'	=> 'Ceci est la liste de tous les messages privés qui ont été rapportés et qui ont été résolus antérieurement.',
	'MCP_PM_REPORTS_OPEN'			=> 'Rapports de MP ouverts',
	'MCP_PM_REPORTS_OPEN_EXPLAIN'	=> 'Ceci est la liste de tous les messages privés qui ont été rapportés et qui sont encore en attente de traitement.',

	'MCP_REPORTS'					=> 'Messages rapportés',
	'MCP_REPORT_DETAILS'			=> 'Informations sur le rapport',
	'MCP_REPORTS_CLOSED'			=> 'Rapports fermés',
	'MCP_REPORTS_CLOSED_EXPLAIN'	=> 'Ceci est la liste de tous les messages qui ont été rapportés et qui ont été résolus antérieurement.',
	'MCP_REPORTS_OPEN'				=> 'Rapports ouverts',
	'MCP_REPORTS_OPEN_EXPLAIN'		=> 'Ceci est la liste de tous les messages qui ont été rapportés et qui sont encore en attente de traitement.',

	'MCP_QUEUE'								=> 'File d’attente de modération',
	'MCP_QUEUE_APPROVE_DETAILS'				=> 'Approuver les informations',
	'MCP_QUEUE_UNAPPROVED_POSTS'			=> 'Messages en attente d’approbation',
	'MCP_QUEUE_UNAPPROVED_POSTS_EXPLAIN'	=> 'Ceci est la liste de tous les messages qui nécessitent une approbation afin qu’ils soient visibles aux utilisateurs.',
	'MCP_QUEUE_UNAPPROVED_TOPICS'			=> 'Sujets en attente d’approbation',
	'MCP_QUEUE_UNAPPROVED_TOPICS_EXPLAIN'	=> 'Ceci est la liste de tous les sujets qui nécessitent une approbation afin qu’ils soient visibles aux utilisateurs.',

	'MCP_VIEW_USER'			=> 'Voir les avertissements d’un utilisateur spécifique',

	'MCP_WARN'				=> 'Avertissements',
	'MCP_WARN_FRONT'		=> 'Page principale',
	'MCP_WARN_LIST'			=> 'Liste des avertissements',
	'MCP_WARN_POST'			=> 'Avertir pour le message spécifique',
	'MCP_WARN_USER'			=> 'Avertir l’utilisateur',

	'MERGE_POSTS'			=> 'Fusionner les messages',
	'MERGE_POSTS_CONFIRM'	=> 'Êtes-vous sûr de vouloir fusionner les messages sélectionnés ?',
	'MERGE_TOPIC_EXPLAIN'	=> 'En utilisant le formulaire ci-dessous, vous pouvez fusionner les messages que vous avez sélectionné dans un autre sujet. Ces messages ne seront pas réordonnés et apparaîtront comme si les utilisateurs les avaient publiés dans le nouveau sujet.<br />Veuillez saisir le numéro d’identification du sujet de destination ou cliquer sur <em>Sélectionner le sujet</em> afin d’en rechercher un.',
	'MERGE_TOPIC_ID'		=> 'Numéro d’identification du sujet de destination',
	'MERGE_TOPICS'			=> 'Fusionner les sujets',
	'MERGE_TOPICS_CONFIRM'	=> 'Êtes-vous sûr de vouloir fusionner les sujets sélectionnés ?',
	'MODERATE_FORUM'		=> 'Modérer le forum',
	'MODERATE_TOPIC'		=> 'Modérer le sujet',
	'MODERATE_POST'			=> 'Modérer le message',
	'MOD_OPTIONS'			=> 'Options de la modération',
	'MORE_INFO'				=> 'Informations supplémentaires',
	'MOST_WARNINGS'			=> 'Utilisateurs les plus avertis',
	'MOVE_TOPIC_CONFIRM'	=> 'Êtes-vous sûr de vouloir déplacer le sujet vers un nouveau forum ?',
	'MOVE_TOPICS'			=> 'Déplacer les sujets sélectionnés',
	'MOVE_TOPICS_CONFIRM'	=> 'Êtes-vous sûr de vouloir déplacer les sujets sélectionnés vers un nouveau forum ?',

	'NOTIFY_POSTER_APPROVAL'		=> 'Avertir l’auteur du message concernant l’approbation ?',
	'NOTIFY_POSTER_DISAPPROVAL'		=> 'Avertir l’auteur du message concernant la désapprobation ?',
	'NOTIFY_USER_WARN'				=> 'Avertir l’utilisateur à propos de l’avertissement ?',
	'NOT_MODERATOR'					=> 'Vous n’êtes pas un modérateur de ce forum.',
	'NO_DESTINATION_FORUM'			=> 'Veuillez sélectionner un forum de destination.',
	'NO_DESTINATION_FORUM_FOUND'	=> 'Aucun forum de destination n’est disponible.',
	'NO_ENTRIES'					=> 'Aucun historique n’existe sur cette période.',
	'NO_FEEDBACK'					=> 'Aucune remarque n’existe sur cet utilisateur.',
	'NO_FINAL_TOPIC_SELECTED'		=> 'Vous devez sélectionner un sujet de destination afin de fusionner les messages.',
	'NO_MATCHES_FOUND'				=> 'Aucun résultat n’a été trouvé.',
	'NO_POST'						=> 'Vous devez sélectionner un message avant d’avertir un utilisateur concernant un de ses messages.',
	'NO_POST_REPORT'				=> 'Ce message n’a pas été rapporté.',
	'NO_POST_SELECTED'				=> 'Vous devez sélectionner au moins un message afin d’effectuer cette opération.',
	'NO_REASON_DISAPPROVAL'			=> 'Veuillez spécifier une raison appropriée concernant la désapprobation.',
	'NO_REPORT'						=> 'Aucun rapport n’a été trouvé',
	'NO_REPORTS'					=> 'Aucun rapport n’a été trouvé',
	'NO_REPORT_SELECTED'			=> 'Vous devez sélectionner au moins un rapport afin d’effectuer cette opération.',
	'NO_TOPIC_ICON'					=> 'Aucun',
	'NO_TOPIC_SELECTED'				=> 'Vous devez sélectionner au moins un sujet afin d’effectuer cette opération.',
	'NO_TOPICS_QUEUE'				=> 'Aucun sujet n’est en attente d’approbation.',

	'ONLY_TOPIC'			=> 'Uniquement le sujet “%s”',
	'OTHER_USERS'			=> 'Autres utilisateurs ayant publiés avec cette IP',

	'PM_REPORT_CLOSED_SUCCESS'	=> 'Le rapport de MP sélectionné a été fermé avec succès.',
	'PM_REPORT_DELETED_SUCCESS'	=> 'Le rapport de MP sélectionné a été supprimé avec succès.',
	'PM_REPORTED_SUCCESS'		=> 'Ce message privé a été rapporté avec succès.',
	'PM_REPORT_TOTAL'			=> 'Au total, il y a <strong>1</strong> rapport de MP à traiter.',
	'PM_REPORTS_CLOSED_SUCCESS'	=> 'Les rapports de MP sélectionnés ont été fermés avec succès.',
	'PM_REPORTS_DELETED_SUCCESS'=> 'Les rapport de MP sélectionnés ont été supprimés avec succès.',
	'PM_REPORTS_TOTAL'			=> 'Au total, il y a <strong>%d</strong> rapports de MP à traiter.',
	'PM_REPORTS_ZERO_TOTAL'		=> 'Il n’y a aucun rapport de MP à traiter.',
	'PM_REPORT_DETAILS'			=> 'Informations sur le rapport de message privé',
	'POSTER'					=> 'Rédacteur',
	'POSTS_APPROVED_SUCCESS'	=> 'Les messages sélectionnés ont été approuvés avec succès.',
	'POSTS_DELETED_SUCCESS'		=> 'Les messages sélectionnés ont été supprimés de la base de données avec succès.',
	'POSTS_DISAPPROVED_SUCCESS'	=> 'Les messages sélectionnés ont été désapprouvés avec succès.',
	'POSTS_LOCKED_SUCCESS'		=> 'Les messages sélectionnés ont été verrouillés avec succès.',
	'POSTS_MERGED_SUCCESS'		=> 'Les messages sélectionnés ont été fusionnés avec succès.',
	'POSTS_UNLOCKED_SUCCESS'	=> 'Les messages sélectionnés ont été déverrouillés avec succès.',
	'POSTS_PER_PAGE'			=> 'Messages par page',
	'POSTS_PER_PAGE_EXPLAIN'	=> '(réglez cette valeur sur <samp>0</samp> afin de consulter tous les messages)',
	'POST_APPROVED_SUCCESS'		=> 'Le message sélectionné a été approuvé avec succès.',
	'POST_DELETED_SUCCESS'		=> 'Le message sélectionné a été supprimé de la base de données avec succès.',
	'POST_DISAPPROVED_SUCCESS'	=> 'Le message sélectionné a été désapprouvé avec succès.',
	'POST_LOCKED_SUCCESS'		=> 'Le message a été verrouillé avec succès.',
	'POST_NOT_EXIST'			=> 'Le message que vous avez recherché n’existe pas.',
	'POST_REPORTED_SUCCESS'		=> 'Ce message a été rapporté avec succès.',
	'POST_UNLOCKED_SUCCESS'		=> 'Le message a été déverrouillé avec succès.',

	'READ_USERNOTES'			=> 'Notes sur l’utilisateur',
	'READ_WARNINGS'				=> 'Avertissements de l’utilisateur',
	'REPORTER'					=> 'Auteur du rapport',
	'REPORTED'					=> 'Rapporté',
	'REPORTED_BY'				=> 'Rapporté par',
	'REPORTED_ON_DATE'			=> 'le',
	'REPORTS_CLOSED_SUCCESS'	=> 'Les rapports sélectionnés ont été fermés avec succès.',
	'REPORTS_DELETED_SUCCESS'	=> 'Les rapports sélectionnés ont été supprimés avec succès.',
	'REPORTS_TOTAL'				=> 'Au total, il y a <strong>%d</strong> rapports à traiter.',
	'REPORTS_ZERO_TOTAL'		=> 'Il n’y a aucun rapport à traiter.',
	'REPORT_CLOSED'				=> 'Ce rapport a déjà été fermé.',
	'REPORT_CLOSED_SUCCESS'		=> 'Le rapport sélectionné a été fermé avec succès.',
	'REPORT_DELETED_SUCCESS'	=> 'Le rapport sélectionné a été supprimé avec succès.',
	'REPORT_DETAILS'			=> 'Informations sur le rapport',
	'REPORT_MESSAGE'			=> 'Rapporter ce message',
	'REPORT_MESSAGE_EXPLAIN'	=> 'Veuillez utiliser ce formulaire afin de rapporter le message privé sélectionné. Seuls les messages violant des règles du forum devraient être rapportés. <strong>Lorsqu’un message privé est rapporté, son contenu est rendu visible à tous les modérateurs.</strong>',
	'REPORT_NOTIFY'				=> 'M’avertir',
	'REPORT_NOTIFY_EXPLAIN'		=> 'Vous avertir lorsque votre rapport sera traité.',
	'REPORT_POST_EXPLAIN'		=> 'Veuillez utiliser ce formulaire afin de rapporter le message sélectionné aux modérateurs et aux administrateurs du forum. Seuls les messages violant des règles du forum devraient être rapportés.',
	'REPORT_REASON'				=> 'Raison du rapport',
	'REPORT_TIME'				=> 'Date du rapport',
	'REPORT_TOTAL'				=> 'Au total, il y a <strong>1</strong> rapport à traiter.',
	'RESYNC'					=> 'Resynchroniser',
	'RETURN_MESSAGE'			=> '%sRetour au message%s',
	'RETURN_NEW_FORUM'			=> '%sAller sur le nouveau forum%s',
	'RETURN_NEW_TOPIC'			=> '%sAller sur le nouveau sujet%s',
	'RETURN_PM'					=> '%sRetour au message privé%s',
	'RETURN_POST'				=> '%sRetour au message%s',
	'RETURN_QUEUE'				=> '%sRetour à la file d’attente%s',
	'RETURN_REPORTS'			=> '%sRetour aux rapports%s',
	'RETURN_TOPIC_SIMPLE'		=> '%sRetour au sujet%s',

	'SEARCH_POSTS_BY_USER'				=> 'Rechercher les messages de',
	'SELECT_ACTION'						=> 'Sélectionner une action souhaitée',
	'SELECT_FORUM_GLOBAL_ANNOUNCEMENT'	=> 'Veuillez sélectionner le forum dans lequel vous souhaitez afficher cette annonce globale.',
	'SELECT_FORUM_GLOBAL_ANNOUNCEMENTS'	=> 'Un ou plusieurs sujets que vous avez sélectionné sont des annonces globales. Veuillez sélectionner le forum dans lequel vous souhaitez qu’elles soient affichées.',
	'SELECT_MERGE'						=> 'Sélectionner pour la fusion',
	'SELECT_TOPICS_FROM'				=> 'Sélectionner les sujets de',
	'SELECT_TOPIC'						=> 'Sélectionner un sujet',
	'SELECT_USER'						=> 'Sélectionner un utilisateur',
	'SORT_ACTION'						=> 'Historique',
	'SORT_DATE'							=> 'Date',
	'SORT_IP'							=> 'Adresse IP',
	'SORT_WARNINGS'						=> 'Avertissements',
	'SPLIT_AFTER'						=> 'Diviser le sujet à partir du message sélectionné',
	'SPLIT_FORUM'						=> 'Forum du nouveau sujet',
	'SPLIT_POSTS'						=> 'Diviser les messages sélectionnés',
	'SPLIT_SUBJECT'						=> 'Titre du nouveau sujet',
	'SPLIT_TOPIC_ALL'					=> 'Diviser le sujet à partir des messages sélectionnés',
	'SPLIT_TOPIC_ALL_CONFIRM'			=> 'Êtes-vous sûr de vouloir diviser ce sujet ?',
	'SPLIT_TOPIC_BEYOND'				=> 'Diviser le sujet à partir du message sélectionné',
	'SPLIT_TOPIC_BEYOND_CONFIRM'		=> 'Êtes-vous sûr de vouloir diviser ce sujet à partir du message sélectionné ?',
	'SPLIT_TOPIC_EXPLAIN'				=> 'En utilisant le formulaire ci-dessous, vous pouvez diviser un sujet en deux. Pour ce faire, sélectionnez individuellement les sujets ou divisez le sujet à partir d’un message sélectionné.',

	'THIS_PM_IP'				=> 'IP de ce message privé',
	'THIS_POST_IP'				=> 'IP de ce message.',
	'TOPICS_APPROVED_SUCCESS'	=> 'Les sujets sélectionnés ont été approuvés avec succès.',
	'TOPICS_DELETED_SUCCESS'	=> 'Les sujets sélectionnés ont été supprimés de la base de données avec succès.',
	'TOPICS_DISAPPROVED_SUCCESS'=> 'Les sujets sélectionnés ont été désapprouvés avec succès.',
	'TOPICS_FORKED_SUCCESS'		=> 'Les sujets sélectionnés ont été copiés avec succès.',
	'TOPICS_LOCKED_SUCCESS'		=> 'Les sujets sélectionnés ont été verrouillés avec succès.',
	'TOPICS_MOVED_SUCCESS'		=> 'Les sujets sélectionnés ont été déplacés avec succès.',
	'TOPICS_RESYNC_SUCCESS'		=> 'Les sujets sélectionnés ont été resynchronisés avec succès.',
	'TOPICS_TYPE_CHANGED'		=> 'Le type des sujets sélectionnés a été modifié avec succès.',
	'TOPICS_UNLOCKED_SUCCESS'	=> 'Les sujets sélectionnés ont été déverrouillés avec succès.',
	'TOPIC_APPROVED_SUCCESS'	=> 'Le sujet sélectionné a été approuvé avec succès.',
	'TOPIC_DELETED_SUCCESS'		=> 'Le sujet sélectionné a été supprimé de la base de données avec succès.',
	'TOPIC_DISAPPROVED_SUCCESS'	=> 'Le sujet sélectionné a été désapprouvé avec succès.',
	'TOPIC_FORKED_SUCCESS'		=> 'Le sujet sélectionné a été copié avec succès.',
	'TOPIC_LOCKED_SUCCESS'		=> 'Le sujet sélectionné a été verrouillé avec succès.',
	'TOPIC_MOVED_SUCCESS'		=> 'Le sujet sélectionné a été déplacé avec succès.',
	'TOPIC_NOT_EXIST'			=> 'Le sujet sélectionné n’existe pas.',
	'TOPIC_RESYNC_SUCCESS'		=> 'Le sujet sélectionné a été resynchronisé avec succès.',
	'TOPIC_SPLIT_SUCCESS'		=> 'Le sujet sélectionné a été divisé avec succès.',
	'TOPIC_TIME'				=> 'Heure du sujet',
	'TOPIC_TYPE_CHANGED'		=> 'Le type de sujet a été modifié avec succès.',
	'TOPIC_UNLOCKED_SUCCESS'	=> 'Le sujet sélectionné a été déverrouillé avec succès.',
	'TOTAL_WARNINGS'			=> 'Total des avertissements',

	'UNAPPROVED_POSTS_TOTAL'		=> 'Au total, il y a <strong>%d</strong> messages en attente d’approbation.',
	'UNAPPROVED_POSTS_ZERO_TOTAL'	=> 'Il n’y a aucun message en attente d’approbation.',
	'UNAPPROVED_POST_TOTAL'			=> 'Au total, il y a <strong>1</strong> message en attente d’approbation.',
	'UNLOCK'						=> 'Déverrouiller',
	'UNLOCK_POST'					=> 'Déverrouiller le message',
	'UNLOCK_POST_EXPLAIN'			=> 'Autoriser l’édition',
	'UNLOCK_POST_POST'				=> 'Déverrouiller le message',
	'UNLOCK_POST_POST_CONFIRM'		=> 'Êtes-vous sûr de vouloir autoriser l’édition de ce message ?',
	'UNLOCK_POST_POSTS'				=> 'Déverrouiller les messages sélectionnés',
	'UNLOCK_POST_POSTS_CONFIRM'		=> 'Êtes-vous sûr de vouloir autoriser l’édition des messages sélectionnés ?',
	'UNLOCK_TOPIC'					=> 'Déverrouiller le sujet',
	'UNLOCK_TOPIC_CONFIRM'			=> 'Êtes-vous sûr de vouloir déverrouiller ce sujet ?',
	'UNLOCK_TOPICS'					=> 'Déverrouiller les sujets sélectionnés',
	'UNLOCK_TOPICS_CONFIRM'			=> 'Êtes-vous sûr de vouloir déverrouiller tous les sujets sélectionnés ?',
	'USER_CANNOT_POST'				=> 'Vous ne pouvez pas publier de messages dans ce forum.',
	'USER_CANNOT_REPORT'			=> 'Vous ne pouvez pas rapporter les messages de ce forum.',
	'USER_FEEDBACK_ADDED'			=> 'La remarque a été ajouté sur l’utilisateur avec succès.',
	'USER_WARNING_ADDED'			=> 'L’utilisateur a été averti avec succès.',

	'VIEW_DETAILS'			=> 'Voir les informations',
	'VIEW_PM'				=> 'Voir le message privé',
	'VIEW_POST'            => 'Voir le message',

	'WARNED_USERS'			=> 'Utilisateurs avertis',
	'WARNED_USERS_EXPLAIN'	=> 'Ceci est la liste des utilisateurs avertis dont la période n’a pas encore expirée.',
	'WARNING_PM_BODY'		=> 'Ceci est un avertissement prononcé à votre encontre par un administrateur ou un modérateur de ce forum.[quote]%s[/quote]',
	'WARNING_PM_SUBJECT'	=> 'Avertissement',
	'WARNING_POST_DEFAULT'	=> 'Ceci est un avertissement concernant votre message suivant : %s .',
	'WARNINGS_ZERO_TOTAL'	=> 'Aucun avertissement n’existe.',

	'YOU_SELECTED_TOPIC'	=> 'Vous avez sélectionné le sujet numéro %d : %s.',

	'report_reasons'		=> array(
		'TITLE'	=> array(
			'WAREZ'		=> 'Piratage',
			'SPAM'		=> 'SPAM',
			'OFF_TOPIC'	=> 'Hors-sujet',
			'OTHER'		=> 'Autre',
		),
		'DESCRIPTION' => array(
			'WAREZ'		=> 'Le message rapporté contient des liens vers des ressources illégales ou des logiciels piratés.',
			'SPAM'		=> 'Le message rapporté contient de la publicité visant à promouvoir un site Internet ou un produit divers.',
			'OFF_TOPIC'	=> 'Le message rapporté est hors-sujet.',
			'OTHER'		=> 'Le message rapporté n’entre dans aucune autre catégorie, veuillez utiliser le champ d’information supplémentaire.'
		)
	),
));

?>