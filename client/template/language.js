/**
 * Created by yeslkoh on 2015. 11. 12..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.directive('commitLanguage', function(){
        return {
            restrict: 'E',
            templateUrl: 'template/language.html',
            controller: 'langController',
            scope: {}
            //controllerAs: 'Chartist'
        };
    });
})(angular);