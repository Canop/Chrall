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
* acp_styles [French]
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
	'ACP_IMAGESETS_EXPLAIN'	=> 'Les archives d’images comprennent tous les images de boutons, de forums, de dossiers, etc. Elles comprennent également d’autres images qui ne sont pas spécifiques au style utilisé sur le forum. Vous pouvez éditer, exporter ou supprimer ici les archives d’images et importer ou activer de nouvelles archives.',
	'ACP_STYLES_EXPLAIN'	=> 'Vous pouvez gérer ici les styles disponibles sur votre forum. Un style comprend un template, un thème et une archive d’images. Vous pouvez modifier les styles existants et supprimer, désactiver, réactiver, créer ou en importer de nouveaux. Vous pouvez également voir à quoi va ressembler un style en utilisant la fonction de prévisualisation. Le style actuellement par défaut est noté par la présence d’un astérisque (*). Vous pouvez également retrouver le compteur du nombre total d’utilisateurs de chaque style.',
	'ACP_TEMPLATES_EXPLAIN'	=> 'Une archive de templates comprend toutes les balises utilisées afin de générer l’aspect de votre forum. Vous pouvez éditer, supprimer, exporter, importer et prévisualiser ici ces archives. Vous pouvez également modifier le code des templates utilisés afin de générer du BBCode.',
	'ACP_THEMES_EXPLAIN'	=> 'Vous pouvez créer, installer, éditer, supprimer et exporter ici des thèmes. Un thème est une combinaison de couleurs et d’images appliquée à vos templates afin de définir l’aspect basique de votre forum. La gamme des options disponibles dépend de la configuration de votre serveur et de l’installation de phpBB, veuillez consulter le manuel pour plus d’informations. Veuillez noter qu’en créant de nouveaux thèmes, l’utilisation d’un thème existant basique est optionnelle.',
	'ADD_IMAGESET'			=> 'Créer une archive d’images',
	'ADD_IMAGESET_EXPLAIN'	=> 'Vous pouvez créer ici une nouvelle archive d’images. Des options additionnelles peuvent être présentes, selon la configuration de votre serveur et les permissions assignées aux fichiers. Par exemple, vous pourrez baser cette archive d’images sur une archive d’images qui existe déjà. Vous pourrez également envoyer ou importer une archive d’images depuis le répertoire de stockage.',
	'ADD_STYLE'				=> 'Créer un style',
	'ADD_STYLE_EXPLAIN'		=> 'Vous pouvez créer ici un nouveau style. Des options additionnelles peuvent être présentes, selon la configuration de votre serveur et les permissions assignées aux fichiers. Par exemple, vous pourrez baser ce style sur un style qui existe déjà. Vous pourrez également envoyer ou importer une archive de styles depuis le répertoire de stockage.',
	'ADD_TEMPLATE'			=> 'Créer un template',
	'ADD_TEMPLATE_EXPLAIN'	=> 'Vous pouvez ajouter ici un nouveau template. Des options additionnelles peuvent être présentes, selon la configuration de votre serveur et les permissions assignées aux fichiers. Par exemple, vous pourrez baser ce template sur un template qui existe déjà. Vous pourrez également envoyer ou importer une archive de templates depuis le répertoire de stockage.',
	'ADD_THEME'				=> 'Créer un thème',
	'ADD_THEME_EXPLAIN'		=> 'Vous pouvez ajouter ici un nouveau thème. Des options additionnelles peuvent être présentes, selon la configuration de votre serveur et les permissions assignées aux fichiers. Par exemple, vous pourrez baser ce thème sur un thème qui existe déjà. Vous pourrez également envoyer ou importer une archive de thèmes depuis le répertoire de stockage.',
	'ARCHIVE_FORMAT'		=> 'Format de l’archive',
	'AUTOMATIC_EXPLAIN'		=> 'Laissez vide afin de tenter une détection automatique.',

	'BACKGROUND'			=> 'Fond',
	'BACKGROUND_COLOUR'		=> 'Couleur de fond',
	'BACKGROUND_IMAGE'		=> 'Image de fond',
	'BACKGROUND_REPEAT'		=> 'Mosaïque de fond',
	'BOLD'					=> 'Gras',

	'CACHE'							=> 'Cache',
	'CACHE_CACHED'					=> 'Mis en cache',
	'CACHE_FILENAME'				=> 'Fichier template',
	'CACHE_FILESIZE'				=> 'Taille du fichier',
	'CACHE_MODIFIED'				=> 'Modifié',
	'CONFIRM_IMAGESET_REFRESH'		=> 'Êtes-vous sûr de vouloir rafraîchir toutes les données des archives d’images ? Cela écrasera toutes les modifications faites à partir de l’éditeur des archives d’images.',
	'CONFIRM_TEMPLATE_CLEAR_CACHE'	=> 'Êtes-vous sûr de vouloir supprimer toutes les versions des fichiers template mis en cache ?',
	'CONFIRM_TEMPLATE_REFRESH'		=> 'Êtes-vous sûr de vouloir rafraîchir toutes les données des templates stockés dans la base de données ? Cela écrasera toutes les modifications faites à partir de l’éditeur des templates stockés dans la base de données.',
	'CONFIRM_THEME_REFRESH'			=> 'Êtes-vous sûr de vouloir rafraîchir les données des thèmes stockés dans la base de données ? Ceci écrasera toutes modifications faites à partir de l’éditeur des thèmes stockés dans la base de données.',
	'COPYRIGHT'						=> 'Copyright',
	'CREATE_IMAGESET'				=> 'Créer une nouvelle archive d’images',
	'CREATE_STYLE'					=> 'Créer un nouveau style',
	'CREATE_TEMPLATE'				=> 'Créer une nouvelle archive de templates',
	'CREATE_THEME'					=> 'Créer un nouveau thème',
	'CURRENT_IMAGE'					=> 'Image actuelle',

	'DEACTIVATE_DEFAULT'		=> 'Vous ne pouvez pas désactiver le style par défaut.',
	'DELETE_FROM_FS'			=> 'Supprimer du système de fichiers',
	'DELETE_IMAGESET'			=> 'Supprimer l’archive d’images',
	'DELETE_IMAGESET_EXPLAIN'	=> 'Vous pouvez supprimer ici l’archive d’images que vous avez sélectionné. Veuillez noter que cette opération est irréversible. Il est donc recommandé d’effectuer une sauvegarde de votre archive pour une possible utilisation future.',
	'DELETE_STYLE'				=> 'Supprimer le style',
	'DELETE_STYLE_EXPLAIN'		=> 'Vous pouvez supprimer ici le style que vous avez sélectionné. Cependant, vous ne pourrez pas supprimer ici tous les éléments du style, ils doivent être supprimés individuellement. Soyez prudent lorsque vous supprimez des styles car cette opération est irréversible.',
	'DELETE_TEMPLATE'			=> 'Supprimer l’archive de templates',
	'DELETE_TEMPLATE_EXPLAIN'	=> 'Vous pouvez supprimer ici l’archive de templates que vous avez sélectionné de la base de données. Veuillez noter que cette opération est irréversible. Il est donc recommandé d’effectuer une sauvegarde de votre archive pour une possible utilisation future.',
	'DELETE_THEME'				=> 'Supprimer le thème',
	'DELETE_THEME_EXPLAIN'		=> 'Vous pouvez supprimer ici le thème que vous avez sélectionné de la base de données. Veuillez noter que cette opération est irréversible. Il est donc recommandé d’effectuer une sauvegarde de votre thème pour une possible utilisation future.',
	'DETAILS'					=> 'Informations',
	'DIMENSIONS_EXPLAIN'		=> 'Si vous sélectionnez “Oui” ici, cela inclura les paramètres de largeur et de hauteur.',


	'EDIT_DETAILS_IMAGESET'				=> 'Éditer les informations de l’archive d’images',
	'EDIT_DETAILS_IMAGESET_EXPLAIN'		=> 'Vous pouvez éditer ici certaines informations de l’archive d’images, comme son nom.',
	'EDIT_DETAILS_STYLE'				=> 'Éditer un style',
	'EDIT_DETAILS_STYLE_EXPLAIN'		=> 'En utilisant le formulaire ci-dessous, vous pouvez modifier ce style. Vous pouvez modifier sa combinaison de template, de thème et d’archive d’images qui définit le style en lui-même. Vous pouvez également définir le style comme étant celui à utiliser par défaut.',
	'EDIT_DETAILS_TEMPLATE'				=> 'Éditer les informations du template',
	'EDIT_DETAILS_TEMPLATE_EXPLAIN'		=> 'Vous pouvez éditer ici certaines informations du template, comme son nom. Vous pouvez également avoir l’option qui vous permet de basculer le stockage de la feuille de style du système de fichiers à la base de données, et vice et versa. Cette option dépend de la configuration de PHP et de votre serveur.',
	'EDIT_DETAILS_THEME'				=> 'Éditer les informations du thème',
	'EDIT_DETAILS_THEME_EXPLAIN'		=> 'Vous pouvez éditer ici les informations du thème, comme son nom. Vous pouvez également avoir l’option qui vous permet de basculer le stockage de la feuille de style du système de fichiers à la base de données, et vice et versa. Cette option dépend de la configuration de PHP et de votre serveur.',
	'EDIT_IMAGESET'						=> 'Éditer une archive d’images',
	'EDIT_IMAGESET_EXPLAIN'				=> 'Vous pouvez éditer ici les images individuelles qui définissent l’archive d’images. Vous pouvez également spécifier les dimensions de l’image. Elles sont optionnelles mais peuvent aider à résoudre certains problèmes graphiques rencontrés avec quelques navigateurs. Cependant, si vous ne les spécifiez pas, cela permettra de réduire la taille de la base de données.',
	'EDIT_TEMPLATE'						=> 'Éditer une archive de templates',
	'EDIT_TEMPLATE_EXPLAIN'				=> 'Vous pouvez éditer ici votre archive de templates. Veuillez noter que ces éditions sont permanentes et qu’elles ne peuvent pas être annulées une fois effectuées. Si PHP arrive à écrire dans vos fichiers de templates situés dans le répertoire de vos styles, toutes les modifications seront directement écrites dans ces fichiers. Si PHP n’arrive pas à écrire dans ces fichiers, ils seront alors copiés dans la base de données et toute modification ne sera reflétée qu’ici. Soyez prudent en éditant votre archive de templates et n’oubliez pas de fermer tous les termes de remplacement de variables {XXXX} et les rapports conditionnels.',
	'EDIT_TEMPLATE_STORED_DB'			=> 'Le fichier template n’a pas pu être écrit. L’archive de templates est à présent stockée dans la base de données et contient le fichier modifié.',
	'EDIT_THEME'						=> 'Éditer un thème',
	'EDIT_THEME_EXPLAIN'				=> 'Vous pouvez éditer ici le thème que vous avez sélectionné en modifiant ses couleurs, ses images, etc.',
	'EDIT_THEME_STORED_DB'				=> 'La feuille de style n’a pas pu être écrite. Elle est à présent stockée dans la base de données et contient votre modification.',
	'EDIT_THEME_STORE_PARSED'			=> 'Le thème requiert que sa feuille de style soit analysée. Ceci n’est possible que si cette dernière est stockée dans la base de données.',
	'EDITOR_DISABLED'               => 'L’éditeur de templates est désactivé.',
	'EXPORT'							=> 'Exporter',

	'FOREGROUND'			=> 'Premier plan',
	'FONT_COLOUR'			=> 'Couleur de la police',
	'FONT_FACE'				=> 'Police',
	'FONT_FACE_EXPLAIN'		=> 'Vous pouvez spécifier plusieurs polices en les séparant par une virgule. Si un utilisateur n’a pas la première police installée sur son ordinateur, la suivante sera alors sélectionnée.',
	'FONT_SIZE'				=> 'Taille de la police',

	'GLOBAL_IMAGES'			=> 'Globales',

	'HIDE_CSS'				=> 'Masquer le CSS brut',

	'IMAGE_WIDTH'				=> 'Largeur de l’image',
	'IMAGE_HEIGHT'				=> 'Hauteur de l’image',
	'IMAGE'						=> 'Image',
	'IMAGE_NAME'				=> 'Nom de l’image',
	'IMAGE_PARAMETER'			=> 'Paramètre',
	'IMAGE_VALUE'				=> 'Valeur',
	'IMAGESET_ADDED'			=> 'L’archive d’images a été ajoutée au système de fichiers avec succès.',
	'IMAGESET_ADDED_DB'			=> 'L’archive d’images a été ajoutée à la base de données avec succès.',
	'IMAGESET_DELETED'			=> 'L’archive d’images a été supprimée avec succès.',
	'IMAGESET_DELETED_FS'		=> 'L’archive d’images a été supprimée de la base de données mais quelques fichiers peuvent subsister dans le système de fichiers.',
	'IMAGESET_DETAILS_UPDATED'	=> 'Les informations de l’archive d’images ont été mises à jour avec succès.',
	'IMAGESET_ERR_ARCHIVE'		=> 'Veuillez sélectionner une méthode de compression.',
	'IMAGESET_ERR_COPY_LONG'	=> 'Le copyright ne doit pas dépasser 60 caractères.',
	'IMAGESET_ERR_NAME_CHARS'	=> 'Le nom de l’archive d’images ne doit contenir que des caractères alphanumériques, -, +, _ et des espaces.',
	'IMAGESET_ERR_NAME_EXIST'	=> 'Une archive d’images portant ce nom existe déjà.',
	'IMAGESET_ERR_NAME_LONG'	=> 'Le nom de l’archive d’images ne doit pas dépasser 30 caractères.',
	'IMAGESET_ERR_NOT_IMAGESET'	=> 'Le fichier compréssé que vous avez spécifié ne contient pas d’archive d’images valide.',
	'IMAGESET_ERR_STYLE_NAME'	=> 'Vous devez spécifier le nom de cette archive d’images.',
	'IMAGESET_EXPORT'			=> 'Exporter une archive d’images',
	'IMAGESET_EXPORT_EXPLAIN'	=> 'Vous pouvez exporter ici une archive d’images sous forme de fichier compréssé. Ce dernier contiendra toutes les données nécessaires afin d’installer l’archive d’images sur un autre forum. Vous pouvez soit télécharger le fichier directement, soit le placer dans votre dossier de stockage afin de le télécharger ultérieurement par FTP.',
	'IMAGESET_EXPORTED'			=> 'L’archive d’images a été exportée et stockée dans %s avec succès.',
	'IMAGESET_NAME'				=> 'Nom de l’archive d’images',
	'IMAGESET_REFRESHED'		=> 'L’archive d’images a été rafraîchie avec succès.',
	'IMAGESET_UPDATED'			=> 'L’archive d’images a été mise à jour avec succès.',
	'ITALIC'					=> 'Italique',

	'IMG_CAT_BUTTONS'		=> 'Boutons traduits',
	'IMG_CAT_CUSTOM'		=> 'Images personnalisées',
	'IMG_CAT_FOLDERS'		=> 'Icônes de sujets',
	'IMG_CAT_FORUMS'		=> 'Icônes de forums',
	'IMG_CAT_ICONS'			=> 'Icônes générales',
	'IMG_CAT_LOGOS'			=> 'Logos',
	'IMG_CAT_POLLS'			=> 'Images de sondages',
	'IMG_CAT_UI'			=> 'Éléments généraux de l’interface de l’utilisateur',
	'IMG_CAT_USER'			=> 'Images additionnelles',

	'IMG_SITE_LOGO'			=> 'Logo principal',
	'IMG_UPLOAD_BAR'		=> 'Barre de progression de transfert',
	'IMG_POLL_LEFT'			=> 'Extrémité gauche du sondage',
	'IMG_POLL_CENTER'		=> 'Centre du sondage',
	'IMG_POLL_RIGHT'		=> 'Extrémité droite du sondage',
	'IMG_ICON_FRIEND'		=> 'Ajouter comme ami',
	'IMG_ICON_FOE'			=> 'Ajouter comme ignoré',

	'IMG_FORUM_LINK'			=> 'Forum-lien',
	'IMG_FORUM_READ'			=> 'Forum',
	'IMG_FORUM_READ_LOCKED'		=> 'Forum verrouillé',
	'IMG_FORUM_READ_SUBFORUM'	=> 'Sous-forum',
	'IMG_FORUM_UNREAD'			=> 'Forum contenant des messages non lus',
	'IMG_FORUM_UNREAD_LOCKED'	=> 'Forum contenant des messages non lus verrouillés',
	'IMG_FORUM_UNREAD_SUBFORUM'	=> 'Sous-forum contenant des messages non lus',
	'IMG_SUBFORUM_READ'			=> 'Légende du sous-forum',
	'IMG_SUBFORUM_UNREAD'		=> 'Légende du sous-forum contenant des messages non lus',
	
	'IMG_TOPIC_MOVED'			=> 'Sujet déplacé',

	'IMG_TOPIC_READ'				=> 'Sujet',
	'IMG_TOPIC_READ_MINE'			=> 'Sujet pointé',
	'IMG_TOPIC_READ_HOT'			=> 'Sujet populaire',
	'IMG_TOPIC_READ_HOT_MINE'		=> 'Sujet populaire et pointé',
	'IMG_TOPIC_READ_LOCKED'			=> 'Sujet verrouillé',
	'IMG_TOPIC_READ_LOCKED_MINE'	=> 'Sujet verrouillé et pointé',

	'IMG_TOPIC_UNREAD'				=> 'Sujet contenant des messages non lus',
	'IMG_TOPIC_UNREAD_MINE'			=> 'Sujet pointé contenant des messages non lus',
	'IMG_TOPIC_UNREAD_HOT'			=> 'Sujet populaire contenant des messages non lus',
	'IMG_TOPIC_UNREAD_HOT_MINE'		=> 'Sujet populaire et pointé contenant des messages non lus',
	'IMG_TOPIC_UNREAD_LOCKED'		=> 'Sujet verrouillé contenant des messages non lus',
	'IMG_TOPIC_UNREAD_LOCKED_MINE'	=> 'Sujet verrouillé et pointé contenant des messages non lus',

	'IMG_STICKY_READ'				=> 'Note',
	'IMG_STICKY_READ_MINE'			=> 'Note pointée',
	'IMG_STICKY_READ_LOCKED'		=> 'Note verrouillée',
	'IMG_STICKY_READ_LOCKED_MINE'	=> 'Note verrouillée et pointée',
	'IMG_STICKY_UNREAD'				=> 'Note contenant des messages non lus',
	'IMG_STICKY_UNREAD_MINE'		=> 'Note pointée contenant des messages non lus',
	'IMG_STICKY_UNREAD_LOCKED'		=> 'Note verrouillée contenant des messages non lus',
	'IMG_STICKY_UNREAD_LOCKED_MINE'	=> 'Note verrouillée et pointée contenant des messages non lus',

	'IMG_ANNOUNCE_READ'					=> 'Annonce',
	'IMG_ANNOUNCE_READ_MINE'			=> 'Annonce pointée',
	'IMG_ANNOUNCE_READ_LOCKED'			=> 'Annonce verrouillée',
	'IMG_ANNOUNCE_READ_LOCKED_MINE'		=> 'Annonce verrouillée et pointée',
	'IMG_ANNOUNCE_UNREAD'				=> 'Annonce contenant des messages non lus',
	'IMG_ANNOUNCE_UNREAD_MINE'			=> 'Annonce pointée contenant des messages non lus',
	'IMG_ANNOUNCE_UNREAD_LOCKED'		=> 'Annonce verrouillée contenant des messages non lus',
	'IMG_ANNOUNCE_UNREAD_LOCKED_MINE'	=> 'Annonce verrouillée et pointée contenant des messages non lus',

	'IMG_GLOBAL_READ'					=> 'Annonce globale',
	'IMG_GLOBAL_READ_MINE'				=> 'Annonce globale pointée',
	'IMG_GLOBAL_READ_LOCKED'			=> 'Annonce globale verrouillée',
	'IMG_GLOBAL_READ_LOCKED_MINE'		=> 'Annonce globale verrouillée et pointée',
	'IMG_GLOBAL_UNREAD'					=> 'Annonce globale contenant des messages non lus',
	'IMG_GLOBAL_UNREAD_MINE'			=> 'Annonce globale pointée contenant des messages non lus',
	'IMG_GLOBAL_UNREAD_LOCKED'			=> 'Annonce globale verrouillée contenant des messages non lus',
	'IMG_GLOBAL_UNREAD_LOCKED_MINE'		=> 'Annonce globale verrouillée et pointée contenant des messages non lus',

	'IMG_PM_READ'		=> 'Message privé lu',
	'IMG_PM_UNREAD'		=> 'Message privé non lu',

	'IMG_ICON_BACK_TOP'		=> 'Haut',

	'IMG_ICON_CONTACT_AIM'		=> 'AIM',
	'IMG_ICON_CONTACT_EMAIL'	=> 'Envoyer un e-mail',
	'IMG_ICON_CONTACT_ICQ'		=> 'ICQ',
	'IMG_ICON_CONTACT_JABBER'	=> 'Jabber',
	'IMG_ICON_CONTACT_MSNM'		=> 'MSNM',
	'IMG_ICON_CONTACT_PM'		=> 'Envoyer un message',
	'IMG_ICON_CONTACT_YAHOO'	=> 'YIM',
	'IMG_ICON_CONTACT_WWW'		=> 'Site Internet',

	'IMG_ICON_POST_DELETE'			=> 'Supprimer un message',
	'IMG_ICON_POST_EDIT'			=> 'Éditer un message',
	'IMG_ICON_POST_INFO'			=> 'Afficher les informations sur un message',
	'IMG_ICON_POST_QUOTE'			=> 'Citer un message',
	'IMG_ICON_POST_REPORT'			=> 'Rapporter un message',
	'IMG_ICON_POST_TARGET'			=> 'Mini-message',
	'IMG_ICON_POST_TARGET_UNREAD'	=> 'Nouveau mini-message',


	'IMG_ICON_TOPIC_ATTACH'			=> 'Pièce jointe',
	'IMG_ICON_TOPIC_LATEST'			=> 'Dernier message',
	'IMG_ICON_TOPIC_NEWEST'			=> 'Dernier message non lu',
	'IMG_ICON_TOPIC_REPORTED'		=> 'Message rapporté',
	'IMG_ICON_TOPIC_UNAPPROVED'		=> 'Message non approuvé',

	'IMG_ICON_USER_ONLINE'		=> 'Utilisateur en ligne',
	'IMG_ICON_USER_OFFLINE'		=> 'Utilisateur hors-ligne',
	'IMG_ICON_USER_PROFILE'		=> 'Afficher le profil',
	'IMG_ICON_USER_SEARCH'		=> 'Rechercher des messages',
	'IMG_ICON_USER_WARN'		=> 'Avertir l’utilisateur',

	'IMG_BUTTON_PM_FORWARD'		=> 'Transmettre le message privé',
	'IMG_BUTTON_PM_NEW'			=> 'Nouveau message privé',
	'IMG_BUTTON_PM_REPLY'		=> 'Répondre au message privé',
	'IMG_BUTTON_TOPIC_LOCKED'	=> 'Sujet verrouillé',
	'IMG_BUTTON_TOPIC_NEW'		=> 'Nouveau sujet',
	'IMG_BUTTON_TOPIC_REPLY'	=> 'Répondre au sujet',

	'IMG_USER_ICON1'		=> 'Image 1 définie par l’utilisateur',
	'IMG_USER_ICON2'		=> 'Image 2 définie par l’utilisateur',
	'IMG_USER_ICON3'		=> 'Image 3 définie par l’utilisateur',
	'IMG_USER_ICON4'		=> 'Image 4 définie par l’utilisateur',
	'IMG_USER_ICON5'		=> 'Image 5 définie par l’utilisateur',
	'IMG_USER_ICON6'		=> 'Image 6 définie par l’utilisateur',
	'IMG_USER_ICON7'		=> 'Image 7 définie par l’utilisateur',
	'IMG_USER_ICON8'		=> 'Image 8 définie par l’utilisateur',
	'IMG_USER_ICON9'		=> 'Image 9 définie par l’utilisateur',
	'IMG_USER_ICON10'		=> 'Image 10 définie par l’utilisateur',

	'INCLUDE_DIMENSIONS'		=> 'Inclure les dimensions',
	'INCLUDE_IMAGESET'			=> 'Inclure l’archive d’images',
	'INCLUDE_TEMPLATE'			=> 'Inclure le template',
	'INCLUDE_THEME'				=> 'Inclure le thème',
	'INHERITING_FROM'         => 'Hérite de',
	'INSTALL_IMAGESET'			=> 'Installer une archive d’images',
	'INSTALL_IMAGESET_EXPLAIN'	=> 'Vous pouvez installer ici une archive d’images. Si vous le souhaitez, vous pouvez éditer certaines informations ou utiliser les valeurs par défaut lors de l’installation.',
	'INSTALL_STYLE'				=> 'Installer un style',
	'INSTALL_STYLE_EXPLAIN'		=> 'Vous pouvez installer ici un style et ses éléments. Si les éléments appropriés au style sont déjà installés, ils ne seront pas écrasés. Certains styles nécessitent que ces éléments soient déjà installés. Si vous en rencontrez un de ce genre, vous serez alors averti.',
	'INSTALL_TEMPLATE'			=> 'Installer une archive de templates',
	'INSTALL_TEMPLATE_EXPLAIN'	=> 'Vous pouvez installer ici une archive de templates. Selon la configuration de votre serveur, vous pouvez rencontrer certaines options supplémentaires.',
	'INSTALL_THEME'				=> 'Installer un thème',
	'INSTALL_THEME_EXPLAIN'		=> 'Vous pouvez installer ici un thème. Si vous le souhaitez, vous pouvez éditer certaines informations ou utiliser les valeurs par défaut lors de l’installation.',
	'INSTALLED_IMAGESET'		=> 'Archives d’images installées',
	'INSTALLED_STYLE'			=> 'Styles installés',
	'INSTALLED_TEMPLATE'		=> 'Archives de templates installées',
	'INSTALLED_THEME'			=> 'Thèmes installés',

	'LINE_SPACING'				=> 'Ligne d’espacement',
	'LOCALISED_IMAGES'			=> 'Traduites',
	'LOCATION_DISABLED_EXPLAIN'   => 'Ce réglage est hérité et ne peut pas être modifié.',


	'NO_CLASS'					=> 'Aucune classe n’a été trouvée dans la feuille de style.',
	'NO_IMAGESET'				=> 'Aucune archive d’images n’a été trouvée dans le système de fichiers.',
	'NO_IMAGE'					=> 'Aucune image',
	'NO_IMAGE_ERROR'			=> 'Aucune image n’a été trouvée dans le système de fichiers.',
	'NO_STYLE'					=> 'Aucune style n’a été trouvé dans le système de fichiers.',
	'NO_TEMPLATE'				=> 'Aucune archive de templates n’a été trouvée dans le système de fichiers.',
	'NO_THEME'					=> 'Aucun thème n’a été trouvé dans le système de fichiers.',
	'NO_UNINSTALLED_IMAGESET'	=> 'Aucune archive d’images désinstallée n’a été détectée.',
	'NO_UNINSTALLED_STYLE'		=> 'Aucun style désinstallé n’a été détecté.',
	'NO_UNINSTALLED_TEMPLATE'	=> 'Aucune archive de templates désinstallée n’a été détectée.',
	'NO_UNINSTALLED_THEME'		=> 'Aucun thème désinstallé n’a été détecté.',
	'NO_UNIT'					=> 'Aucun',

	'ONLY_IMAGESET'			=> 'Ceci est la seule archive d’images restante, vous ne pouvez pas l’effacer.',
	'ONLY_STYLE'			=> 'Ceci est le seul style restant, vous ne pouvez pas l’effacer.',
	'ONLY_TEMPLATE'			=> 'Ceci est la seule archive de templates restante, vous ne pouvez pas l’effacer.',
	'ONLY_THEME'			=> 'Ceci est le seul thème restant, vous ne pouvez pas l’effacer.',
	'OPTIONAL_BASIS'		=> 'Base optionnelle',

	'REFRESH'					=> 'Rafraîchir',
	'REPEAT_NO'					=> 'Aucun',
	'REPEAT_X'					=> 'Seulement horizontalement',
	'REPEAT_Y'					=> 'Seulement verticalement',
	'REPEAT_ALL'				=> 'Deux directions',
	'REPLACE_IMAGESET'			=> 'Remplacer l’archive d’images par',
	'REPLACE_IMAGESET_EXPLAIN'	=> 'Cette archive d’images remplacera celle que vous supprimez dans tous les styles l’utilisant.',
	'REPLACE_STYLE'				=> 'Remplacer le style par',
	'REPLACE_STYLE_EXPLAIN'		=> 'Ce style remplacera celui qui a été supprimé pour les membres l’utilisant.',
	'REPLACE_TEMPLATE'			=> 'Remplacer l’archive de templates par',
	'REPLACE_TEMPLATE_EXPLAIN'	=> 'Cette archive de templates remplacera celle que vous supprimez dans tous les styles l’utilisant.',
	'REPLACE_THEME'				=> 'Remplacer le thème par',
	'REPLACE_THEME_EXPLAIN'		=> 'Ce thème remplacera celui que vous supprimez dans tous les styles l’utilisant.',
	'REQUIRES_IMAGESET'			=> 'Ce style requiert l’installation de l’archive d’images %s.',
	'REQUIRES_TEMPLATE'			=> 'Ce style requiert l’installation de l’archive de templates %s.',
	'REQUIRES_THEME'			=> 'Ce style requiert l’installation du thème %s.',

	'SELECT_IMAGE'				=> 'Sélectionner l’image',
	'SELECT_TEMPLATE'			=> 'Sélectionner le fichier template',
	'SELECT_THEME'				=> 'Sélectionner le fichier thème',
	'SELECTED_IMAGE'			=> 'Image sélectionnée',
	'SELECTED_IMAGESET'			=> 'Archive d’images sélectionnée',
	'SELECTED_TEMPLATE'			=> 'Template sélectionné',
	'SELECTED_TEMPLATE_FILE'	=> 'Fichier template sélectionné',
	'SELECTED_THEME'			=> 'Thème sélectionné',
	'SELECTED_THEME_FILE'		=> 'Fichier thème sélectionné',
	'STORE_DATABASE'			=> 'Base de données',
	'STORE_FILESYSTEM'			=> 'Système de fichiers',
	'STYLE_ACTIVATE'			=> 'Activer',
	'STYLE_ACTIVE'				=> 'Actif',
	'STYLE_ADDED'				=> 'Le style a été ajouté avec succès.',
	'STYLE_DEACTIVATE'			=> 'Désactiver',
	'STYLE_DEFAULT'				=> 'En faire le style par défaut',
	'STYLE_DELETED'				=> 'Le style a été supprimé avec succès.',
	'STYLE_DETAILS_UPDATED'		=> 'Le style a été édité avec succès.',
	'STYLE_ERR_ARCHIVE'			=> 'Veuillez sélectionner une méthode de compression.',
	'STYLE_ERR_COPY_LONG'		=> 'Le copyright ne doit pas dépasser 60 caractères.',
	'STYLE_ERR_MORE_ELEMENTS'	=> 'Vous devez sélectionner au moins un élément pour le style.',
	'STYLE_ERR_NAME_CHARS'		=> 'Le nom du style ne doit contenir que des caractères alphanumériques, -, +, _ et des espaces.',
	'STYLE_ERR_NAME_EXIST'		=> 'Un style portant ce nom existe déjà.',
	'STYLE_ERR_NAME_LONG'		=> 'Le nom du style ne doit pas dépasser 30 caractères.',
	'STYLE_ERR_NO_IDS'			=> 'Vous devez sélectionner un template, un thème et une archive d’images pour ce style.',
	'STYLE_ERR_NOT_STYLE'		=> 'Le fichier importé ou transféré ne contient pas de fichier de style compressé valide.',
	'STYLE_ERR_STYLE_NAME'		=> 'Vous devez spécifier le nom de ce style.',
	'STYLE_EXPORT'				=> 'Exporter un style',
	'STYLE_EXPORT_EXPLAIN'		=> 'Vous pouvez exporter ici un style sous forme de fichier compréssé. Un style ne devra pas contenir tous les éléments, mais il doit en contenir au moins un. Par exemple, si vous créez un nouveau thème et une archive d’images pour un template fréquemment utilisé, vous pourriez simplement exporter le thème et l’archive d’images, en omettant le template. Vous pouvez soit télécharger le dossier directement, soit le placer dans votre répertoire de stockage afin de le télécharger ultérieurement par FTP.',
	'STYLE_EXPORTED'			=> 'Le style a été exporté et stocké dans %s avec succès.',
	'STYLE_IMAGESET'			=> 'Archive d’images',
	'STYLE_NAME'				=> 'Nom du style',
	'STYLE_TEMPLATE'			=> 'Template',
	'STYLE_THEME'				=> 'Thème',
	'STYLE_USED_BY'				=> 'Utilisé par (incluant les robots)',

	'TEMPLATE_ADDED'			=> 'L’archive de templates a été ajoutée au système de fichiers avec succès.',
	'TEMPLATE_ADDED_DB'			=> 'L’archive de templates a été ajoutée à la base de données avec succès.',
	'TEMPLATE_CACHE'			=> 'Cache du template',
	'TEMPLATE_CACHE_EXPLAIN'	=> 'Par défaut, phpBB met en cache la version compilée de ses templates. Cela permet de diminuer la charge du serveur à chaque fois qu’une page est consultée et réduit le temps de chargement de la page. Vous pouvez consulter ici le statut en cache de chaque fichier et supprimer individuellement les fichiers ou le cache en entier.',
	'TEMPLATE_CACHE_CLEARED'	=> 'Le cache du template a été vidé avec succès.',
	'TEMPLATE_CACHE_EMPTY'		=> 'Il n’y a aucun template mis en cache.',
	'TEMPLATE_DELETED'			=> 'L’archive de templates a été supprimée avec succès.',
	'TEMPLATE_DELETE_DEPENDENT'   => 'L’archive de templates ne peut être supprimée car un ou plusieurs autres templates héritent de ce dernier :',
	'TEMPLATE_DELETED_FS'		=> 'L’archive de templates a été supprimée de la base données mais certains fichiers ont été conservés dans le système de fichiers.',
	'TEMPLATE_DETAILS_UPDATED'	=> 'Les informations de l’archive de templates ont été mises à jour avec succès.',
	'TEMPLATE_EDITOR'			=> 'Éditeur de templates en HTML brut',
	'TEMPLATE_EDITOR_HEIGHT'	=> 'Taille de l’éditeur de templates',
	'TEMPLATE_ERR_ARCHIVE'		=> 'Veuillez sélectionner une méthode de compression.',
	'TEMPLATE_ERR_CACHE_READ'	=> 'Le répertoire de cache utilisé afin de stocker les versions des fichiers de templates mis en cache ne peut pas être lu.',
	'TEMPLATE_ERR_COPY_LONG'	=> 'Le copyright ne doit pas dépasser 60 caractères.',
	'TEMPLATE_ERR_NAME_CHARS'	=> 'Le nom de l’archive de templates ne doit contenir que des caractères alphanumériques, -, +, _ et des espaces.',
	'TEMPLATE_ERR_NAME_EXIST'	=> 'Une archive de templates portant ce nom existe déjà.',
	'TEMPLATE_ERR_NAME_LONG'	=> 'Le nom de l’archive de templates ne doit pas dépasser 30 caractères.',
	'TEMPLATE_ERR_NOT_TEMPLATE'	=> 'Le fichier compressé que vous avez spécifié ne contient aucune archive de templates valide.',
	'TEMPLATE_ERR_REQUIRED_OR_INCOMPLETE' => 'La nouvelle archive de templates requiert l’installation du template %s et ne doit pas hériter de ce dernier.',
	'TEMPLATE_ERR_STYLE_NAME'	=> 'Vous devez spécifier le nom de cette archive de templates.',
	'TEMPLATE_EXPORT'			=> 'Exporter une archive de templates',
	'TEMPLATE_EXPORT_EXPLAIN'	=> 'Vous pouvez exporter ici une archive de templates sous forme de fichier compréssé. Le fichier compréssé ne devra pas contenir tous les fichiers nécessaires à l’installation de templates sur un autre forum. Vous pouvez soit télécharger le dossier directement, soit le placer dans votre répertoire de stockage afin de le télécharger ultérieurement par FTP.',
	'TEMPLATE_EXPORTED'			=> 'Les templates ont été exportés et stockés dans %s avec succès.',
	'TEMPLATE_FILE'				=> 'Fichier template',
	'TEMPLATE_FILE_UPDATED'		=> 'Le fichier template a été mis à jour avec succès.',
	'TEMPLATE_INHERITS'         => 'Ces archives de templates héritent de %s et ne peuvent donc pas avoir de réglages de stockage différents que ce super template.',
	'TEMPLATE_LOCATION'			=> 'Stocker les templates dans',
	'TEMPLATE_LOCATION_EXPLAIN'	=> 'Les images sont toujours stockées dans le système de fichiers.',
	'TEMPLATE_NAME'				=> 'Nom du template',
	'TEMPLATE_FILE_NOT_WRITABLE'=> 'Impossible d’écrire sur le fichier template %s. Veuillez vérifier les permissions du répertoire et des fichiers.',
	'TEMPLATE_REFRESHED'		=> 'Le template a été rafraîchi avec succès.',

	'THEME_ADDED'				=> 'Le thème a été ajouté au système de fichiers avec succès.',
	'THEME_ADDED_DB'			=> 'Le thème a été ajouté à la base de données avec succès.',
	'THEME_CLASS_ADDED'			=> 'La classe personnalisée a été ajoutée avec succès.',
	'THEME_DELETED'				=> 'Le thème a été supprimé avec succès.',
	'THEME_DELETED_FS'			=> 'Le thème supprimé de la base de données mais quelques fichiers peuvent subsister dans le système de fichiers.',
	'THEME_DETAILS_UPDATED'		=> 'Les informations du thème ont été mises à jour avec succès.',
	'THEME_EDITOR'				=> 'Éditeur de thèmes',
	'THEME_EDITOR_HEIGHT'		=> 'Taille de l’éditeur de thèmes',
	'THEME_ERR_ARCHIVE'			=> 'Veuillez sélectionner une méthode de compression.',
	'THEME_ERR_CLASS_CHARS'		=> 'Seuls les caractère alphanumériques, ., :, -, _ et # sont valides dans les noms de classes.',
	'THEME_ERR_COPY_LONG'		=> 'Le copyright ne doit pas dépasser 60 caractères.',
	'THEME_ERR_NAME_CHARS'		=> 'Le nom du thème ne doit contenir que des caractères alphanumériques, -, +, _ et des espaces.',
	'THEME_ERR_NAME_EXIST'		=> 'Un thème portant ce nom existe déjà.',
	'THEME_ERR_NAME_LONG'		=> 'Le nom du thème ne doit pas dépasser 30 caractères.',
	'THEME_ERR_NOT_THEME'		=> 'Le fichier compressé que vous avez spécifié ne contient pas de thème valide.',
	'THEME_ERR_REFRESH_FS'		=> 'Ce thème est stocké dans le système de fichiers. Il n’y a donc pas besoin de le rafraîchir.',
	'THEME_ERR_STYLE_NAME'		=> 'Vous devez spécifier le nom de ce thème.',
	'THEME_FILE'				=> 'Fichier thème',
	'THEME_EXPORT'				=> 'Exporter un thème',
	'THEME_EXPORT_EXPLAIN'		=> 'Vous pouvez exporter ici un thème sous forme de fichier compréssé. Ce fichier compressé contiendra toutes les données nécessaires à l’installation du thème sur un autre forum. Vous pouvez soit télécharger le fichier directement, soit le placer dans votre répertoire de stockage afin de le télécharger ultérieurement par FTP.',
	'THEME_EXPORTED'			=> 'Le thème a été exporté et stocké dans %s avec succès.',
	'THEME_LOCATION'			=> 'Stocker la feuille de style dans',
	'THEME_LOCATION_EXPLAIN'	=> 'Les images sont toujours stockées dans le système de fichiers.',
	'THEME_NAME'				=> 'Nom du thème',
	'THEME_REFRESHED'			=> 'Le thème a été rafraîchi avec succès.',
	'THEME_UPDATED'				=> 'Le thème a été mis à jour avec succès.',

	'UNDERLINE'				=> 'Souligné',
	'UNINSTALLED_IMAGESET'	=> 'Archives d’images désinstallées',
	'UNINSTALLED_STYLE'		=> 'Styles désinstallés',
	'UNINSTALLED_TEMPLATE'	=> 'Archives de templates désinstallées',
	'UNINSTALLED_THEME'		=> 'Thèmes désinstallés',
	'UNSET'					=> 'Non défini',

));

?>