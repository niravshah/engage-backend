var app = angular.module('engageApp', ['ngStorage', 'ui.router', 'angular-jwt','ngFileUpload','cgNotify','angularSpinner','ngSanitize']);

app.config(function ($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            authenticate: true,
            views: {
                'projectHeader': {
                    templateUrl: '/angular/partials/project/header.html',
                    controller: 'headerController'
                },
                'about': {
                    templateUrl: '/angular/partials/profile/about.html'
                },
                'projects': {
                    templateUrl: '/angular/partials/profile/projects.html'
                },
                'settings': {
                    templateUrl: '/angular/partials/profile/settings.html'
                }
            }
        })
});

app.controller('headerController', function ($window, $scope, $localStorage) {
    $scope.logout = function () {
        delete $localStorage.currentUser;
        $window.location.href = '/login';
    }
});

app.controller('mainController', function ($window, $http, $attrs, $scope,Upload, notify,usSpinnerService) {
    $scope.init = function () {

        $scope.projects = [];
        $scope.currentSid = $attrs.sid;
        var url = '/api/user/sid/' + $attrs.sid;

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