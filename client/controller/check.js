/**
 * Created by jwlee on 12/13/15.
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('CheckLogin', function ($location, Auth) {
        if (Auth.isLoggedIn()) {
            $location.path('/main');
        } else {
            $location.path('/login');
        }
    });
})(angular);
