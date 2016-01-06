/**
 * Created by jwlee on 2015. 11. 16..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('SidebarCtrl', function($scope, $routeParams, $location, Group) {
        var groupId = $routeParams.groupId;
        var path = $location.path().split('/');

        Group.getGroups(function(err, groups) {
            groups.forEach(function(group) {
                group.link = '/' + (path[0] || path[1]) + '/' + group._id;
            });

            if (groups.length == 0) {
                $location.url('/manage');
            }

            if (groups.length > 0 && ! groupId) {
                $location.url(groups[0].link);
            }

            $scope.groups = groups;
        });

        $scope.isActive = function(group) {
            return group._id == groupId;
        };
    });
})(angular);