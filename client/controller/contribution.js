/**
 * Created by jwlee on 2015. 11. 10..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('contributionController', function($scope, $http) {
        var today = new Date(2015, 10, 5),
            startDate = new Date(2015, 5, 1);

        var width = 400,
            height = 200,
            cellSize = 16; // cell size

        var percent = d3.format(".1%"),
            format = d3.time.format("%Y-%m-%d");

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
            .data(d3.time.days(startDate, today))
            .enter().append("rect")
            .attr("class", "day")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function(d) { return (d3.time.weekOfYear(d) - d3.time.weekOfYear(startDate)) * cellSize; })
            .attr("y", function(d) { return d.getDay() * cellSize; })
            .datum(format);

        rect.append("title")
            .text(function(d) { return d; });

        //svg.selectAll(".month")
        //    .data(d3.time.months(startDate, today))
        //    .enter().append("path")
        //    .attr("class", "month")
        //    .attr("d", monthPath);

        $http.get('http://localhost:3000/contributions').success(function(data) {
            rect.filter(function(d) { return d in data; })
                .attr("class", function(d) { return "day " + color(data[d]); })
                .select("title")
                .text(function(d) { return d + ": " + percent(data[d]); });
        });

        //function monthPath(t0) {
        //    var t1 = t0.getMonth() < new Date().getMonth() ? new Date(t0.getFullYear(), t0.getMonth() + 1, 0) : new Date(),
        //        d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0) - d3.time.weekOfYear(startDate),
        //        d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1) - d3.time.weekOfYear(startDate);
        //    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
        //        + "H" + w0 * cellSize + "V" + 7 * cellSize
        //        + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
        //        + "H" + (w1 + 1) * cellSize + "V" + 0
        //        + "H" + (w0 + 1) * cellSize + "Z";
        //}
    });
})(angular);