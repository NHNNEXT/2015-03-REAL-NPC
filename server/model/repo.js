/**
 * Created by Ellen on 2015. 10. 27..
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repoSchema = new Schema({
    name: String,
    owner: String,
    languages: {}
});

module.exports = mongoose.model('repo', repoSchema);