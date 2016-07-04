// app.js
var app = angular.module('engageApp', ['ngStorage', 'angular-jwt','ui.router', 'permission','permission.ui' ]).run(function (PermissionStore, $localStorage,jwtHelper) {
    
    PermissionStore
      .definePermission('isAdmin', function () {      
        return jwtHelper.decodeToken($localStorage.currentUser.token)._doc.roles.indexOf('admin') > -1;
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