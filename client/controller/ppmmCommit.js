/**
 * Created by Ellen on 2015. 11. 8..
 */

(function(angular) {
    'use strict';

    var rangeOptions = [
        { title: "1 week", days: 7 },
        { title: "1 month", months: 1 },
        { title: "3 months", months: 3 },
        { title: "6 months", months: 6 }
    ];

    var app = angular.module('npcApp');
    app.filter('percent', function($filter) {
        return function(number, fractionSize) {
            return $filter('number')(number * 100, fractionSize || 0) + '%';
        };
    });
    app.controller('ppmmCommitController', function($routeParams, $scope, $http, Util) {
        var controller = this;
        var groupId = $routeParams.groupId;
        var today = new Date();

        function makeChart() {
            var range = controller.range;
            var startDate = new Date(
                today.getFullYear() - (range.years || 0),
                today.getMonth() - (range.months || 0),
                today.getDate() - (range.days || 0)
            );
            var since = 'since=' + Util.getLocalDateString(startDate);

            $http.get('/groups/' + groupId + '/commits?' + since).success(function(data) {
                var repositories = data.repositories;
                var commits = data.commits;
                var totalLine = 0;
                var groups = {};

                commits.forEach(function(commit) {
                    var repoId = commit.repository;
                    groups[repoId] = groups[repoId] || {'lines': 0, 'commits': 0};
                    groups[repoId].lines += commit.addition;
                    groups[repoId].commits++;
                });

                function teamName(repoId) {
                    return Util.simpleName(repositories[repoId]);
                }

                var keys = Object.keys(groups);
                var chartData =
                    keys.map(function(repoId) {         // set lines and commit
                        var group = groups[repoId] || {'lines': 0, 'commits': 0};
                        totalLine += group.lines;
                        return {
                            'name': teamName(repoId),
                            'lines': group.lines,
                            'commits': group.commits
                        };
                    }).sort(function(a, b) {        // sort by lines
                        return b.lines - a.lines;
                    });

                var leftWidth = 0,
                    rightLines = 0,
                    rightTotal;
                chartData.forEach(function(group, index) {
                    group.ratio = group.lines / totalLine;
                    group.className = 'series series-' + index;

                    if (index == 0) {   // left side (1st group)
                        group.x = 0;
                        group.y = 0;
                        group.width = leftWidth = (group.lines / totalLine);
                        group.height = 1;
                        rightTotal = (totalLine - group.lines) || 1;
                    } else {            // right side (other groups)
                        group.x = leftWidth;
                        group.y = rightLines / rightTotal;
                        group.width = 1 - leftWidth;
                        group.height = group.lines / rightTotal;
                        rightLines += group.lines;
                    }
                });

                $scope.chartData = chartData;
            });
        }

        $scope.rangeOptions = rangeOptions;
        $scope.setRange = function(range) {
            controller.range = range;
            makeChart();
        };
        $scope.isRangeSelected = function(range) {
            return (controller.range == range);
        };

        controller.range = rangeOptions[0];
        if (groupId) { makeChart(); }
    });
})(angular);