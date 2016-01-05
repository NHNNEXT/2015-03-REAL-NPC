/**
 * Created by Ellen Seon on 2016. 1. 3..
 */

(function(angular) {
    'use strict';

    var today = new Date();

    var app = angular.module('npcApp');
    app.controller('todayCommitCountController', function($routeParams, $scope, $http, Util) {
        var groupId = $routeParams.groupId;
        var since = 'since=' + Util.getLocalDateString(today);
        $http.get('/groups/' + groupId + '/commits?' + since).success(function (data) {
            var repositories = data.repositories;
            var commits = data.commits;

            $scope.commitCount = commits.length;
            $scope.commitGoal = Object.keys(repositories).length;
        });
    });
})(angular);
