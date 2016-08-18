var app = angular.module('engageLoginApp', ['ngStorage', 'angular-jwt', 'ngCookies']);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
app.controller('LoginController', function Controller($scope, $http, $location, $localStorage, jwtHelper, $window) {
    $scope.message = '';
    
    $scope.controllerLogin = function () {
        $http.post('/authenticate', {
            email: $scope.email,
            password: $scope.password
        }).success(function (response) {
            if (response.token) {
                //console.log(jwtHelper.decodeToken(response.token));
                if (!jwtHelper.isTokenExpired(response.token)) {
                    var user = jwtHelper.decodeToken(response.token)._doc;
                    $localStorage.currentUser = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        avatar: user.avatar,
                        token: response.token,
                        firebaseToken:response.firebaseToken,
                        tenant:response.tenant
                    };
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
                    $window.location.href = '/index';
                } else {
                    $scope.message = 'Invalid Authentication Token';
                }

            } else {
                $scope.message = response.message;
            }
        });
    };
});