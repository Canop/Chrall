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
* acp_posting [French]
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

// BBCodes
// Note to translators: you can translate everything but what's between { and }
$lang = array_merge($lang, array(
	'ACP_BBCODES_EXPLAIN'		=> 'Le BBCode est une implémentation spéciale du HTML qui offre un plus grand contrôle sur quoi et comment quelque chose doit être affiché. De cette page, vous pouvez ajouter, supprimer et éditer des BBCodes personnalisés.',
	'ADD_BBCODE'				=> 'Ajouter un nouveau BBCode',

	'BBCODE_DANGER'				=> 'Le BBCode que vous êtes en train d’essayer d’ajouter semble utiliser une chaîne de symboles {TEXT} dans l’attribut HTML. Ceci peut être un éventuel problème de sécurité XSS. Essayez d’utiliser un type plus restrictif à la place, comme {SIMPLETEXT} ou {INTTEXT}. Ne procédez uniquement à cela que si vous comprenez les risque encourus et que vous considérez que l’utilisation de {TEXT} est absolumement inévitable.',
	'BBCODE_DANGER_PROCEED'		=> 'Procéder', //'I understand the risk',

	'BBCODE_ADDED'				=> 'Le BBCode a été ajouté avec succès.',
	'BBCODE_EDITED'				=> 'Le BBCode a été édité avec succès.',
	'BBCODE_NOT_EXIST'			=> 'Le BBCode que vous avez sélectionné n’existe pas.',
	'BBCODE_HELPLINE'			=> 'Ligne d’aide',
	'BBCODE_HELPLINE_EXPLAIN'	=> 'Ce champ contient le texte du BBCode qui sera affiché lors du passage de la souris.',
	'BBCODE_HELPLINE_TEXT'		=> 'Texte de la ligne d’aide',
	'BBCODE_HELPLINE_TOO_LONG'   => 'La ligne d’aide que vous avez saisi est trop longue.',
	
	'BBCODE_INVALID_TAG_NAME'	=> 'Le nom de la balise BBCode que vous avez sélectionné existe déjà.',
	'BBCODE_INVALID'			=> 'Votre BBCode est construit dans une architecture invalide.',
	'BBCODE_OPEN_ENDED_TAG'		=> 'Votre BBCode personnalisé doit contenir une balise d’ouverture et de fermeture.',
	'BBCODE_TAG'				=> 'Balise',
	'BBCODE_TAG_TOO_LONG'		=> 'Le nom de la balise que vous avez sélectionné est trop long.',
	'BBCODE_TAG_DEF_TOO_LONG'	=> 'La définition de la balise que vous avez saisi est trop longue, veuillez la raccourcir.',
	'BBCODE_USAGE'				=> 'Utilisation du BBCode',
	'BBCODE_USAGE_EXAMPLE'		=> '[highlight={COLOR}]{TEXT}[/highlight]<br /><br />[font={SIMPLETEXT1}]{SIMPLETEXT2}[/font]',
	'BBCODE_USAGE_EXPLAIN'		=> 'Vous pouvez définir ici comment utiliser le BBCode. Remplacez n’importe quelle variable d’entrée par la chaîne de symboles correspondante (%svoir ci-dessous%s).',

	'EXAMPLE'						=> 'Exemple :',
	'EXAMPLES'						=> 'Exemples :',

	'HTML_REPLACEMENT'				=> 'Remplacement de l’HTML',
	'HTML_REPLACEMENT_EXAMPLE'		=> '&lt;span style="background-color:{COLOR};"&gt;{TEXT}&lt;/span&gt;<br /><br />&lt;span style="font-family:{SIMPLETEXT1};"&gt;{SIMPLETEXT2}&lt;/span&gt;',
	'HTML_REPLACEMENT_EXPLAIN'		=> 'Vous pouvez définir ici le remplacement par défaut de l’HTML. N’oubliez pas de remettre la chaîne de symboles d’entrée que vous avez utilisé ci-dessus !',

	'TOKEN'					=> 'Chaîne de symboles',
	'TOKENS'				=> 'Chaînes de symboles',
	'TOKENS_EXPLAIN'		=> 'Les chaînes de symboles sont des conteneurs pour les utilisateurs. Les entrées ne seront validées que si elles trouvent la définition correspondante. Si besoin, vous pouvez les numéroter en y ajoutant un nombre entre des accolades comme dernier caractère, comme {TEXT1}, {TEXT2}.<br /><br />Vous pouvez, en plus du remplacement de l’HTML, utiliser une chaîne de langue dans votre répertoire language/ comme ceci : {L_<em>&lt;STRINGNAME&gt;</em>} où <em>&lt;STRINGNAME&gt;</em> est le nom de la chaîne traduite que vous souhaitez ajouter. Par exemple, {L_WROTE} sera affiché en tant que “a écrit” ou sa traduction selon la langue locale de l’utilisateur.<br /><br /><strong>Veuillez noter que seules les chaînes listées ci-dessous sont autorisées à être utilisées dans les BBCodes personnalisés.</strong>',
	'TOKEN_DEFINITION'		=> 'Qu’est-ce que c’est ?',
	'TOO_MANY_BBCODES'		=> 'Vous ne pouvez pas créer d’autres BBCodes. Veuillez supprimer un ou plusieurs BBCodes, puis réessayer.',

	'tokens'	=>	array(
		'TEXT'			=> 'Du texte, incluant des caractères étrangers, des chiffres, etc. Vous ne devriez pas utiliser cette chaîne de symboles dans les balises HTML. Essayez d’utiliser à la place IDENTIFIER, INTTEXT ou SIMPLETEXT.',
		'SIMPLETEXT'	=> 'Des caractères de l’alphabet latin (A-Z), des chiffres, des espaces, des virgules, des points, des plus, des moins, des tirets et des tirets-bas.',
		'INTTEXT'		=> 'Des lettres de caractères Unicode, des chiffres, des espaces, des virgules, des points, des plus, des moins, des tirets-bas et des espaces insécables.',
		'IDENTIFIER'	=> 'Des caractères de l’alphabet latin (A-Z), des chiffres, des tirets et des tirets-bas.',
		'NUMBER'		=> 'Une série de chiffres',
		'EMAIL'			=> 'Une adresse e-mail valide',
		'URL'			=> 'Un lien correct utilisant n’importe quel protocole (http, ftp, etc.) ne pouvant pas être utilisé en cas d’exécution de Javascript. Si aucun protocole n’est fourni, “http://” sera utilisé par défaut.',
		'LOCAL_URL'		=> 'Un lien local. Le lien doit être relatif à la page du sujet et ne doit pas contenir un nom de serveur ou un protocole.',
		'COLOR'			=> 'Une couleur HTML, qui peut être dans une forme hexadécimale <samp>#FF1234</samp> ou un <a href="http://www.w3.org/TR/CSS21/syndata.html#value-def-color">nom de couleur CSS</a>, tel que <samp>fuchsia</samp> ou <samp>InactiveBorder</samp>'
	)
));

