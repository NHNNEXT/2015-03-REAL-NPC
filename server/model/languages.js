
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var languageSchema = new Schema({
    name: String,
    owner: String,
    languages: {}
});

module.exports = mongoose.model('language', languageSchema);