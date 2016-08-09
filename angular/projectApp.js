var app = angular.module('engageApp', ['ngStorage', 'ui.router', 'dndLists', 'angularMoment', 'angularUtils.directives.dirPagination', 'firebase']);
app.config(function ($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            views: {
                'projectHeader': {
                    templateUrl: '/angular/partials/project/projectHeader.html',
                    controller: 'headerController'
                },
                'projectInfo': {
                    templateUrl: '/angular/partials/project/projectInfo.html'
                },
                'teamMembers': {
                    templateUrl: '/angular/partials/project/teamMembers.html',
                    controller: 'teamMemberController'
                },
                'messageStream': {
                    templateUrl: '/angular/partials/project/messageStream.html',
                    controller: 'messageStreamController'
                },
                'projectTasks': {
                    templateUrl: '/angular/partials/project/projectTracker.html',
                    controller: 'projectTasksController'
                }
            },
            resolve: {
                pid: function () {
                    return $("#content").data("pid")
                }
            }

        });
});

app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.directive('activeToggle', function () {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attr) {

            element.on('click', function () {

                var target = angular.element(attr.target) || Array(element);

                if (element.hasClass('active')) {
                    element.removeClass('active');
                    target.removeClass('show');
                } else {
                    element.addClass('active');
                    target.addClass('show');
                }
            });
        }
    };
});


app.controller('headerController', function ($scope, $localStorage) {
    $scope.token = $localStorage.currentUser.token;
});

app.controller('mainController', function ($scope, $localStorage,$firebaseAuth,$firebaseArray) {
    $scope.init = function () {
        $scope.firebaseToken = $localStorage.currentUser.firebaseToken;
        var auth = $firebaseAuth();
        auth.$signInWithCustomToken($scope.firebaseToken).then(function (firebaseUser) {
            var tasks = firebase.database().ref().child("P1").child("tasks");
            var messages = firebase.database().ref().child("P1").child("messages");
            $scope.fbTasks = $firebaseArray(tasks);
            $scope.fbMessages = $firebaseArray(messages);
        }).catch(function (error) {
            console.log(error)
        });
    };

    $scope.init();

});


app.controller('teamMemberController', function ($scope, $http) {
    $scope.init = function () {
        //console.log('teamMemberController Init');
        $http.get('/data/projects/1/team.json').then(function (response) {
            $scope.team = response.data.team;
            //console.log($scope.team);
        })
    };

    $scope.init();

});

app.controller('messageStreamController', function ($scope, $http) {
    $scope.init = function () {
        //console.log('messageStreamController Init');
        $http.get('/data/projects/1/messages.json').then(function (response) {
            $scope.messages = response.data.messages;
            //console.log($scope.messages);
        })
    }

    $scope.init();

});


app.controller('projectTasksController', function ($scope, $http) {

    $controls = $('#controls');
    $scope.tasks = [];
    $scope.tasksPerPage = "3";

    $scope.models = {
        selected: null,
    };

    $scope.init = function () {
        //console.log('projectTasksController Init', new Date().getTime());
        $http.get('/data/projects/1/tasks.json').then(function (response) {
            $scope.tasks = response.data.tasks;
            //console.log($scope.tasks);
        })
    }

    $scope.init();

    $scope.dndSelectedFn = function (task) {
        //console.log('Selected', task);
        $scope.models.selected = task;

        if ($controls.hasClass('rightbar-hidden')) {
            $controls.removeClass('rightbar-hidden').addClass('rightbar-show');
        }
    };

    $scope.closeRightSidebar = function () {
        if ($controls.hasClass('rightbar-show')) {
            $controls.removeClass('rightbar-show').addClass('rightbar-hidden');
        }

    };

});