// Smilies and topic icons
$lang = array_merge($lang, array(
	'ACP_ICONS_EXPLAIN'		=> 'Vous pouvez ajouter, supprimer ou éditer ici les icônes que les utilisateurs peuvent ajouter à leurs sujets ou messages. Ces icônes sont généralement affichées à côté des titres des sujets sur la liste des forums, ou à côté des titres des messages sur la liste des sujets. Vous pouvez également installer et créer de nouvelles archives d’icônes.',
	'ACP_SMILIES_EXPLAIN'	=> 'Les émoticônes sont généralement de petites images, parfois animées, qui sont utilisées afin d’exprimer une émotion ou un sentiment. De cette page, vous pouvez ajouter, supprimer et éditer les émoticônes que les utilisateurs utilisent dans leurs messages et leurs messages privés. Vous pouvez également installer et créer de nouvelles archives d’émoticônes.',
	'ADD_SMILIES'			=> 'Ajouter plusieurs émoticônes',
	'ADD_SMILEY_CODE'		=> 'Ajouter un code additionnel d’émoticône',
	'ADD_ICONS'				=> 'Ajouter plusieurs icônes',
	'AFTER_ICONS'			=> 'Après %s',
	'AFTER_SMILIES'			=> 'Après %s',

	'CODE'						=> 'Code',
	'CURRENT_ICONS'				=> 'Icônes actuelles',
	'CURRENT_ICONS_EXPLAIN'		=> 'Choisissez que faire des icônes actuellement installées.',
	'CURRENT_SMILIES'			=> 'Émoticônes actuelles',
	'CURRENT_SMILIES_EXPLAIN'	=> 'Choisissez que faire des émoticônes actuellement installées.',

	'DISPLAY_ON_POSTING'	=> 'Afficher sur la page de rédaction',
	'DISPLAY_POSTING'			=> 'Sur la page de rédaction',
	'DISPLAY_POSTING_NO'		=> 'Pas sur la page de rédaction',


  
	'EDIT_ICONS'				=> 'Éditer les icônes',
	'EDIT_SMILIES'				=> 'Éditer les émoticônes',
	'EMOTION'					=> 'Émotion',
	'EXPORT_ICONS'				=> 'Exporter et télécharger icons.pak',
	'EXPORT_ICONS_EXPLAIN'		=> '%sEn cliquant sur ce lien, la configuration des icônes que vous avez installé sera regroupée dans l’archive <samp>icons.pak</samp> qui, une fois téléchargée, peut être utilisée afin de créer un fichier <samp>.zip</samp> ou <samp>.tgz</samp> qui contient toutes vos icônes, ainsi que le fichier de configuration <samp>icons.pak</samp>%s.',
	'EXPORT_SMILIES'			=> 'Exporter et télécharger smilies.pak',
	'EXPORT_SMILIES_EXPLAIN'	=> '%sEn cliquant sur ce lien, la configuration des émoticônes que vous avez installé sera regroupée dans l’archive <samp>smilies.pak</samp> qui, une fois téléchargée, peut être utilisée afin de créer un fichier <samp>.zip</samp> ou <samp>.tgz</samp> qui contient toutes vos émoticônes, ainsi que le fichier de configuration <samp>smilies.pak</samp>%s.',

	'FIRST'			=> 'Premier',

	'ICONS_ADD'				=> 'Ajouter une nouvelle icône',
	'ICONS_NONE_ADDED'		=> 'Aucune icône n’a été ajoutée.',
	'ICONS_ONE_ADDED'		=> 'L’icône a été ajouté avec succès.',
	'ICONS_ADDED'			=> 'Les icônes ont été ajoutées avec succès.',
	'ICONS_CONFIG'			=> 'Configuration de l’icône',
	'ICONS_DELETED'			=> 'L’icône a été supprimée avec succès.',
	'ICONS_EDIT'			=> 'Éditer l’icône',
	'ICONS_ONE_EDITED'		=> 'L’icône a été mise à jour avec succès.',
	'ICONS_NONE_EDITED'		=> 'Aucune icône n’a été mise à jour.',
	'ICONS_EDITED'			=> 'Les icônes ont été mises à jour avec succès.',
	'ICONS_HEIGHT'			=> 'Hauteur de l’icône',
	'ICONS_IMAGE'			=> 'Image de l’icône',
	'ICONS_IMPORTED'		=> 'L’archive d’icônes a été installée avec succès.',
	'ICONS_IMPORT_SUCCESS'	=> 'L’archive d’icônes a été importée avec succès.',
	'ICONS_LOCATION'		=> 'Emplacement de l’icône',
	'ICONS_NOT_DISPLAYED'	=> 'Les icônes suivantes ne sont pas affichées sur la page de rédaction',
	'ICONS_ORDER'			=> 'Classement de l’icône',
	'ICONS_URL'				=> 'Image de l’icône',
	'ICONS_WIDTH'			=> 'Largeur de l’icône',
	'IMPORT_ICONS'			=> 'Installer une archive d’icônes',
	'IMPORT_SMILIES'		=> 'Installer une archive d’émoticônes',

	'KEEP_ALL'			=> 'Tout conserver',

	'MASS_ADD_SMILIES'	=> 'Ajouter plusieurs émoticônes',

	'NO_ICONS_ADD'		=> 'Il n’y a aucune icône disponible à ajouter.',
	'NO_ICONS_EDIT'		=> 'Il n’y a aucune icône disponible à modifier.',
  'NO_ICONS_EXPORT'	=> 'Vous n’avez sélectionné aucune icône afin de créer une archive.',
	'NO_ICONS_PAK'		=> 'Aucune archive d’icônes n’a été trouvée.',
	'NO_SMILIES_ADD'	=> 'Il n’y a aucune émoticône disponible à ajouter.',
	'NO_SMILIES_EDIT'	=> 'Il n’y a aucune émoticône disponible à modifier.',
	'NO_SMILIES_EXPORT'	=> 'Vous n’avez aucune émoticône afin de créer une archive.',
	'NO_SMILIES_PAK'	=> 'Aucune archive d’émoticônes n’a été trouvée.',

	'PAK_FILE_NOT_READABLE'		=> 'Impossible de lire le fichier <samp>.pak</samp>.',

	'REPLACE_MATCHES'	=> 'Remplacer les résultats',

	'SELECT_PACKAGE'			=> 'Sélectionner une archive',
	'SMILIES_ADD'				=> 'Ajouter une nouvelle émoticône',
	'SMILIES_NONE_ADDED'		=> 'Aucune émoticône n’a été ajoutée.',
	'SMILIES_ONE_ADDED'			=> 'L’émoticône a été ajoutée avec succès.',
	'SMILIES_ADDED'				=> 'Les émoticônes ont été ajoutées avec succès.',
	'SMILIES_CODE'				=> 'Code de l’émoticône',
	'SMILIES_CONFIG'			=> 'Configuration de l’émoticône',
	'SMILIES_DELETED'			=> 'L’émoticône a été supprimée avec succès.',
	'SMILIES_EDIT'				=> 'Éditer l’émoticône',
	'SMILIE_NO_CODE'			=> 'L’émoticône “%s” a été ignorée car aucun code n’a été saisi.',
	'SMILIE_NO_EMOTION'			=> 'L’émoticône “%s” a été ignorée car aucune émoticône n’a été spécifiée.',
	'SMILIES_NONE_EDITED'		=> 'Aucune émoticône n’a été mise à jour.',
	'SMILIES_ONE_EDITED'		=> 'L’émoticône a été mise à jour avec succès.',
	'SMILIES_EDITED'			=> 'Les émoticônes ont été mises à jour avec succès.',
	'SMILIES_EMOTION'			=> 'Émotion',
	'SMILIES_HEIGHT'			=> 'Hauteur de l’émoticône',
	'SMILIES_IMAGE'				=> 'Image de l’émoticône',
	'SMILIES_IMPORTED'			=> 'L’archive d’émoticônes a été installée avec succès.',
	'SMILIES_IMPORT_SUCCESS'	=> 'L’archive d’émoticônes a été importée avec succès.',
	'SMILIES_LOCATION'			=> 'Emplacement de l’émoticône',
	'SMILIES_NOT_DISPLAYED'		=> 'Les émoticônes suivantes ne sont pas affichées sur la page de rédaction',
	'SMILIES_ORDER'				=> 'Classement de l’émoticône',
	'SMILIES_URL'				=> 'Image de l’émoticône',
	'SMILIES_WIDTH'				=> 'Largeur de l’émoticône',

	'TOO_MANY_SMILIES'			=> 'La limite de %d émoticônes a été atteinte.',

	'WRONG_PAK_TYPE'	=> 'L’archive que vous avez spécifié ne contient pas de données appropriées.',
));

