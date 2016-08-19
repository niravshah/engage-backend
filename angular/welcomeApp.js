var app = angular.module('engageWelcomeApp', ['ngStorage', 'angular-jwt', 'ngCookies']);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
app.controller('WelcomeController', function Controller($scope, $http, $location, $localStorage, jwtHelper, $window) {

    $scope.welcome = function () {

    };
});