/**
 * Created by Ellen on 2015. 11. 8..
 */

(function(angular) {
    'use strict';

    function getLocalDateString(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return year +
            ((month < 10) ? '-0' : '-') + month +
            ((day < 10) ? '-0' : '-') + day;
    }

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
    app.controller('ppmmCommitController', function($scope, $http) {
        var controller = this;
        var today = new Date();

        function teamName(commit) {
            return (commit.owner + '-' + commit.repoName)
                .split('-').slice(-2).join('-');
        }

        function recoverName(commit) {
            var recoverMap = {
                "zerohouse": "2-3",
                "yskoh": "2-4",
                "ellen24h": "2-4",
                "jinuskr": "4-10",
                "hataeho1": "2-4",
                "HwangJJung": "2-4",
                "dragonist": "2-4",
                "030ii": "2-4",
                "hyes": "2-3",
                "milooy": "2-4",
                "hyeyeounj": "2-3"
            };
            return recoverMap[commit.name] || 'else';
        }

        function makeChart() {
            var range = controller.range;
            var startDate = new Date(
                today.getFullYear() - (range.years || 0),
                today.getMonth() - (range.months || 0),
                today.getDate() - (range.days || 0)
            );
            var since = 'since=' + getLocalDateString(startDate);

            var groupMapper = teamName;
            var groupNames;
            switch (controller.mode) {
                case 'recover':
                    groupMapper = recoverName;
                    groupNames = ['2-3', '2-4', '3-7', '3-8', '3-9', '4-10'];
                    break;
            }

            $http.get('/commits?' + since).success(function(data) {
                var totalLine = 0;
                var groups = {};

                data.forEach(function(commit) {
                    var name = groupMapper(commit);
                    groups[name] = groups[name] || {'lines': 0, 'commits': 0};
                    groups[name].lines += commit.addition;
                    groups[name].commits++;
                });

                var keys = groupNames || Object.keys(groups);
                var chartData =
                    keys.filter(function(name) {    // remove 'else' group
                        return name != 'else';
                    }).map(function(name) {         // set lines and commit
                        var group = groups[name] || {'lines': 0, 'commits': 0};
                        totalLine += group.lines;
                        return {
                            'name': name,
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

        $scope.setMode = function(mode) {
            controller.mode = mode;
            makeChart();
        };
        $scope.isModeSelected = function(mode) {
            return (controller.mode == mode);
        }

        controller.range = rangeOptions[0];
        controller.mode = 'team';
        makeChart();
    });
})(angular);