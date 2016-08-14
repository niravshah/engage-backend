var app = angular.module('engageApp', ['ngStorage', 'ui.router', 'dndLists', 'angularMoment', 'angularUtils.directives.dirPagination', 'firebase', 'cgNotify','angularSpinner','angular-jwt']);

app.config(function ($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            authenticate:true,
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

app.run(['$rootScope', '$state', 'AuthService','$window', function ($rootScope, $state, AuthService, $window) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (!AuthService.validToken() && toState.authenticate) {
            event.preventDefault();
            $window.location.href='/login';
        }
        if (toState.redirectTo) {
            event.preventDefault();
            $state.go(toState.redirectTo, toParams, {location: 'replace'})
        }
    });

}]);

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

app.controller('mainController', function ($attrs, $scope, $localStorage,$firebaseAuth,$firebaseArray, notify,usSpinnerService) {
    $scope.init = function () {
        if($localStorage.currentUser) {

            $scope.firebaseToken = $localStorage.currentUser.firebaseToken;
            var dataId = $localStorage.currentUser.tenant + "-" + $attrs.pid;
            var auth = $firebaseAuth();
            auth.$signInWithCustomToken($scope.firebaseToken).then(function (firebaseUser) {
                usSpinnerService.spin('spin1');
                var tasksRef = firebase.database().ref().child(dataId).child("tasks");
                var messagesRef = firebase.database().ref().child(dataId).child("messages");

                var tasksData = $firebaseArray(tasksRef);
                tasksData.$loaded().then(function(tasks){
                    $scope.fbTasks = tasks;
                    notify('Tasks Loaded');
                    usSpinnerService.stop('spin1');
                },function(err) {
                    notify(err.message);
                    usSpinnerService.stop('spin1');
                });

                var messageData = $firebaseArray(messagesRef);
                messageData.$loaded().then(function(messages){
                    $scope.fbMessages = messages;
                    notify('Messages Loaded');
                    usSpinnerService.stop('spin1');
                }, function(err) {
                    notify(err.message);
                    usSpinnerService.stop('spin1');
                });

            }).catch(function (error) {
                notify("Unable to Retrieve Data." + error.message);
                console.log(error);
                usSpinnerService.stop('spin1');
            });
        }
    };

    $scope.init();

});


app.controller('teamMemberController', function ($scope, $http) {
    $scope.init = function () {
        $http.get('/data/projects/1/team.json').then(function (response) {
            $scope.team = response.data.team;
        })
    };

    $scope.init();

});

app.controller('messageStreamController', function ($scope, $http) {
    $scope.init = function () {
    };
    $scope.init();
});

app.controller('projectTasksController', function ($scope, $http) {

    $controls = $('#controls');
    $scope.tasks = [];
    $scope.tasksPerPage = "3";

    $scope.models = {
        selected: null
    };

    $scope.init = function () {
    };

    $scope.init();

    $scope.dndSelectedFn = function (task) {
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