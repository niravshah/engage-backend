app.controller('mainAdminController', function ($window, $http, $scope,Upload, notify,usSpinnerService,NgTableParams) {

    $scope.uploadUsers = function(){
        var files = [];
        if(typeof $scope.uploadedXls == 'object'){
            files.push($scope.uploadedXls);
        }
        $scope.upload(files,{},'/api/upload/users',function(resp,err){
           if(err){
               notify('Error uploading users' + err.message);
           } else{
               if(resp.data.success == true) {
                   notify('Users Upload Successful.' + resp.data.message);
               }else{
                   notify('Users Upload Failed.' + resp.data.message);
               }
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