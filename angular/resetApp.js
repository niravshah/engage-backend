var app = angular.module('engageResetApp',['ngStorage']);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
app.controller('ResetController', function Controller($scope, $http, $location,$localStorage) {

    $scope.init = function(){
        $scope.user = $localStorage.currentUser;
    };

    $scope.init();

});