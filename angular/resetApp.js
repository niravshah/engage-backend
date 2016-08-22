var app = angular.module('engageResetApp', ['ngStorage', 'angular-jwt','cgNotify']);
app.config(function ($interpolateProvider, $httpProvider, jwtOptionsProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');

    jwtOptionsProvider.config({
        tokenGetter:['AuthService', function (AuthService) {
            return AuthService.getToken();
        }]
    });

    $httpProvider.interceptors.push('jwtInterceptor');
});

app.service('AuthService', ['$localStorage',
    function ($localStorage) {
        this.getToken = function () {
            return $localStorage.currentUser.token;
        }
    }]);

app.controller('ResetController', function Controller($scope, $http, $window, $localStorage, notify) {

    $scope.init = function () {
        $scope.user = $localStorage.currentUser;
    };

    $scope.init();

    $scope.resetPassword = function () {
        console.log($scope.resetForm, $scope.user.userid);

        var url = '/api/user/' + $scope.user.userid + '/reset';
        $http.post(url, $scope.resetForm).then(function (resp) {
            if(resp.data.success == true){
                $window.location.href = '/login';
            }else{
                notify('Could reset password' + resp.data.reason);
            }

        }, function (err) {
            console.log('Error', err)
        })
    }

});