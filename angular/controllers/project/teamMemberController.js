app.controller('teamMemberController', function ($scope, $http) {
    $scope.init = function () {
        $http.get('/api/projects/' + $scope.projectId + '/members').then(function (response) {
            if (response.data.success == true) {
                $scope.team = response.data.users;
            } else {
                notify('Could not retrieve Team Members.' + err.message);
            }
        });
    };

    $scope.init();

});