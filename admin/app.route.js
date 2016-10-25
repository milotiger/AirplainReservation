"use strict";

(function($){
	let app = angular.module('myApp');
	app.config(function( $stateProvider, $urlRouterProvider ) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
		.state('app', {
			url : '/',
			views : {
				'subview' : {
					templateUrl : './components/home.html',
				}
			}
		})

		.state('app.flights' , {
			url : 'flights',
			views : {
				'subview@' : {
					templateUrl : './components/flights.html',
					controller : 'flightController'
				}
			}
		})

		.state('app.booking' , {
			url : 'booking',
			views : {
				'subview@' : {
					templateUrl : './components/booking.html',
				}
			}
		})

		.state('app.flightdetails' , {
			url : 'flight-details',
			views : {
				'subview@' : {
					templateUrl : './components/flight-detail.html',
				}
			}
		})

		.state('app.passenger' , {
			url : 'passenger',
			views : {
				'subview@' : {
					templateUrl : './components/passenger.html',
				}
			}
		})
	});
}(jQuery));