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