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
* ucp [French]
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

// Privacy policy and T&C
$lang = array_merge($lang, array(
	'TERMS_OF_USE_CONTENT'	=> 'En accédant à “%1$s” (désigné ici par “nous”, “notre”, “nos”, “%1$s”, “%2$s”), vous acceptez d’être légalement responsable des conditions suivantes. Si vous n’acceptez pas d’être légalement responsable de toutes les conditions suivantes, veuillez ne pas utiliser et/ou accéder à “%1$s”. Nous pouvons modifier ces conditions à n’importe quel moment et nous essaierons de vous informer de ces modifications, bien que nous vous conseillons de vérifier régulièrement cela par vous-même car si vous continuez à participer à “%1$s” après que les modifications aient été effectuées, vous acceptez d’être légalement responsable des conditions modifiées et/ou mises à jour.<br />
	<br />
	Nos forums sont propulsés par phpBB (désignés ici par “ils”, “eux”, “leur”, “logiciel phpBB”, “www.phpbb.com”, “phpBB Group”, “Équipes de phpBB”), qui est une solution de création de forums, déclaré sous la licence “<a href="http://opensource.org/licenses/gpl-license.php">Licence Publique Générale</a>” (désignée ici par “GPL”) et qui peut être téléchargé depuis <a href="http://www.phpbb.fr/">www.phpbb.fr</a> ou <a href="http://www.phpbb.com/">www.phpbb.com</a>. Le logiciel phpBB a pour seul but de faciliter les discussions sur Internet, le phpBB Group n’est pas responsable de la conduite et/ou du contenu que nous acceptons et/ou que nous n’acceptons pas. Pour plus d’informations à propos de phpBB, veuillez consulter <a href="http://www.phpbb.fr/">http://www.phpbb.fr/</a> ou <a href="http://www.phpbb.com/">http://www.phpbb.com/</a>.<br />
	<br />
	Vous acceptez de ne publier aucun contenu à caractère abusif, obscène, vulgaire, diffamatoire, choquant, menaçant, pornographique ou autre qui pourrait transgresser les lois de votre pays, le pays où “%1$s” est hébergé ou la loi internationale. Ne pas respecter cela peut vous mener à un bannissement immédiat et permanent, en plus de l’envoi d’un avertissement à votre fournisseur d’accès à Internet si nous jugeons cela nécessaire. L’adresse IP de tous les messages est enregistrée afin d’aider au renforcement de ces conditions. Vous acceptez le fait que “%1$s” ait le droit de supprimer, d’éditer, de déplacer ou de verrouiller n’importe quel sujet lorsque nous estimons que cela est nécessaire. En tant qu’utilisateur, vous acceptez que toutes les informations que vous avez saisi soient stockées dans notre base de données. Bien que cette information ne sera pas diffusée à une tierce partie sans votre consentement, ni “%1$s” et ni phpBB ne pourront être tenus comme responsables en cas de tentative de piratage visant à compromettre les données.
	',

	'PRIVACY_POLICY'		=> 'Cette politique explique en détail comment “%1$s” et ses sociétés affiliées (désignés ici par “nous”, “notre”, “nos”, “%1$s”, “%2$s”) et phpBB (désigné ici par “ils”, “eux”, “leur”, “logiciel phpBB”, “www.phpbb.com”, “phpBB Group”, “Équipes de phpBB”) utilisent n’importe quelle information collectée pendant n’importe quelle session d’utilisation de votre part (désignée ici par “vos informations”).<br />
	<br />
	Vos informations sont collectées de deux manières différentes. Premièrement, en naviguant sur “%1$s”, le logiciel phpBB créera un certain nombre de cookies qui sont de petits fichiers texte téléchargés dans les fichiers temporaires du navigateur Internet de votre ordinateur. Les deux premiers cookies ne contiennent qu’un identifiant utilisateur (désigné ici par “identifiant de l’utilisateur”) et un identifiant de session anonyme (désigné ici par “identifiant de la session”), qui vous sont automatiquement assignés par le logiciel phpBB. Un troisième cookie sera créé une fois que vous naviguerez sur les sujets de “%1$s”. Il est utilisé afin de stocker les sujets que vous avez consulté, ce qui de ce fait améliore votre confort de navigation en tant qu’utilisateur.<br />
	<br />
	Nous pouvons également créer des cookies externes au logiciel phpBB tout en naviguant sur “%1$s”, bien que ceux-ci soient hors de portée du document qui est prévu pour couvrir uniquement les pages créées par le logiciel phpBB. La seconde manière est de récupérer l’information que vous nous envoyez et que nous collectons. Ceci peut être et n’est pas limité à : la publication en tant qu’utilisateur anonyme (désigné ici par “messages anonymes”), l’inscription sur “%1$s” (désigné ici par “votre compte”) et les messages que vous envoyez après l’inscription et lors d’une connexion (désigné ici par “vos messages”).<br />
	<br />
	Votre compte contiendra au minimum un identifiant unique (désigné ici par “votre nom d’utilisateur”), un mot de passe personnel utilisé afin de vous connecter à votre compte (désigné ici par “votre mot de passe”) et une adresse e-mail personnelle correcte (désignée ici par “votre e-mail”). Les informations de votre compte sur “%1$s” sont protégées par les lois de protection des données applicables dans le pays qui nous héberge. Toute information en-dehors de votre nom d’utilisateur, de votre mot de passe et de votre adresse e-mail requis par “%1$s” durant la procédure d’inscription est obligatoire ou facultative, à la discrétion de “%1$s”. Dans tous les cas, vous pouvez choisir quelle information de votre compte peut être affichée publiquement. De plus, dans votre compte, l’option afin de vous abonner ou non à l’envoi automatique d’e-mail par le logiciel phpBB est disponible.<br />
	<br />
	Votre mot de passe est crypté (cryptage à sens unique) afin qu’il soit sécurisé. Cependant, il est recommandé de ne pas utiliser le même mot de passe sur plusieurs sites Internet différents. Votre mot de passe est le moyen d’accès de votre compte sur “%1$s”, veuillez le conservez précieusement. En aucun cas une personne affiliée à “%1$s”, à phpBB ou à une tierce partie ne peut vous demander légitimement votre mot de passe. Si vous oubliez le mot de passe de votre compte, vous pouvez utiliser la fonction “J’ai perdu mon mot de passe” qui est fournie par le logiciel phpBB. Cette procédure vous demandera de spécifier votre nom d’utilisateur et votre adresse e-mail. Le logiciel phpBB générera alors un nouveau mot de passe afin que vous puissiez reprendre votre compte.<br />
	',
));

