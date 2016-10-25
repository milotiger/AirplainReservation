(function () {
	var app = angular.module('mainApp');
	app.controller('mainCtr', function($scope, $rootScope, mainService, uiService, $http, $timeout){
		window.sc = $scope;
		sc.step = 1;
		sc.isWaiting = false;

		sc.infor = {};
		sc.infor.customer = [];
		sc.infor.detail = {};
		sc.infor.isReturn = false;
		sc.infor.selectedFlight = 0;
		sc.infor.selectedReturnFlight = 0;

		sc.allAirports = [];

		sc.resultFlights = [];
		sc.returnFlights = [];

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
				// console.log(data);
				sc.initInputDelay();
			})
		}

		sc.loadAllAirports();

		sc.searchF = function searchF() {
			console.log("milo")
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
				unWait();
				if (sc.infor.isReturn) {
					$http.get($rootScope.baseApi + "/flights", 
						{params: {
							rate: sc.infor.detail.class,
							passengers: sc.infor.detail.seats,
							date: mainService.convertDate(sc.infor.detail.returnDate),
							start: sc.infor.detail.desAirAport,
							end: sc.infor.detail.startAirAport
						}
					})
					.then(function (dataReturn) {
						console.log(data);
						unWait();
						sc.resultFlights = data.data;
						sc.returnFlights = dataReturn.data;

					}, function (error) {
						unWait();
						swal('Không tìm thấy!', 'Không tìm thấy chuyến bay phù hợp!', 'error');
						sc.returnFlights = [];
					})
				}
				else {
					sc.resultFlights = data.data;
				}
				

			}, function (error) {
				unWait();
				swal('Không tìm thấy!', 'Không tìm thấy chuyến bay phù hợp!', 'error');
				sc.resultFlights = [];
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
				// console.log(data);
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
				&& (!sc.infor.isReturn || sc.infor.detail.returnDate));
		}

		sc.validateStep1 = function validateStep1() {
			return (sc.validateBeforeSearch() && sc.resultFlights.length > 0 && (!sc.infor.isReturn || sc.returnFlights));
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
			Wait();
			var postData = {};
			var flight = sc.resultFlights[sc.infor.selectedFlight];
			postData.MADATCHO = sc.infor.detail.code;
			postData.CHUYENBAY = [];
			postData.CHUYENBAY[0] = {};
			postData.CHUYENBAY[0].MACHUYENBAY = flight.MA;
			postData.CHUYENBAY[0].NGAY = flight.NGAY;
			postData.CHUYENBAY[0].HANG = flight.HANG;
			postData.CHUYENBAY[0].MUCGIA = flight.MUCGIA;
			postData.CHUYENBAY[0].GIO = flight.GIO;

			if (sc.infor.isReturn) {
				var returnFlight = sc.returnFlights[sc.infor.selectedReturnFlight];
				postData.CHUYENBAY[1] = {};
				postData.CHUYENBAY[1].MACHUYENBAY = returnFlight.MA;
				postData.CHUYENBAY[1].NGAY = returnFlight.NGAY;
				postData.CHUYENBAY[1].HANG = returnFlight.HANG;
				postData.CHUYENBAY[1].MUCGIA = returnFlight.MUCGIA;
				postData.CHUYENBAY[1].GIO = returnFlight.GIO;
			}

			console.log(postData);

			$http.post($rootScope.baseApi + "/booking/completed", postData)
			.success(function (data) {
				unWait();
				console.log(data);
				if (data.messages == "Already Completed")
					swal('Đã thanh toán', 'Bạn đã thực hiện thanh toán rồi!', 'warning');
				else swal('Thành Công', 'Bạn đã đặt chỗ thành công\nMã đặt chỗ của bạn là ' + sc.infor.detail.code, 'success');
			})
		}

		sc.search = {};

		sc.searchCode = function searchCode() {
			// if (!sc.search.code || sc.search.code == '')
			// 	return;
			Wait();
			$http.get($rootScope.baseApi + "/booking/" + sc.search.code)
			.then(function (data) {
				sc.search.result = data.data;
				console.log(data);
				unWait();
			}, function (data) {
				swal('Không Tìm Thấy', 'Mã đặt chỗ không tồn tại!', 'warning');
				unWait();
			})
		}

		sc.copyPass =[];

		sc.openChangeModal = function openChangeModal() {
			sc.copyPass = sc.search.result.HANHKHACH;
			$('#changeInfor').openModal();
			sc.initInputDelay();
		}

		sc.submitChange = function submitChange() {
			Wait();
			sc.search.result.HANHKHACH = sc.copyPass;
			var postData = {};
			postData.CHUYENBAY = sc.search.result.CHANGBAY;
			postData.HANHKHACH = sc.copyPass;
			console.log(postData);
			$http.put($rootScope.baseApi + "/booking/" + sc.search.code, postData)
			.success(function (data) {
				console.log(data);
				swal('Thành Công', 'Bạn đã cập nhật thành công!', 'success');
				unWait();
			});
		}

		function Wait() {
			sc.isWaiting = true;
			sc.$evalAsync();
		}

		function unWait() {
			sc.isWaiting = false;
			sc.$evalAsync();
		}
	});
})();