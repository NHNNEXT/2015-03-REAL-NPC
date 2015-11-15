/**
 * Created by Ellen on 2015. 11. 8..
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('ppmmCommitController', function($scope, $http) {

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

        // commitCount를 바탕으로 sorting 되고 나서도 recover를 알 수 있어야 하기 때문에 object로 이루어진 배열로 구현함
        // key값을 object로 주고 value를 commitCount로 해도 되지 않을까 생각했지만, 나중에 추가될 key-value가 더 있기 때문에 각 항목을 따로 둠

        var ppmmCount = [
            {
                "recover": "2-3",
                "commitCount": 0
            },
            {
                "recover": "2-4",
                "commitCount": 0
            },
            {
                "recover": "3-7",
                "commitCount": 0
            },
            {
                "recover": "3-8",
                "commitCount": 0
            },
            {
                "recover": "3-9",
                "commitCount": 0
            },
            {
                "recover": "4-10",
                "commitCount": 0
            }
        ];
        //var range = 6;
        //for (var i = 0; i < range; i++) {
        //    ppmmCount[i] = 0;
        //}

        //var ctx = document.getElementById("ppmmCommit").getContext("2d");

        $http.get('http://localhost:3000/commits').success(function(data) {
            data.forEach(function(commit) {
                console.log("commit.name: ", commit.name);
                var recover = recoverMap[commit.name];
                console.log("recover: ", recover);
                var index;
                switch (recover) {
                    case "2-3":
                        ppmmCount[0].commitCount++;
                        break;
                    case "2-4":
                        ppmmCount[1].commitCount++;
                        break;
                    case "3-7":
                        ppmmCount[2].commitCount++;
                        break;
                    case "3-8":
                        ppmmCount[3].commitCount++;
                        break;
                    case "3-9":
                        ppmmCount[4].commitCount++;
                        break;
                    case "4-10":
                        ppmmCount[5].commitCount++;
                        break;
                }
            });
            // 비동기로 처리되어서 commitCount가 전부 들어가고 나서 다음 과정이 처리될지가 걱정되지만, 우선 구현

            // ppmmCount 배열을 commitCount의 value를 기준으로 sorting
            ppmmCount.sort(function (a, b) {
               if (a.commitCount < b.commitCount) {
                   return 1;
               }
               if (a.commitCount > b.commitCount) {
                   return -1;
               }
               // a = b
               return 0;
            });

            // 각 commitCount가 전체에서 차지하는 %를 계산해서 object에 새로운 property로 넣음
            // 일단, 전체 commitCount 계산
            var totalCommitCount = 0;
            for (var i = 0; i < ppmmCount.length; i++) {
                totalCommitCount += ppmmCount[i].commitCount;
            }

            // % 계산해서 object에 새로운 property로 넣기
            for (var j = 0; j < ppmmCount.length; j++) {
                ppmmCount[j].percent = (ppmmCount[j].commitCount / totalCommitCount) * 100;
            }

            // svg를 이용하여 색을 칠할 때 필요한 x, y, width, height를 계산해서 넣음
            // 1, 2등은 나머지 등수와 다른 형식이기 때문에 먼저 넣음
            ppmmCount[0].x = 0;
            ppmmCount[0].y = 0;
            ppmmCount[0].width = ppmmCount[0].percent;
            ppmmCount[0].height = 100;
            ppmmCount[1].x = ppmmCount[0].percent;
            ppmmCount[1].y = 0;
            ppmmCount[1].width = 100 - ppmmCount[0].percent;
            ppmmCount[1].height = (ppmmCount[1].percent/(100-ppmmCount[0].percent))*100;

            // 3등부터 나머지 등수까지 넣음, 아래에 첨부한 svg 부분 로직 참고
            for (var k = 2; k < ppmmCount.length; k++) {
                ppmmCount[k].x = ppmmCount[0].percent;
                ppmmCount[k].y = ppmmCount[k-1].percent/(100-ppmmCount[0].percent)*100 + ppmmCount[k-1].y;
                ppmmCount[k].width = 100 - ppmmCount[0].percent;
                ppmmCount[k].height = (ppmmCount[k].percent/(100-ppmmCount[0].percent))*100;
            }

            // 원색 color
            var colorset = ["#FDB45C","#F7464A","#31C0FF","blue","purple","green"];
            // blue계열 color
            //var colorset = ["#31C0FF", "#68CDFF", "#2CACE5", "#4E9ABF", "#64BFE5", "#386A7F"]
            for (var c = 0; c < ppmmCount.length; c++) {
                ppmmCount[c].fill = colorset[c];
            }

            console.log(ppmmCount);

        });
        // ng-repeat를 이용하여 template에 구현
        $scope.ppmmCounts = ppmmCount;
    });})(angular);

// svg 부분 로직 참고자료
//<svg baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="250px" height="250px">
//        <!-- 바탕 -->
//    <rect width="100%" height="100%" fill="#31C0FF" />
//        <!-- 1등 -->
//    <rect width="{{1등}}%" height="100%" fill="#68CDFF" />
//        <!-- 2등 -->
//    <rect x = "{{1등}}" width="100-{{1등}}%" height="{{2등}}%" fill="#2CACE5" />
//        <!-- 3등 -->
//    <rect x = "{{1등}}" y = "{{2등}}%" width="100-{{1등}}%" height = "{{3등}}%" fill="#4E9ABF"/>
//        <!-- 4등 -->
//    <rect x = "{{1등}}" y = "{{2등+3등}}%" width="100-{{1등}}%" height="{{4등}}%" fill="#64BFE5"/>
//        <!-- 5등 -->
//    <rect x = "{{1등}}" y = "{{2등+3등+4등}}%" width="100-{{1등}}%" height="{{5등}}%" fill="#386A7F"/>
//        <!-- 5등 -->
//    <rect x = "{{1등}}" y = "{{2등+3등+4등+5등}}%" width="100-{{1등}}%" height="{{6등}}%" fill="#386A7F"/>
//</svg>