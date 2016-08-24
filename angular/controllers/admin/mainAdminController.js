app.controller('mainAdminController', function ($window, $http, $scope,Upload, notify,usSpinnerService,NgTableParams) {

    $scope.uploadUsers = function(){
        var files = [];
        if(typeof $scope.uploadedXls == 'object'){
            files.push($scope.uploadedXls);
        }
        $scope.upload(files,{},'/api/upload/users',function(resp,err){
           if(err){
               console.log('Error',err);
           } else{
               $scope.tableParams = new NgTableParams({}, { dataset: resp.data[0]});
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