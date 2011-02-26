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
				$.getJSON(
					"http://localhost:9090/chrall/json", {
						"action" : "calculer"
					},
					function(data) {
						$("#envoi").hide();
						$("p#resultContent").html(data['text']);
						$("#result").show("slow");
					}
				);
			}
		</script>
		<p>Vous êtes au bord du <span class=emphase>Puit</span> de <a href=..>gOgOchrall</a></p>
		<p>Copiez vos CDM ci-dessous :
			<form id=wellForm>
				<textarea rows=20></textarea>
			</form>
		</p>
		<a href="javascript:sendForAnalyse();">Déverser</a> <span id=envoi class=invisible>Envoi en cours...</span>
		<div id=result class=invisible>
			<p>
			<span class=emphase>Résultat :</span>
			</p>
			<p id=resultContent>
				Le puit ne sait pas encore digérer ça.
			</p>
		</div>
	`))
	h.foot(w)
}
