(function () {
	var app = angular.module('mainApp');

	app.factory('uiService', function(){
		var ui = {};

		ui.initInput = function initInput() {
			$('select').material_select();
			Materialize.updateTextFields();
		}
		return ui;
	})
})();