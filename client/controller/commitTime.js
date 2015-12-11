/**
 * Created by yeslkoh on 2015. 11. 1..
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
    app.controller('commitTimeController', function($scope, $http) {
        var controller = this;
        var today = new Date();

        function makeChart() {
            var range = controller.range;
            var startDate = new Date(
                today.getFullYear() - (range.years || 0),
                today.getMonth() - (range.months || 0),
                today.getDate() - (range.days || 0)
            );
            var since = 'since=' + getLocalDateString(startDate);

            var chartData = [
                {
                    color: "#FDB45C",
                    highlight: "#FFC870",
                    label: "Morning",
                    tooltip: '07:00 ~ 11:00'
                },
                {
                    color:"#F7464A",
                    highlight: "#FF5A5E",
                    label: "Daytime",
                    tooltip: '11:00 ~ 17:00'
                },
                {
                    color: "#46BFBD",
                    highlight: "#5AD3D1",
                    label: "Evening",
                    tooltip: '17:00 ~ 21:00'
                },
                {
                    color: "blue",
                    highlight: "#2266FF",
                    label: "Night",
                    tooltip: '21:00 ~ 24:00'
                },
                {
                    color: "purple",
                    highlight: "#9370DB",
                    label: "After midnight",
                    tooltip: '0:00 ~ 07:00'
                }
            ];
            chartData.forEach(function(data) { data.value = 0; });

            $http.get('/commits?' + since).success(function(data) {
                data.forEach(function(commit) {
                    var dateTime = new Date(commit.date);
                    var time = dateTime.getHours();

                    if (time < 7) {
                        chartData[4].value++;
                    } else if (time < 11) {
                        chartData[0].value++;
                    } else if (time < 17) {
                        chartData[1].value++;
                    } else if (time < 21) {
                        chartData[2].value++;
                    } else {
                        chartData[3].value++;
                    }
                });

                var ctx = document.getElementById("commitTime").getContext("2d");
                if (controller.chart) controller.chart.destroy();
                controller.chart = new Chart(ctx).Doughnut(chartData);
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
        makeChart();
    });
})(angular);