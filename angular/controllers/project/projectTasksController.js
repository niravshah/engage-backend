app.controller('projectTasksController', function ($scope, notify, $localStorage,$firebaseArray,$firebaseObject) {

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
        $scope.models.selectedTaskConversation = $scope.getSelectedTaskComments(task);
    };

    $scope.getSelectedTaskComments = function(task){
        var dataId = $localStorage.currentUser.tenant + "-" + $scope.projectId;
        var commentsRef = firebase.database().ref().child(dataId).child("comments").child(task.$id);
        return $firebaseArray(commentsRef);
    };

    $scope.addTaskComment = function(task,comment){

        var dataId = $localStorage.currentUser.tenant + "-" + $scope.projectId;
        var commentsRef = firebase.database().ref().child(dataId).child("comments").child(task.$id);
        var comments = $firebaseArray(commentsRef);

        var newComment = {
            message: comment,
            created: $scope.user.shortid,
            timestamp: Date.now()
        };

        comments.$add(newComment).then(function (ref) {
            console.log('Comment Added', ref);
        }, function (err) {
            notify("Could not add comment." + err);
        });
    };

    $scope.deleteTaskComment = function(commentKey,taskId){

        var dataId = $localStorage.currentUser.tenant + "-" + $scope.projectId;
        var commentRef = firebase.database().ref().child(dataId).child("comments").child(taskId).child(commentKey);
        var comment = $firebaseObject(commentRef);
        comment.$remove().then(function(ref){
            console.log('Comment Deleted',ref);
        },function(err){
            notify("Could not delete comment." + err);
        });
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