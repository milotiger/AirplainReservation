"use strict";

(function($){
	let app = angular.module('myApp');

	app.controller('bookingController', function($scope, $timeout, $http){
		$http.get('../api/booking').success( function(response) {
			$timeout(function() {
				$scope.listBooking = response;
			});
		});
	})
}(jQuery));