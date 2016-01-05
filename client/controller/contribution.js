/**
 * Created by jwlee on 2015. 11. 10..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('contributionController', function($routeParams, $scope, $http, Util) {
        var groupId = $routeParams.groupId;
        var PERIOD_MONTH = 12;

        var today = new Date(),
            tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
            startDate = new Date(today.getFullYear(), today.getMonth() - PERIOD_MONTH, today.getDate());

        var width = 630,
            height = 150,
            cellSize = width / (PERIOD_MONTH * 4 + 1) - 2; // cell size

        var format = d3.time.format("%Y-%m-%d");

        var color = d3.scale.quantize()
            .domain([0, 10])
            .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

        var svg = d3.select(".contribution").selectAll("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "RdYlGn")
            .append("g")
            .attr("transform", "translate(15, 40)");

        var month = svg.selectAll(".month")
            .data(d3.time.months(startDate, today))
            .enter().append("text")
            .attr("transform", function(d) {
                var month = Math.floor(Util.dateDiffInDays(d3.time.month(startDate), d3.time.month(d)) / 7);
                return "translate(" + (month * 11 - 3) + "," + -1 + ")";
            })
            .attr("fill", "white")
            .attr("class", "month")
            .text(function(d) {
                return d3.time.format('%b')(d);
            });

        var rect = svg.selectAll(".day")
            .data(d3.time.days(startDate, tomorrow))
            .enter().append("rect")
            .attr("class", "day")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function(d) {
                var week = Math.floor(Util.dateDiffInDays(d3.time.week(startDate), d3.time.week(d)) / 7);
                console.log('week: ', week);
                week = (week >= 0) ? week : week + 52;
                return week * cellSize;
            })
            .attr("y", function(d) { return d.getDay() * cellSize; })
            .datum(format);

        rect.append("title")
            .text(function(d) { return d; });

        $http.get('/groups/' + groupId + '/contributions').success(function(data) {
            rect.filter(function(d) { return d in data; })
                .attr("class", function(d) { return "day " + color(data[d]); })
                .select("title")
                .text(function(d) { return d + ": " + data[d] + " commits"; });
        });
    });
})(angular);