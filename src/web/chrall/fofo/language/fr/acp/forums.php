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
* acp_forums [French]
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

// Forum Admin
$lang = array_merge($lang, array(
	'AUTO_PRUNE_DAYS'			=> 'Durée du délestage automatique',
	'AUTO_PRUNE_DAYS_EXPLAIN'	=> 'Nombre de jours entre la publication du dernier message et la suppression du sujet.',
	'AUTO_PRUNE_FREQ'			=> 'Fréquence du délestage automatique',
	'AUTO_PRUNE_FREQ_EXPLAIN'	=> 'Nombre de jours entre les délestages automatiques.',
	'AUTO_PRUNE_VIEWED'			=> 'Durée du délestage automatique des message consultés',
	'AUTO_PRUNE_VIEWED_EXPLAIN'	=> 'Nombre de jours entre la dernière consultation du sujet et sa suppression.',

	'CONTINUE'						=> 'Continuer',
  'COPY_PERMISSIONS'				=> 'Copier les permissions de',
  'COPY_PERMISSIONS_EXPLAIN'		=> 'Pour faciliter la configuration des permissions de votre nouveau forum, vous pouvez copier les permissions d’un forum déjà existant.',
	'COPY_PERMISSIONS_ADD_EXPLAIN'	=> 'Une fois créé, le forum détiendra les mêmes permissions que celles que vous avez sélectionné ici. Si aucun forum n’est sélectionné, le forum créé ne sera pas visible car il ne détiendra aucune permission.',
	'COPY_PERMISSIONS_EDIT_EXPLAIN'	=> 'Si vous copiez les permissions, le forum détiendra les mêmes permissions que celles que vous avez sélectionné ici. Cela écrasera toutes les permissions antérieures du forum. Si aucun forum n’est sélectionné, les permissions actuelles seront conservées.',
	'COPY_TO_ACL'					=> 'Vous pouvez également %sconfigurer les nouvelles permissions%s de ce forum.',
	'CREATE_FORUM'					=> 'Créer un nouveau forum',

	'DECIDE_MOVE_DELETE_CONTENT'		=> 'Supprimer le contenu ou le déplacer vers le forum',
	'DECIDE_MOVE_DELETE_SUBFORUMS'		=> 'Supprimer les sous-forums ou les déplacer vers le forum',
	'DEFAULT_STYLE'						=> 'Style par défaut',
	'DELETE_ALL_POSTS'					=> 'Supprimer les messages',
	'DELETE_SUBFORUMS'					=> 'Supprimer les sous-forums et les messages',
	'DISPLAY_ACTIVE_TOPICS'				=> 'Activer les sujets actifs',
	'DISPLAY_ACTIVE_TOPICS_EXPLAIN'		=> 'Si réglé sur <samp>Oui</samp>, les sujets actifs du sous-forum sélectionné seront affichés dans cette catégorie.',

	'EDIT_FORUM'					=> 'Éditer le forum',
	'ENABLE_INDEXING'				=> 'Activer lindexation de la recherche',
	'ENABLE_INDEXING_EXPLAIN'		=> 'Si réglé sur <samp>Oui</samp>, les messages publiés dans ce forum seront indexés lors de la recherche.',
	'ENABLE_POST_REVIEW'			=> 'Activer la revue des messages',
	'ENABLE_POST_REVIEW_EXPLAIN'	=> 'Si réglé sur <samp>Oui</samp>, les utilisateurs pourront revoir leur message en éditant celui-ci alors que des réponses ont été publiées. Il est conseillé de ne pas activer cela sur les forums de discussions.',
	'ENABLE_QUICK_REPLY'			=> 'Activer la réponse rapide',
	'ENABLE_QUICK_REPLY_EXPLAIN'	=> 'Active la réponse rapide dans ce forum. Ce réglage n’est pas pris en compte si la réponse rapide a été désactivée sur tout le forum. La réponse rapide ne sera affichée qu’aux utilisateurs ayant la permission de publier dans ce forum.',
	'ENABLE_RECENT'					=> 'Afficher les sujets actifs',
	'ENABLE_RECENT_EXPLAIN'			=> 'Si réglé sur <samp>Oui</samp>, les sujets actifs du forum seront affichés dans la liste des sujets actifs.',
	'ENABLE_TOPIC_ICONS'			=> 'Activer les icônes de sujets',

	'FORUM_ADMIN'						=> 'Administration des forums',
	'FORUM_ADMIN_EXPLAIN'				=> 'Dans phpBB3, les catégories n’existent plus, tout est basé sur la notion de forums. Chaque forum peut contenir un nombre illimité de sous-forums et vous pouvez déterminer s’ils peuvent contenir ou non des messages, comme c’était le cas grâce aux anciennes catégories. Vous pouvez ajouter, éditer, supprimer, verrouiller ou déverrouiller ici des forums de manière individuelle et également régler certains contrôles additionnels. Si vos messages et vos sujets se désynchronisent, vous pouvez également resynchroniser un forum. <strong>Vous devez copier ou régler les permissions appropriées sur chaque nouveau forum créé afin qu’ils soient visibles de manière publique.</strong>',
	'FORUM_AUTO_PRUNE'					=> 'Activer le délestage automatique',
	'FORUM_AUTO_PRUNE_EXPLAIN'			=> 'Les sujets du forum seront automatiquement supprimés par rapport au réglage de la fréquence/temps ci-dessous.',
	'FORUM_CREATED'						=> 'Le forum a été créé avec succès.',
	'FORUM_DATA_NEGATIVE'				=> 'Les paramètres de délestage ne peuvent pas être négatifs.',
	'FORUM_DESC_TOO_LONG'				=> 'La description du forum est trop longue. Elle ne doit pas dépasser 4000 caractères.',
	'FORUM_DELETE'						=> 'Supprimer le forum',
	'FORUM_DELETE_EXPLAIN'				=> 'Le formulaire ci-dessous vous permet de supprimer un forum. Si le forum contient des sous-forums, des sujets et des messages, vous pouvez sélectionner l’emplacement où vous souhaitez les déplacer.',
	'FORUM_DELETED'						=> 'Le forum a été supprimé avec succès.',
	'FORUM_DESC'						=> 'Description',
	'FORUM_DESC_EXPLAIN'				=> 'Tout code HTML saisi ici sera affiché comme tel.',
	'FORUM_EDIT_EXPLAIN'				=> 'Le formulaire ci-dessous vous permet de personnaliser ce forum. La modération et les paramètres de contrôle du compteur de messages sont réglés par l’intermédiaire des permissions du forum concernant chaque utilisateur ou groupe d’utilisateurs.',
	'FORUM_IMAGE'						=> 'Image du forum',
	'FORUM_IMAGE_EXPLAIN'				=> 'Image additionnelle à associer à ce forum dont l’emplacement est relatif à la racine du répertoire de phpBB.',
	'FORUM_IMAGE_NO_EXIST'				=> 'L’image du forum que vous avez spécifié n’existe pas',
	'FORUM_LINK_EXPLAIN'				=> 'Lien complet, incluant le protocole, qui redirigera les utilisateurs vers la destination spécifiée, comme <samp>http://www.phpbb.fr/</samp>.',
	'FORUM_LINK_TRACK'					=> 'Afficher le nombre de redirections',
	'FORUM_LINK_TRACK_EXPLAIN'			=> 'Enregistre et affiche le nombre de clics effectués sur le lien.',
	'FORUM_NAME'						=> 'Nom du forum',
	'FORUM_NAME_EMPTY'					=> 'Veuillez saisir le nom du forum.',
	'FORUM_PARENT'						=> 'Forum parent',
	'FORUM_PASSWORD'					=> 'Mot de passe du forum',
	'FORUM_PASSWORD_CONFIRM'			=> 'Confirmer le mot de passe du forum',
	'FORUM_PASSWORD_CONFIRM_EXPLAIN'	=> 'Ne complétez cela que si le mot de passe du forum a été spécifié.',
	'FORUM_PASSWORD_EXPLAIN'			=> 'Met en place un mot de passe sur ce forum. Utilisez de préférence un système de permissions.',
	'FORUM_PASSWORD_UNSET'				=> 'Supprimer le mot de passe du forum',
	'FORUM_PASSWORD_UNSET_EXPLAIN'		=> 'Ne cochez cette case que si vous souhaitez supprimer le mot de passe du forum.',
	'FORUM_PASSWORD_OLD'				=> 'Le mot de passe du forum utilise une méthode de hachage obsolète. Vous devriez la modifier.',
	'FORUM_PASSWORD_MISMATCH'			=> 'Les mots de passe que vous avez saisi ne concordent pas.',
	'FORUM_PRUNE_SETTINGS'				=> 'Réglages du délestage du forum',
	'FORUM_RESYNCED'					=> 'Le forum <strong>%s</strong> a été resynchronisé avec succès',
	'FORUM_RULES_EXPLAIN'				=> 'Les règles du forum sont affichées sur toutes les pages du forum.',
	'FORUM_RULES_LINK'					=> 'Lien vers les règles du forum',
	'FORUM_RULES_LINK_EXPLAIN'			=> 'Vous pouvez saisir ici le lien de la page ou du message contenant les règles de votre forum. Ce réglage écrasera les règles du forum qui ont été spécifiées.',
	'FORUM_RULES_PREVIEW'				=> 'Aperçu des règles du forum',
	'FORUM_RULES_TOO_LONG'				=> 'Les règles du forum ne doivent pas dépasser 4000 caractères.',
	'FORUM_SETTINGS'					=> 'Réglages du forum',
	'FORUM_STATUS'						=> 'Statut du forum',
	'FORUM_STYLE'						=> 'Style du forum',
	'FORUM_TOPICS_PAGE'					=> 'Sujets par page',
	'FORUM_TOPICS_PAGE_EXPLAIN'			=> 'Si cette valeur est autre que <samp>0</samp>, elle remplacera le réglage par défaut des sujets par page.',
	'FORUM_TYPE'						=> 'Type du forum',
	'FORUM_UPDATED'						=> 'Les informations du forum ont été mises à jour avec succès.',

	'FORUM_WITH_SUBFORUMS_NOT_TO_LINK'		=> 'Vous souhaitez modifier un forum qui contient des sous-forums dans lesquels vous pouvez rédiger des messages en un forum-lien. Avant de procéder à cette opération, veuillez déplacer tous les sous-forums hors de ce forum, car une fois le forum modifié en forum-lien, vous ne pourrez plus consulter les sous-forums qu’il contient.',

	'GENERAL_FORUM_SETTINGS'	=> 'Réglages généraux du forum',

	'LINK'						=> 'Lien',
	'LIST_INDEX'				=> 'Lister le sous-forum dans la légende du forum parent',
	'LIST_INDEX_EXPLAIN'		=> 'Affiche ce forum sur l’index et sur quelques autres endroits comme lien dans la légende de son forum parent si l’option “Lister les sous-forums dans la légende” est activée.',
	'LIST_SUBFORUMS'			=> 'Lister les sous-forums dans la légende',
	'LIST_SUBFORUMS_EXPLAIN'	=> 'Affiche ce forum de sous-forums sur l’index et sur quelques autres endroits comme lien dans la légende de son forum parent si l’option “Lister le sous-forum dans la légende du forum parent” est activée.',
	'LOCKED'					=> 'Verrouillé',

	'MOVE_POSTS_NO_POSTABLE_FORUM'	=> 'Le forum que vous avez sélectionné afin de déplacer le contenu n’est pas approprié. Veuillez sélectionner un forum dans lequel il est possible d’accueillir des messages.',
	'MOVE_POSTS_TO'					=> 'Déplacer les messages vers',
	'MOVE_SUBFORUMS_TO'				=> 'Déplacer les sous-forums vers',

	'NO_DESTINATION_FORUM'			=> 'Vous n’avez spécifié aucun forum afin de déplacer le contenu.',
	'NO_FORUM_ACTION'				=> 'Aucune action n’a été définie afin de connaître ce qui se produit avec le contenu du forum.',
	'NO_PARENT'						=> 'Aucun parent',
	'NO_PERMISSIONS'				=> 'Ne pas copier les permissions',
	'NO_PERMISSION_FORUM_ADD'		=> 'Vous n’avez pas les permissions appropriées afin d’ajouter des forums.',
	'NO_PERMISSION_FORUM_DELETE'	=> 'Vous n’avez pas les permissions appropriées afin de supprimer des forums.',

	'PARENT_IS_LINK_FORUM'		=> 'Le forum parent que vous avez sélectionné est un forum-lien. Veuillez spécifier une catégorie ou un forum comme forum parent car les forums-liens ne peuvent pas contenir d’autres forums.',
	'PARENT_NOT_EXIST'			=> 'Le parent n’existe pas.',
	'PRUNE_ANNOUNCEMENTS'		=> 'Délester les annonces',
	'PRUNE_STICKY'				=> 'Délester les notes',
	'PRUNE_OLD_POLLS'			=> 'Délester les anciens sondages',
	'PRUNE_OLD_POLLS_EXPLAIN'	=> 'Supprime les sujets contenant des sondages n’ayant aucun vote durant ce nombre de jours.',
	
	'REDIRECT_ACL'	=> 'Vous pouvez à présent %srégler les permissions%s de ce forum.',

	'SYNC_IN_PROGRESS'			=> 'Synchronisation du forum',
	'SYNC_IN_PROGRESS_EXPLAIN'	=> 'Resynchronisation des sujets %1$d/%2$d en cours.',

	'TYPE_CAT'			=> 'Catégorie',
	'TYPE_FORUM'		=> 'Forum',
	'TYPE_LINK'			=> 'Lien',

	'UNLOCKED'			=> 'Déverrouillé',
));

?>