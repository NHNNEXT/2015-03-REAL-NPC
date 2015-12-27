/**
 * Created by jwlee on 12/14/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * name can be ''(empty string), and it means user's all repository
 */
var groupSchema = new Schema({
    user: String,
    name: String
});

module.exports = mongoose.model('group', groupSchema);
