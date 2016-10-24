(function () {
	var app = angular.module('mainApp');
	app.controller('mainCtr', function($scope, $rootScope, mainService, uiService, $http, $timeout){
		window.sc = $scope;
		sc.step = 4;
		sc.isWait = false;

		sc.infor = {};
		sc.infor.customer = {};
		sc.infor.detail = {};

		sc.allAirports = [];

		sc.initInput = function initInput() {
			uiService.initInput();
		}

		sc.initInputDelay = function initInputDelay(delay) {
			if (!delay)
				delay = 100;
			$timeout(function(){
				sc.initInput();
			}, delay);
		}

		sc.loadAllAirports = function loadAllAirports() {
			Wait();
			$http.get($rootScope.baseApi + '/flights')
			.success(function (data) {
				unWait();
				sc.allAirports = data;
				console.log(data);
				sc.initInputDelay();
			})
		}

		sc.loadAllAirports();

		function Wait() {
			sc.Wait = true;
			sc.$evalAsync();
		}

		function unWait() {
			sc.Wait = false;
			sc.$evalAsync();
		}
	});
})();