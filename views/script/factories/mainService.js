(function () {
	var app = angular.module('mainApp');

	app.factory('mainService', function(){
		var main = {};

		main.convertDate = function convertDate(date) {
			dateObj = new Date(date);
			return dateObj.getYear + "-" + dateObj.getMonth + "-" + dateObj.getDay; 
		};

		return main;
	});
})();