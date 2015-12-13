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
                    var option = {
                        //Boolean - Whether we should show a stroke on each segment
                        segmentShowStroke : true,

                        //String - The colour of each segment stroke
                        segmentStrokeColor : "transparent",

                        //Number - The width of each segment stroke
                        segmentStrokeWidth : 2,

                        //Number - The percentage of the chart that we cut out of the middle
                        percentageInnerCutout : 50, // This is 0 for Pie charts

                        //Number - Amount of animation steps
                        animationSteps : 100,

                        //String - Animation easing effect
                        animationEasing : "easeOutBounce",

                        //Boolean - Whether we animate the rotation of the Doughnut
                        animateRotate : true,

                        //Boolean - Whether we animate scaling the Doughnut from the centre
                        animateScale : false,

                        //String - A legend template
                        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

                    }
                    if (--finishCount == 0) {
                        var chart = new Chart(ctx).Doughnut(series, option);
                        document.getElementById('commitTimeLegend').innerHTML = chart.generateLegend();
                    }
                });
            });
        });
    });
})(angular);