/**
 * Created by jwlee on 1/5/16.
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('MainController', function ($routeParams, $scope) {
        $scope.groupId = $routeParams.groupId;
    });
})(angular);
