app.controller('projectTasksController', function ($scope, notify, $localStorage,$firebaseArray,$firebaseObject) {

    $scope.tasks = [];
    $scope.tasksPerPage = "3";
    
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


    $scope.dndSelectedFn = function (task) {
        $scope.models.selected = task;
        $scope.models.selectedAction = 'Edit';
        $scope.openRightSidebar('controls');
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
        $scope.closeRightSidebar('controls');
    };
    $scope.onTimeSet = function (newDate, oldDate) {
        $('#dLabel').dropdown('toggle');
    }
});