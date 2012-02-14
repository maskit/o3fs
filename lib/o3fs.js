var db = require('./db');
var storage = require('./storage');

var O3FS = function(user) {
	console.log('New o3fs instance has been created.');
	this.user = user;
};
O3FS.prototype = {
	getMetadata : function (path, callback) {
		var mountPoint = getMountPoint(this.user.fs, path);
		if (mountPoint === null) {
			// TODO Generate pseudo tree structure
			var metadata = {
				bytes: 0,
				thumbnail: '',
				revision: '',
				modified: '',
				path: path,
				type: 'dir',
				contents: []
			};
			callback(null, metadata);
		} else {
			var service = storage.create(mountPoint.service, mountPoint.token);
			service.getMetadata(path.substr(mountPoint.path.length), callback);
		}
	},
	mount : function(path, service, token, callback) {
		if (path.charAt(0) !== '/' || path.length < 1) {
			throw "Invalid path";
		}
		var mountPoint = getMountPoint(this.user.fs, path);
		if (mountPoint !== null && mountPoint.path === path) {
			throw "Invalid path";
		}
		this.user.fs.entries.push({
			path: path,
			service: service,
			token: token
		});
		this.user.save(callback);
	},
	unmount : function(path, callback) {
		var mountPoint = getMountPoint(this.user.fs, path);
		if (mountPoint === null) {
			throw "Invalid path";
		}
		var index = this.user.fs.entries.indexOf(mountPoint);
		this.user.fs.entries.splice(index, 1);
		this.user.fs.save(callback);
	},
};

function getMountPoint(fs, path) {
	var result = null;	
	fs.entries.forEach(function (mountPoint, index, entries) {
		if (path.indexOf(mountPoint.path) == 0) {
			if(result === null || result.path.length < mountPoint.path.length) {
				result = mountPoint;
			}
		}
	});
	return result;
}

exports.getFilesystem = function(uid, callback) {
	db.findOrCreateUser(uid, function (err, user) {
		if (err) throw err;
		callback(null, new O3FS(user));
	});
};

exports.browser = require('./browser.js');
exports.api = require('./api.js');
