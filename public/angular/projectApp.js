var app = angular.module('engageApp', ['ngStorage','ui.router']);
app.config(function ($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/angular/partials/projectBody.html',
            resolve:{
                pid:function(){return $("#content").data("pid")}
            },
            controller:'projectCardsCtrl'

        });
});

app.controller('projectCardsCtrl', ['$scope','pid', function ($scope,pid) {
    $scope.testdata = [1,2,3];
    $scope.pid = pid;
}]);

app.service('ProjectsService',['$http',function($http){
    this.getProjectById = function(id){
        return $http.get('/api/projects/'+id);
    }
}]);

app.controller('headerController', function($scope,$localStorage) {
    $scope.token = $localStorage.currentUser.token;
});