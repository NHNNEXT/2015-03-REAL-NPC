var express = require('express');
var router = express.Router();
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

module.exports = router;