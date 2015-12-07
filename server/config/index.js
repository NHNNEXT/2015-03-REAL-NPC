/**
 * Created by jwlee on 12/6/15.
 */

'use strict';

var config = {
    secrets: {
        session: 'npcSessionSecret'
    },

    github: {
        clientID: process.env.GITHUB_CLIENT_ID || '4a7d4ecc97205f7eb214',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '5e9f2b69b8ce5d8a86dc896c0dd01a1f3b78d90a',
        callbackURL: (process.env.DOMAIN || 'http://localhost:3000') + '/auth/github/callback'
    }
};

module.exports = config;