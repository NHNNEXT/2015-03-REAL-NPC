/**
 * Created by Ellen Seon on 2016. 1. 3..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.directive('recentCommitMsg', function(){
        return {
            restrict: 'E',
            templateUrl: 'template/recentCommitMsg.html',
            controller: 'Controller',
            scope: {}
        };
    });
})(angular);