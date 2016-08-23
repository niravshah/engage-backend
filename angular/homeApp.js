var app = angular.module('engageApp', ['ngStorage', 'ui.router', 'dndLists', 'angularUtils.directives.dirPagination',
    'firebase', 'cgNotify', 'angularSpinner', 'angular-jwt', 'selectize',
    'angularMoment', 'ui.bootstrap.datetimepicker', 'ngSanitize', 'ngFileUpload',
    'permission', 'permission.ui']);

app.config(function ($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');

    $urlRouterProvider.otherwise('/profile');

    $stateProvider
        .state('profile', {
            url: '/profile',
            authenticate: true,
            views: {
                'projectHeader': {
                    templateUrl: '/angular/partials/header.html',
                    controller: 'headerController'
                },
                'mainView': {
                    templateUrl: '/angular/partials/profile/main.html',
                    controller:'mainProfileController'
                },
                'about@profile': {
                    templateUrl: '/angular/partials/profile/about.html'
                },
                'projects@profile': {
                    templateUrl: '/angular/partials/profile/projects.html'
                },
                'settings@profile': {
                    templateUrl: '/angular/partials/profile/settings.html'
                }
            }
        })
        .state('project', {
            url: '/projects/:id',
            authenticate: true,
            views: {
                'projectHeader': {
                    templateUrl: '/angular/partials/header.html',
                    controller: 'headerController'
                },
                'mainView': {
                    templateUrl: '/angular/partials/project/main.html',
                    controller:'mainController'
                },
                'teamMembers@project': {
                    templateUrl: '/angular/partials/project/team.html',
                    controller: 'teamMemberController'
                },
                'messageStream@project': {
                    templateUrl: '/angular/partials/project/messages.html',
                    controller: 'messageStreamController'
                },
                'projectTasks@project': {
                    templateUrl: '/angular/partials/project/tasks.html',
                    controller: 'projectTasksController'
                },
                'projectInfo@project': {
                    templateUrl: '/angular/partials/project/info.html',
                    controller: 'projectInfoController'
                }
            }
        })
        .state('admin', {
            url: '/admin',
            authenticate: true,
            views: {
                'projectHeader': {
                    templateUrl: '/angular/partials/header.html',
                    controller: 'headerController'
                },
                'mainView': {
                    templateUrl: '/angular/partials/admin/main.html'
                }
            }
        });
});

app.run(['$rootScope', '$state', 'AuthService', '$window', 'PermissionStore', '$localStorage', function ($rootScope, $state, AuthService, $window, PermissionStore, $localStorage) {
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

    PermissionStore
        .definePermission('isAdmin', function () {
            return $localStorage.currentUser.userRoles.indexOf('admin') > -1;
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
        scope: {
            avatar: '@',
            index: '@',
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
