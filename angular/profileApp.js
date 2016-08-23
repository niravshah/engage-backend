var app = angular.module('engageApp', ['ngStorage', 'ui.router', 'angular-jwt','ngFileUpload','cgNotify','angularSpinner','ngSanitize']);

app.config(function ($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            authenticate: true,
            views: {
                'projectHeader': {
                    templateUrl: '/angular/partials/header.html',
                    controller: 'headerController'
                },
                'about': {
                    templateUrl: '/angular/partials/profile/about.html'
                },
                'projects': {
                    templateUrl: '/angular/partials/profile/projects.html'
                },
                'settings': {
                    templateUrl: '/angular/partials/profile/settings.html'
                }
            }
        })
});


