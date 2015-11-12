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
    var data = {};
    var today = new Date();

    for (var i = 0; i < 365; ++i) {
        var date = new Date(today.getFullYear(), today.getMonth(), -i);
        data[date.toISOString().split('T')[0]] = 0;
    }

    Commit.find(function(err, commits) {
        commits.forEach(function(commit) {
            var commitDate = new Date(commit.date).toISOString().split('T')[0];
            if (commitDate in data) {
                data[commitDate]++;
            }
        });

        res.status(200).send(data);
    });
});

module.exports = router;