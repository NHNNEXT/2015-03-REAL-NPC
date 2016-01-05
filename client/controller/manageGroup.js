/**
 * Created by jwlee on 12/14/15.
 */

(function(angular) {
    'use strict';

    var app = angular.module('npcApp');
    app.controller('ManageGroup', function ($scope, $http, Auth) {
        $scope.groups = [];
        $scope.selectedGroup = '';
        $scope.repos = [];
        $scope.searchResults = [];

        $http.get('/groups', {headers: Auth.httpHeader()}).success(function(groups) {
            $scope.groups = groups;
            selectGroup($scope.groups[0]);
        });

        function selectGroup(group) {
            $scope.selectedGroup = group;
            $scope.repos = [];
            if (! group) { return; }

            $http.get('/groups/' + group._id + '/repos', {headers: Auth.httpHeader()}).success(function(repos) {
                $scope.repos = repos;
            });
        }

        function addGroup(groupName) {
            $http.post('/groups/' + groupName, '', {headers: Auth.httpHeader()}).success(function(group) {
                $scope.groups.push(group);
                selectGroup(group);
            });
        }

        function removeGroup(group) {
            // TODO
        }

        function searchRepositories(keyword) {
            if (! keyword) {
                return console.log('Repository search: no keyword');
            }
            $http.get('https://api.github.com/search/repositories?q=' + keyword).success(function(data) {
                $scope.searchResults = data.items.map(function(repo) {
                    return {
                        owner: repo.owner.login,
                        name: repo.name,
                        url: repo.html_url,
                        description: repo.description
                    };
                });
            });
        }

        function addRepositories(group, searchResults) {
            if (! group) { return; }
            var selectedRepositories = searchResults.filter(function(repository) {
                return repository.selected;
            }).map(function(repository) {
                return {
                    owner: repository.owner,
                    name: repository.name
                };
            });
            $http.post(
                '/groups/' + group._id + '/repos', selectedRepositories,
                {headers: Auth.httpHeader()}
            ).success(function() {
                selectGroup(group);
            })
        }

        function removeRepository(group, repository) {
            if (! group) { return; }
            $http.delete(
                '/groups/' + group._id + '/repos/' + repository._id,
                {headers: Auth.httpHeader()}
            ).success(function() {
                selectGroup(group);
            });
        }

        $scope.selectGroup = selectGroup;
        $scope.addGroup = addGroup;
        $scope.removeGroup = removeGroup;
        $scope.searchRepositories = searchRepositories;
        $scope.addRepositories = addRepositories;
        $scope.removeRepository = removeRepository;
    });
})(angular);
