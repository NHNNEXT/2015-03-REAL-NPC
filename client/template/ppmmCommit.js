/**
 * Created by Ellen on 2015. 11. 8..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.directive('ppmmCommit', function(){
        return {
            restrict: 'E',
            templateUrl: 'template/ppmmCommit.html',
            controller: 'ppmmCommitController',
            scope: {}
        }
    });
})(angular);