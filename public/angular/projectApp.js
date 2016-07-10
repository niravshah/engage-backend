var app = angular.module('engageApp', ['ngStorage', 'ui.router']);
app.config(function ($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            views: {
                'projectHeader':{
                    templateUrl:'/angular/partials/projectHeader.html',
                    controller:'headerController'
                },
                'projectInfo': {
                    templateUrl: '/angular/partials/projectInfo.html'
                },
                'teamMembers': {
                    templateUrl: '/angular/partials/teamMembers.html'
                },
                'messageStream': {
                    templateUrl: '/angular/partials/messageStream.html'
                },
                'projectTracker': {
                    templateUrl: '/angular/partials/projectTracker.html'
                }
            },
            resolve: {
                pid: function () {
                    return $("#content").data("pid")
                }
            }

        });
});


app.controller('headerController', function ($scope, $localStorage) {
    $scope.token = $localStorage.currentUser.token;
});