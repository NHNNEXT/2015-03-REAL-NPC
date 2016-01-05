/**
 * Created by Ellen Seon on 2016. 1. 3..
 */

(function(angular) {
    'use strict';

    var today = new Date();
    var className = ['first', 'second', 'third'];
    var app = angular.module('npcApp');
    app.controller('recentCommitMsgController', function($routeParams, $scope, $http, $timeout, Util) {
        var groupId = $routeParams.groupId;
        var interval = 1000 * 60;   // 60 sec = 1 min

        var update = function() {
            $http.get('/groups/' + groupId + '/commits?limit=3').success(function (data) {
                var commits = data.commits;

                $scope.commits = commits.map(function(commit, index) {
                    return {
                        author: commit.name,
                        message: commit.message.length > 54 ?
                        commit.message.substring(0, 50) + '...' :
                            commit.message,
                        url: commit.url,
                        time: Util.dateDiffMessage(new Date(commit.date), today),
                        className: className[index] + '-msg',
                        className2: className[index] + '-msg-a'
                    };
                });
            });

            $timeout(update, interval);
        };

        update();
    });
})(angular);
