package main

import (
	"net/http"
)

type WellHandler struct {
	ChrallHandler
}

func (h *WellHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	h.hit()
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "GET")
	h.head(w, "Le Puits de gOgOchrall")
	w.Write([]byte(`
		<script>
			function sendForAnalyse() {
				$("#envoi").show();
				var authorId = -1;
				var authorIdStr = $("#author").val().trim();
				if (authorIdStr!="") {
					try {
						authorId = parseInt(authorIdStr)
					} catch (e) {}
				} else {
					authorId = 0; // cas du champ vide : don anonyme
				}
				if (authorId<0 || isNaN(authorId)) {
					$("p#resultContent").html("Numéro de troll invalide (ne mettez rien s'il  s'agit d'un don anonyme, mettez un numéro de troll sinon).");
					return;
				}
				var bucketText = $("#bucket").val().replace(/\?/g, "-"); // si je ne fais pas cette élimination des "?", jquery fait des trucs bizarres à l'envoi
				$.post(
					"jsonp",
					JSON.stringify(
						{
							action: "pour",
							author: authorId,
							bucket: bucketText
						}
					),
					function(data, textStatus) {
						$("#envoi").hide();
						$("p#resultContent").html(data['Text']);
						$("p#serverMessage").html(data['Message']);
						$("#result").show("slow");
						$("#cleanBtn").show();
					},
					"json"
				);
			}
			function clean() {
				$("#bucket").val("");
				$("#result").hide("slow");
				$("#cleanBtn").hide();
			}
		</script>
		<p>Vous êtes au bord du <span class=emphase>Puits</span> de <a class=gogo href=.>gOgOchrall</a></p>
		<p>Copiez vos CDM ci-dessous :
			<form>
				<textarea id=bucket rows=20></textarea>
			</form>
		</p>
		<p>Indiquez éventuellement un numéro de troll donateur :
			<form>
				<input id=author>
			</form>
		</p>
		<a class=gogo href="javascript:sendForAnalyse();">Déverser</a>
		<a class=gogo id=cleanBtn href="javascript:clean();" invisible>Nettoyer</a>
		<span id=envoi invisible>Envoi en cours...</span>
		<div id=result invisible>
			<p>
			<span class=emphase>Résultat :</span>
			</p>
			<p id=resultContent>
				Désolé, il semble que le serveur ait trop bu...
			</p>
			<p id=serverMessage>
			</p>
		</div>
	`))
	h.foot(w)
}
