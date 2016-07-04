// app.js
var app = angular.module('engageApp', ['ngStorage', 'ui.router', 'permission','permission.ui' ]).run(function (PermissionStore, $localStorage) {
    console.log('Saved User: ', $localStorage.currentUser.email)
    PermissionStore
      .definePermission('seeDashboard', function () {        
        return false;
      });
  });
app.config(function($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $urlRouterProvider.otherwise('/home');
    $stateProvider.state('home', {
        url: '/home',
        views:{
            'nav':{
                templateUrl: '/angular/partials/indexNav.html'
            },
            'body':{
                templateUrl: '/angular/partials/indexBody.html',
                controller: 'projectCardsCtrl'
            }
        }
    });
});
app.controller('projectCardsCtrl', function($scope) {
    $scope.testdata = [1, 2, 3];
});