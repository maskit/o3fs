var mongoose = require('mongoose');
var config  = require('./config');

var Schema = mongoose.Schema;

var User = new Schema({
	uid		: String,	// OpenId
	tokens	: [String],		// Application Token
	fs		: {
		entries: [ {
			path : String,
			service : String,
			token : String
		} ]
	}
});

User = mongoose.model('User', User);

mongoose.connect(config.db_uri);

exports.findUser = function (uid, callback) {
	console.log('finding user: ' + uid);
	User.findOne({uid: uid}, callback);
};

exports.createUser = function (uid, callback) {
	console.log('creating user: ' + uid);
	var user = new User({uid: uid});
	user.save(function (err) {
		callback(err, user);
	});	
};

exports.findOrCreateUser = function (uid, callback) {
	exports.findUser(uid, function (err, user) {
		if (user) {
			callback(err, user);
		} else {
			exports.createUser(uid, callback);
		}
	});
};

exports.deleteUser = function (uid, callback) {
	User.findOne({uid: uid}, function (err, docs) {
		if (!err) {
			docs.remove(function (err) {
				callback(err);
			});
		}
	});
};
