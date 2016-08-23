var app = angular.module('engageApp', ['ngStorage', 'ui.router', 'dndLists', 'angularUtils.directives.dirPagination',
    'firebase', 'cgNotify', 'angularSpinner', 'angular-jwt', 'selectize', 'angularMoment', 'ui.bootstrap.datetimepicker','ngSanitize']);

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
                'projectInfo': {
                    templateUrl: '/angular/partials/project/info.html',
                    controller: 'projectInfoController'
                },
                'teamMembers': {
                    templateUrl: '/angular/partials/project/team.html',
                    controller: 'teamMemberController'
                },
                'messageStream': {
                    templateUrl: '/angular/partials/project/messages.html',
                    controller: 'messageStreamController'
                },
                'projectTasks': {
                    templateUrl: '/angular/partials/project/tasks.html',
                    controller: 'projectTasksController'
                }
            }

        });
});

app.run(['$rootScope', '$state', 'AuthService', '$window', function ($rootScope, $state, AuthService, $window) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (!AuthService.validToken() && toState.authenticate) {
            event.preventDefault();
            $window.location.href = '/login';
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

app.directive('chatReply', function () {
    return {
        templateUrl: '/angular/partials/project/chatReply.html',
        restrict: 'E',
        scope:{
            avatar: '@',
            index:'@',
            post: '&'
        }
    };
});

app.directive("contenteditable", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function () {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function () {
                scope.$apply(read);
            });
        }
    };
});
