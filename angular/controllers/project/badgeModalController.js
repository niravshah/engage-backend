app.controller('badgeModalController', function ($scope,$rootScope) {
    $scope.init = function () {
        $rootScope.teamSelectOptions = $rootScope.team;
        $rootScope.teamSelectConfig = {
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
    };

    $scope.init();
});