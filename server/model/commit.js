/**
 * Created by yeslkoh on 2015. 10. 26..
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commitSchema = new Schema({
    sha: String,
    name: String,
    email: String,
    date: String,
    message: String,
    url: String,
    commentCount: Number,
    repoName: String,
    owner: String
});

module.exports = mongoose.model('commit', commitSchema);