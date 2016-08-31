app.directive('afterRender', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'A',
        terminal: true,
        transclude: false,
        link: function (scope, element, attrs) {
            $timeout(scope.$eval(attrs.afterRender), 0);  //Calling a scoped method
        }
    };
    return def;
}]);


app.controller('headerController', function ($window, $scope, $rootScope, $localStorage) {

    $scope.logout = function () {
        delete $localStorage.currentUser;
        $window.location.href = '/login';
    };

    $scope.sidebarToggle = function () {
        var $sidebar = angular.element('#contentw');
        if ($sidebar.hasClass('sidebar-show')) {
            $sidebar.removeClass('sidebar-show');
            $sidebar.addClass('sidebar-hide');
        } else {
            $sidebar.addClass('sidebar-show');
            $sidebar.removeClass('sidebar-hide');
        }
    };

    $scope.disableLeftBar = function(){
        angular.element('#contentw').removeClass('sidebar-show').addClass('sidebar-hide');
        $scope.showLeftBarToggle = false;
    };

    $scope.sidebarToggle2 = function(){
        var $navigation = $('#navigation'),
            $dropdowns = $navigation.find('ul').parent('li'),
            $a = $dropdowns.children('a'),
            $notDropdowns = $navigation.children('li').not($dropdowns),
            $controls = $('#controls'),
            $notDropdownsLinks = $notDropdowns.children('a');

        if( $dropdowns.length > 0 ) {

            $dropdowns.addClass('dropdown');

            var $submenus = $dropdowns.find('ul >.dropdown');
            $submenus.addClass('submenu');

            $a.append('<i class="fa fa-plus"></i>');

            $a.on('click', function(event) {
            
                var $this = $(this),
                    $parent = $this.parent('li'),
                    $openSubmenu = $('.submenu.open');

                if (!$parent.hasClass('submenu')) {
                    $dropdowns.not($parent).removeClass('open').find('ul').slideUp();
                }

                $openSubmenu.not($this.parents('.submenu')).removeClass('open').find('ul').slideUp();
                $parent.toggleClass('open').find('>ul').stop().slideToggle();
                event.preventDefault();
            });

            $dropdowns.on('mouseenter', function() {
                $controls.addClass('dropdown-open');
            });

            $dropdowns.on('mouseleave', function() {
                $controls.removeClass('dropdown-open');
            });

            $notDropdownsLinks.on('click', function() {
                $dropdowns.removeClass('open').find('ul').slideUp();
            });

            var $activeDropdown = $('.dropdown>ul>.active').parent();

            $activeDropdown.css('display', 'block');
        }
    };

    $scope.init = function () {
        if ($localStorage.currentUser) {
            $scope.user = $localStorage.currentUser;
        }
        $scope.showLeftBarToggle = true;
    };

    $scope.init();
});
