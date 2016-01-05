/**
 * Created by jwlee on 2015. 10. 22..
 */
(function(angular) {
    'use strict';

    var app = angular.module('npcApp', ['ngCookies', 'ngRoute']);
    app.config(function($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                controller: 'CheckLogin',
                templateUrl: '/template/check.html'
            }).when('/main/:groupId?', {
                controller: 'MainController',
                templateUrl: '/template/main.html'
            }).when('/login', {
                templateUrl: '/template/login.html'
            }).when('/manage', {
                templateUrl: '/template/manageGroup.html',
                controller: 'ManageGroup',
                scope: {}
            }).when('/commits/:groupId?', {
                templateUrl: '/template/hCommits.html'
            }).when('/commitlines/:groupId?', {
                templateUrl: '/template/hCommitLines.html'

            }).when('/committime/:groupId?', {
                templateUrl: '/template/hCommitTime.html'
            }).otherwise({
                redirectTo: '/'
            });

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
