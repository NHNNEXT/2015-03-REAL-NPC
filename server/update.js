'use strict';

var request = require('request');
var Repo = require('./model/repo');
var Commit = require('./model/commit');

function update() {
    /* GET commit page. */
    Repo.find(function(err, repos) {
        if (err) {
            console.log("error " + err);
        }
        repos.forEach(function(repo) {
            request({
                url: 'https://api.github.com/repos/' + repo.owner + '/' + repo.name + '/commits',
                headers: {
                    'User-Agent': 'request',
                    'Authorization': 'Basic bmV4dG5wYzp0anN0bWRndXMx'
                }
            }, function(err, response, body) {
                var commits = JSON.parse(body);
                commits.forEach(function(data) {
                    fetchCommit(data.sha, repo.owner, repo.name);
                });
            });
        });
    });
}

function fetchCommit(sha, owner, name) {
    Commit.find({sha: sha}, function(err, commits) {
        if(err) {
            console.log(err);
        }
        if(commits.length == 0) {
            request({
                url: 'https://api.github.com/repos/' + owner + '/' + name + '/commits/' + sha,
                headers: {
                    'User-Agent': 'request',
                    'Authorization': 'Basic bmV4dG5wYzp0anN0bWRndXMx'
                }
            }, function(err, response, body) {
                var commit = JSON.parse(body);
                var commitData = new Commit({
                    sha: sha,
                    owner: owner,
                    repoName: name,
                    date: commit.commit.author.date,
                    addition: commit.stats.additions,
                    deletion: commit.stats.deletions,
                    name: commit.author.login
                });
                commitData.save();
            });
        }
    });
}

module.exports = update;