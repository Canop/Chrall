package main

import (
	"http"
)


type WellHandler struct {
	Handler
}

func (h *WellHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	h.hit()
	h.head(w, "Le Puit de gOgOchrall")
	w.Write([]byte(`
		<script>
			function sendForAnalyse() {
				$("#envoi").show();
				$.post(
					"/chrall/json",
					JSON.stringify(
						{
							action: "pour",
							bucket: $("#bucket").val()
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
		<p>Vous êtes au bord du <span class=emphase>Puits</span> de <a class=gogo href=/chrall>gOgOchrall</a></p>
		<p>Copiez vos CDM ci-dessous :
			<form>
				<textarea id=bucket rows=20></textarea>
			</form>
		</p>
		<a class=gogo href="javascript:sendForAnalyse();">Déverser</a>
		<a class=gogo id=cleanBtn href="javascript:clean();" class=invisible>Nettoyer</a>
		<span id=envoi class=invisible>Envoi en cours...</span>
		<div id=result class=invisible>
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