// Word censors
$lang = array_merge($lang, array(
	'ACP_WORDS_EXPLAIN'		=> 'Vous pouvez ajouter, éditer et supprimer ici les mots qui seront automatiquement censurés sur votre forum. Les visiteurs seront encore autorisés à s’inscrire avec des noms d’utilisateurs qui contiennent ces mots. Les jokers (*) sont acceptés dans le champ du mot. Par exemple, *test* censurera détestable, test* censurera testament, *test censurera contest.',
	'ADD_WORD'				=> 'Ajouter un nouveau mot',

	'EDIT_WORD'		=> 'Éditer la censure du mot',
	'ENTER_WORD'	=> 'Vous devez saisir un mot et son remplacement.',

	'NO_WORD'	=> 'Aucun mot n’a été sélectionné afin de l’éditer.',

	'REPLACEMENT'	=> 'Remplacement',

	'UPDATE_WORD'	=> 'Mettre à jour la censure du mot',

	'WORD'				=> 'Mot',
	'WORD_ADDED'		=> 'La censure du mot a été ajoutée avec succès.',
	'WORD_REMOVED'		=> 'La censure du mot a été supprimée avec succès.',
	'WORD_UPDATED'		=> 'La censure du mot a été mise à jour avec succès.',
));

// Ranks
$lang = array_merge($lang, array(
	'ACP_RANKS_EXPLAIN'		=> 'En utilisant ce formulaire, vous pouvez ajouter, éditer, voir et supprimer des rangs. Vous pouvez également créer des rangs personnalisés qui peuvent être appliqués à vos utilisateurs par l’intermédiaire de la gestion des utilisateurs.',
	'ADD_RANK'				=> 'Ajouter un nouveau rang',

	'MUST_SELECT_RANK'		=> 'Vous devez sélectionner un rang.',
	
	'NO_ASSIGNED_RANK'		=> 'Aucun rang spécial n’est assigné.',
	'NO_RANK_TITLE'			=> 'Vous n’avez pas spécifié le titre du rang.',
	'NO_UPDATE_RANKS'		=> 'Le rang a été supprimé avec succès. Cependant, les comptes des utilisateurs qui utilisent ce rang n’ont pas été mis à jour. Vous devrez réinitialiser manuellement le rang relatif à ces comptes.',

	'RANK_ADDED'			=> 'Le rang a été ajouté avec succès.',
	'RANK_IMAGE'			=> 'Image du rang',
	'RANK_IMAGE_EXPLAIN'	=> 'Utilisez ceci afin de définir une petite image à associer au rang. Le chemin est relatif par rapport à la racine de phpBB.',
	'RANK_IMAGE_IN_USE'		=> '(En cours d’utilisation)',
	'RANK_MINIMUM'			=> 'Messages minimums',
	'RANK_REMOVED'			=> 'Le rang a été supprimé avec succès.',
	'RANK_SPECIAL'			=> 'Définir comme rang spécial',
	'RANK_TITLE'			=> 'Titre du rang',
	'RANK_UPDATED'			=> 'Le rang a été mis à jour avec succès.',
));

