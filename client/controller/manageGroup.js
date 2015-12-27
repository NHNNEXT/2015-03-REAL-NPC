/**
 * Created by jwlee on 12/14/15.
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('ManageGroup', function ($scope, $http, Auth) {
        $scope.groups = [];
        $scope.repos = [];
        $scope.searchResult = [];

        $http.get('/groups', {headers: Auth.httpHeader()}).success(function(groups) {
            console.log(groups);
            $scope.groups = groups.filter(function(group) { return group.name != ''; });
            console.log($scope.groups);
        });

        var test_data = [
            {owner: 'NHNNEXT', name: '2015-03-REAL-NPC'},
            {owner: 'NHNNEXT', name: '2015-03-REAL-TUTU'},
            {owner: 'NHNNEXT', name: '2015-03-REAL-BNB'}
        ];

        function selectGroup(group) {
            if (! group) {
                $scope.repos = test_data;
                return;
            }
            $http.get('/repos?group=' + group.name, {headers: Auth.httpHeader()}).success(function(repos) {
                console.log(repos);
                $scope.repos = repos;
            }).error(function(data, status) {
                console.log(data, status);
            });
        }

        function searchRepo() {
            var keyword = $scope.keyword;
            if (! keyword) {
                return console.log('Repository search: no keyword');
            }
            $http.get('https://api.github.com/search/repositories?q=' + keyword).success(function(data) {
                console.log(data.items);
                $scope.searchResult = data.items.map(function(repo) {
                    return {
                        owner: repo.owner.login,
                        name: repo.name,
                        url: repo.html_url,
                        description: repo.description
                    };
                });
            });
        }

        selectGroup();

        $scope.search = searchRepo;
    });
})(angular);
