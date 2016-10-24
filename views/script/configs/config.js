(function () {
	var app = angular.module('mainApp', []);

	app.run(function($rootScope){
		$rootScope.baseApi = 'http://localhost:3000/api'
	})
})();