(function () {
	var app = angular.module('mainApp');

	app.factory('uiService', function(){
		var ui = {};

		ui.initInput = function initInput() {
			$('select').material_select();
			Materialize.updateTextFields();
			$('.datepicker').pickadate({
				selectMonths: true, 
				selectYears: 15 
			});
		}
		return ui;
	})
})();