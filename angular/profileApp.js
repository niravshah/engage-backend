var app = angular.module('engageApp', ['ngStorage', 'ui.router', 'angular-jwt']);

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
                'about': {
                    templateUrl: '/angular/partials/profile/about.html'
                },
                'projects': {
                    templateUrl: '/angular/partials/profile/projects.html'
                },
                'settings': {
                    templateUrl: '/angular/partials/profile/settings.html'
                }

            }
        })
});

app.controller('headerController', function ($window, $scope, $localStorage) {
    $scope.logout = function () {
        delete $localStorage.currentUser;
        $window.location.href = '/login';
    }
});

app.controller('mainController', function ($window, $http, $attrs, $scope, $localStorage) {
    $scope.init = function () {

        $scope.projects = [];
        if ($localStorage.currentUser) {
            $http.get('/api/user/' + $localStorage.currentUser.userid).then(function (resp) {
                $scope.user = resp.data.user;

                var memberships = $scope.user.memberships;
                angular.forEach(memberships, function (membership) {
                    var pid = membership.split("-")[1];
                    console.log(pid);
                    var url = '/api/projects/' + pid + '/info';
                    $http.get(url).then(function (resp) {
                        if (resp.data.success == true) {
                            $scope.projects.push(resp.data.project)
                        }
                    }, function (err) {
                    });
                });

            }, function (err) {
            });
        }
    };

    $scope.init();
});