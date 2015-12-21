/**
 * Created by jwlee on 2015. 10. 23.
 */

(function(angular) {
    'use strict';

    var today = new Date();
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // a and b are javascript Date objects
    function dateDiffInDays(a, b) {
        // Discard the time and time-zone information.
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    function getLocalDateString(date, simple) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var simpleForm = month + ((day < 10) ? '-0' : '-') + day;
        return simple ?
            simpleForm : year + ((month < 10) ? '-0' : '-') + simpleForm;
    }

    var lineColor = ["rgba(220,220,220,1)", "rgba(151,187,205,1)", "rgba(151,187,205,1)"];
    var fillColor = ["rgba(220,220,220,0.2)", "rgba(151,187,205,0.2)", "rgba(151,187,205,0.2)"];

    var app = angular.module('npcApp');
    app.controller('commitController', function($scope, $http) {
        var controller = this;
        var range = 10; // 일단 기간, view에서 어떤 게 눌렸느냐에 따라 유동적으로 변경되어야 한다
        var ctx = document.getElementById('commit').getContext('2d');

        var startDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - range
        );
        var since = 'since=' + getLocalDateString(startDate);
        $http.get('/commits?' + since).success(function(data) {
            var commitData = {};
            /* commitData Structure
             commitData = { repoName: repoData, ... }
             repoData = [ commitData, ... ] (index: dateDiff)
             */

            data.forEach(function(commit) {
                var repoName = commit.owner + commit.repoName;
                var date = new Date(commit.date);

                if (! (repoName in commitData)) {
                    // Make new array with default value 0
                    commitData[repoName] =
                        Array.apply(null, Array(range)).map(function() { return 0; });
                }

                var dateDiff = dateDiffInDays(date, today);
                if (dateDiff < range) {
                    commitData[repoName][dateDiff]++;
                }
            });

            var chartData = {
                labels : Array.apply(null, Array(range))
                    .map(function(_, index) {
                        var date = new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            today.getDate() - range + index
                        );
                        return getLocalDateString(date, true);
                    }),
                datasets : Object.keys(commitData).map(function(repoName, index) {
                    return {
                        label: repoName,
                        fillColor: fillColor[index] || fillColor[0],
                        strokeColor: lineColor[index] || lineColor[0],
                        pointColor: lineColor[index] || lineColor[0],
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: lineColor[index] || lineColor[index],
                        data: commitData[repoName]
                    };
                })
            };

            if (controller.chart) controller.chart.destroy();
            controller.chart = new Chart(ctx).Line(chartData);
        });
    });
})(angular);