// app.js
var app = angular.module('engageApp', ['ui.router']);
app.config(function ($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/angular/partials/main.html',
            controller:'projectCardsCtrl'

        });
});

app.controller('projectCardsCtrl', function ($scope) {
    $scope.testdata = [1,2,3];
});