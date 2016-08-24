app.controller('mainAdminController', function ($window, $http, $scope,Upload, notify,usSpinnerService) {

    $scope.uploadUsers = function(){
        $scope.upload(uploadedXls,{},'/api/upload/users',function(resp,err){
           if(err){
               console.log('Error',err);
           } else{
               console.log('Response',resp);
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