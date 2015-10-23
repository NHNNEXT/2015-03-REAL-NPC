/**
 * Created by jwlee on 2015. 10. 23..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('commitController', function($scope, $http) {
        var owner = 'NHNNEXT';
        var repo = '2015-03-REAL-NPC';

        $http.get('https://api.github.com/repos/' + owner + '/' + repo + '/commits')
            .success(function(data) {
                $scope.data = data;
            });

        // line chart
        this.lineData = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'test'],
            series: [
                [0, 1, 2, 4, 7, 6, 9, 10, 8, 10, 14, 13, 16, 14, 17, 19, 20, 31, 32, 26, 36, 28, 31, 40, 26, 26, 43, 47, 55, 30],
                [0, 1, 2, 4, 4, 6, 6, 13, 9, 10, 16, 18, 21, 16, 16, 16, 31, 17, 27, 23, 31, 29, 35, 39, 30, 32, 26, 43, 51, 46],
                [0, 1, 3, 4, 6, 5, 11, 9, 11, 11, 13, 15, 14, 22, 20, 15, 31, 27, 25, 25, 36, 30, 37, 29, 29, 39, 40, 49, 34, 35],
                [0, 1, 3, 5, 7, 5, 9, 9, 10, 17, 13, 21, 14, 16, 23, 23, 25, 17, 24, 34, 27, 39, 33, 45, 47, 32, 40, 36, 49, 32],
                [0, 1, 3, 3, 7, 5, 8, 11, 12, 13, 16, 17, 20, 24, 27, 15, 22, 33, 35, 24, 32, 35, 41, 39, 24, 31, 51, 29, 45, 50]
            ]
        };

        this.lineOptions = {
            axisX: {
                labelInterpolationFnc: function (value) {
                    return value;
                }
            }
        };
    });
})(angular);