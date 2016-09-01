app.controller('teamController', function ( $http, $scope, $rootScope, $localStorage) {

    $scope.init = function(){
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
        console.log($scope.currentReceiver, $scope.currentReview,$scope.user);
    };

    $scope.saveAward = function () {
        console.log($scope.currentReceiver, $scope.currentAward,$scope.user);
    };

    $rootScope.badgeSelectOptions = [{name:'badge1',img:'/img/badges/badge1.png'}];

    $rootScope.badgeSelectConfig = {
        create: false,
        persist: false,
        valueField: 'name',
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
                if (option.name == value) {
                    $scope.currentAward.badgeImg = option.img;
                    $scope.currentAward.badgeName = option.name;
                }
            })
        }

    };

    $rootScope.teamSelectConfigTeamCtrl = {
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
                    $scope.currentReceiver.receiverName = option.firstName + ' ' + option.lastName;
                    $scope.currentReceiver.receiverImage = option.avatar;
                    $scope.currentReceiver.receiverEmail = option.email;
                }
            })
        }

    };
});