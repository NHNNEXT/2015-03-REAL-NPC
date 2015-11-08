/**
 * Created by Ellen on 2015. 11. 8..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('ppmmCommitController', function($scope, $http) {
        var chartData = [
            {
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "Recover2-3"
            },
            {
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Recover2-4"
            },
            {
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Recover3-7"
            },
            {
                color: "blue",
                highlight: "lightblue",
                label: "Recover3-8"
            },
            {
                color: "purple",
                highlight: "lightpurple",
                label: "Recover3-9"
            },
            {
                color: "black",
                highlight: "gray",
                label: "Recover4-10"
            }

        ];

        var recoverMap = {
            "zerohouse": "2-3",
            "yskoh": "2-4",
            "ellen24h": "2-4",
            "jinuskr": "4-10",
            "hataeho1": "2-4",
            "HwangJJung": "2-4",
            "dragonist": "2-4",
            "030ii": "2-4",
            "hyes": "2-3",
            "milooy": "2-4",
            "hyeyeounj": "2-3",
            "kyoungchinseo": "else",
            "godrmnext": "else"
        };

        var ppmmCount = [];
        var range = 6;
        for (var i = 0; i < range; i++) {
            ppmmCount[i] = 0;
        }

        var ctx = document.getElementById("ppmmCommit").getContext("2d");

        $http.get('http://localhost:3000/commits').success(function(data) {
            data.forEach(function(commit) {
                console.log("commit.name: ", commit.name);
                var recover = recoverMap[commit.name];
                console.log("recover: ", recover);
                var index;
                switch (recover) {
                    case "2-3":
                        ppmmCount[0]++;
                        break;
                    case "2-4":
                        ppmmCount[1]++;
                        break;
                    case "3-7":
                        ppmmCount[2]++;
                        break;
                    case "3-8":
                        ppmmCount[3]++;
                        break;
                    case "3-9":
                        ppmmCount[4]++;
                        break;
                    case "4-10":
                        ppmmCount[5]++;
                        break;
                }
            });
            console.log(ppmmCount);
            var chart = new Chart(ctx).Doughnut(ppmmCount);
            document.getElementById('ppmmCommitLegend').innerHTML = chart.generateLegend();
        });
    });
})(angular);