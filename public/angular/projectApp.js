var app = angular.module('engageApp', ['ngStorage', 'ui.router','dndLists']);
app.config(function ($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            views: {
                'projectHeader':{
                    templateUrl:'/angular/partials/projectHeader.html',
                    controller:'headerController'
                },
                'projectInfo': {
                    templateUrl: '/angular/partials/projectInfo.html'
                },
                'teamMembers': {
                    templateUrl: '/angular/partials/teamMembers.html'
                },
                'messageStream': {
                    templateUrl: '/angular/partials/messageStream.html'
                },
                'projectTasks': {
                    templateUrl: '/angular/partials/projectTracker.html',
                    controller:'projectTasksController'
                }
            },
            resolve: {
                pid: function () {
                    return $("#content").data("pid")
                }
            }

        });
});

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.controller('headerController', function ($scope, $localStorage) {
    $scope.token = $localStorage.currentUser.token;
});

app.controller('projectTasksController', function ($scope, $http) {

    $controls = $('#controls');
    $scope.currentPage = 0;
    $scope.pageSize = 2;
    $scope.tasks=[];

    $scope.models = {
        selected: null,
        lists: {"A": [], "B": []}
    };

    $scope.init = function(){
        console.log('projectTasksController Init');
        $http.get('/data/projects/1/tasks.json').then(function(response){
            $scope.tasks = response.data.tasks;
            console.log($scope.tasks);
        })
    }

    $scope.init();

    $scope.dndSelectedFn = function(task){
        console.log('Selected', task);
        $scope.models.selected = task;

        if ($controls.hasClass('rightbar-hidden')) {
            $controls.removeClass('rightbar-hidden').addClass('rightbar-show');
        }
    }

    $scope.closeRightSidebar = function(){
        if ($controls.hasClass('rightbar-show')) {
            $controls.removeClass('rightbar-show').addClass('rightbar-hidden');
        }

    }

    $scope.numberOfPages=function(){
        return Math.ceil($scope.tasks.length/$scope.pageSize);
    }
    
});