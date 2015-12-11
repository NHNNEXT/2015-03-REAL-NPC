/**
 * Created by jwlee on 2015. 11. 10..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('contributionController', function($scope, $http) {
        var PERIOD_MONTH = 6;

        var today = new Date(),
            tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
            startDate = new Date(today.getFullYear(), today.getMonth() - PERIOD_MONTH, today.getDate());

        var width = 400,
            height = 200,
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

        svg.append("text")
            .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
            .attr("fill", "white")
            .attr("class", "year")
            .text(2015);

        var rect = svg.selectAll(".day")
            .data(d3.time.days(startDate, tomorrow))
            .enter().append("rect")
            .attr("class", "day")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function(d) { return (d3.time.weekOfYear(d) - d3.time.weekOfYear(startDate)) * cellSize; })
            .attr("y", function(d) { return d.getDay() * cellSize; })
            .datum(format);

        rect.append("title")
            .text(function(d) { return d; });

        $http.get('/contributions').success(function(data) {
            rect.filter(function(d) { return d in data; })
                .attr("class", function(d) { return "day " + color(data[d]); })
                .select("title")
                .text(function(d) { return d + ": " + data[d] + " commits"; });
        });
    });
})(angular);