"use strict";

(function($){
	let app = angular.module('myApp');

	app.controller('passengerController', function($scope, $timeout, $http){
		$http.get('../api/passengers').success( function(response) {
			$timeout(function() {
				$scope.listPassengers = response;
			});
		});
	})
}(jQuery));