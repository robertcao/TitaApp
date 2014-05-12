var mongoose = require('mongoose');

// define
var wordSchema = mongoose.Schema({
	recordContent  : String,
	recordDate     : String,
    recorderEmail  : String
});

module.exports = mongoose.model('Word', wordSchema);

