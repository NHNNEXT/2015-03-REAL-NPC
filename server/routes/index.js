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
    })
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