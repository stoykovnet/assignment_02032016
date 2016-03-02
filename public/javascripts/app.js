var app = angular.module('ums', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl'
            });

        $urlRouterProvider.otherwise('home');
    }
]);

app.controller('MainCtrl', [
    '$scope',
    function ($scope) {
        $scope.users = [
            {
                _id: 'testtesten',
                email: 'test@testen.com',
                firstName: 'test',
                lastName: 'testen',
                role: 'user'
            },
            {
                _id: 'testentest',
                email: 'test@testen.com',
                firstName: 'test',
                lastName: 'testen',
                role: 'user'
            }
        ];

        $scope.registerUser = function () {
            if (!$scope.email
                || !$scope.password
                || !$scope.firstName
                || !$scope.lastName
            )
                return;

            _saveRegistration();

            _clearRegistrationScope();
        };

        function _saveRegistration() {
            $scope.users.push({
                email: $scope.email,
                password: $scope.password,
                firstName: $scope.firstName,
                lastName: $scope.lastName
            });
        }

        function _clearRegistrationScope() {
            $scope.email = '';
            $scope.password = '';
            $scope.firstName = '';
            $scope.lastName = '';
        }

    }]);

/**
 * Use auth to maintain a session for user.
 */
app.factory('auth', ['$http', '$window',
    function ($http, $window) {
        var auth = {};

        auth.saveToken = function (token) {
            $window.localStorage['ums-user-token'] = token;
        };

        auth.getToken = function () {
            return $window.localStorage['ums-user-token'];
        }

        /*
         * Check if current user has a valid token.
         */
        auth.isLoggedIn = function () {
            var token = auth.getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.expire > Date.now() / 1000;
            } else {
                return false;
            }
        };

        /*
         * Get user's email if he or she is logged in.
         */
        auth.currentUser = function () {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.email;
            }
        };

        /*
         * Send user data to server to register him or her.
         * On success a token will be saved, otherwise user should retry registration.
         */
        auth.register = function (user) {
            return $http.post('/authentication/post', user)
                .success(function (data) {
                    auth.saveToken(data.token);
                });
        };

        /*
         * Send user credentials to server to log him or her in.
         * On success a token will be saved, otherwise user should retry logging in.
         */
        auth.logIn = function (user) {
            return $http.post('/login', user)
                .success(function (data) {
                    auth.saveToken(data.token);
                });
        };

        /*
         * Remove user token to log him or her out.
         */
        auth.logOut = function () {
            $window.localStorage.removeItem('ums-user-token');
        };

        return auth;
    }]);