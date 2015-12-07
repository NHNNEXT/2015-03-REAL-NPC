var express = require('express');
var request = require('request');
var passport = require('passport');
var GithubStrategy = require('passport-github2');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var config = require('../config');
var Repo = require('../model/repo');
var Commit = require('../model/commit');
var Language = require('../model/languages');
var User = require('../model/user');

var router = express.Router();
var validateJwt = expressJwt({ secret: config.secrets.session });

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

/* GET commit languages*/
router.get('/lang', function(req, res){
    Language.find(function(err, languages){
        if(err){
            return res.status(500).send(err);
        }
        res.status(200).send(languages);
    });
});

/* Github login - passport setting */
passport.use(new GithubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
}, function(accessToken, refreshToken, profile, done) {
    // Github logged on
    console.log('profile:', profile);
    User.findOne({ 'username': profile.username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            user = new User({
                'username': profile.username,
                'displayName': profile.displayName,
                'email': profile.emails[0].value,
                'role': 'user'
            });
            user.save(function(err) {
                if (err) return done(err);
                done(err, user);
            });
        } else {
            return done(err, user);
        }
    });
}));

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(user) {
    return {
        role: user.role,
        token: jwt.sign({ _id: user.username, role: user.role }, config.secrets.session, { expiresIn: '12h' })
    };
}

/**
 * Verify given token with app secret
 */
function verifyToken(req, res, next) {
    if (!req.headers || !req.headers.authorization) { return next(); }

    var parts = req.headers.authorization.split(' ');
    if (parts.length != 2 || parts[0] != 'Bearer') return next();

    jwt.verify(parts[1], config.secrets.session, function (err, decoded) {
        if (err) return next(err);
        req['user'] = decoded;
        next();
    });
}

/* Github login - routing setting */
router.get('/login', function(req, res) {
    res.redirect('/auth/github');
});
router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        var token = signToken(req.user);
        // Successful authentication, redirect home.
        console.log('Login success, redirect to home...', token);
        res.cookie('token', JSON.stringify(token));
        res.redirect('/');
    });

module.exports = router;