/**
 * Created by jwlee on 2015. 10. 23.
 */

(function(angular) {
    'use strict';

    var today = new Date();

    var rangeOptions = [
        { title: "1 week", days: 7 },
        { title: "1 month", months: 1 },
        { title: "3 months", months: 3 },
        { title: "6 months", months: 6 }
    ];

    var lineColor = ["rgba(220,220,220,1)", "rgba(151,187,205,1)", "rgba(151,187,205,1)"];
    var fillColor = ["rgba(220,220,220,0.2)", "rgba(151,187,205,0.2)", "rgba(151,187,205,0.2)"];

    var app = angular.module('npcApp');
    app.controller('commitController', function($routeParams, $scope, $http, Util) {
        var controller = this;
        var groupId = $routeParams.groupId;
        var ctx = document.getElementById('commit').getContext('2d');

        function makeChart() {
            var range = controller.range.days || controller.range.months * 30;
            var mode = 'day';
            var startDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - range
            );
            var since = 'since=' + Util.getLocalDateString(startDate);

            $http.get('/groups/' + groupId + '/commits?' + since + '&mode=' + mode).success(function (data) {
                var repositories = data.repositories;
                var commits = data.commits;
                var commitData = {};
                /* commitData Structure
                 commitData = { repoName: repoData, ... }
                 repoData = [ commitData, ... ] (index: dateDiff)
                 */

                commits.forEach(function (commit) {
                    var repoId = commit.repository;
                    var date = new Date(commit.date);

                    if (!(repoId in commitData)) {
                        // Make new array with default value 0
                        commitData[repoId] =
                            Array.apply(null, Array(range)).map(function () {
                                return 0;
                            });
                    }

                    var dateDiff = Util.dateDiffInDays(date, today);
                    if (dateDiff < range) {
                        commitData[repoId][dateDiff]++;
                    }
                });

                var chartData = {
                    labels: Array.apply(null, Array(range))
                        .map(function (_, index) {
                            var date = new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate() - range + index
                            );
                            return Util.getLocalDateString(date, true);
                        }),
                    datasets: Object.keys(commitData).map(function (repoId, index) {
                        return {
                            label: repositories[repoId],
                            fillColor: fillColor[index] || fillColor[0],
                            strokeColor: lineColor[index] || lineColor[0],
                            pointColor: lineColor[index] || lineColor[0],
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: lineColor[index] || lineColor[index],
                            data: commitData[repoId]
                        };
                    })
                };

                if (controller.chart) controller.chart.destroy();
                controller.chart = new Chart(ctx).Line(chartData);

                $scope.rangeOptions = rangeOptions;
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