/**
 * Created by jwlee on 2015. 11. 16..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp')
    app.controller('NavbarCtrl', function ($scope, $location, Auth) {
        $scope.menu = [{
            'title': 'Dashboard',
            'link': '/'
        }, {
            'title': 'Some',
            'link': '/some'
        }, {
            'title': 'things',
            'link': '/things'
        }];

        $scope.isCollapsed = true;
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.isAdmin = Auth.isAdmin;
        $scope.getCurrentUser = Auth.getCurrentUser;

        $scope.logout = function() {
            Auth.logout();
            $location.path('/login');
        };

        $scope.isActive = function(route) {
            return route === $location.path();
        };
    });
})(angular);