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

/**
 * Get commits
 * Parameters:
 *  since   string  Only commits from this date will be returned. 'YYYY-MM-DD' format.
 *  until   string  Only commits until this date will be returned. 'YYYY-MM-DD' format.
 */
router.get('/commits', function(req, res) {
    var query = {};
    var since = req.query.since;
    var until = req.query.until;

    // new Date() with 'YYYY-MM-DD' returns ISO date (not Local time),
    // so we use 'YYYY/MM/DD' format.
    if (since) {
        var firstDay = new Date(since.replace('-', '/'));
        query.date = query.date || {};
        query.date.$gte = firstDay;
    }
    if (until) {
        var lastDay = new Date(until.replace('-', '/'));
        query.date = query.date || {};
        query.date.$lte = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate() + 1);
    }

    Commit.find(query, function(err, commits) {
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
            var commitDate = getLocalDateString(commit.date);
            if (commitDate in data) {
                data[commitDate]++;
            }
        });

        res.status(200).send(data);
    });
});

module.exports = router;