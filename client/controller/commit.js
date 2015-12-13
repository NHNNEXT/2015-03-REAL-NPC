/**
 * Created by jwlee on 2015. 10. 23.
 */

(function(angular) {
    'use strict';

    function getLocalDateString(date) {
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        return year +
            ((month < 10) ? '-0' : '-') + month +
            ((day < 10) ? '-0' : '-') + day;
    }

    var rangeOptions = [
        { title: "1 week", days: 7},
        { title: "2 week", days: 14},
        { title: "1 month", days: 30},
        { title: "3 month", days: 90}
    ];

    var app = angular.module('npcApp');

    app.controller('commitController', function($scope, $http) {
        var data = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        var ctx = document.getElementById("commit").getContext("2d");
        var chart = new Chart(ctx).Line(data);

        var self = this;
        var today = new Date(); // 오늘 날짜를 받아온다.
        var range = 10; // 일단 기간, view에서 어떤 게 눌렸느냐에 따라 유동적으로 변경되어야 한다

        var labels = [];
        for(var i = range-1 ; i >= 0 ; i-- ) {
            labels[i] = getLocalDateString(today);
        }
        console.log(labels);
        console.log(new Date());
        var commitCount = {};

        $http.get('http://localhost:3000/repos').success(function(data) {
            data.forEach(function(repo, i) {
                commitCount[repo.name] = {};
            });
        });

        $http.get('http://localhost:3000/commits').success(function(data) {
            data.forEach(function(commits, i) {
                var dateWithTime = new Date(commits.date);
                if (!commitCount[commits.repoName][getLocalDateString(dateWithTime)]) {
                    commitCount[commits.repoName][getLocalDateString(dateWithTime)] = 1;
                }
                else {
                    commitCount[commits.repoName][getLocalDateString(dateWithTime)]++;
                }
            });
            console.log(commitCount);
        });
    });
})(angular);