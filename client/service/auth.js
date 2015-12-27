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
                return ('role' in currentUser);
            },

            isAdmin: function() {
                return currentUser.role === 'auth';
            },

            httpHeader: function(headers) {
                headers = headers || {};
                if ($cookies.getObject('token')) {
                    headers.Authorization = 'Bearer ' + $cookies.getObject('token').token;
                }
                return headers;
            },

            getToken: function() {
                return currentUser.token;
            }
        };
    });
})(angular);