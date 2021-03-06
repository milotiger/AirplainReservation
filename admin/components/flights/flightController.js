"use strict";

var editor;

(function($) {
	let app = angular.module('myApp');

	app.controller('flightController', function($scope, $timeout, $http) {

		$http.get('../api/all-flights').success(function(response) {
			$timeout(function() {
				$scope.listFlights = response;
			});
		});

		$scope.flight = {};
		$scope.current = {};

		$scope.addFlight = function() {

			$scope.flightToAdd = {
				'MA': $scope.flight.ma,
				'NOIDI': $scope.flight.noidi,
				'NOIDEN': $scope.flight.noiden,
				'NGAY': $scope.flight.ngay,
				'GIO': $scope.flight.gio,
				'HANG': $scope.flight.hang,
				'MUCGIA': $scope.flight.mucgia,
				'SOLUONGGHE': $scope.flight.soluongghe,
				'GIABAN': $scope.flight.giaban
			};

			$http.post('../api/flights', $scope.flightToAdd).success(function(response) {
				$timeout(function() {
					$scope.listFlights.push($scope.flightToAdd);
				})
			});
		}

		$scope.editFlight = function(index) {
			$scope.current = $scope.listFlights[index];
		}

		$scope.updateFlight = function() {
			
			$http.put('../api/flights', $scope.current).success(function(response) {
				$timeout(function() {
					alert(response.messages);
				});
			});
		}

	})
}(jQuery));
