/**
 * Created by yeslkoh on 2015. 11. 12..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('langController', function($scope, $http) {
        var chartData = [
            {
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "C"
            },
            {
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "C++"
            },
            {
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "JavaScript"
            },
            {
                color: "blue",
                highlight: "lightblue",
                label: "Java"
            },
            {
                color: "purple",
                highlight: "lightpurple",
                label: "Python"
            }
        ];

        //var langCount = [];
        //var range = 5;
        //for (var i = 0; i < range; i++) {
        //    lang[i] = 0;
        //}
        //var finishCount = 0;

        var ctx = document.querySelector('#commit-language').getContext("2d");

        $http.get('http://localhost:3000/repos').success(function(data){
            var usedLangs = [];
            data.forEach(function(repo){
                $http.get('https://api.github.com/repos/'+ repo.owner + '/' + repo.name + '/languages').success(function(data) {
                    //각 obj의 key값을 가져와서 랭귀지로.
                    console.log(Object.keys(data));
                    //usedLangs.push(Object.keys(data));
                    usedLangs.push(Object.keys(data));

                    //이 key값들 하나씩만 있는 하나의 배열로..
                    //같은 키값을 가지고 있으면 벨류들을 다 더하기.
                    //키 값을 차트의 레이블로 넣는다.

                    //--> 우선 랭귀지 받아온 것을 우리 서버에 저장을 하고, 후 여기서 꺼내는 방식으로.
                        });
                console.log(usedLangs);

                });
        });
    });
})(angular);