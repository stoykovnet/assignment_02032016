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
            })

            // if user is already logged in he or she will be redirected to home.
            .state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'AuthenticationCtrl',
                onEnter: ['$state', 'auth', function ($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })

            // if user is already logged in he or she will be redirected to home.
            .state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthenticationCtrl',
                onEnter: ['$state', 'auth', function ($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            });

        $urlRouterProvider.otherwise('home');
    }
]);

app.controller('MainCtrl', [
    '$scope',
    function ($scope) {

    }]);

app.controller('AuthenticationCtrl', ['$scope', '$state', 'auth',
    function ($scope, $state, auth) {
        $scope.user = {};

        /*
         *  Register user, on fail changes state to home.
         */
        $scope.register = function () {
            auth.register($scope.user)
                .error(function (error) {
                    $scope.error = error;
                })
                .then(function () {
                    $state.go('home');
                });
        };

        $scope.login = function () {
            auth.login($scope.user)
                .error(function (error) {
                    $scope.error = error;
                })
                .then(function () {
                    $state.go('home')
                });
        };
    }]);

app.controller('NavigationCtrl', ['$scope', 'auth',
    function ($scope, auth) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
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
        };

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
            return $http.post('/authentication/register', user)
                .success(function (data) {
                    auth.saveToken(data.token);
                });
        };

        /*
         * Send user credentials to server to log him or her in.
         * On success a token will be saved, otherwise user should retry logging in.
         */
        auth.login = function (user) {
            return $http.post('/authentication/login', user)
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