app.controller('headerController', function ($window, $scope, $localStorage) {
    $scope.logout = function () {
        delete $localStorage.currentUser;
        $window.location.href = '/login';
    }
});
