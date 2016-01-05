/**
 * Created by jwlee on 1/5/16.
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.factory('Group', function($http, Auth) {
        var groups;
        var selected = '';

        return {
            getGroups: function(callback) {
                $http.get('/groups', {headers: Auth.httpHeader()}).success(function(list) {
                    groups = list;
                    callback(null, groups);
                });
            },
            select: function(groupId) {
                selected = groupId;
            },
            selectedGroup: function() {
                return selected;
            },
            isActive: function(group) {
                return selected == group._id;
            }
        };
    });
})(angular);
