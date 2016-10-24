(function () {
	var app = angular.module('mainApp', []);

	app.run(function($rootScope){
		$rootScope.baseApi = 'localhost:3000/api'
	})
})();