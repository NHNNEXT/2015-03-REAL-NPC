/**
 * Created by jwlee on 2015. 10. 22..
 */
(function(angular) {
    'use strict';

    var app = angular.module('npcApp', ['ngRoute']);

    app.config(function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl:'/template/main.html'
        });

    });
})(angular);