// Disallow Usernames
$lang = array_merge($lang, array(
	'ACP_DISALLOW_EXPLAIN'	=> 'Vous pouvez contrôler ici les noms d’utilisateurs qui ne sont pas autorisés à être utilisés. Les noms d’utilisateurs interdits sont autorisés à contenir un joker “*”. Veuillez noter que vous ne serez pas autorisé à spécifier un nom d’utilisateur déjà inscrit. Vous devez d’abord supprimer ce nom, puis l’interdire.',
	'ADD_DISALLOW_EXPLAIN'	=> 'Vous pouvez interdire un nom d’utilisateur en utilisant un joker “*” afin de remplacer tout caractère.',
	'ADD_DISALLOW_TITLE'	=> 'Ajouter un nom d’utilisateur interdit',

	'DELETE_DISALLOW_EXPLAIN'	=> 'Vous pouvez supprimer un nom d’utilisateur interdit en sélectionnant le nom d’utilisateur de cette liste et en cliquant sur envoyer.',
	'DELETE_DISALLOW_TITLE'		=> 'Supprimer un nom d’utilisateur interdit',
	'DISALLOWED_ALREADY'		=> 'Le nom d’utilisateur que vous avez saisi ne peut pas être interdit. Soit il est déjà présent dans cette liste ou celle de la censure de mots, soit il correspond à un nom d’utilisateur inscrit.',
	'DISALLOWED_DELETED'		=> 'Le nom d’utilisateur interdit a été supprimé avec succès.',
	'DISALLOW_SUCCESSFUL'		=> 'Le nom d’utilisateur interdit a été ajouté avec succès.',

	'NO_DISALLOWED'				=> 'Il n’y a aucun nom d’utilisateur interdit',
	'NO_USERNAME_SPECIFIED'		=> 'Vous n’avez sélectionné aucun nom d’utilisateur. Veuillez en sélectionner un afin d’effectuer cette opération.',
));

