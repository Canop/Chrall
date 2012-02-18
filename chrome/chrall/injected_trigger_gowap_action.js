var trollId = localStorage['last_saved_troll_id'];
var movementType = 'move' == localStorage['troll.' + trollId + '.gowap-order'] ? '1' : '7'; // move or snort
var numGowap = localStorage['troll.' + trollId + '.gowap-numGowap'];
var numMaxOrdre = localStorage['troll.' + trollId + '.gowap-numMaxOrdre'];

parent.frames['Action'].location.href = 'FO_NewOrder.php?ai_IdOrdre=' + movementType + "&ai_IdFollower=" + numGowap + "&ai_NbOrdres=" + numMaxOrdre + "&as_Action=Enregistrer+un+nouvel+Ordre;";
localStorage.removeItem('troll.' + trollId + '.gowap-numGowap');
localStorage.removeItem('troll.' + trollId + '.gowap-numMaxOrdre');
