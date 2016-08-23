app.controller('headerController', function ($window, $scope, $localStorage) {

    $scope.init = function() {
        if ($localStorage.currentUser) {
            $scope.user = $localStorage.currentUser;
        }
    };

    $scope.init();

    $scope.logout = function () {
        delete $localStorage.currentUser;
        $window.location.href = '/login';
    }
});
