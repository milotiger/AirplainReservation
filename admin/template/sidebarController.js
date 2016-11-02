"use strict";

(function($) {
    let app = angular.module('myApp');

    app.controller('sidebarController', function($scope, $state, $location, $http, Base64) {

        $scope.checkAuthenticated = function() {
            let split = $state.href($state.current.name, $state.params, { absolute: true }).split('#');

            if ($location.absUrl().split('?').length === 1) {
                let currentState = split[0] + 'admin#';
                window.location = `../api/oauth2/authorize?client_id=flight&response_type=code&redirect_uri=${currentState}`;
            } else {
                let code = $location.absUrl().split('?')[1].split('=')[1].split('#')[0];

                let data = {
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": split[0] + 'admin',
                }

                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }

                $http.defaults.headers.common['Authorization'] = 'Basic ' + 'ZmxpZ2h0OmZsaWdodA==';

                $http.post('../api/oauth2/token', data, config).success(function(res) {
                    console.log(res);
                });
            }
        }
    });
}(jQuery));
