/**
 * Created by jwlee on 2015. 10. 22..
 */
(function(angular) {
    'use strict';

    var app = angular.module('npcApp', ['ngCookies', 'ngRoute']);

    //route등록하는 config
    app.config(function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
        .when('/', {
            templateUrl:'/template/main.html'
        });

        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push();
    }).factory('authInterceptor', function($rootScope, $q, $cookies, $location) {
        return {
            // Add authorization token to headers
            request: function(config) {
                config.headers = config.headers || {};
                if ($cookies.get('token')) {
                    config.headers.Authorization = 'Bearer ' + $cookies.get('token');
                }
                return config;
            },

            // Intercept 401s and redirect you to login
            responseError: function(response) {
                if (response.status === 401) {
                    $location.path('/login');
                    // remove any stale tokens
                    $cookies.remove('token');
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
        };
    });
})(angular);
