/**
 * Created by yeslkoh on 2015. 11. 12..
 */

(function (angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('langController', function ($scope, $http) {
        var results=[[], [], [], [], [], [], []];
        var langIndexMap = {
            'C': 0,
            'C++': 0,
            'Java': 1,
            'JavaScript': 2,
            'Objective-C': 3,
            'Python': 4,
            'HTML': 5,
            'CSS': 5,
            'other': 6
        }

        $http.get('http://localhost:3000/lang').success(function (data) {
            data.forEach(function (teamData, teamIndex) {
                var langCount = [0, 0, 0, 0, 0, 0, 0];
                for (var language in teamData.languages) {
                    var langIndex;

                    if (language in langIndexMap) {
                        langIndex = langIndexMap[language];
                    } else {
                        langIndex = langIndexMap['other'];
                    }

                    langCount[langIndex] += teamData.languages[language];
                }

                langCount.forEach(function (count, langIndex) {
                    var langObj = {'x': teamIndex, 'y': count};
                    results[langIndex].push(langObj);
                });
            });

            var n = 7, // number of layers
                m = 4, // number of samples per layer
                stack = d3.layout.stack(),
                layers = stack(results),
                yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
                yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

            var margin = {top: 40, right: 10, bottom: 20, left: 10},
                width = 300 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
                .domain(d3.range(m))
                .rangeRoundBands([0, width], .08);

            var y = d3.scale.linear()
                .domain([0, yStackMax])
                .range([height, 0]);

            var color = d3.scale.linear()
                .domain([0, n - 1])
                .range(["#aad", "#556"]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .tickSize(0)
                .tickPadding(6)
                .orient("bottom");

            var svg = d3.select("#commit-language").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var layer = svg.selectAll(".layer")
                .data(layers)
                .enter().append("g")
                .attr("class", "layer")
                .style("fill", function(d, i) { return color(i); });

            var rect = layer.selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("x", function(d) { return x(d.x); })
                .attr("y", height)
                .attr("width", x.rangeBand())
                .attr("height", 0);

            rect.transition()
                .delay(function(d, i) { return i * 10; })
                .attr("y", function(d) { return y(d.y0 + d.y); })
                .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            function transitionStacked() {
                y.domain([0, yStackMax]);

                rect.transition()
                    // .duration(500)
                    // .delay(function(d, i) { return i * 10; })
                    .attr("y", function(d) { return y(d.y0 + d.y); })
                    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
                    .transition()
                    .attr("x", function(d) { return x(d.x); })
                    .attr("width", x.rangeBand());
            }

        });
    });
})(angular);