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

        var commitTimeCount = [];
        var range = 5;
        for (var i = 0; i < range; i++) {
            commitTimeCount[i] = 0;
        }
        var finishCount = 0;

        var ctx = document.getElementById("commitTime").getContext("2d");

        $http.get('http://localhost:3000/repos').success(function(data) {
            data.forEach(function(repo) {
                finishCount++;
                // 오늘 날짜 구해서 파라미터로 넣기
                $http.get('https://api.github.com/repos/' + repo.owner + '/' + repo.name + '/commits').success(function(commits) {
                    commits.forEach(function(commit) {
                        var dateWithTime = new Date(commit.commit.author.date);
                        var time = dateWithTime.getHours();

                        if (time < 7) {
                            commitTimeCount[4]++;
                        } else if (time < 11) {
                            commitTimeCount[0]++;
                        } else if (time < 17) {
                            commitTimeCount[1]++;
                        } else if (time < 21) {
                            commitTimeCount[2]++;
                        } else {
                            commitTimeCount[3]++;
                        }
                    });
                    var series = commitTimeCount.map(function(count, i) {
                        chartData[i].value = count;
                        return chartData[i];
                    });
                    if (--finishCount == 0) {
                        var chart = new Chart(ctx).Doughnut(series);
                        document.getElementById('commitTimeLegend').innerHTML = chart.generateLegend();
                    }
                });
            });
        });
    });
})(angular);