(function () {
	var app = angular.module('mainApp');
	app.controller('mainCtr', function($scope){
		window.sc = $scope;
		sc.step = 1;
	});
})();