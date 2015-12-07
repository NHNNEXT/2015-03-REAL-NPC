/**
 * Created by yeslkoh on 2015. 11. 1..
 */

(function(angular) {
    'use strict';
    var app = angular.module('npcApp');
    app.controller('commitTimeController', function($scope, $http) {
        var chartData = [
            {
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "Morning"
            },
            {
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Daytime"
            },
            {
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Evening"
            },
            {
                color: "blue",
                highlight: "lightblue",
                label: "Night"
            },
            {
                color: "purple",
                highlight: "lightpurple",
                label: "After midnight"
            }
        ];
        chartData.forEach(function(data) { data.value = 0; });

        $http.get('http://localhost:3000/commits').success(function(data) {
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
            var chart = new Chart(ctx).Doughnut(chartData);
            document.getElementById('commitTimeLegend').innerHTML = chart.generateLegend();
        });
    });
})(angular);