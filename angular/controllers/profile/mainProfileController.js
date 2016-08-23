app.controller('mainProfileController', function ($window, $http, $scope,Upload, notify,usSpinnerService) {
    $scope.init = function () {

        $scope.projects = [];
        $scope.currentSid = angular.element('#project-id').data('sid');;
        var url = '/api/user/sid/' + $scope.currentSid;

        $http.get(url).then(function (resp) {
            $scope.user = resp.data.user;
            var memberships = $scope.user.memberships;
            angular.forEach(memberships, function (membership) {
                var pid = membership.split("-")[1];
                var url = '/api/projects/' + pid + '/info';
                $http.get(url).then(function (resp) {
                    if (resp.data.success == true) {
                        $scope.projects.push(resp.data.project)
                    }
                }, function (err) {
                });
            });

        }, function (err) {
        });

    };

    $scope.init();

    $scope.cancelProfileImage = function(){
        delete $scope.user.uploadedAvatar;
    };

    $scope.saveProfileUpdates = function(){
        usSpinnerService.spin('spin1');
        var files=[];
        if(typeof $scope.user.uploadedAvatar == 'object'){
            files.push($scope.user.uploadedAvatar);
            delete $scope.user.uploadedAvatar;
        }

        $scope.upload(files,$scope.user,'/api/user/' + $scope.user._id,function(resp,err){
            if(err){
                usSpinnerService.stop('spin1');
                notify("Error updating user profile" + err.message);
            }else{
                usSpinnerService.stop('spin1');
                notify('User profile updated. Please logout and log back in.');
            }
        });
    };

    $scope.upload = function (file, addMore, url, cb) {
        Upload.upload({
            url: url,
            data: {file: file, addData: addMore},
            arrayKey: '[k]',
            objectKey: '[k]'
        }).then(function (resp) {
            cb(resp, null);
        }, function (err) {
            cb(null, err);
        });
    };
});