/**
 * Created by jwlee on 12/2/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    displayName: String,
    email: String
});

module.exports = mongoose.model('user', userSchema);