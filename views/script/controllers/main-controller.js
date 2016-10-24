(function () {
	var app = angular.module('mainApp');
	app.controller('mainCtr', function($scope, $rootScope, mainService, uiService, $http, $timeout){
		window.sc = $scope;
		sc.step = 1;
		sc.isWait = false;

		sc.infor = {};
		sc.infor.customer = [];
		sc.infor.detail = {};
		sc.infor.isReturn = false;
		sc.infor.selectedFlight = 0;

		sc.allAirports = [];

		sc.resultFlights = [];

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

		sc.search = function search() {
			Wait()
			$http.get($rootScope.baseApi + "/flights", 
				{params: {
					rate: sc.infor.detail.class,
					passengers: sc.infor.detail.seats,
					date: mainService.convertDate(sc.infor.detail.startDate),
					start: sc.infor.detail.startAirAport,
					end: sc.infor.detail.desAirAport
				}
			})
			.then(function (data) {
				console.log(data);
				unWait();
				sc.resultFlights = data.data;
			}, function (error) {
				unWait();
				swal('Không tìm thấy!', 'Không tìm thấy chuyến bay phù hợp!', 'error');
				sc.resultFlights = {};
			})
		}

		sc.getPassengerNumber = function getPassengerNumber() {
			return new Array(sc.infor.detail.seats);
		}

		sc.getCode = function getCode() {
			var postData = {};
			postData.HANHKHACH = sc.infor.customer;
			console.log(postData);
			$http.post($rootScope.baseApi + "/booking", postData)
			.success(function (data) {
				console.log(data);
				sc.infor.detail.code = data.MADATCHO;
				swal('Thành Công', 'Mã đặt chỗ của bạn là ' + data.MADATCHO, 'success');
				sc.nextStep(3);
			})
		}

		sc.nextStep = function nextStep(step) {
			var id = "tab" + step;
			sc.step = step;
			sc.$evalAsync();
			$(document).ready(function(){
				$('ul.tabs').tabs('select_tab', id);
			});
			sc.initInputDelay();
		}

		sc.validateBeforeSearch = function validateBeforeSearch() {
			return (sc.infor.detail.startAirAport 
				&& sc.infor.detail.desAirAport
				&& sc.infor.detail.startDate
				&& sc.infor.detail.seats
				&& sc.infor.detail.class
				);
		}

		sc.validateStep1 = function validateStep1() {
			return (sc.validateBeforeSearch() && sc.resultFlights.length > 0);
		}

		sc.validateStep2 = function validateStep2() {
			for (var i = 0; i < sc.infor.detail.seats; ++i) {
				if (!sc.infor.customer[i] || !sc.infor.customer[i].DANHXUNG 
					|| !sc.infor.customer[i].HO 
					|| !sc.infor.customer[i].TEN)
					return false;
			}
			return true;
		}

		sc.complete = function complete() {
			var postData = {};
			var flight = sc.resultFlights[sc.infor.selectedFlight];
			postData.MADATCHO = sc.infor.detail.code;
			postData.CHUYENBAY = [];
			postData.CHUYENBAY[0] = {};
			postData.CHUYENBAY[0].MACHUYENBAY = flight.MA;
			postData.CHUYENBAY[0].NGAY = flight.NGAY;
			postData.CHUYENBAY[0].HANG = flight.HANG;
			postData.CHUYENBAY[0].MUCGIA = flight.MUCGIA;

			console.log(postData);
			
			$http.post($rootScope.baseApi + "/booking/completed", postData)
			.success(function (data) {
				console.log(data);
			})
		}

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