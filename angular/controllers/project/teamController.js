app.controller('teamController', function ($http, $scope, $rootScope, notify) {

    $scope.init = function () {
        $scope.initScopeVars();
    };

    $scope.initScopeVars = function () {
        $scope.currentReceiver = {};
        $scope.currentAward = {};
        $scope.currentReview = {};
        $scope.currentReview.private = false;
    };

    $scope.init();

    $scope.awardBadge = function () {
        $scope.openRightSidebar('badge-sidebar');
    };

    $scope.writeReview = function () {
        $scope.openRightSidebar('review-sidebar');
    };

    $scope.saveReview = function () {
        //console.log($scope.currentReceiver, $scope.currentReview,$scope.user);
        var payload = {};
        payload.receiver = $scope.currentReceiver.receiver;
        payload.review = $scope.currentReview;
        payload.date = new Date();
        payload.from = {};
        payload.from.firstName = $scope.user.firstName;
        payload.from.lastName = $scope.user.lastName;
        payload.project = $scope.info.name;
        var url = '/api/user/' + $scope.currentReceiver.receiver + '/review';
        $http.post(url, payload).then(function (res) {
            console.log('Response', res);
            if (res.data.success == true) {
                $scope.initScopeVars();
                $scope.closeRightSidebar('review-sidebar');
                notify("Review Added. Thanks.");
            } else {
                notify("Error  Adding Review. " + res.data.message);
            }
        }, function (err) {
            console.log('Error', err);
            notify("Error Adding Review. " + err.message);
        });

    };

    $scope.saveAward = function () {
        //console.log($scope.currentReceiver, $scope.currentAward,$scope.user);
        var payload = {};
        payload.receiver = $scope.currentReceiver.receiver;
        payload.award = $scope.currentAward.badge;
        payload.from = $scope.user.shortid;
        var url = '/api/user/' + $scope.currentReceiver.receiver + '/badge';
        $http.post(url, payload).then(function (res) {
            console.log('Response', res);
            if (res.data.success == true) {
                $scope.initScopeVars();
                $scope.closeRightSidebar('badge-sidebar');
                notify("Badge Awarded. Thanks.");
            } else {
                notify("Error Awarding Badge. " + res.data.message);
            }
        }, function (err) {
            console.log('Error', err);
            notify("Error Awarding Badge. " + err.message);
        });

    };

    $rootScope.badgeSelectOptions = [{id: '1', name: 'badge1', img: '/img/badges/badge1.png'}];

    $rootScope.badgeSelectConfig = {
        create: false,
        persist: false,
        valueField: 'id',
        labelField: 'name',
        searchField: ['name'],
        delimiter: '|',
        placeholder: 'Select Award',
        maxItems: 1,
        render: {
            item: function (item, escape) {
                var label = item.img;
                var caption = item.name;
                return '<div>' +
                    '<img class="img-circle-sm" src="' + label + '"/>' +
                    (caption ? '<span class="caption md-pl-15">' + escape(caption) + '</span>' : '') +
                    '</div>';
            },
            option: function (item, escape) {
                var label = item.img;
                var caption = item.name;
                return '<div>' +
                    '<img class="img-circle-sm" src="' + label + '"/>' +
                    (caption ? '<span class="caption md-pl-15">' + escape(caption) + '</span>' : '') +
                    '</div>';
            }
        },
        onChange: function (value) {
            angular.forEach($scope.badgeSelectOptions, function (option) {
                if (option.id == value) {
                    $scope.currentAward.badgeImg = option.img;
                    $scope.currentAward.badgeName = option.name;
                }
            })
        }

    };

    $rootScope.teamSelectConfigTeamCtrl = {
        create: false,
        persist: false,
        valueField: 'shortid',
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
                if (option.shortid == value) {
                    $scope.currentReceiver.receiverName = option.firstName + ' ' + option.lastName;
                    $scope.currentReceiver.receiverImage = option.avatar;
                    $scope.currentReceiver.receiverEmail = option.email;
                }
            })
        }

    };
});