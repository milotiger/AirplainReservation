(function () {
	var app = angular.module('mainApp', []);

	app.run(function($rootScope){
		$rootScope.baseApi = '../api';
	})

	app.directive('datepicker', function() {
		return {
			require: 'ngModel',
			link: function(scope, el, attr, ngModel) {
				$(el).datepicker({
					onSelect: function(dateText) {
						scope.$apply(function() {
							ngModel.$setViewValue(dateText);
						});
					}
				});
			}
		};
	});
})();