app.controller('mainProfileController', function ($window, $http, $scope, $state, Upload, notify,usSpinnerService) {
    $scope.init = function () {

        $scope.disableLeftBar();

        $scope.skills = {};
        $scope.skills.primarySkills = [];
        $scope.skills.desiredSkills = [];
        $scope.projects = [];
        $scope.currentSid = angular.element('#project-id').data('sid');
        $scope.headerSideBarToggle = false;

        //$scope.badges=[{id:1,url:'/img/badges/badge1.png'}];
        $scope.badges=[];

        $http.get('/api/misc/badge').then(function(response){
            if(response.data.success == true){
                $scope.badges = response.data.data;
            }
        });


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
                    $scope.skills = res.data.profile;
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
                $(".nav-tabs a[href='#projectsTab']").tab('show');
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

    $scope.saveSkills = function(){
        var url = '/api/user/' + $scope.user._id + '/profile';
        $http.post(url,{data: $scope.skills}).then(function(res){
            if(res.data.success == true){
                notify('User skills updated.');
                $(".nav-tabs a[href='#viewSkillsTab']").tab('show');
            }else{
                notify('Could not update user skills updated.' + res.data.message);
            }

        },function(err){
            notify('Could not update user skills updated.' + err.message);
        })
    };

    $scope.markProjectComplete = function(id){
        var url = '/api/projects/' + id + '/status/complete';
        $http.post(url).then(function(res){
            if(res.data.success == true){
                notify('Project Status marked Complete.');
                $state.reload();
            }else{
                notify('Could not mark Project status Complete.' + res.data.message)
            }
        },function(err){
            if(err){
                notify('Error occurred while marking Project status Complete.' + err.message)
            }
        });
    };
    $scope.archiveProject = function(id){
        var url = '/api/projects/' + id + '/status/archived';
        $http.post(url).then(function(res){
            if(res.data.success == true){
                notify('Project Archived.');
                $state.reload();
            }else{
                notify('Could not Archive Project .' + res.data.message)
            }
        },function(err){
            if(err){
                notify('Error occurred Archiving Project. ' + err.message)
            }
        });
    };
    $scope.markProjectInProgress = function(id){
        var url = '/api/projects/' + id + '/status/in_progress';
        $http.post(url).then(function(res){
            if(res.data.success == true){
                notify('Project Status marked In Progress.');
                $state.reload();
            }else{
                notify('Could not mark Project status to In Progress.' + res.data.message)
            }
        },function(err){
            if(err){
                notify('Error occurred while marking Project status In Progress.' + err.message)
            }
        });
    };
    
});