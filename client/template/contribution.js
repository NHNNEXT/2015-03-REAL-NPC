/**
 * Created by jwlee on 2015. 11. 10..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.directive('contribution', function(){
        return {
            restrict: 'E',
            templateUrl: 'template/contribution.html',
            controller: 'contributionController',
            scope: {}
        }
    });
})(angular);