app.controller('projectInfoController', function ($scope, $http) {
    $scope.init = function(){
        $http.get('/api/projects/' + $scope.projectId + '/info').then(function (response) {
            if (response.data.success == true) {
                $scope.info = response.data.project;
            } else {
                notify('Could not retrieve Team Members.' + err.message);
            }
        });
    };

    $scope.init();
});