app.service('AuthService', ['$http', '$window', 'jwtHelper', '$localStorage',
    function ($http, $window, jwtHelper,$localStorage) {

        this.getToken = function () {
            if($localStorage.currentUser) {
                return $localStorage.currentUser.token;
            }else{
                return null
            }
        };

        this.validToken = function () {
            var token = this.getToken();
            if (token != null) {
                var date = jwtHelper.getTokenExpirationDate(token);
                if (typeof date != 'undefined' && date != null) {
                    if (date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                        return false;
                    } else {
                        return true;
                    }
                }else{
                    return false;
                }
            } else {
                return false;
            }
        };

    }
]);