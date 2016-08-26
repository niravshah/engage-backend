app.controller('mainController', function ($window, $http, $scope, $localStorage, $firebaseAuth, $firebaseArray, notify, usSpinnerService,$stateParams) {
    $scope.init = function () {

        angular.element('#contentw').removeClass('sidebar-show').addClass('sidebar-hide');

        if ($localStorage.currentUser) {

            $scope.user = {};
            $scope.user.firstName = $localStorage.currentUser.firstName;
            $scope.user.lastName = $localStorage.currentUser.lastName;
            $scope.user.avatar = $localStorage.currentUser.avatar;
            $scope.user.shortid = $localStorage.currentUser.shortid;
            $scope.token = $localStorage.currentUser.token;
            $scope.projectId = $stateParams.id;

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

});