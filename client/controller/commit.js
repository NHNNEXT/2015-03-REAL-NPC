/**
 * Created by jwlee on 2015. 10. 23..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('commitController', function($scope, $http) {
        var self = this;
        var labels = ['D-9', 'D-8', 'D-7', 'D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'today'];
        var series = [];
        var totalCommitCount = [];
        /* totalCommitCount 배열 초기화 @TODO: 함수로 따로 구현하기 */
        var range = 10;
        for (var i = 0; i < range; i++) {
            totalCommitCount[i] = 0;
        }

        var chart = new Chartist.Line('.ct-chart-commit', {
            labels: ['', '', '', '', '', '', '', '', '', ''],
            series: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        }, {
            low: 0, height:'300px'
        });

        $http.get('http://localhost:3000/repos').success(function(data) {
            data.forEach(function(repo) {
                var repoCommitCount = [];
                for (var i = 0; i < range; i++) {
                    repoCommitCount[i] = 0;
                }
                // 오늘 날짜 구해서 파라미터로 넣기
                $http.get('https://api.github.com/repos/' + repo.owner + '/' + repo.name + '/commits').success(function(commits) {
                    commits.forEach(function(commit) {
                        var dateWithTime = new Date(commit.commit.author.date);
                        var date = new Date(dateWithTime.toLocaleDateString());
                        var today = new Date(new Date().toLocaleDateString());
                        var diffDate = (today - date) / 1000 / 60 / 60 / 24;

                        if (diffDate < range) {
                            totalCommitCount[diffDate]++;
                            repoCommitCount[diffDate]++;
                        }
                    });
                    series.push(repoCommitCount);

                    chart.update({
                        labels: labels,
                        series: series
                    });
                });
            });
            series.push(totalCommitCount);
        });

        // Let's put a sequence number aside so we can use it in the event callbacks
        var seq = 0,
            delays = 40,
            durations = 250;

        // Once the chart is fully created we reset the sequence
        chart.on('created', function() {
            seq = 0;
        });

        // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
        chart.on('draw', function(data) {
            seq++;

            if(data.type === 'line') {
                // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
                data.element.animate({
                    opacity: {
                        // The delay when we like to start the animation
                        begin: seq * delays + 1000,
                        // Duration of the animation
                        dur: durations,
                        // The value where the animation should start
                        from: 0,
                        // The value where it should end
                        to: 0.5
                    }
                });
            } else if(data.type === 'label' && data.axis === 'x') {
                data.element.animate({
                    y: {
                        begin: seq * delays,
                        dur: durations,
                        from: data.y + 100,
                        to: data.y,
                        // We can specify an easing function from Chartist.Svg.Easing
                        easing: 'easeOutQuart'
                    }
                });
            } else if(data.type === 'label' && data.axis === 'y') {
                data.element.animate({
                    x: {
                        begin: seq * delays,
                        dur: durations,
                        from: data.x - 100,
                        to: data.x,
                        easing: 'easeOutQuart'
                    }
                });
            } else if(data.type === 'point') {
                data.element.animate({
                    x1: {
                        begin: seq * delays,
                        dur: durations,
                        from: data.x - 10,
                        to: data.x,
                        easing: 'easeOutQuart'
                    },
                    x2: {
                        begin: seq * delays,
                        dur: durations,
                        from: data.x - 10,
                        to: data.x,
                        easing: 'easeOutQuart'
                    },
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'easeOutQuart'
                    }
                });
            } else if(data.type === 'grid') {
                // Using data.axis we get x or y which we can use to construct our animation definition objects
                var pos1Animation = {
                    begin: seq * delays,
                    dur: durations,
                    from: data[data.axis.units.pos + '1'] - 30,
                    to: data[data.axis.units.pos + '1'],
                    easing: 'easeOutQuart'
                };

                var pos2Animation = {
                    begin: seq * delays,
                    dur: durations,
                    from: data[data.axis.units.pos + '2'] - 100,
                    to: data[data.axis.units.pos + '2'],
                    easing: 'easeOutQuart'
                };

                var animations = {};
                animations[data.axis.units.pos + '1'] = pos1Animation;
                animations[data.axis.units.pos + '2'] = pos2Animation;
                animations['opacity'] = {
                    begin: seq * delays,
                    dur: durations,
                    from: 0,
                    to: 1,
                    easing: 'easeOutQuart'
                };

                data.element.animate(animations);
            }
        });
    });
})(angular);