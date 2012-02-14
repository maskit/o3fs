var Storage = function(token) {
	this.token = token;
};

Storage.prototype = {
	getMetadata: function (path, callback) {
		console.log('Storage->getMetadata: ' + path);
	},
// isVersionable:function () {},
};

exports.baseObject = Storage;
exports.create = function (type, token) {
	return require('./storage/' + type + '.js').create(token);
};