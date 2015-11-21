/**
 * Created by Ellen on 2015. 11. 8..
 */

function getLocalDateString(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year +
        ((month < 10) ? '-0' : '-') + month +
        ((day < 10) ? '-0' : '-') + day;
}

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.filter('percent', function() {
        return function(ratio) {
            return Math.round(ratio * 1000) / 10 + '%';
        };
    });
    app.controller('ppmmCommitController', function($scope, $http) {
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
        var groups = ['2-3', '2-4', '3-7', '3-8', '3-9', '4-10'];
        var members = recoverMap;

        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        var since = 'since=' + getLocalDateString(startDate);
        $http.get('http://localhost:3000/commits?' + since).success(function(data) {
            var totalLine = 0;
            var chartData = groups.map(function(name) {
                return {
                    'name': name,
                    'lines': 0
                };
            });

            // Count all addition from data
            var additions = {};
            data.forEach(function(commit) {
                var group = members[commit.name] || 'else';
                additions[group] = additions[group] || 0;
                additions[group] += commit.addition;
            });

            // Update groups by chartData
            chartData.forEach(function(group) {
                group.lines = additions[group.name] || 0;
                totalLine += group.lines;
                return group;
            });

            // Sort groups by chartData
            chartData.sort(function(a, b) {
                return b.lines - a.lines;
            });

            chartData.forEach(function(data, index) {
                data.ratio = data.lines / totalLine;
                data.className = 'series series-' + index;
            });

            // Calculate width and height
            // 1st group (left side)
            chartData[0].x      = 0;
            chartData[0].y      = 0;
            chartData[0].width  = chartData[0].lines / totalLine;
            chartData[0].height = 1;

            // other groups (right side)
            var lines = 0;
            var rightTotal = totalLine - chartData[0].lines;
            for (var index = 1; index < chartData.length; index++) {
                chartData[index].x      = chartData[0].width;
                chartData[index].y      = lines / rightTotal;
                chartData[index].width  = 1 - chartData[0].width;
                chartData[index].height = chartData[index].lines / rightTotal;
                lines += chartData[index].lines;
            }

            $scope.chartData = chartData;
        });
    });
})(angular);