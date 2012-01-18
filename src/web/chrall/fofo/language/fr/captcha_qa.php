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
* captcha_qa [French]
*
* @package   language
* @author    Maël Soucaze <maelsoucaze@gmail.com> (Maël Soucaze) http://mael.soucaze.com/
* @copyright (c) 2009 phpBB Group
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
	'CAPTCHA_QA'				=> 'Q&amp;R',
	'CONFIRM_QUESTION_EXPLAIN'	=> 'Cette question est un moyen de prévention luttant contre l’envoi de formulaires par des robots indésirables.',
	'CONFIRM_QUESTION_WRONG'	=> 'Vous n’avez pas répondu correctement à la question.',

	'QUESTION_ANSWERS'			=> 'Réponses',
	'ANSWERS_EXPLAIN'			=> 'Veuillez répondre correctement à la question. Chaque réponse doit être saisie sur une nouvelle ligne.',
	'CONFIRM_QUESTION'			=> 'Question',

	'ANSWER'					=> 'Réponse',
	'EDIT_QUESTION'				=> 'Éditer la question',
	'QUESTIONS'					=> 'Questions',
	'QUESTIONS_EXPLAIN'			=> 'Sur chaque envoi de formulaire où vous avez activé le plugin des Q&amp;R, les utilisateurs seront invités à répondre à une des questions qui ont été spécifiées ici. Pour utiliser ce plugin, au moins une des questions devra être rédigée dans la langue par défaut. Il est recommandé de cibler ces questions selon votre audience, qui devrait être capable de répondre plus facilement par rapport aux robots indésirables capables d’exécuter des recherches sur Google™. L’utilisation et la mise à jour régulière d’un grand nombre de questions fournira de meilleurs résultats. Activez la vérification stricte si une des réponses à votre question contient du “MixEd CaSe”, des signes de ponctuation ou encore des espaces.',
	'QUESTION_DELETED'			=> 'Question supprimée',
	'QUESTION_LANG'				=> 'Langue',
	'QUESTION_LANG_EXPLAIN'		=> 'La langue dans laquelle cette question et ses réponses sont rédigées.',
	'QUESTION_STRICT'			=> 'Vérification stricte',
	'QUESTION_STRICT_EXPLAIN'	=> 'Activez cette option afin de prendre en compte le “MixEd CaSe”, les signes de ponctuation et les espaces.',

	'QUESTION_TEXT'				=> 'Question',
	'QUESTION_TEXT_EXPLAIN'		=> 'La question qui sera présentée aux utilisateurs.',

	'QA_ERROR_MSG'				=> 'Veuillez remplir tous les champs et saisir au moins une réponse.',
	'QA_LAST_QUESTION'			=> 'Vous ne pouvez pas supprimer toutes les questions lorsque le plugin est actif.',

));

?>