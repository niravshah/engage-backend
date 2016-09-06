app.controller('mainSurveyController', function ($scope, $rootScope,  $stateParams, $http, notify) {
    $scope.init = function () {
        $scope.disableLeftBar();
        $scope.projectId = $stateParams.id;
        console.log($scope.projectId);

        $http.get('/api/projects/' + $scope.projectId + '/members').then(function (response) {
            if (response.data.success == true) {
                $rootScope.team =response.data.users;
                console.log($rootScope.team);
            } else {
                notify('Could not retrieve Team Members.' + err.message);
            }
        });

        $http.get('/api/projects/' + $scope.projectId + '/skills').then(function (response) {
            if (response.data.success == true) {
                $rootScope.info = response.data.project;
            } else {
                notify('Could not retrieve Project Info.' + err.message);
            }
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

    $scope.init();

    $scope.addDetails = function () {
        $scope.openRightSidebar('survey-sidebar');
    };

    $scope.closeRightSidebar = function (sidebarId) {
        var el = '#' + sidebarId;
        var $controls = $(el);
        if ($controls.hasClass('rightbar-show')) {
            $controls.removeClass('rightbar-show').addClass('rightbar-hidden');
        }
    };

    $scope.openRightSidebar = function (sidebarId) {
        var el = '#' + sidebarId;
        var $controls = $(el);
        if ($controls.hasClass('rightbar-hidden')) {
            $controls.removeClass('rightbar-hidden').addClass('rightbar-show');
        }
    };
});