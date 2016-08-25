app.controller('mainAdminController', function ($window, $http, $scope, Upload, notify, usSpinnerService) {

    $scope.init = function () {
        var $sidebar = angular.element('#contentw');
        if (!$sidebar.hasClass('sidebar-show'))
        {
            $sidebar.removeClass('sidebar-hide');
            $sidebar.addClass('sidebar-show');
        }
        $scope.szCategoryConfig = {
            valueField: 'value',
            labelField: 'label',
            placeholder: 'Select Category'
        };

        $scope.szCategoryOptions = [
            {label: 'Label 1', value: 'Value 1'},
            {label: 'Label 2', value: 'Value 2'}
        ];

        $scope.currentProject = {};
        $scope.currentProject.sDate = new Date();
        $scope.currentProject.eDate = new Date();

    };

    $scope.init();

    $scope.uploadUsers = function () {
        var files = [];
        if (typeof $scope.uploadedXls == 'object') {
            files.push($scope.uploadedXls);
        }
        $scope.upload(files, {}, '/api/upload/users', function (resp, err) {
            if (err) {
                notify('Error uploading users' + err.message);
            } else {
                if (resp.data.success == true) {
                    notify('Users Upload Successful.' + resp.data.message);
                } else {
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

    $scope.inputOnTimeSet = function (newDate, oldDate) {
        $('#dLabel1').dropdown('toggle');
    };

});