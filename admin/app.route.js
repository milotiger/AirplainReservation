"use strict";

(function($){
	let app = angular.module('myApp');
	app.config(function( $stateProvider, $urlRouterProvider,$httpProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
		.state('app', {
			url : '/',
			views : {
				'subview' : {
					templateUrl : './components/home/home.html',
				}
			}
		})

		.state('app.flights' , {
			url : 'flights',
			views : {
				'subview@' : {
					templateUrl : './components/flights/flights.html',
					controller : 'flightController'
				}
			}
		})

		.state('app.booking' , {
			url : 'booking',
			views : {
				'subview@' : {
					templateUrl : './components/booking/booking.html',
					controller : 'bookingController'
				}
			}
		})

		.state('app.flightdetails' , {
			url : 'flight-details',
			views : {
				'subview@' : {
					templateUrl : './components/flight-detail/flight-detail.html',
					controller : 'flightDetailController'
				}
			}
		})

		.state('app.passenger' , {
			url : 'passenger',
			views : {
				'subview@' : {
					templateUrl : './components/passenger/passenger.html',
					controller : 'passengerController'
				}
			}
		});

		$httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + 'ZmxpZ2h0OmZsaWdodA==';
	});
}(jQuery));