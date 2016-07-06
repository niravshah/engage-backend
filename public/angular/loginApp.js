 var app = angular.module('engageLoginApp', ['ngStorage', 'angular-jwt']);
 app.config(function($interpolateProvider) {
     $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
 });
 app.controller('LoginController', function Controller($scope, $http, $location, $localStorage, jwtHelper, $window  ) {
     $scope.message = '';
     $scope.controllerLogin = function() {         
         $http.post('/authenticate', {
             email: $scope.email,
             password: $scope.password
         }).success(function(response) {
             if(response.token) {
                 console.log(jwtHelper.decodeToken(response.token));
                 if(!jwtHelper.isTokenExpired(response.token)) {
                     $localStorage.currentUser = {
                         email: $scope.email,
                         token: response.token
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