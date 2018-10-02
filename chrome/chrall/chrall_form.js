"use strict";
(function(chrall){

	chrall.shouldSkipFormHandling = function(){
		return (0 > chrall.pageName().indexOf("Play_a_") && 0 > chrall.pageName().indexOf(("FO_")))
				|| 0 <= chrall.pageName().indexOf("FO_Description")
				|| 0 <= chrall.pageName().indexOf("Play_a_Don");
	};


	chrall.memorizeForm = function(){
		var memo = chrall.getTrollStorage(".form-memoized");
		memo = null == memo ? {} : JSON.parse(memo);

		var pageMemo = memo[chrall.pageName()];
		pageMemo = null == pageMemo ? {} : pageMemo;
		memo[chrall.pageName()] = pageMemo;

		$("select").each(function(){
			pageMemo[this.name] = $(this).val();
		});
		$("input[type=text]").each(function(){
			pageMemo[this.name] = $(this).val();
		});
		$("input[type=checkbox]").each(function(){
			pageMemo[this.name] = this.checked;
		});
		$("input[type=radio]").each(function(){
			if (this.checked) {
				pageMemo[this.name] = $(this).val();
			}
		});
		$("textarea").each(function(){
			pageMemo[this.name] = this.value;
		});

		chrall.setTrollStorage({ ".form-memoized": JSON.stringify(memo)});
	};


	chrall.listenOnFormElements = function(){
		// Only runs on skills, spells, attacks and selected followers frames
		if (chrall.shouldSkipFormHandling()) {
			return;
		}

		// en fait, c'est juste au moment du submit que ça a un intérêt
		$("form").submit(chrall.memorizeForm);
	};


	chrall.restoreFormElements = function(){
		// Only runs on skills, spells, attacks and selected followers frames
		if (chrall.shouldSkipFormHandling()) {
			return;
		}

		var memo = chrall.getTrollStorage(".form-memoized");
		if (null == memo) {
			return;
		}
		memo = JSON.parse(memo);

		var pageMemo = memo[chrall.pageName()];
		if (null == pageMemo) {
			return;
		}


		$("select").each(function(){
			restoreSelectValue(this, pageMemo);
		});
		$("input[type=text]").each(function(){
			restoreValue(this, pageMemo);
		});
		$("input[type=checkbox]").each(function(){
			restoreBooleanValue(this, pageMemo);
		});
		$("input[type=radio]").each(function(){
			restoreRadioValue(this, pageMemo);
		});
		$("textarea").each(function(){
			restoreValue(this, pageMemo);
		});

	};

	function restoreValue(element, memo){
		var value = memo[element.name];
		if (null == value || "" == value) {
			return;
		}
		$(element).val(value);
	}

	function restoreBooleanValue(element, memo){
		var value = memo[element.name];
		if (null == value || "" == value) {
			return;
		}
		$(element).prop("checked", value);
	}

	function restoreRadioValue(element, memo){
		var value = memo[element.name];
		if (null == value || "" == value) {
			return;
		}
		if (value == $(element).val()) {
			$(element).prop("checked", true);
		}
	}

	function restoreSelectValue(element, memo){
		var value = memo[element.name];
		if (null == value || "" == value) {
			return;
		}
		var $selected = $(element).find("option[selected]");
		if (0 < $selected.size()) {
			return; // évite de restaurer une option pré-sélectionnée si l'utilisateur fait une sélection manuelle, ex: utiliser potion depuis inventaire
		}
		var $options = $(element).find("option");
		for (var i = 0; i < $options.length; i++) {
			if (value == $options[i].value) {
				$(element).val(value);
				return;
			}
		}
	}

})(window.chrall = window.chrall || {});
