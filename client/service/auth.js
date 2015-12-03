/**
 * Created by jwlee on 12/3/15.
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.factory('Auth', function($cookies) {
        var currentUser = $cookies.getObject('token') || {};

        return {
            logout: function() {
                $cookies.remove('token');
                currentUser = {};
            },

            getCurrentUser: function() {
                return currentUser;
            },

            isLoggedIn: function() {
                return currentUser.hasOwnProperty('role');
            },

            isAdmin: function() {
                return currentUser.role === 'admin';
            },

            getToken: function() {
                return $cookies.get('token');
            }
        }
    });
})(angular);