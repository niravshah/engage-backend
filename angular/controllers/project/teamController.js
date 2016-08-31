app.controller('teamController', function ( $http, $scope, $rootScope, $localStorage) {

    $scope.awardBadge = function () {
        $scope.openRightSidebar('badge-sidebar');
    };

    $scope.writeReview = function () {
        $scope.openRightSidebar('review-sidebar');
    };

    $scope.saveReview = function () {
    };

    $scope.saveAward = function () {
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
                    $scope.models.selected.badgeImg = option.img;
                    $scope.models.selected.badgeName = option.name;
                }
            })
        }

    };
});