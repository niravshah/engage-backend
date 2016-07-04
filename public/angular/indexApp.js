// app.js
var app = angular.module('engageApp', ['ngStorage', 'angular-jwt','ui.router', 'permission','permission.ui' ]).run(function (PermissionStore, $localStorage,jwtHelper) {
    PermissionStore
      .definePermission('isAdmin', function () {      
        return jwtHelper.decodeToken($localStorage.currentUser.token)._doc.roles.indexOf('admin') > -1;
      });
  });

app.config(function($interpolateProvider, $stateProvider, $urlRouterProvider,jwtInterceptorProvider, $localStorageProvider,$httpProvider) {
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
    })
    jwtInterceptorProvider.tokenGetter = function() {
        var user =  $localStorageProvider.get('currentUser');
        if(typeof user != undefined){
            return user.token;
        }
    };

    $httpProvider.interceptors.push('jwtInterceptor');

});
app.controller('projectCardsCtrl', function($scope,$localStorage) {
    $scope.testdata = [1, 2, 3];
    $scope.token = $localStorage.currentUser.token;
});