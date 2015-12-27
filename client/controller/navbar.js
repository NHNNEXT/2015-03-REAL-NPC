/**
 * Created by jwlee on 2015. 11. 16..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('NavbarCtrl', function ($scope, $location, Auth) {
        $scope.menu = [{
            'title': 'Dashboard',
            'link': '/'
        }, {
            'title': 'Setting',
            'link': '/manage'
        }];

        $scope.isCollapsed = true;
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.isAdmin = Auth.isAdmin;
        $scope.getCurrentUser = Auth.getCurrentUser;

        $scope.logout = function() {
            Auth.logout();
            $location.path('/');
        };

        $scope.isActive = function(route) {
            return route === $location.path();
        };
    });
})(angular);