var app = angular.module('engageApp', ['ngStorage', 'ui.router', 'dndLists', 'angularUtils.directives.dirPagination',
    'firebase', 'cgNotify', 'angularSpinner', 'angular-jwt', 'selectize',
    'angularMoment', 'ui.bootstrap.datetimepicker', 'ngSanitize', 'ngFileUpload',
    'permission', 'permission.ui', 'mgo-angular-wizard', 'summernote', 'ngLodash', 'ngRaty']);

app.config(function ($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');

    $urlRouterProvider.otherwise('/profile');

    $stateProvider
        .state('profile', {
            url: '/profile',
            authenticate: true,
            views: {
                'projectHeader': {
                    templateUrl: '/angular/partials/header.html'
                },
                'rootView': {
                    templateUrl: '/angular/partials/profile/root.html',
                    controller: 'mainProfileController'
                },
                'about@profile': {
                    templateUrl: '/angular/partials/profile/about.html'
                },
                'projects@profile': {
                    templateUrl: '/angular/partials/profile/projects.html'
                },
                'settings@profile': {
                    templateUrl: '/angular/partials/profile/settings.html'
                },
                'viewSkills@profile': {
                    templateUrl: '/angular/partials/profile/viewSkills.html'
                },
                'skills@profile': {
                    templateUrl: '/angular/partials/profile/editSkills.html'
                },
                'reviewsTab@profile':{
                    templateUrl: '/angular/partials/profile/reviews.html'
                }
            }
        })
        .state('project', {
            url: '/projects/:id',
            authenticate: true,
            views: {
                'projectHeader': {
                    templateUrl: '/angular/partials/header.html'
                },
                'rootView': {
                    templateUrl: '/angular/partials/project/root.html',
                    controller: 'rootViewController'
                },
                'teamMembers@project': {
                    templateUrl: '/angular/partials/project/team.html',
                    controller:'teamController'
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
                    templateUrl: '/angular/partials/project/info.html'
                }
            }
        })
        .state('admin', {
            url: '/admin',
            authenticate: true,
            views: {
                'projectHeader': {
                    templateUrl: '/angular/partials/header.html'
                },
                'mainView': {
                    templateUrl: '/angular/partials/admin/main.html',
                    controller: 'mainAdminController'
                },
                'leftSidebar': {
                    templateUrl: '/angular/partials/leftSidebar.html'
                }
            }
        })
        .state('survey', {
            url: '/:id/survey',
            authenticate: true,
            views: {
                'projectHeader': {
                    templateUrl: '/angular/partials/header.html'
                },
                'rootView': {
                    templateUrl: '/angular/partials/survey/root.html',
                    controller: 'mainSurveyController'
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
            $state.go(toState.redirectTo, toParams, { location: 'replace' })
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

app.filter('sidToUname', ['lodash', function (lodash) {
    return function (shortid, users) {
        var user = lodash.find(users, function (t) {
            return t.shortid == shortid
        });
        return user.firstName + ' ' + user.lastName;
    }
}]);

app.filter('idToBadgeImg', ['lodash', function (lodash) {
    return function (id, badges) {
        var badge = lodash.find(badges, function (t) {
            return t.sid == id
        });
        if(typeof badge != 'undefined') {
            return badge.url;
        }
    }
}]);


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

app.filter('projectStatusNot', function() {
    return function( projects, statusArr) {
        var filtered = [];

        if(statusArr === undefined || statusArr === []){
            return projects;
        }

        angular.forEach(projects, function(project) {
            if(statusArr.indexOf(project.status) == -1){
                filtered.push(project);
            }
        });

        return filtered;
    };
});

app.directive('engageAvatar', ['lodash', function (lodash) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var user = lodash.find(scope.team, function (user) {
                return user.shortid == attrs.engageAvatar;
            });
            if (typeof user != 'undefined') {
                attrs.$set('src', user.avatar);
            }
        }
    };
}]);

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
