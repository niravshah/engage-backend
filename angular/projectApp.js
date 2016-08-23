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
            },
            resolve: {
                pid: function () {
                    return $("#content").data("pid")
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

app.controller('headerController', function ($window, $scope, $localStorage) {
    $scope.logout = function () {
        delete $localStorage.currentUser;
        $window.location.href = '/login';
    }
});
app.controller('projectInfoController', function ($scope, $http) {
    $scope.init = function(){
        $http.get('/api/projects/' + $scope.projectId + '/info').then(function (response) {
            if (response.data.success == true) {
                $scope.info = response.data.project;
            } else {
                notify('Could not retrieve Team Members.' + err.message);
            }
        });
    };

    $scope.init();
});

app.controller('mainController', function ($window, $http, $attrs, $scope, $localStorage, $firebaseAuth, $firebaseArray, notify, usSpinnerService) {
    $scope.init = function () {
        if ($localStorage.currentUser) {

            $scope.user = {};
            $scope.user.firstName = $localStorage.currentUser.firstName;
            $scope.user.lastName = $localStorage.currentUser.lastName;
            $scope.user.avatar = $localStorage.currentUser.avatar;
            $scope.user.shortid = $localStorage.currentUser.shortid;
            $scope.token = $localStorage.currentUser.token;
            $scope.projectId = $attrs.pid;

            $scope.firebaseToken = $localStorage.currentUser.firebaseToken;
            var dataId = $localStorage.currentUser.tenant + "-" + $attrs.pid;
            var auth = $firebaseAuth();
            auth.$signInWithCustomToken($scope.firebaseToken).then(function (firebaseUser) {
                usSpinnerService.spin('spin1');
                var tasksRef = firebase.database().ref().child(dataId).child("tasks");
                var messagesRef = firebase.database().ref().child(dataId).child("messages").limitToLast(30);

                var tasksData = $firebaseArray(tasksRef);
                tasksData.$loaded().then(function (tasks) {
                    $scope.fbTasks = tasks;
                    //notify('Tasks Loaded');
                    usSpinnerService.stop('spin1');
                }, function (err) {
                    notify(err.message);
                    usSpinnerService.stop('spin1');
                });

                var messageData = $firebaseArray(messagesRef);
                messageData.$loaded().then(function (messages) {
                    $scope.fbMessages = messages;
                    //notify('Messages Loaded');
                    usSpinnerService.stop('spin1');
                }, function (err) {
                    notify(err.message);
                    usSpinnerService.stop('spin1');
                });

            }).catch(function (error) {

                if (error.code == 'auth/invalid-custom-token') {
                    $window.location.href = '/login';
                } else {
                    notify("Unable to Retrieve Data." + error.message);
                    $http.get('/data/projects/1/tasksArr.json').then(function (response) {
                        $scope.fbTasks = response.data;
                    });
                    $http.get('/data/projects/1/messagesArr.json').then(function (response) {
                        $scope.fbMessages = response.data;
                    });

                    usSpinnerService.stop('spin1');
                }
            });
        }
    };

    $scope.init();

});

app.controller('teamMemberController', function ($scope, $http) {
    $scope.init = function () {
        $http.get('/api/projects/' + $scope.projectId + '/members').then(function (response) {
            if (response.data.success == true) {
                $scope.team = response.data.users;
            } else {
                notify('Could not retrieve Team Members.' + err.message);
            }
        });
    };

    $scope.init();

});

app.controller('messageStreamController', function ($scope, $compile, $firebaseArray) {
    $scope.currentMessage = "";
    $scope.showReplyBox = {};

    $scope.postMessage = function (message) {
        var newMessage = {
            $id: Date.now(),
            avatar: $scope.user.avatar,
            from: $scope.user.firstName + " " + $scope.user.lastName,
            likes: 0,
            message: message,
            replies: {},
            timestamp: Date.now()
        };

        $scope.fbMessages.$add(newMessage).then(function (ref) {
            console.log('Message Added', ref);
            $scope.currentMessage = "";
        }, function (err) {
            console.log('Message Add Error', err);
        });
    };

    $scope.showReplyBox = function (index) {

        var rep = document.createElement('chat-reply');

        var att = document.createAttribute("post");
        att.value = "postReply(index, chatReply)";
        rep.setAttributeNode(att);

        var att2 = document.createAttribute("avatar");
        att2.value = $scope.user.avatar;
        rep.setAttributeNode(att2);

        var att3 = document.createAttribute("index");
        att3.value = index;
        rep.setAttributeNode(att3);

        var reply = angular.element(rep);
        $compile(reply)($scope);

        var repliesBoxId = '#message' + index;
        angular.element(repliesBoxId).after(reply);
    };

    $scope.postReply = function (key, message) {
        var newReply = {
            avatar: $scope.user.avatar,
            from: $scope.user.firstName + " " + $scope.user.lastName,
            likes: 0,
            message: message,
            timestamp: Date.now()
        };

        var repliesRef = $scope.fbMessages.$ref().path.toString();
        var childRef = repliesRef + "/" + key + "/" + "replies";
        var db = firebase.database().ref(childRef);
        var repliesArr = $firebaseArray(db);
        repliesArr.$add(newReply).then(function (ref) {
            console.log('Message Added', ref);
        }, function (err) {
            console.log('Message Add Error', err);
        });
    };

    $scope.deleteMessage = function(mid, isReply, parentMid){
        if(isReply) {
            console.log('Delete Message', mid);
            var repliesRef = $scope.fbMessages.$ref().path.toString();
            var childRef = repliesRef + "/" + parentMid + "/" + "replies";
            var db = firebase.database().ref(childRef);
            var repliesArr = $firebaseArray(db);
            var index = repliesArr.$indexFor(mid);
            repliesArr.$remove(index).then(function(ref){
                console.log('Message Deleted',ref);
            })

        }else{
            var index = $scope.fbMessages.$indexFor(mid);
            $scope.fbMessages.$remove(index).then(function(ref){
               console.log('Message Deleted',ref);
            });
        }
    }
    
});

app.controller('projectTasksController', function ($scope, notify) {

    var $controls = $('#controls');
    $scope.tasks = [];
    $scope.tasksPerPage = "3";

    $scope.myOptions = [
        {
            "firstName": "Roger",
            "lastName": "Freeman",
            "email": "roger@ew.com",
            "avatar": "/img/avatars/roger.jpg",
            "badges": ["/img/badges/badge1.png"],
            "role": "Team Lead"
        },
        {
            "firstName": "Robin",
            "lastName": "Wills",
            "email": "robin@ew.com",
            "avatar": "/img/avatars/robin.jpg",
            "badges": ["/img/badges/badge3.png"],
            "role": "Project Manager"
        },
        {
            "firstName": "Anna",
            "lastName": "Smith",
            "email": "anna@ew.com",
            "avatar": "/img/avatars/anna.jpg",
            "badges": ["/img/badges/badge2.png"],
            "role": "Communications Manager"
        },
        {
            "firstName": "Deel",
            "lastName": "Marlow",
            "email": "deel@ew.com",
            "avatar": "/img/avatars/deel.jpg",
            "badges": ["/img/badges/badge1.png", "/img/badges/badge1.png"],
            "role": "Team Member"
        },
        {
            "firstName": "Mike",
            "lastName": "Herrington",
            "email": "mike@ew.com",
            "avatar": "/img/avatars/mike.jpg",
            "badges": ["/img/badges/badge2.png"],
            "role": "Team Member"
        },
        {
            "firstName": "John",
            "lastName": "Douey",
            "email": "john@ew.com",
            "avatar": "/img/avatars/john.jpg",
            "badges": [],
            "role": "Team Member"
        }
    ];

    $scope.myConfig = {
        create: false,
        persist: false,
        valueField: 'email',
        labelField: 'firstName' + 'lastName',
        searchField: ['name', 'email'],
        delimiter: '|',
        placeholder: 'Assign Task',
        maxItems: 1,
        render: {
            item: function (item, escape) {
                var label = item.avatar;
                var caption = item.firstName + item.lastName;
                return '<div>' +
                    '<img class="img-circle-sm" src="' + label + '"/>' +
                    (caption ? '<span class="caption md-pl-15">' + escape(caption) + '</span>' : '') +
                    '</div>';
            },
            option: function (item, escape) {
                var label = item.avatar;
                var caption = item.firstName + item.lastName;
                return '<div>' +
                    '<img class="img-circle-sm" src="' + label + '"/>' +
                    (caption ? '<span class="caption md-pl-15">' + escape(caption) + '</span>' : '') +
                    '</div>';
            }
        },
        onChange: function (value) {
            angular.forEach($scope.myOptions, function (option) {
                if (option.email == value) {
                    $scope.models.selected.owner = option.firstName + ' ' + option.lastName;
                    $scope.models.selected.ownerImage = option.avatar;
                    $scope.models.selected.ownerEmail = option.email;
                }
            })
        }

    };

    $scope.statusOptions = [
        {value: 'New'},
        {value: 'In Progress'},
        {value: 'Complete'},
        {value: 'Blocked'}
    ];

    $scope.statusConfig = {
        create: false,
        persist: false,
        valueField: 'value',
        labelField: 'value',
        delimiter: '|',
        placeholder: 'Pick Status',
        maxItems: 1
    };

    $scope.models = {
        selected: null
    };

    $scope.closeRightSidebar = function () {
        if ($controls.hasClass('rightbar-show')) {
            $controls.removeClass('rightbar-show').addClass('rightbar-hidden');
        }
    };

    $scope.openRightSidebar = function () {
        if ($controls.hasClass('rightbar-hidden')) {
            $controls.removeClass('rightbar-hidden').addClass('rightbar-show');
        }
    };

    $scope.dndSelectedFn = function (task) {
        $scope.models.selected = task;
        $scope.models.selectedAction = 'Edit';
        $scope.openRightSidebar();
    };

    $scope.editTask = function () {
        $scope.models.selected = $scope.fbTasks[index];
        $scope.models.selectedAction = 'Edit';
        $scope.openRightSidebar();
    };
    $scope.addNewTask = function () {
        $scope.models.selected = {};
        $scope.models.selectedAction = 'Add';
        $scope.openRightSidebar();
    };

    $scope.deleteTask = function (index) {
        var record = $scope.fbTasks.$getRecord(index);
        record.status = 'deleted';
        $scope.fbTasks.$save(record).then(function (ref) {
            notify('Task Deleted : ' + $scope.fbTasks.$getRecord(ref.key).description);
        })
    };

    $scope.save = function (task) {
        if (task.$id) {
            $scope.saveTask(task);
        } else {
            $scope.addTask(task);
        }
    };
    $scope.addTask = function (task) {
        $scope.fbTasks.$add(task).then(function (ref) {
            $scope.closeRightSidebar();
            notify('New Task Added');
        }, function (err) {
            $scope.closeRightSidebar();
            notify('Error Adding New Task' + err);
        });
    };

    $scope.saveTask = function (task) {
        $scope.fbTasks.$save(task).then(function (ref) {
            $scope.closeRightSidebar();
            notify('Task Saved : ' + $scope.fbTasks.$getRecord(ref.key).description);
        });
    };

    $scope.cancelEditItem = function (index) {
        $scope.closeRightSidebar();
    }
    $scope.onTimeSet = function (newDate, oldDate) {
        $('#dLabel').dropdown('toggle');
    }
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
