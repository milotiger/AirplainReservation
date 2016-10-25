"use strict";

(function($){
	let app = angular.module('myApp');

	app.controller('flightController', function($scope, $timeout, $http){

		$http.get('http://localhost:3000/api/all-flights').success( function(response) {
			$timeout(function() {
				$scope.listFlights = response;
				console.log(response);
			});
		});

	})
}(jQuery));