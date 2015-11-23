var express = require('express');
var router = express.Router();
var request = require('request');
var Repo = require('../model/repo');
var Commit = require('../model/commit');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* GET repositories */
router.get('/repos', function(req, res) {
    Repo.find(function(err, repos) {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).send(repos);
    });
});

/* GET commits */
router.get('/commits', function(req, res) {
    Commit.find(function(err, commits) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(commits);
    });
});

router.get('/contributions', function(req, res) {
    var PERIOD_MONTH = 6;

    function getLocalDateString(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return year +
            ((month < 10) ? '-0' : '-') + month +
            ((day < 10) ? '-0' : '-') + day;
    }

    var today = new Date(),
        tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        startDate = new Date(today.getFullYear(), today.getMonth() - PERIOD_MONTH, today.getDate());

    var data = {};

    for (var i = 0; i < (PERIOD_MONTH * 31); ++i) {
        var date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
        data[getLocalDateString(date)] = 0;
    }

    Commit.find(function(err, commits) {
        commits.forEach(function(commit) {
            var commitDate = getLocalDateString(new Date(commit.date));
            if (commitDate in data) {
                data[commitDate]++;
            }
        });

        res.status(200).send(data);
    });
});

/* GET commit languages*/
router.get('/lang', function(req, res){
    Repo.find(function(err, repos){
        if(err){
            return res.status(500).send(err);
        }
        repos.forEach(function(repo) {
            request({
                url: 'https://api.github.com/repos/' + repo.owner + '/' + repo.name + '/languages',
                headers: {
                    'User-Agent': 'request'
                }
            }, function(err, response, body) {
                var languagesObj = JSON.parse(body);
                console.log(languagesObj);
                //languagesObj.forEach(function(data) {
                    //각 랭귀지 별로의 바이트 수를 카운트
                //});
            });
        });
        res.sendStatus(200);
    });
});

///* GET commit page. */
//router.get('/commit', function(req, res) {
//    Repo.find(function(err, repos) {
//        if (err) {
//            return res.status(500).send(err);
//        }
//        repos.forEach(function(repo) {
//            request({
//                url: 'https://api.github.com/repos/' + repo.owner + '/' + repo.name + '/commits',
//                headers: {
//                    'User-Agent': 'request'
//                }
//            }, function(err, response, body) {
//                var commits = JSON.parse(body);
//                commits.forEach(function(data) {
//                    Commit.update({sha: data.sha}, {
//                        sha: data.sha,
//                        name: data.commit.author.name,
//                        email: data.commit.author.email,
//                        date: data.commit.author.date,
//                        message: data.commit.message,
//                        url: data.commit.url,
//                        commentCount: data.commit.comment_count,
//                        repoName: repo.name,
//                        owner: repo.owner
//                    }, {upsert: true});
//                });
//            });
//        });
//        res.sendStatus(200);
//    });
//});

module.exports = router;