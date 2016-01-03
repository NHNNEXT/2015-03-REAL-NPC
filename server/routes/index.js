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
var Group = require('../model/group');

var router = express.Router();
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Get groups
 */
router.get('/groups', validateJwt, function(req, res) {
    var user = req.user._id;
    Group.find({'user': user}, function(err, groups) {
        if (err) { return res.status(500).send(err); }

        res.status(200).send(
            groups.map(function(group) { return group.name; })
        );
    })
});

/**
 * Add new group
 * Parameters:
 *  group   String  group name
 */
router.post('/groups/:group', validateJwt, function(req, res) {
    var user = req.user._id;
    var group = req.params.group;
    Group.find({'user': user, 'name': group}, function(err, groups) {
        if (err) { return res.status(500).send(err); }
        if (groups.length > 0) { return res.status(409).send('Group already exists'); }

        var newGroup = new Group({
            'user': user,
            'name': group
        });
        newGroup.save(function(err) {
            if (err) { return res.status(500).send(err); }
            res.sendStatus(201);
        });
    });
});

/**
 * Delete group
 * Parameters:
 *  group   String  group name
 */
router.delete('/groups/:group', validateJwt, function(req, res) {
    var user = req.user._id;
    var group = req.params.group;
    Group.remove({'user': user, 'name': group}, function(err, result) {
        if (err) { return res.status(500).send(err); }
        // if (! result.ok || ! result.n) { return res.status(404).send('Group not exists');
        res.sendStatus(204);
    });
});

/**
 * Get repositories on group
 * Parameters:
 *  group   String  group name
 */
router.get('/groups/:group/repos', validateJwt, function(req, res) {
    var user = req.user._id;
    var group = req.params.group;
    Group.find({'user': user, 'name': group}, function(err, groups) {
        if (err) { return res.status(500).send(err); }
        if (groups.length == 0) { return res.status(404).send('Group not exists'); }

        Repo.find({'groups': groups[0]._id}, function(err, repos) {
            if (err) { return res.status(500).send(err); }
            res.status(200).send(repos);
        });
    });
});

/**
 * Add repositories on group
 * Parameters:
 *  group   String  group name
 * Data:
 *  owner   String  owner of repository
 *  name    String  repository name
 */
router.post('/groups/:group/repos', validateJwt, function(req, res) {
    var user = req.user._id;
    var group = req.params.group;
    var repositories = req.body;

    Group.find({user: user, name: group}, function(err, groups) {
        if (err || groups.length == 0) {
            return res.status(500).send(err);
        }

        var groupId = groups[0]._id;
        repositories.forEach(function(repository) {
            Repo.find(repository, function(err, results) {
                if (err) { return console.log(new Error(err)); }

                var data = (results.length == 0) ? new Repo(repository) : results[0];
                if (data.groups.indexOf(groupId) == -1) {
                    data.groups.push(groupId);
                }
                data.save(function(err) {
                    if (err) { return console.log(new Error(err)); }
                });
            });
        });

        res.sendStatus(201);
    });
});

/**
 * Delete repositories from group
 * Parameters:
 *  group   String  group name
 *  repoId  String  ObjectID of repository
 */
router.delete('/groups/:group/repos/:repoId', validateJwt, function(req, res) {
    var user = req.user._id;
    var group = req.params.group;
    var repoId = req.params.repoId;

    Group.findOne({user: user, name: group}, function(err, group) {
        if (err) { return res.status(500).send(err); }
        if (! group) { return res.status(404).send('Group not found'); }

        Repo.findById(repoId, function(err, repo) {
            if (err) { return res.status(500).send(err); }
            if (! repo) { return res.status(404).send('Repository not found'); }

            if (repo.groups.length == 1 && repo.groups[0].equals(group._id)) {
                repo.remove(function(err) {
                    if (err) { return res.status(500).send(err); }
                    res.sendStatus(204);
                });
            } else {
                repo.groups = repo.groups.filter(function(g) { return ! g.equals(group._id); });
                repo.save(function(err) {
                    if (err) { return res.status(500).send(err); }
                    res.sendStatus(204);
                });
            }
        });
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

/* Groups */
router.get('/group/:userId', function(req, res) {
    // Get gropus of current user
});

router.post('/group', function(req, res) {
    // Create new group on current user
});

router.delete('/group/:groupName', function(req, res) {
    // Delete group of current user
});

/* Github login - passport setting */
passport.use(new GithubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
}, function(accessToken, refreshToken, profile, done) {
    // Github logged on
    console.log('accessToken:', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile:', profile);
    User.findOne({ 'username': profile.username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            user = new User({
                'username': profile.username,
                'displayName': profile.displayName,
                'email': profile.emails[0].value,
                'accessToken': accessToken,
                'role': 'user'
            });
            user.save(function(err) {
                if (err) return done(err);

                var group = new Group({'user': user.username, 'name': ''});
                group.save();

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
    console.log({ _id: user.username, role: user.role });
    return {
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

/**
 * Get repository list of given user
 */
function getRepository(user) {
    request({
        url: 'https://api.github.com/repos/' + repo.owner + '/' + repo.name + '/commits',
        headers: {
            'User-Agent': 'request',
            'Authorization': 'Basic bmV4dG5wYzp0anN0bWRndXMx'
        }
    }, function(err, response, body) {
        if (err) { return console.log(new Error(err)); }
        var commits = body ? JSON.parse(body) : [];
        commits.forEach(function(data) {
            fetchCommit(data.sha, repo.owner, repo.name);
        });
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