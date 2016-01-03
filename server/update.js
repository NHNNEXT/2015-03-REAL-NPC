'use strict';

var request = require('request');
var Repo = require('./model/repo');
var Commit = require('./model/commit');
var Language = require('./model/languages');

var defaultInterval = 60 * 1000;    // 60 sec
var updateInterval = defaultInterval;

function update() {
    /* GET commit page. */
    Repo.find(function(err, repos) {
        if (err) { return console.log(new Error(err)); }
        repos.forEach(function(repo) {
            request({
                url: 'https://api.github.com/repos/' + repo.owner + '/' + repo.name + '/commits',
                headers: {
                    'User-Agent': 'request',
                    'Authorization': 'Basic bmV4dG5wYzp0anN0bWRndXMx'
                }
            }, function(err, response, body) {
                if (err) { return console.log(new Error(err)); }
                if (response.statusCode == 403) {
                    updateInterval = defaultInterval * 10;
                    return console.log(response.statusCode, body);
                }

                var commits = body ? JSON.parse(body) : [];
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
                if (err) { return console.log(new Error(err)); }
                if (response.statusCode == 403) {
                    updateInterval = defaultInterval * 10;
                    return console.log(response.statusCode, body);
                }

                //upsert하여 넣는다. 똑같으면 안 넣고, 라인 수가 다르면 넣고 이전 것을 지워야 한다.
                var langData = JSON.parse(body);
                var query = {owner: repo.owner, name: repo.name};
                var update = {languages: langData};
                var options = { upsert: true};
                Language.findOneAndUpdate(query, update, options, function(err, result) {
                    if (err) { return console.log(new Error(err)); }
                });
            });
        });
    });

    setTimeout(update, updateInterval);
    updateInterval = defaultInterval;
}

function fetchCommit(sha, owner, name) {
    Commit.find({sha: sha}, function(err, commits) {
        if (err) { return console.log(new Error(err)); }
        if(commits.length == 0) {
            request({
                url: 'https://api.github.com/repos/' + owner + '/' + name + '/commits/' + sha,
                headers: {
                    'User-Agent': 'request',
                    'Authorization': 'Basic bmV4dG5wYzp0anN0bWRndXMx'
                }
            }, function(err, response, body) {
                if (err) { return console.log(new Error(err)); }
                if (response.statusCode == 403) {
                    updateInterval = defaultInterval * 10;
                    return console.log(response.statusCode, body);
                }

                var commit = JSON.parse(body);
                // TODO: Get commiter (or someone who push that commit) when commit.author is null
                if (commit.author) {
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
                }
            });
        }
    });
}

module.exports = update;