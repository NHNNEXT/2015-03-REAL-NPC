/**
 * Created by jwlee on 2015. 11. 16..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp')
    app.controller('NavbarCtrl', function ($scope, $location) {
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

        $scope.isActive = function(route) {
            return route === $location.path();
        };
    });
})(angular);