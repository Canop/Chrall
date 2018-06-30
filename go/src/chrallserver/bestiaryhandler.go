package main

import (
	"fmt"
	"log"
	"net/http"
)

type BestiaryHandler struct {
	ChrallHandler
}

func (h *BestiaryHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	h.hit()
	h.head(w, "Le Bestiaire de gOgOchrall")
	w.Write([]byte(`
		<script>
		var sentValue;
		function chooseMonster(name) {
			$("#cleanBtn").show();
			sentValue = name
			$.getJSON(
				"json?action=get_extract&timestamp="+(new Date()).getTime()+"&name="+name,
				function(data) {
					$("p#resultContent").html(data);
					$("#result").show("slow");
					setTimeout(
						function() {
							var newName = $("input#monster_name").val();
							//alert ("newName=" + newName);
							if (sentValue!=	newName) {
								//alert("mauvais !");
								chooseMonster(newName);
							} 
						},
						200
					);
				}
			);
		}
		function clean() {
			$("#monster_name").val("");
			$("#monster_name").focus();
			$("#result").hide("slow");
			$("#cleanBtn").hide();
		}
		
		$(document).ready(function() {
			$("#monster_name").focus();
			$("input#monster_name").autocomplete({
				source: "json?action=get_monster_names&limit=20"
			});
			$("input#monster_name").change(function(){
				inputValue = $(this).val();
				chooseMonster(inputValue);
			});
		});
		</script>
		<p>Vous faites face au <span class=emphase>Bestiaire</span> de <a class=gogo href=.>gOgOchrall</a></p>
	`))

	var be *BestiaryExtract
	db, err := h.store.DB()
	if err == nil {
		defer db.Close()
		be, err = h.store.ReadTotalStats(db)
	} else {
		log.Println("Erreur connexion BD :", err)
	}
	if err != nil {
		fmt.Fprint(w, "<p>La base de données du bestiaire semble innacessible :   <span class=emphase>"+err.Error()+"</span></p>")
	} else {
		fmt.Fprintf(w, "<p>Le bestiaire contient actuellement : <span class=emphase>%d</span> CDM concernant <span class=emphase>%d</span> monstres. Notez que cette interface, contrairement aux bulles de l'extension Chrall, ne vous fournit que des données issues de monstres au numéro supérieur à 4 000 000.</p>", be.NbCdm, be.NbMonsters)
	}

	w.Write([]byte(`<p>Choisissez un monstre :
		<input id="monster_name" />
		<a class=gogo id=sendBtn href="javascript:chooseMonster($('input#monster_name').val());">Hop!</a>
		<a class=gogo id=cleanBtn href="javascript:clean();" invisible>Vider</a>
		</p>
		<span id=envoi invisible>Envoi en cours...</span>
		<div id=result invisible>
			<p>
			<span class=emphase>Résultat :</span>
			</p>
			<p id=resultContent>
				Désolé, il semble que g0g0chrall ait encore trop bu...
			</p>
			<p id=serverMessage>
			</p>
		</div>
	`))
	h.foot(w)
}
