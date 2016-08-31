app.controller('mainProfileController', function ($window, $http, $scope,Upload, notify,usSpinnerService) {
    $scope.init = function () {

        angular.element('#contentw').removeClass('sidebar-show').addClass('sidebar-hide');
        $scope.skills = {};
        $scope.skills.primarySkills = [];
        $scope.projects = [];
        $scope.currentSid = angular.element('#project-id').data('sid');
        var url = '/api/user/sid/' + $scope.currentSid;

        $http.get(url).then(function (resp) {
            if(resp.data) {
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

                var profileUrl = '/api/user/' + $scope.user._id + '/profile';

                $http.get(profileUrl).then(function (res) {
                    $scope.user.skills = res.data.profile;
                }, function (err) {
                    console.log('Error ', err);
                });
            }
        }, function (err) {
        });

    };

    $scope.init();

    $scope.cancelProfileImage = function(){
        delete $scope.user.uploadedAvatar;
    };

    $scope.saveProfileUpdates = function(user){
        usSpinnerService.spin('spin1');
        var files=[];
        if(typeof user.uploadedAvatar == 'object'){
            files.push(user.uploadedAvatar);
            delete user.uploadedAvatar;
        }

        $scope.upload(files,user,'/api/user/' + $scope.user._id,function(resp,err){
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

    $scope.ratyOptions = {
        half: true,
        cancel: false,
        cancelOn: '/img/raty/cancel-off.png',
        cancelOff: '/img/raty/cancel-on.png',
        starHalf: '/img/raty/star-half.png',
        starOff: '/img/raty/star-off.png',
        starOn: '/img/raty/star-on.png'
    };

    $scope.saveSkills = function(skills){
        var url = '/api/user/' + $scope.user._id + '/profile';
        $http.post(url,{data: skills}).then(function(res){
            if(res.data.success == true){
                notify('User skills updated.');
            }else{
                notify('Could not update user skills updated.' + res.data.message);
            }

        },function(err){
            notify('Could not update user skills updated.' + err.message);
        })
    }
});