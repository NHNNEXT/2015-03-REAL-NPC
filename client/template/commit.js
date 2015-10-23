/**
 * Created by jwlee on 2015. 10. 23..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.directive('commit', function(){
       return {
           restrict: 'E',
           templateUrl: 'template/commit.html',
           controller: 'commitController',
           controllerAs: 'Chartist'
       }
    });
})(angular);