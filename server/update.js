'use strict';

var request = require('request');
var Repo = require('./model/repo');
var Commit = require('./model/commit');
var Language = require('./model/languages');

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

        repos.forEach(function(repo) {
            request({
                url: 'https://api.github.com/repos/' + repo.owner + '/' + repo.name + '/languages',
                headers: {
                    'User-Agent': 'request',
                    'Authorization': 'Basic bmV4dG5wYzp0anN0bWRndXMx'
                }
            }, function(err, response, body) {
                console.log(response.headers);
                //upsert하여 넣는다. 똑같으면 안 넣고, 라인 수가 다르면 넣고 이전 것을 지워야 한다.
                var langData = JSON.parse(body);
                var query = {owner: repo.owner, name: repo.name};
                var update = {languages: langData};
                console.log('langData: ', langData);
                console.log('query: ', query);
                var options = { upsert: true};
                Language.findOneAndUpdate(query, update, options, function(err, result){
                    if(err){
                        console.log(err);
                    }
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