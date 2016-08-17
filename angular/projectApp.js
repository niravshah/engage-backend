var app = angular.module('engageApp', ['ngStorage', 'ui.router', 'dndLists', 'angularUtils.directives.dirPagination',
    'firebase', 'cgNotify','angularSpinner','angular-jwt','selectize','ui.bootstrap.datetimepicker']);

app.config(function ($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            authenticate:true,
            views: {
                'projectHeader': {
                    templateUrl: '/angular/partials/project/header.html',
                    controller: 'headerController'
                },
                'projectInfo': {
                    templateUrl: '/angular/partials/project/info.html'
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

app.directive("contenteditable", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function() {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function() {
                scope.$apply(read);
            });
        }
    };
});

app.controller('headerController', function ($scope, $localStorage) {
    $scope.token = $localStorage.currentUser.token;
});

app.controller('mainController', function ($http, $attrs, $scope, $localStorage,$firebaseAuth,$firebaseArray, notify,usSpinnerService) {
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

                $http.get('/data/projects/1/tasksArr.json').then(function (response) {
                    $scope.fbTasks = response.data;
                });


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
        });
    };

    $scope.init();

});

app.controller('messageStreamController', function ($scope, $http) {
    $scope.init = function () {
    };
    $scope.init();
});

app.controller('projectTasksController', function ($scope, notify) {

    var $controls = $('#controls');
    $scope.tasks = [];
    $scope.tasksPerPage = "3";

    $scope.myOptions = [
        {
            "firstName":"Roger",
            "lastName":"Freeman",
            "email":"roger@ew.com",
            "avatar":"/img/avatars/roger.jpg",
            "badges":["/img/badges/badge1.png"],
            "role":"Team Lead"
        },
        {
            "firstName":"Robin",
            "lastName":"Wills",
            "email":"robin@ew.com",
            "avatar":"/img/avatars/robin.jpg",
            "badges":["/img/badges/badge3.png"],
            "role":"Project Manager"
        },
        {
            "firstName":"Anna",
            "lastName":"Smith",
            "email":"anna@ew.com",
            "avatar":"/img/avatars/anna.jpg",
            "badges":["/img/badges/badge2.png"],
            "role":"Communications Manager"
        },
        {
            "firstName":"Deel",
            "lastName":"Marlow",
            "email":"deel@ew.com",
            "avatar":"/img/avatars/deel.jpg",
            "badges":["/img/badges/badge1.png","/img/badges/badge1.png"],
            "role":"Team Member"
        },
        {
            "firstName":"Mike",
            "lastName":"Herrington",
            "email":"mike@ew.com",
            "avatar":"/img/avatars/mike.jpg",
            "badges":["/img/badges/badge2.png"],
            "role":"Team Member"
        },
        {
            "firstName":"John",
            "lastName":"Douey",
            "email":"john@ew.com",
            "avatar":"/img/avatars/john.jpg",
            "badges":[],
            "role":"Team Member"
        }
    ];

    $scope.myConfig = {
        create:false,
        persist: false,
        valueField: 'email',
        labelField: 'firstName' + 'lastName',
        searchField: ['name', 'email'],
        delimiter: '|',
        placeholder: 'Pick something',
        maxItems: 1,
        render: {
            item: function(item, escape) {
                var label = item.avatar;
                var caption = item.firstName + item.lastName;
                return '<div>' +
                    '<img class="img-circle-sm" src="'+label+ '"/>' +
                    (caption ? '<span class="caption md-pl-15">' + escape(caption) + '</span>' : '') +
                    '</div>';
            },
            option: function(item, escape) {
                var label = item.avatar;
                var caption = item.firstName + item.lastName;
                return '<div>' +
                    '<img class="img-circle-sm" src="'+label+ '"/>' +
                    (caption ? '<span class="caption md-pl-15">' + escape(caption) + '</span>' : '') +
                    '</div>';
            }
        },
        onChange: function(value){
            console.log('New Value', value);
            angular.forEach($scope.myOptions,function(option){
                if(option.email == value){
                    console.log(option);
                    $scope.models.selected.owner = option.firstName + ' ' + option.lastName;
                    $scope.models.selected.ownerImage = option.avatar;
                    $scope.models.selected.ownerEmail = option.email;
                }
            })
        }

    };

    $scope.statusOptions = [
        {value:'In Progress'},
        {value:'Complete'},
        {value:'Blocked'}
    ];

    $scope.statusConfig = {
        create:false,
        persist: false,
        valueField: 'value',
        labelField: 'value',
        delimiter: '|',
        placeholder: 'Pick something',
        maxItems: 1
    };

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

    $scope.deleteTask = function(index){
        var record = $scope.fbTasks.$getRecord(index);
        record.status = 'deleted';
        $scope.fbTasks.$save(record).then(function(ref){
            notify('Task Deleted : ' + $scope.fbTasks.$getRecord(ref.key).description);
        })
    };

    $scope.addNewTask = function(task){
        $scope.fbTasks.$add(task).then(function(){
            notify('New Task Added' + ref);
        });
    };

    $scope.editTask = function(index){
        $scope.models.selected = $scope.fbTasks[index];
        if ($controls.hasClass('rightbar-hidden')) {
            $controls.removeClass('rightbar-hidden').addClass('rightbar-show');
        }
    };

    $scope.saveEditedItem = function(index){
        var record = $scope.fbTasks.$getRecord(index);
        $scope.fbTasks.$save(record).then(function(ref){
            $controls.addClass('rightbar-hidden');
            notify('Task Saved : ' + $scope.fbTasks.$getRecord(ref.key).description);
        });
    };
});