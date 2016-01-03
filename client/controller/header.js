/**
 * Created by jwlee on 1/3/16.
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('HeaderCtrl', function ($scope, $location, Auth) {
        $scope.menu = [{
            'title': 'Dashboard',
            'link': '/main'
        }, {
            'title': 'Commits',
            'link': '/commits'
        }, {
            'title': 'Commit Lines',
            'link': '/commitlines'
        }, {
            'title': 'Commit time',
            'link': '/committime'
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
