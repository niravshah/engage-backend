var app = angular.module('engageWelcomeApp', ['ngStorage', 'angular-jwt', 'ngCookies','ngFileUpload','cgNotify']);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
app.controller('WelcomeController', function Controller($scope, $http, $location, $localStorage, jwtHelper, $window,Upload, notify) {

    $scope.init = function(){
        $scope.user = $localStorage.currentUser;
    };

    $scope.init();

    $scope.imageAdded = function(){
        angular.element(document.querySelector( '.default-profile-photo')).remove();
    };

    $scope.uploadImage = function () {

        var files = [];
        var canvas = angular.element(document.querySelector( '.default-profile-photo canvas'))[0];

        if (canvas) {
            var myImage = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            var name = $scope.user.firstName + "-" + $scope.user.lastName + "-avatar.png";
            files.push(Upload.dataUrltoBlob(myImage, name));
        }else if (typeof $scope.uploadedAvatar== 'object') {
                files.push($scope.uploadedAvatar);
        };

        if(files.length > 0) {
            $scope.upload(files, $scope.user.userid, '/api/user/avatar', function (resp, err) {
                if (err){
                    notify('Error uploading avatar '+ err);
                } else{
                    $localStorage.currentUser.avatar = resp.data.avatar;
                    $window.location.href = resp.data.nextUrl;
                }
            })
        };
    };

    $scope.upload = function (file, addMore, url, cb) {
        Upload.upload({
            url: url,
            data: {file: file, addData: addMore},
            arrayKey: '[k]',
            objectKey: '[k]'
        }).then(function (resp) {
            cb(resp, null);
        }, function (resp) {
            cb(null, resp);
        });
    };
});