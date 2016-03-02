var app = angular.module('ums', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'HomeCtrl'
            })

            .state('admin', {
                url: '/users',
                templateUrl: '/users.html',
                controller: 'AdminCtrl',
                resolve: {
                    userPromise: ['users', function (users) {
                        return users.getAll();
                    }]
                }
            })

            .state('users', {
                url: '/users/{id}',
                templateUrl: '/user-details.html',
                controller: 'UsersCtrl',
                resolve: {
                    user: ['$stateParams', 'users', function ($stateParams, users) {
                        return users.get($stateParams.id);
                    }]
                }
            })

            .state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function ($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })

            .state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function ($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            });

        $urlRouterProvider.otherwise('home');
    }]);

app.factory('users', ['$http', 'auth',
    function ($http, auth) {
        var u = {
            users: []
        };

        u.getAll = function () {
            return $http.get('/users', {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).error(function (error) {
            }).success(function (data) {
                angular.copy(data, u.users);
            });
        };

        u.get = function (id) {
            return $http.get('/users/' + id, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).then(function (res) {
                res.data;
                return res.data;
            });
        };

        u.update = function (user) {
            return $http.put('/users/' + user._id)
                .success(function (data) {
                    user = data;
                });
        };

        return u;
    }]);

app.factory('auth', ['$http', '$window',
    function ($http, $window) {
        var auth = {};

        auth.saveToken = function (token) {
            $window.localStorage['ums-token'] = token;
        };

        auth.getToken = function () {
            return $window.localStorage['ums-token'];
        };

        auth.isLoggedIn = function () {
            var token = auth.getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.expire > Date.now() / 1000;
            } else {
                return false;
            }
        };

        auth.currentUser = function () {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.email;
            }
        };

        auth.register = function (user) {
            return $http.post('authentication/register', user)
                .success(function (data) {
                    auth.saveToken(data.token);
                });
        };

        auth.logIn = function (user) {
            return $http.post('authentication/login', user)
                .success(function (data) {
                    auth.saveToken(data.token);
                });
        };

        auth.logOut = function () {
            $window.localStorage.removeItem('ums-token');
        };

        return auth;
    }]);

app.controller('HomeCtrl', ['$scope', 'users',
    function ($scope, users) {
        $scope.users = users;
    }]);

app.controller('AdminCtrl', ['$scope', 'users',
    function ($scope, users) {
        $scope.users = users.users;
    }]);

app.controller('UsersCtrl', ['$scope', 'user',
    function ($scope, user) {
        $scope.user = user;
    }]);

app.controller('AuthCtrl', ['$scope', '$state', 'auth',
    function ($scope, $state, auth) {
        $scope.user = {};

        $scope.register = function () {
            auth.register($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $state.go('home');
            });
        };

        $scope.logIn = function () {
            auth.logIn($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $state.go('home');
            });
        };
    }]);

app.controller('NavCtrl', ['$scope', 'auth',
    function ($scope, auth) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }]);