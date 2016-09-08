app.controller('mainSurveyController', function ($scope, $rootScope, $stateParams, $http, notify, $location,$localStorage) {
    $scope.init = function () {
        $scope.disableLeftBar();
        $scope.projectId = $stateParams.id;
        $scope.rating = {};

        $scope.user = {};
        $scope.user.firstName = $localStorage.currentUser.firstName;
        $scope.user.lastName = $localStorage.currentUser.lastName;
        $scope.user.avatar = $localStorage.currentUser.avatar;
        $scope.user.shortid = $localStorage.currentUser.shortid;


        $http.get('/api/projects/' + $scope.projectId + '/members').then(function (response) {
            if (response.data.success == true) {
                $rootScope.team = response.data.users;
                console.log($rootScope.team);

                angular.forEach($rootScope.team, function (value, key) {
                    $scope.rating[key] = {};
                    $scope.rating[key].skills = {};
                    $scope.rating[key].email = value.email;
                    $scope.rating[key].shortid = value.shortid;
                    $scope.rating[key].value = 0;
                });
            } else {
                notify('Could not retrieve Team Members.' + err.message);
            }
        });

        $http.get('/api/projects/' + $scope.projectId + '/skills').then(function (response) {
            if (response.data.success == true) {
                $rootScope.info = response.data.project;
                angular.forEach($rootScope.info.skillsDesired, function (value, key) {
                    angular.forEach($scope.rating, function (rating, key2) {
                        rating.skills[key] = {};
                        rating.skills[key].skill = value.name;
                        rating.skills[key].sid = value.sid;
                        rating.skills[key].value = 0;
                    })
                })
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

    $scope.addDetails = function (index) {
        $scope.currentIndex = index;
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

    $scope.saveSurvey = function () {
        console.log($scope.rating);

        var data = {};
        data.from = $scope.user;
        data.ratings = $scope.rating;
        
        var url = '/api/project/' + $scope.projectId + '/survey';
        $http.post(url, data).then(function(res){
            if(res.data.success == true){
                notify('Survey Submitted. Thanks.');
                $location.path('/profile');
            }else{
                notify('Could not submit survey. ' + res.data.message);
            }
        },function(err){
            notify('Could not submit survey. ' + err.data.errorMessage);
        });
    };
    
    $scope.cancelSurvey = function () {
        $location.path('/profile');
    }
});