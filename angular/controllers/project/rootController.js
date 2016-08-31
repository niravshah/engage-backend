app.controller('rootViewController', function ($rootScope, $scope, $stateParams, $http) {
    $scope.init = function () {
        console.log('rootViewController', $stateParams.id);

        $http.get('/api/projects/' + $stateParams.id + '/members').then(function (response) {
            if (response.data.success == true) {
                //$scope.team = response.data.users;
                $rootScope.team =response.data.users;
            } else {
                notify('Could not retrieve Team Members.' + err.message);
            }
        });
    };

    $scope.init();
});