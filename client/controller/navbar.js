/**
 * Created by jwlee on 1/3/16.
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('NavbarCtrl', function ($scope, $routeParams, $location, Auth) {
        var groupId = $routeParams.groupId;
        var path = groupId ? '/' + groupId : '';

        $scope.menu = [{
            'title': 'Dashboard',
            'link': '/main' + path
        }, {
            'title': 'Commits',
            'link': '/commits' + path
        }, {
            'title': 'Commit Lines',
            'link': '/commitlines' + path
        }, {
            'title': 'Commit time',
            'link': '/committime' + path
        }];

        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.logout = function() {
            Auth.logout();
            $location.path('/');
        };

        $scope.isActive = function(route) {
            return route === $location.path();
        };
    });
})(angular);
