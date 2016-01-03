/**
 * Created by Ellen Seon on 2016. 1. 3..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.directive('todayCommitCount', function(){
        return {
            restrict: 'E',
            templateUrl: 'template/todayCommitCount.html',
            controller: 'todayCommitCountController',
            scope: {}
        };
    });
})(angular);