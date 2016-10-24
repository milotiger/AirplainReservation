(function () {
	var app = angular.module('mainApp');
	app.controller('mainCtr', function($scope, $rootScope, uiService, $http){
		window.sc = $scope;
		sc.step = 4;

		sc.infor = {};
		sc.infor.customer = {};

		sc.AllAirports = [];

		sc.initInput = function initInput() {
			uiService.initInput();
		}

		sc.loadAllAirports = function loadAllAirports() {
			$http.get($rootScope.baseApi + '/flights')
			.success(function (data) {
				console.log(data);
			})
		}

		sc.loadAllAirports();
	});
})();