// Common language entries
$lang = array_merge($lang, array(
	'ACCOUNT_ACTIVE'				=> 'Votre compte est à présent activé. Nous vous remercions de votre inscription.',
	'ACCOUNT_ACTIVE_ADMIN'			=> 'Le compte est à présent activé.',
	'ACCOUNT_ACTIVE_PROFILE'		=> 'Votre compte a été réactivé avec succès.',
	'ACCOUNT_ADDED'					=> 'Nous vous remercions de votre inscription, votre compte est dorénavant créé. Vous pouvez à présent vous connecter avec votre nom d’utilisateur et votre mot de passe.',
	'ACCOUNT_COPPA'					=> 'Votre compte a été créé mais il doit être approuvé. Veuillez vérifier vos e-mails pour plus d’informations.',
	'ACCOUNT_EMAIL_CHANGED'			=> 'Votre compte a été mis à jour avec succès. Cependant, vous devez le réactiver car vous avez modifié votre adresse e-mail. Une clé d’activation a été envoyée sur la nouvelle adresse e-mail que vous avez fourni. Veuillez vérifier vos e-mails pour plus d’informations.',
	'ACCOUNT_EMAIL_CHANGED_ADMIN'	=> 'Votre compte a été mis à jour avec succès. Cependant, un des administrateurs doit le réactiver car vous avez modifié votre adresse e-mail. Un e-mail leur a été envoyé et vous serez informé lors de la réactivation de votre compte.',
	'ACCOUNT_INACTIVE'				=> 'Votre compte a été créé avec succès. Cependant, vous devez activer votre compte. Une clé d’activation a été envoyée sur l’adresse e-mail que vous avez fourni. Veuillez vérifier vos e-mails pour plus d’informations.',
	'ACCOUNT_INACTIVE_ADMIN'		=> 'Votre compte a été créé avec succès. Cependant, un des administrateurs doit activer votre compte. Un e-mail leur a été envoyé et vous serez informé lors de la réactivation de votre compte.',
	'ACTIVATION_EMAIL_SENT'			=> 'L’e-mail d’activation a été envoyé à votre adresse e-mail.',
	'ACTIVATION_EMAIL_SENT_ADMIN'	=> 'L’e-mail d’activation a été envoyé aux adresses e-mails des administrateurs.',
	'ADD'							=> 'Ajouter',
	'ADD_BCC'						=> 'Ajouter [Cci]',
	'ADD_FOES'						=> 'Ajouter de nouveaux ignorés',
	'ADD_FOES_EXPLAIN'				=> 'Vous devez saisir chaque nom d’utilisateur sur une ligne différente.',
	'ADD_FOLDER'					=> 'Ajouter un dossier',
	'ADD_FRIENDS'					=> 'Ajouter de nouveaux amis',
	'ADD_FRIENDS_EXPLAIN'			=> 'Vous devez saisir chaque nom d’utilisateur sur une ligne différente.',
	'ADD_NEW_RULE'					=> 'Ajouter une nouvelle règle',
	'ADD_RULE'						=> 'Ajouter une règle',
	'ADD_TO'						=> 'Ajouter [À]',
	'ADD_USERS_UCP_EXPLAIN'			=> 'Vous pouvez ajouter ici de nouveaux utilisateurs à un groupe. Vous pouvez décider que ce groupe deviendra le nouveau groupe par défaut pour les utilisateurs sélectionnés. Veuillez saisir chaque nom d’utilisateur sur une ligne différente.',
	'ADMIN_EMAIL'					=> 'Les administrateurs peuvent m’informer par e-mail',
	'AGREE'							=> 'J’accepte ces conditions',
	'ALLOW_PM'						=> 'Autoriser les utilisateurs à vous envoyer des messages privés',
	'ALLOW_PM_EXPLAIN'				=> 'Notez que les administrateurs et les modérateurs pourront toujours vous envoyer des messages privés.',
	'ALREADY_ACTIVATED'				=> 'Vous avez déjà activé votre compte.',
	'ATTACHMENTS_EXPLAIN'			=> 'Ceci est la liste des pièces jointes que vous avez inséré dans les messages de ce forum.',
	'ATTACHMENTS_DELETED'			=> 'Les pièces jointes ont été supprimées avec succès.',
	'ATTACHMENT_DELETED'			=> 'La pièce jointe a été supprimée avec succès.',
	'AVATAR_CATEGORY'				=> 'Catégorie',
	'AVATAR_EXPLAIN'				=> 'Dimensions maximales ; largeur : %1$d pixels, hauteur : %2$d pixels, taille du fichier : %3$.2f Kio.',
	'AVATAR_FEATURES_DISABLED'		=> 'La fonctionnalité des avatars est actuellement désactivée.',
	'AVATAR_GALLERY'				=> 'Galerie locale',
	'AVATAR_GENERAL_UPLOAD_ERROR'	=> 'Impossible de transférer l’avatar vers %s.',
	'AVATAR_NOT_ALLOWED'			=> 'Votre avatar ne peut pas être affiché car les avatars n’ont pas été autorisés.',
	'AVATAR_PAGE'					=> 'Page',
	'AVATAR_TYPE_NOT_ALLOWED'		=> 'Votre avatar actuel ne peut pas être affiché car son type n’est pas autorisé.',

	'BACK_TO_DRAFTS'			=> 'Retour aux brouillons sauvegardés',
	'BACK_TO_LOGIN'				=> 'Retour à l’écran de connexion',
	'BIRTHDAY'					=> 'Anniversaire',
	'BIRTHDAY_EXPLAIN'			=> 'Le réglage d’une année énumérera votre âge lors de votre anniversaire.',
	'BOARD_DATE_FORMAT'			=> 'Mon format de date',
	'BOARD_DATE_FORMAT_EXPLAIN'	=> 'La syntaxe utilisée est identique à la fonction PHP <a href="http://www.php.net/date"><var>date()</var></a>.',
	'BOARD_DST'					=> 'L’heure d’été est effective',
	'BOARD_LANGUAGE'			=> 'Ma langue',
	'BOARD_STYLE'				=> 'Mon style du forum',
	'BOARD_TIMEZONE'			=> 'Mon fuseau horaire',
	'BOOKMARKS'					=> 'Favoris',
	'BOOKMARKS_EXPLAIN'			=> 'Vous pouvez ajouter des sujets dans vos favoris afin de les consulter ultérieurement. Sélectionnez les cases à cocher pour les favoris que vous souhaitez supprimer, puis appuyez sur le bouton <em>Supprimer les favoris sélectionnés</em>.',
	'BOOKMARKS_DISABLED'		=> 'Les favoris ont été désactivés sur ce forum.',
	'BOOKMARKS_REMOVED'			=> 'Les favoris ont été supprimés avec succès.',

	'CANNOT_EDIT_MESSAGE_TIME'	=> 'Vous ne pouvez désormais plus éditer ou supprimer ce message.',
	'CANNOT_MOVE_TO_SAME_FOLDER'=> 'Les messages ne peuvent pas être déplacés dans le dossier que vous souhaitez supprimer.',
	'CANNOT_MOVE_FROM_SPECIAL'	=> 'Les messages ne peuvent pas être déplacés de la boîte d’envoi.',
	'CANNOT_RENAME_FOLDER'		=> 'Ce dossier ne peut pas être renommé.',
	'CANNOT_REMOVE_FOLDER'		=> 'Ce dossier ne peut pas être supprimé.',
	'CHANGE_DEFAULT_GROUP'		=> 'Modifier le groupe par défaut',
	'CHANGE_PASSWORD'			=> 'Modifier le mot de passe',
	'CLICK_RETURN_FOLDER'		=> '%1$sRetour à votre dossier “%3$s”%2$s',
	'CONFIRMATION'				=> 'Confirmation de l’inscription',
	'CONFIRM_CHANGES'			=> 'Confirmer les modifications',	
	'CONFIRM_EMAIL'				=> 'Confirmer l’adresse e-mail',
	'CONFIRM_EMAIL_EXPLAIN'		=> 'Vous ne devez spécifier cela que si vous avez modifié votre adresse e-mail ci-dessus.',
	'CONFIRM_EXPLAIN'			=> 'Afin d’empêcher les inscriptions automatisées, vous devez saisir un code de confirmation. Le code est affiché dans l’image que vous devriez voir ci-dessous. Veuillez contacter l’%sadministrateur du forum%s si vous êtes visuellement déficient ou que vous éprouvez des difficultés à lire ce code correctement.',
	'VC_REFRESH'				=> 'Rafraîchir le code de confirmation',
	'VC_REFRESH_EXPLAIN'		=> 'Si vous n’arrivez pas à lire le code, vous pouvez en demander un nouveau en cliquant sur le bouton.',

  'CONFIRM_PASSWORD'			=> 'Confirmer le mot de passe',
	'CONFIRM_PASSWORD_EXPLAIN'	=> 'Vous ne devez confirmer votre mot de passe que si vous l’avez modifié ci-dessus.',
	'COPPA_BIRTHDAY'			=> 'Veuillez nous renseigner votre date de naissance afin de continuer la procédure d’inscription.',
	'COPPA_COMPLIANCE'			=> 'Conformité de la COPPA',
	'COPPA_EXPLAIN'				=> 'Veuillez noter que si vous cliquez sur le bouton <em>Envoyer</em>, cela créera votre compte. Cependant, celui-ci ne peut être activé que si un parent ou un tuteur légal approuve votre inscription. Vous recevrez une copie du formulaire contenant les renseignements à nous envoyer.',
	'CREATE_FOLDER'				=> 'Ajouter un dossier…',
	'CURRENT_IMAGE'				=> 'Image actuelle',
	'CURRENT_PASSWORD'			=> 'Mot de passe actuel',
	'CURRENT_PASSWORD_EXPLAIN'	=> 'Vous devez confirmer votre mot de passe actuel si vous souhaitez modifier votre mot de passe, votre adresse e-mail ou votre nom d’utilisateur.',
	'CUR_PASSWORD_ERROR'		=> 'Le mot de passe actuel que vous avez saisi est incorrect.',
	'CUSTOM_DATEFORMAT'			=> 'Personnaliser…',

	'DEFAULT_ACTION'			=> 'Action par défaut',
	'DEFAULT_ACTION_EXPLAIN'	=> 'Cette action sera déclenchée si aucune de ce qui la précède n’est applicable.',
	'DEFAULT_ADD_SIG'			=> 'Insérer ma signature par défaut',
	'DEFAULT_BBCODE'			=> 'Activer le BBCode par défaut',
	'DEFAULT_NOTIFY'			=> 'M’avertir lors des réponses par défaut',
	'DEFAULT_SMILIES'			=> 'Activer les émoticônes par défaut',
	'DEFINED_RULES'				=> 'Règles définies',
	'DELETED_TOPIC'				=> 'Le sujet a été supprimé.',
	'DELETE_ATTACHMENT'			=> 'Supprimer la pièce jointe',
	'DELETE_ATTACHMENTS'		=> 'Supprimer les pièces jointes',
	'DELETE_ATTACHMENT_CONFIRM'	=> 'Êtes-vous sûr de vouloir supprimer cette pièce jointe ?',
	'DELETE_ATTACHMENTS_CONFIRM'=> 'Êtes-vous sûr de vouloir supprimer ces pièces jointes ?',
	'DELETE_AVATAR'				=> 'Supprimer l’image',
	'DELETE_COOKIES_CONFIRM'	=> 'Êtes-vous sûr de vouloir supprimer tous les cookies réglés par ce forum ?',
	'DELETE_MARKED_PM'			=> 'Supprimer les messages sélectionnés',
	'DELETE_MARKED_PM_CONFIRM'	=> 'Êtes-vous sûr de vouloir supprimer tous les messages sélectionnés ?',
	'DELETE_OLDEST_MESSAGES'	=> 'Supprimer les anciens messages',
	'DELETE_MESSAGE'			=> 'Supprimer le message',
	'DELETE_MESSAGE_CONFIRM'	=> 'Êtes-vous sûr de vouloir supprimer ce message privé ?',
	'DELETE_MESSAGES_IN_FOLDER'	=> 'Supprimer tous les messages dans le dossier supprimé',
	'DELETE_RULE'				=> 'Supprimer la règle',
	'DELETE_RULE_CONFIRM'		=> 'Êtes-vous sûr de vouloir supprimer cette règle ?',
	'DEMOTE_SELECTED'			=> 'Rétrograder la sélection',
	'DISABLE_CENSORS'			=> 'Activer la censure de mots',
	'DISPLAY_GALLERY'			=> 'Afficher la galerie',
	'DOMAIN_NO_MX_RECORD_EMAIL'	=> 'Le domaine de l’e-mail n’a aucun enregistrement MX correct.',
	'DOWNLOADS'					=> 'Téléchargements',
	'DRAFTS_DELETED'			=> 'Tous les brouillons sélectionnés ont été supprimés avec succès.',
	'DRAFTS_EXPLAIN'			=> 'Vous pouvez consulter, éditer et supprimer ici vos brouillons sauvegardés.',
	'DRAFT_UPDATED'				=> 'Le brouillon a été mis à jour avec succès.',

	'EDIT_DRAFT_EXPLAIN'		=> 'Vous pouvez éditer ici votre brouillon. Les brouillons ne contiennent ni pièces jointes, ni sondages.',
	'EMAIL_BANNED_EMAIL'		=> 'L’adresse e-mail que vous avez saisi n’est pas autorisée à être utilisée.',
	'EMAIL_INVALID_EMAIL'		=> 'L’adresse e-mail que vous avez saisi est incorrecte.',
	'EMAIL_REMIND'				=> 'Ceci doit être l’adresse e-mail qui est associée à votre compte. Si vous ne l’avez pas modifié par l’intermédiaire de votre panneau de contrôle de l’utilisateur, il s’agit de l’adresse que vous avez saisi lors de l’inscription de votre compte.',
	'EMAIL_TAKEN_EMAIL'			=> 'L’adresse e-mail que vous avez saisi est déjà utilisée.',
	'EMPTY_DRAFT'				=> 'Vous devez saisir un message afin d’envoyer vos modifications.',
	'EMPTY_DRAFT_TITLE'			=> 'Vous devez saisir le titre du brouillon.',
	'EXPORT_AS_XML'				=> 'Exporter en XML',
	'EXPORT_AS_CSV'				=> 'Exporter en CSV',
	'EXPORT_AS_CSV_EXCEL'		=> 'Exporter en CSV (Excel)',
	'EXPORT_AS_TXT'				=> 'Exporter en TXT',
	'EXPORT_AS_MSG'				=> 'Exporter en MSG',
	'EXPORT_FOLDER'				=> 'Exporter le dossier',

	'FIELD_REQUIRED'					=> 'Le champ “%s” doit être complété.',
	'FIELD_TOO_SHORT'					=> 'Le champ “%1$s” est trop court, un minimum de %2$d caractères est obligatoire.',
	'FIELD_TOO_LONG'					=> 'Le champ “%1$s” est trop long, un maximum de %2$d caractères est autorisé.',
	'FIELD_TOO_SMALL'					=> 'La valeur de “%1$s” est trop faible, une valeur minimale de %2$d est obligatoire.',
	'FIELD_TOO_LARGE'					=> 'La valeur de “%1$s” est trop importante, une valeur maximale de %2$d est autorisée.',
	'FIELD_INVALID_CHARS_NUMBERS_ONLY'	=> 'Le champ “%s” contient des caractères incorrects, seuls les nombres sont autorisés.',
	'FIELD_INVALID_CHARS_ALPHA_ONLY'	=> 'Le champ “%s” contient des caractères incorrects, seuls les caractères alphanumériques sont autorisés.',
	'FIELD_INVALID_CHARS_SPACERS_ONLY'	=> 'Le champ “%s” contient des caractères incorrects, seuls les caractères alphanumériques, les espaces ou les signes -+_[] sont autorisés.',
	'FIELD_INVALID_DATE'				=> 'Le champ “%s” contient une date incorrecte.',

	'FOE_MESSAGE'				=> 'Message de la part d’un ignoré',
	'FOES_EXPLAIN'				=> 'Les ignorés sont des utilisateurs qui seront ignorés par défaut. Les messages de ces utilisateurs ne seront pas entièrement visibles. Les messages personnels des ignorés sont tout de même autorisés. Veuillez noter que vous ne pouvez pas ignorer les modérateurs ou les administrateurs.',
	'FOES_UPDATED'				=> 'Votre liste d’ignorés a été mise à jour avec succès.',
	'FOLDER_ADDED'				=> 'Le dossier a été ajouté avec succès.',
	'FOLDER_MESSAGE_STATUS'		=> '%1$d sur %2$d messages stockés',
	'FOLDER_NAME_EMPTY'			=> 'Vous devez saisir le nom de ce dossier.',
	'FOLDER_NAME_EXIST'			=> 'Le dossier <strong>%s</strong> existe déjà.',
	'FOLDER_OPTIONS'			=> 'Options du dossier',
	'FOLDER_RENAMED'			=> 'Le dossier a été renommé avec succès.',
	'FOLDER_REMOVED'			=> 'Le dossier a été supprimé avec succès.',
	'FOLDER_STATUS_MSG'			=> 'Le dossier est plein à %1$d%% (%2$d de %3$d messages stockés)',
	'FORWARD_PM'				=> 'Transmettre le MP',
	'FORCE_PASSWORD_EXPLAIN'	=> 'Vous devez modifier votre mot de passe avant que vous ne puissiez continuer à naviguer sur le forum.',
	'FRIEND_MESSAGE'			=> 'Message d’un ami',
	'FRIENDS'					=> 'Amis',
	'FRIENDS_EXPLAIN'			=> 'Les amis vous permettent d’accéder plus rapidement aux membres avec qui vous communiquez fréquemment. Si le template le permet, les messages de vos amis apparaîtront en surbrillance.',
	'FRIENDS_OFFLINE'			=> 'Hors-ligne',
	'FRIENDS_ONLINE'			=> 'En ligne',
	'FRIENDS_UPDATED'			=> 'Votre liste d’amis a été mise à jour avec succès.',
	'FULL_FOLDER_OPTION_CHANGED'=> 'L’action à réaliser lorsqu’un dossier est plein a été modifiée avec succès.',
	'FWD_ORIGINAL_MESSAGE'		=> '-------- Message original --------',
	'FWD_SUBJECT'				=> 'Sujet : %s',
	'FWD_DATE'					=> 'Date : %s',
	'FWD_FROM'					=> 'De : %s',
	'FWD_TO'					=> 'À : %s',

	'GLOBAL_ANNOUNCEMENT'		=> 'Annonce globale',

	'HIDE_ONLINE'				=> 'Masquer mon statut en ligne',
	'HIDE_ONLINE_EXPLAIN'		=> 'La modification de ce réglage ne sera prise en compte que lors de votre prochaine visite sur le forum.',
	'HOLD_NEW_MESSAGES'			=> 'Ne pas accepter les nouveaux messages (les nouveaux messages seront mis en attente jusqu’à ce qu’assez d’espace soit disponible)',
	'HOLD_NEW_MESSAGES_SHORT'	=> 'Les nouveaux messages seront mis en attente',

	'IF_FOLDER_FULL'			=> 'Si le dossier est plein',
	'IMPORTANT_NEWS'			=> 'Annonces importantes',
	'INVALID_USER_BIRTHDAY'			=> 'La date d’anniversaire que vous avez spécifié est incorrecte.',
	'INVALID_CHARS_USERNAME'	=> 'Le nom d’utilisateur que vous avez spécifié contient des caractères non autorisés.',
	'INVALID_CHARS_NEW_PASSWORD'=> 'Le mot de passe que vous avez spécifié ne contient pas les caractères requis.',
	'ITEMS_REQUIRED'			=> 'Les champs marqués par * sont obligatoires.',

	'JOIN_SELECTED'				=> 'Joindre la sélection',

	'LANGUAGE'					=> 'Langue',
	'LINK_REMOTE_AVATAR'		=> 'Lien externe',
	'LINK_REMOTE_AVATAR_EXPLAIN'=> 'Saisissez le lien où l’image de l’avatar que vous souhaitez insérer est situé.',
	'LINK_REMOTE_SIZE'			=> 'Dimensions de l’avatar',
	'LINK_REMOTE_SIZE_EXPLAIN'	=> 'Spécifiez la largeur et la hauteur de l’avatar. Laissez vide afin de tenter une vérification automatique.',
	'LOGIN_EXPLAIN_UCP'			=> 'Veuillez vous connecter afin d’accéder au panneau de contrôle de l’utilisateur.',
	'LOGIN_REDIRECT'			=> 'Vous vous êtes connecté avec succès.',
	'LOGOUT_FAILED'				=> 'Vous n’avez pas été déconnecté car la requête n’a pas fonctionné sur votre session. Si le problème persiste, veuillez contacter l’administrateur du forum.',
	'LOGOUT_REDIRECT'			=> 'Vous vous êtes déconnecté avec succès.',

	'MARK_IMPORTANT'				=> 'Cocher/décocher comme important',
	'MARKED_MESSAGE'				=> 'Message sélectionné',
	'MAX_FOLDER_REACHED'			=> 'Le nombre maximum de dossiers autorisés a été atteint.',
	'MESSAGE_BY_AUTHOR'				=> 'de',
	'MESSAGE_COLOURS'				=> 'Couleurs du message',
	'MESSAGE_DELETED'				=> 'Le message a été supprimé avec succès.',
	'MESSAGE_HISTORY'				=> 'Historique du message',
	'MESSAGE_REMOVED_FROM_OUTBOX'	=> 'Ce message a été supprimé par son auteur avant qu’il ait été délivré.',
	'MESSAGE_SENT_ON'				=> 'le',
	'MESSAGE_STORED'				=> 'Le message a été envoyé avec succès.',
	'MESSAGE_TO'					=> 'À',
	'MESSAGES_DELETED'				=> 'Les messages ont été supprimés avec succès',
	'MOVE_DELETED_MESSAGES_TO'		=> 'Déplacer les messages du dossier que vous avez supprimé vers',
	'MOVE_DOWN'						=> 'Descendre',
	'MOVE_MARKED_TO_FOLDER'			=> 'Déplacer la sélection vers %s',
	'MOVE_PM_ERROR'					=> 'Une erreur est survenue lors du déplacement des messages vers le nouveau dossier, seuls %1d des %2d messages ont été déplacés.',
	'MOVE_TO_FOLDER'				=> 'Déplacer vers le dossier',
	'MOVE_UP'						=> 'Monter',

	'NEW_EMAIL_ERROR'				=> 'Les adresses e-mails que vous avez saisi ne concordent pas.',
	'NEW_FOLDER_NAME'				=> 'Nom du nouveau dossier',
	'NEW_PASSWORD'					=> 'Nouveau mot de passe',
	'NEW_PASSWORD_ERROR'			=> 'Les mots de passe que vous avez saisi ne concordent pas.',
	'NOTIFY_METHOD'					=> 'Méthode d’avertissement',
	'NOTIFY_METHOD_BOTH'			=> 'Tous les deux',
	'NOTIFY_METHOD_EMAIL'			=> 'E-mail uniquement',
	'NOTIFY_METHOD_EXPLAIN'			=> 'La méthode d’envoi des messages envoyés par ce forum.',
	'NOTIFY_METHOD_IM'				=> 'Jabber uniquement',
	'NOTIFY_ON_PM'					=> 'M’avertir lors de la réception de nouveaux messages privés',
	'NOT_ADDED_FRIENDS_ANONYMOUS'	=> 'Vous ne pouvez pas ajouter des utilisateurs anonymes dans votre liste d’amis.',
	'NOT_ADDED_FRIENDS_BOTS'		=> 'Vous ne pouvez pas ajouter des robots dans votre liste d’amis.',
	'NOT_ADDED_FRIENDS_FOES'		=> 'Vous ne pouvez pas ajouter dans votre liste d’amis des utilisateurs qui sont également présents dans votre liste d’ignorés.',
	'NOT_ADDED_FRIENDS_SELF'		=> 'Vous ne pouvez pas vous ajouter vous-même dans la liste d’amis.',
	'NOT_ADDED_FOES_MOD_ADMIN'		=> 'Vous ne pouvez pas ajouter des administrateurs ou des modérateurs dans votre liste d’ignorés.',
	'NOT_ADDED_FOES_ANONYMOUS'		=> 'Vous ne pouvez pas ajouter des utilisateurs anonymes dans votre liste d’ignorés.',
	'NOT_ADDED_FOES_BOTS'			=> 'Vous ne pouvez pas ajouter des robots dans votre liste d’ignorés.',
	'NOT_ADDED_FOES_FRIENDS'		=> 'Vous ne pouvez pas ajouter dans votre liste d’ignorés des utilisateurs qui sont également présents dans votre liste d’amis.',
	'NOT_ADDED_FOES_SELF'			=> 'Vous ne pouvez pas vous ajouter vous-même dans la liste d’ignorés.',
	'NOT_AGREE'						=> 'Je refuse ces conditions',
	'NOT_ENOUGH_SPACE_FOLDER'		=> 'Le dossier de destination “%s” semble être plein. L’action demandée n’a pas été prise en compte.',
	'NOT_MOVED_MESSAGE'				=> 'Vous avez actuellement 1 message privé en attente car le dossier est plein.',
	'NOT_MOVED_MESSAGES'			=> 'Vous avez actuellement %d messages privés en attente car le dossier est plein.',
	'NO_ACTION_MODE'				=> 'Aucune action n’a été spécifiée pour ce message.',
	'NO_AUTHOR'						=> 'Aucun auteur n’a été défini pour ce message',
	'NO_AVATAR_CATEGORY'			=> 'Aucune',

	'NO_AUTH_DELETE_MESSAGE'		=> 'Vous n’êtes pas autorisé à supprimer les messages privés.',
	'NO_AUTH_EDIT_MESSAGE'			=> 'Vous n’êtes pas autorisé à éditer les messages privés.',
	'NO_AUTH_FORWARD_MESSAGE'		=> 'Vous n’êtes pas autorisé à transmettre des messages privés.',
	'NO_AUTH_GROUP_MESSAGE'			=> 'Vous n’êtes pas autorisé à envoyer des messages privés aux groupes.',
	'NO_AUTH_PASSWORD_REMINDER'		=> 'Vous n’êtes pas autorisé à demander un nouveau mot de passe.',
	'NO_AUTH_READ_HOLD_MESSAGE'		=> 'Vous n’êtes pas autorisé à lire les messages privés qui sont en attente.',
	'NO_AUTH_READ_MESSAGE'			=> 'Vous n’êtes pas autorisé à lire les messages privés.',
	'NO_AUTH_READ_REMOVED_MESSAGE'	=> 'Vous n’êtes pas autorisé à lire ce message car il a été supprimé par son auteur.',
	'NO_AUTH_SEND_MESSAGE'			=> 'Vous n’êtes pas autorisé à envoyer des messages privés.',
	'NO_AUTH_SIGNATURE'				=> 'Vous n’êtes pas autorisé à définir une signature.',

	'NO_BCC_RECIPIENT'			=> 'Aucun',
	'NO_BOOKMARKS'				=> 'Vous n’avez aucun favori.',
	'NO_BOOKMARKS_SELECTED'		=> 'Vous n’avez sélectionné aucun favori.',
	'NO_EDIT_READ_MESSAGE'		=> 'Le message privé ne peut plus être édité car il a déjà été consulté.',
	'NO_EMAIL_USER'				=> 'Les informations concernant l’e-mail ou le nom d’utilisateur sont introuvables.',
	'NO_FOES'					=> 'Aucun ignoré n’a été spécifié',
	'NO_FRIENDS'				=> 'Aucun ami n’a été spécifié',
	'NO_FRIENDS_OFFLINE'		=> 'Aucun ami n’est hors-ligne',
	'NO_FRIENDS_ONLINE'			=> 'Aucun ami n’est en ligne',
	'NO_GROUP_SELECTED'			=> 'Aucun groupe n’a été spécifié.',
	'NO_IMPORTANT_NEWS'			=> 'Aucune annonce importante n’est présente.',
	'NO_MESSAGE'				=> 'Le message privé est introuvable.',
	'NO_NEW_FOLDER_NAME'		=> 'Vous devez spécifier le nom du nouveau dossier.',
	'NO_NEWER_PM'				=> 'Aucun nouveau message.',
	'NO_OLDER_PM'				=> 'Aucun ancien message.',
	'NO_PASSWORD_SUPPLIED'		=> 'Vous ne pouvez pas vous connecter sans saisir un mot de passe.',
	'NO_RECIPIENT'				=> 'Aucun destinataire n’a été spécifié.',
	'NO_RULES_DEFINED'			=> 'Aucune règle n’a été spécifiée.',
	'NO_SAVED_DRAFTS'			=> 'Aucun brouillon n’a été sauvegardé.',
	'NO_TO_RECIPIENT'			=> 'Aucun',
	'NO_WATCHED_FORUMS'			=> 'Vous n’êtes abonné à aucun forum.',
	'NO_WATCHED_SELECTED'      => 'Vous n’avez sélectionné aucun forum ou sujet dont vous êtes abonné.',
	'NO_WATCHED_TOPICS'			=> 'Vous n’êtes abonné à aucun sujet.',

	'PASS_TYPE_ALPHA_EXPLAIN'	=> 'Le mot de passe doit être compris entre %1$d et %2$d caractères de long, doit contenir des lettres en majuscules et en minuscules et doit contenir des nombres.',
	'PASS_TYPE_ANY_EXPLAIN'		=> 'Doit être compris entre %1$d et %2$d caractères.',
	'PASS_TYPE_CASE_EXPLAIN'	=> 'Le mot de passe doit être compris entre %1$d et %2$d caractères de long et doit contenir des lettres en majuscules et en minuscules.',
	'PASS_TYPE_SYMBOL_EXPLAIN'	=> 'Le mot de passe doit être compris entre %1$d et %2$d caractères de long, doit contenir des lettres en majuscules et en minuscules, doit contenir des nombres et doit contenir des symboles.',
	'PASSWORD'					=> 'Mot de passe',
	'PASSWORD_ACTIVATED'		=> 'Votre nouveau mot de passe a été activé.',
	'PASSWORD_UPDATED'			=> 'Un nouveau mot de passe a été envoyé à l’adresse e-mail que vous avez enregistré.',
	'PERMISSIONS_RESTORED'		=> 'Les permissions originales ont été restaurées avec succès.',
	'PERMISSIONS_TRANSFERRED'	=> 'Les permissions de <strong>%s</strong> ont été transférées avec succès, vous pouvez à présent parcourir le forum avec les permissions de l’utilisateur.<br />Veuillez noter que les permissions des administrateurs ne seront pas transférées. Vous pouvez retourner aux réglages de vos permissions à tout moment.',
	'PM_DISABLED'				=> 'La messagerie privée a été désactivée sur ce forum.',
	'PM_FROM'					=> 'De',
	'PM_FROM_REMOVED_AUTHOR'	=> 'Ce message privé a été envoyé par un utilisateur qui n’est plus inscrit.',
	'PM_ICON'					=> 'Icône du MP',
	'PM_INBOX'					=> 'Boîte de réception',
	'PM_NO_USERS'				=> 'Les utilisateurs que vous souhaitez ajouter n’existent pas.',
	'PM_OUTBOX'					=> 'Boîte d’envoi',
	'PM_SENTBOX'				=> 'Messages envoyés',
	'PM_SUBJECT'				=> 'Sujet du message',
	'PM_TO'						=> 'Envoyer à',
	'PM_USERS_REMOVED_NO_PM'	=> 'Certains utilisateurs ne peuvent pas être ajoutés car ils ont désactivés la réception de messages privés.',
	'POPUP_ON_PM'				=> 'Afficher une fenêtre pop-up lors de la réception d’un nouveau message privé',
	'POST_EDIT_PM'				=> 'Éditer le message',
	'POST_FORWARD_PM'			=> 'Transmettre le message',
	'POST_NEW_PM'				=> 'Composer un message',
	'POST_PM_LOCKED'			=> 'La messagerie privée est verrouillée.',
	'POST_PM_POST'				=> 'Citer le message',
	'POST_QUOTE_PM'				=> 'Citer le message',
	'POST_REPLY_PM'				=> 'Répondre au message',
	'PRINT_PM'					=> 'Imprimer',
	'PREFERENCES_UPDATED'		=> 'Vos préférences ont été mises à jour.',
	'PROFILE_INFO_NOTICE'		=> 'Veuillez noter que les informations suivantes peuvent être visibles aux autres membres. Faites attention lors de la saisie d’informations personnelles. Tous les champs marqués avec * sont obligatoires.',
	'PROFILE_UPDATED'			=> 'Votre profil a été mis à jour avec succès.',

	'RECIPIENT'							=> 'Destinataire',
	'RECIPIENTS'						=> 'Destinataires',
	'REGISTRATION'						=> 'Inscription',
	'RELEASE_MESSAGES'					=> '%sSortir tous les messages en attente%s… Ils seront triés de nouveau dans les dossiers appropriés si assez d’espace est rendu disponible.',
	'REMOVE_ADDRESS'					=> 'Supprimer l’adresse',
	'REMOVE_SELECTED_BOOKMARKS'			=> 'Supprimer les favoris sélectionnés',
	'REMOVE_SELECTED_BOOKMARKS_CONFIRM'	=> 'Êtes-vous sûr de vouloir supprimer tous les favoris sélectionnés ?',
	'REMOVE_BOOKMARK_MARKED'			=> 'Supprimer les favoris sélectionnés',
	'REMOVE_FOLDER'						=> 'Supprimer le dossier',
	'REMOVE_FOLDER_CONFIRM'				=> 'Êtes-vous sûr de vouloir supprimer ce dossier ?',
	'RENAME'							=> 'Renommer',
	'RENAME_FOLDER'						=> 'Renommer le dossier',
	'REPLIED_MESSAGE'					=> 'Réponse au message',
	'REPLY_TO_ALL'						=> 'Répondre à l’expéditeur et à tous les destinataires.',
	'REPORT_PM'							=> 'Rapporter le message privé',
	'RESIGN_SELECTED'					=> 'Décocher la sélection',
	'RETURN_FOLDER'						=> '%1$sRetour au dossier précédent%2$s',
	'RETURN_UCP'						=> '%sRetour au panneau de contrôle de l’utilisateur%s',
	'RULE_ADDED'						=> 'La règle a été ajoutée avec succès.',
	'RULE_ALREADY_DEFINED'				=> 'Cette règle a été spécifiée antérieurement.',
	'RULE_DELETED'						=> 'La règle a été supprimée avec succès.',
	'RULE_NOT_DEFINED'					=> 'La règle n’est pas correctement spécifiée.',
	'RULE_REMOVED_MESSAGE'				=> 'Un message privé a été supprimé grâce aux filtres de la messagerie privée.',
	'RULE_REMOVED_MESSAGES'				=> '%d messages privés ont été supprimés grâce aux filtres de la messagerie privée.',

	'SAME_PASSWORD_ERROR'		=> 'Le nouveau mot de passe que vous avez saisi est identique à votre mot de passe actuel.',
	'SEARCH_YOUR_POSTS'			=> 'Afficher vos messages',
	'SEND_PASSWORD'				=> 'Envoyer le mot de passe',
	'SENT_AT'					=> 'Envoyé',			// Used before dates in private messages
	'SHOW_EMAIL'				=> 'Les utilisateurs peuvent me contacter par e-mail',
	'SIGNATURE_EXPLAIN'			=> 'Ceci est un petit texte qui sera ajouté en bas de tous les messages que vous rédigez. Il est limité à %d caractères.',
	'SIGNATURE_PREVIEW'			=> 'Votre signature apparaîtra ainsi dans tous vos messages',
	'SIGNATURE_TOO_LONG'		=> 'Votre signature est trop longue.',
	'SORT'						=> 'Trier par',
	'SORT_COMMENT'				=> 'Description du fichier',
	'SORT_DOWNLOADS'			=> 'Téléchargements',
	'SORT_EXTENSION'			=> 'Extension',
	'SORT_FILENAME'				=> 'Nom du fichier',
	'SORT_POST_TIME'			=> 'Date de publication',
	'SORT_SIZE'					=> 'Taille du fichier',

	'TIMEZONE'					=> 'Fuseau horaire',
	'TO'						=> 'À',
	'TOO_MANY_RECIPIENTS'      => 'Vous ne pouvez pas envoyer votre message privé à autant de destinataires.',
	'TOO_MANY_REGISTERS'		=> 'Vous avez dépassé le nombre maximum de tentatives d’inscriptions pour cette session. Veuillez réessayer ultérieurement.',

	'UCP'						=> 'Panneau de contrôle de l’utilisateur',
	'UCP_ACTIVATE'				=> 'Activer le compte',
	'UCP_ADMIN_ACTIVATE'		=> 'Veuillez noter que vous devez saisir une adresse e-mail correcte avant que votre compte soit activé. L’administrateur vérifiera votre compte et s’il est approuvé, vous recevrez un e-mail à l’adresse que vous avez spécifié.',
	'UCP_AIM'					=> 'AOL Instant Messenger',
	'UCP_ATTACHMENTS'			=> 'Pièces jointes',
	'UCP_COPPA_BEFORE'			=> 'Avant le %s',
	'UCP_COPPA_ON_AFTER'		=> 'Le ou après le %s',
	'UCP_EMAIL_ACTIVATE'		=> 'Veuillez noter que vous devez saisir une adresse e-mail correcte afin que votre compte soit activé. Vous recevrez un e-mail qui contiendra le lien d’activation à l’adresse que vous avez spécifié.',
	'UCP_ICQ'					=> 'Numéro ICQ',
	'UCP_JABBER'				=> 'Adresse Jabber',

	'UCP_MAIN'					=> 'Aperçu',
	'UCP_MAIN_ATTACHMENTS'		=> 'Gérer les pièces jointes',
	'UCP_MAIN_BOOKMARKS'		=> 'Gérer les favoris',
	'UCP_MAIN_DRAFTS'			=> 'Gérer les brouillons',
	'UCP_MAIN_FRONT'			=> 'Page principale',
	'UCP_MAIN_SUBSCRIBED'		=> 'Gérer les abonnements',

	'UCP_MSNM'					=> 'WL/MSN Messenger',
	'UCP_NO_ATTACHMENTS'		=> 'Vous n’avez publié aucun fichier.',

	'UCP_PREFS'					=> 'Préférences du forum',
	'UCP_PREFS_PERSONAL'		=> 'Éditer les réglages globaux',
	'UCP_PREFS_POST'			=> 'Éditer la publication par défaut',
	'UCP_PREFS_VIEW'			=> 'Éditer les options d’affichage',
	
	'UCP_PM'					=> 'Messages privés',
	'UCP_PM_COMPOSE'			=> 'Composer un message',
	'UCP_PM_DRAFTS'				=> 'Gérer les brouillons de MP',
	'UCP_PM_OPTIONS'			=> 'Règles, dossiers &amp; réglages',
	'UCP_PM_POPUP'				=> 'Messages privés',
	'UCP_PM_POPUP_TITLE'		=> 'Pop-up de message privé',
	'UCP_PM_UNREAD'				=> 'Messages non lus',
	'UCP_PM_VIEW'				=> 'Voir les messages',

	'UCP_PROFILE'				=> 'Profil',
	'UCP_PROFILE_AVATAR'		=> 'Éditer l’avatar',
	'UCP_PROFILE_PROFILE_INFO'	=> 'Éditer le profil',
	'UCP_PROFILE_REG_DETAILS'	=> 'Éditer les réglages du compte',
	'UCP_PROFILE_SIGNATURE'		=> 'Éditer la signature',

	'UCP_USERGROUPS'			=> 'Groupes d’utilisateurs',
	'UCP_USERGROUPS_MEMBER'		=> 'Éditer les adhésions',
	'UCP_USERGROUPS_MANAGE'		=> 'Gérer les groupes',

	'UCP_REGISTER_DISABLE'			=> 'La création de nouveaux comptes est actuellement impossible.',
	'UCP_REMIND'					=> 'Envoyer le mot de passe',
	'UCP_RESEND'					=> 'Envoyer l’e-mail d’activation',
	'UCP_WELCOME'					=> 'Bienvenue sur le panneau de contrôle de l’utilisateur. Vous pouvez surveiller, consulter et mettre à jour ici votre profil, vos préférences et vos abonnements aux forums et aux sujets. Vous pouvez également, si cela est autorisé, envoyer des messages aux autres utilisateurs. Veuillez vous assurer d’avoir consulté toutes les annonces avant de continuer.',
	'UCP_YIM'						=> 'Yahoo Messenger',
	'UCP_ZEBRA'						=> 'Amis &amp; ignorés',
	'UCP_ZEBRA_FOES'				=> 'Gérer les ignorés',
	'UCP_ZEBRA_FRIENDS'				=> 'Gérer les amis',
	'UNDISCLOSED_RECIPIENT'			=> 'Destinataire confidentiel',
	'UNKNOWN_FOLDER'				=> 'Dossier inconnu',
	'UNWATCH_MARKED'				=> 'Ne plus surveiller la sélection',
	'UPLOAD_AVATAR_FILE'			=> 'Transférer depuis votre ordinateur',
	'UPLOAD_AVATAR_URL'				=> 'Transférer depuis un lien',
	'UPLOAD_AVATAR_URL_EXPLAIN'		=> 'Saisissez le lien où l’image est stockée. L’image sera copiée sur ce site.',
	'USERNAME_ALPHA_ONLY_EXPLAIN'	=> 'Le nom d’utilisateur doit être compris entre %1$d et %2$d caractères de long et ne doit contenir que des caractères alphanumériques.',
	'USERNAME_ALPHA_SPACERS_EXPLAIN'=> 'Le nom d’utilisateur doit être compris entre %1$d et %2$d caractères de long et doit contenir des caractères alphanumériques, des espaces ou des caractères -+_[].',
	'USERNAME_ASCII_EXPLAIN'		=> 'Le nom d’utilisateur doit être compris entre %1$d et %2$d caractères de long et ne doit contenir que des caractères ASCII, donc aucun symboles spéciaux.',
	'USERNAME_LETTER_NUM_EXPLAIN'	=> 'Le nom d’utilisateur doit être compris entre %1$d et %2$d caractères de long et ne doit contenir que des lettres ou des nombres.',
	'USERNAME_LETTER_NUM_SPACERS_EXPLAIN'=> 'Le nom d’utilisateur doit être compris entre %1$d et %2$d caractères de long et doit contenir des lettres, des nombres, des espaces ou des caractères -+_[].',
	'USERNAME_CHARS_ANY_EXPLAIN'	=> 'La longueur doit être comprise entre %1$d et %2$d caractères.',
	'USERNAME_TAKEN_USERNAME'		=> 'Le nom d’utilisateur que vous avez saisi est déjà utilisé, veuillez en choisir un autre.',
	'USERNAME_DISALLOWED_USERNAME'	=> 'Le nom d’utilisateur que vous avez saisi a été interdit ou contient un mot interdit. Veuillez choisir un nom différent.',
	'USER_NOT_FOUND_OR_INACTIVE'	=> 'Les noms d’utilisateurs que vous avez spécifié sont introuvables ou les utilisateurs ne sont pas encore activés.',

	'VIEW_AVATARS'				=> 'Afficher les avatars',
	'VIEW_EDIT'					=> 'Voir et/ou éditer',
	'VIEW_FLASH'				=> 'Afficher les animations Flash',
	'VIEW_IMAGES'				=> 'Afficher les images dans les messages',
	'VIEW_NEXT_HISTORY'			=> 'Prochain MP dans l’ordre chronologique',
	'VIEW_NEXT_PM'				=> 'Prochain MP',
	'VIEW_PM'					=> 'Voir le message',
	'VIEW_PM_INFO'				=> 'Informations sur le message',
	'VIEW_PM_MESSAGE'			=> '1 message',
	'VIEW_PM_MESSAGES'			=> '%d messages',
	'VIEW_PREVIOUS_HISTORY'		=> 'Précédent MP dans l’ordre chronologique',
	'VIEW_PREVIOUS_PM'			=> 'Précédent MP',
	'VIEW_SIGS'					=> 'Afficher les signatures',
	'VIEW_SMILIES'				=> 'Afficher les émoticônes comme des images',
	'VIEW_TOPICS_DAYS'			=> 'Afficher les sujets des jours précédents',
	'VIEW_TOPICS_DIR'			=> 'Afficher les sujets triés par ordre',
	'VIEW_TOPICS_KEY'			=> 'Afficher les sujets triés par',
	'VIEW_POSTS_DAYS'			=> 'Afficher les messages des jours précédents',
	'VIEW_POSTS_DIR'			=> 'Afficher les messages triés par ordre',
	'VIEW_POSTS_KEY'			=> 'Afficher les messages triés par',

	'WATCHED_EXPLAIN'			=> 'La liste ci-dessous vous informe des forums et des sujets dans lesquels vous êtes abonné. Vous serez averti lorsque de nouveaux messages seront publiés dans ces derniers. Pour vous désabonner, sélectionnez le forum ou le sujet souhaité puis cliquez sur le bouton <em>Ne plus surveiller la sélection</em>.',
	'WATCHED_FORUMS'			=> 'Forums surveillés',
	'WATCHED_TOPICS'			=> 'Sujets surveillés',
	'WRONG_ACTIVATION'			=> 'La clé d’activation que vous avez spécifié ne correspond à rien de connu dans la base de données.',

	'YOUR_DETAILS'				=> 'Votre activité',
	'YOUR_FOES'					=> 'Vos ignorés',
	'YOUR_FOES_EXPLAIN'			=> 'Pour supprimer des noms d’utilisateurs, sélectionnez-les et cliquez sur le bouton <em>Envoyer</em>.',
	'YOUR_FRIENDS'				=> 'Vos amis',
	'YOUR_FRIENDS_EXPLAIN'		=> 'Pour supprimer des noms d’utilisateurs, sélectionnez-les et cliquez sur le bouton <em>Envoyer</em>.',
	'YOUR_WARNINGS'				=> 'Votre niveau d’avertissement',

	'PM_ACTION' => array(
		'PLACE_INTO_FOLDER'	=> 'Placer dans le dossier',
		'MARK_AS_READ'		=> 'Marquer comme lu',
		'MARK_AS_IMPORTANT'	=> 'Marquer le message',
		'DELETE_MESSAGE'	=> 'Supprimer le message'
	),
	'PM_CHECK' => array(
		'SUBJECT'	=> 'Sujet',
		'SENDER'	=> 'Expéditeur',
		'MESSAGE'	=> 'Message',
		'STATUS'	=> 'Statut du message',
		'TO'		=> 'Envoyé à'
	),
	'PM_RULE' => array(
		'IS_LIKE'		=> 'est comme',
		'IS_NOT_LIKE'	=> 'n’est pas comme',
		'IS'			=> 'est',
		'IS_NOT'		=> 'n’est pas',
		'BEGINS_WITH'	=> 'commence par',
		'ENDS_WITH'		=> 'termine par',
		'IS_FRIEND'		=> 'est un ami',
		'IS_FOE'		=> 'est un ignoré',
		'IS_USER'		=> 'est un utilisateur',
		'IS_GROUP'		=> 'est dans un groupe d’utilisateurs',
		'ANSWERED'		=> 'répondu',
		'FORWARDED'		=> 'transmis',
		'TO_GROUP'		=> 'à mon groupe d’utilisateurs par défaut',
		'TO_ME'			=> 'à moi'
	),


	'GROUPS_EXPLAIN'	=> 'Les groupes d’utilisateurs permettent aux administrateurs de mieux administrer les utilisateurs. Par défaut, vous serez placé dans un groupe spécifique et celui-ci est votre groupe par défaut. Ce groupe défini comment vous pouvez apparaître aux autres utilisateurs, comme par exemple par l’intermédiaire de la couleur de votre nom d’utilisateur, de votre avatar, de votre rang, etc. Si l’administrateur l’autorise, vous pouvez modifier votre groupe par défaut. Vous pouvez également être placé dans celui-ci ou être autorisé à rejoindre d’autres groupes. Certains groupes peuvent vous donner des permissions additionnelles afin de voir un certain contenu ou augmenter vos fonctionnalités dans d’autres zones.',
	'GROUP_LEADER'		=> 'Responsables',
	'GROUP_MEMBER'		=> 'Membres',
	'GROUP_PENDING'		=> 'Membres en attente',
	'GROUP_NONMEMBER'	=> 'Non-membres',
	'GROUP_DETAILS'		=> 'Informations sur le groupe',

	'NO_LEADER'		=> 'Aucun responsable du groupe',
	'NO_MEMBER'		=> 'Aucun membre du groupe',
	'NO_PENDING'	=> 'Aucun membre en attente',
	'NO_NONMEMBER'	=> 'Aucun non-membre du groupe',
));

?>