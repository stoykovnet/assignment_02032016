var app = angular.module('ums', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

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