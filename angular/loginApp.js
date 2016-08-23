var app = angular.module('engageLoginApp', ['ngStorage', 'angular-jwt', 'ngCookies']);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
app.controller('LoginController', function Controller($scope, $http, $location, $localStorage, jwtHelper, $window) {
    $scope.message = '';

    $scope.controllerLogin = function () {
        $http.post('/api/authenticate', {
            email: $scope.email,
            password: $scope.password
        }).success(function (response) {
            if (response.token) {
                if (!jwtHelper.isTokenExpired(response.token)) {
                    var user = jwtHelper.decodeToken(response.token)._doc;
                    $localStorage.currentUser = {
                        shortid:user.shortid,
                        userid: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        title: user.title,
                        email: user.email,
                        avatar: user.avatar,
                        token: response.token,
                        firebaseToken: response.firebaseToken,
                        tenant: response.tenant,
                        memberships:user.memberships,
                        projectRoles:user.projectRoles,
                        userRoles:user.userRoles
                    };

                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;

                    if(user.resetPassword == true){
                        $window.location.href = '/reset';
                    } else if (user.profileSet == false) {
                        $window.location.href = '/welcome';
                    } else {
                        $window.location.href = '/profile/' + user.shortid;
                    }
                } else {
                    $scope.message = 'Invalid Authentication Token';
                }

            } else {
                $scope.message = response.message;
            }
        });
    };
});