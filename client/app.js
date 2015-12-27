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
                controller: 'CheckLogin',
                templateUrl: '/template/check.html'
            }).when('/main', {
                templateUrl: '/template/main.html'
            }).when('/login', {
                templateUrl: '/template/login.html'
            }).when('/manage', {
                templateUrl: '/template/manageGroup.html',
                controller: 'ManageGroup',
                scope: {}
            }).otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('authInterceptor');
    }).factory('authInterceptor', function($rootScope, $q, $cookies, $window) {
        return {
            // Intercept 401s and redirect you to login
            responseError: function(response) {
                if (response.status === 401) {
                    $window.location.href = '/login';
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
