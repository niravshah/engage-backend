app.controller('rootViewController', function ($window, $http, $scope, $rootScope,$localStorage, $firebaseAuth, $firebaseArray, notify, usSpinnerService,$stateParams) {
    $scope.init = function () {

        $rootScope.keys = Object.keys;

        $scope.disableLeftBar();

        $scope.badges=[{id:1,url:'/img/badges/badge1.png'}];

        if ($localStorage.currentUser) {

            $rootScope.team = [];
            $rootScope.teamSelectOptions = [];

            $scope.user = {};
            $scope.user.firstName = $localStorage.currentUser.firstName;
            $scope.user.lastName = $localStorage.currentUser.lastName;
            $scope.user.avatar = $localStorage.currentUser.avatar;
            $scope.user.shortid = $localStorage.currentUser.shortid;
            $scope.token = $localStorage.currentUser.token;
            $scope.projectId = $stateParams.id;


            $http.get('/api/projects/' + $scope.projectId + '/members').then(function (response) {
                if (response.data.success == true) {
                    $rootScope.team =response.data.users;
                    $rootScope.teamSelectOptions.push(response.data.users)
                } else {
                    notify('Could not retrieve Team Members.' + err.message);
                }
            });

            $http.get('/api/projects/' + $scope.projectId + '/info').then(function (response) {
                if (response.data.success == true) {
                    $rootScope.info = response.data.project;
                } else {
                    notify('Could not retrieve Team Members.' + err.message);
                }
            });

            $scope.firebaseToken = $localStorage.currentUser.firebaseToken;
            var dataId = $localStorage.currentUser.tenant + "-" + $scope.projectId;
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

   

    $rootScope.teamSelectConfig = {
        create: false,
        persist: false,
        valueField: 'email',
        labelField: 'firstName' + 'lastName',
        searchField: ['name', 'email'],
        delimiter: '|',
        placeholder: 'Select Team Member',
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
            angular.forEach($scope.teamSelectOptions, function (option) {
                if (option.email == value) {
                    $scope.models.selected.owner = option.firstName + ' ' + option.lastName;
                    $scope.models.selected.ownerImage = option.avatar;
                    $scope.models.selected.ownerEmail = option.email;
                }
            })
        }

    };
});