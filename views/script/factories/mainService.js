(function () {
	var app = angular.module('mainApp');

	app.factory('mainService', function(){
		var main = {};

		main.convertDate = function convertDate(date) {
			dateObj = new Date(date);
			return (dateObj.getYear() + 1900) + "-" + (dateObj.getMonth() + 1) + "-" + addZero(dateObj.getDate()); 
		};

		function addZero(num) {
			if (num < 10)
				return 0 + num.toString();
			return num;
		}

		return main;
	});
})();