// Reasons
$lang = array_merge($lang, array(
	'ACP_REASONS_EXPLAIN'	=> 'Vous pouvez gérer ici les raisons utilisées dans les rapports lors de la désapprobation de messages. Il y a une raison par défaut (marquée avec “*”) que vous ne pouvez pas supprimer, cette raison est utilisée normalement pour les messages personnalisés si aucune raison n’est spécifiée.',
	'ADD_NEW_REASON'		=> 'Ajouter une nouvelle raison',
	'AVAILABLE_TITLES'		=> 'Titres des raisons traduites disponibles',
	
	'IS_NOT_TRANSLATED'			=> 'La raison n’a <strong>pas</strong> été traduite.',
	'IS_NOT_TRANSLATED_EXPLAIN'	=> 'La raison n’a <strong>pas</strong> été traduite. Si vous souhaitez renseigner le formulaire, spécifiez la clé des fichiers de langue dans la section des raisons de rapports.',
	'IS_TRANSLATED'				=> 'La raison a été traduite.',
	'IS_TRANSLATED_EXPLAIN'		=> 'La raison a été traduite. Si le titre que vous avez saisi ici est spécifié dans les fichiers de langue situés dans la section des raisons de rapports, le formulaire du titre et de la description traduit sera utilisé.',
	
	'NO_REASON'					=> 'La raison est introuvable.',
	'NO_REASON_INFO'			=> 'Vous devez spécifier le titre et la description de cette raison.',
	'NO_REMOVE_DEFAULT_REASON'	=> 'Vous ne pouvez pas supprimer la raison par défaut “Autres”.',

	'REASON_ADD'				=> 'Ajouter une raison au rapport',
	'REASON_ADDED'				=> 'La raison a été ajoutée au rapport avec succès.',
	'REASON_ALREADY_EXIST'		=> 'Une raison portant ce titre existe déjà. Veuillez en saisir une autre.',
	'REASON_DESCRIPTION'		=> 'Description de la raison',
	'REASON_DESC_TRANSLATED'	=> 'Description de la raison affichée',
	'REASON_EDIT'				=> 'Éditer la raison du rapport',
	'REASON_EDIT_EXPLAIN'		=> 'Vous pouvez ajouter ou éditer ici une raison. Si la raison est traduite, la version traduite sera utilisée au lieu de la description saisie ici.',
	'REASON_REMOVED'			=> 'La raison du rapport a été supprimée avec succès.',
	'REASON_TITLE'				=> 'Titre de la raison',
	'REASON_TITLE_TRANSLATED'	=> 'Titre de la raison affiché',
	'REASON_UPDATED'			=> 'La raison du rapport a été mise à jour avec succès.',

	'USED_IN_REPORTS'		=> 'Utilisé dans les rapports',
));

?>