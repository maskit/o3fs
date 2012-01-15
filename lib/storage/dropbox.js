var DropboxStorage = function () {
	this.username = '';
};

require('util').inherits(DropboxStorage, require('../storage.js').baseObject);



exports.create = function () {
	return new DropboxStorage();
};