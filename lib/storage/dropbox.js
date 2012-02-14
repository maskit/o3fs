var DropboxStorage = function (token) {
	this(token);
};

require('util').inherits(DropboxStorage, require('../storage.js').baseObject);



exports.create = function (token) {
	return new DropboxStorage(token);
};