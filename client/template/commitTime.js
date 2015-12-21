/**
 * Created by yeslkoh on 2015. 11. 1..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.directive('commitTime', function(){
        return {
            restrict: 'E',
            templateUrl: 'template/commitTime.html',
            controller: 'commitTimeController',
            scope: {}
        };
    });
})(angular);