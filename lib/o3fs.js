var O3FS = function() {
	console.log('New filesystem has been created.');
	this.mounted = {};
};
O3FS.prototype = {
	mount : function(storage, path) {
		if (path.charAt(0) !== '/' || path.length < 1) {
			throw "Invalid mount point";
		}
		if (!(storage instanceof Storage)) {
			throw "Invalid storage";
		}

		if (typeof mounted[path] !== 'undefined') {
			throw "Mount point is busy";
		}
		mounted[path] = storage;
		storage.onMount();
	},
	unmount : function(path) {
		if (path.charAt(0) !== '/' || path.length < 1) {
			throw "Invalid mount point";
		}
		if (typeof mounted[path] !== 'undefined') {
			storage.onUnmount();
		}
	},
	getMountedStorage : function() {
		return this.mounted;
	}
};

function getStorage(path) {
	var longestMatch = null;

	for (mp in mounted) {
		if (mounted.isOwnProperty(path)) {
			// TODO Find mounted storage
		}
	}
	if (longestMatch === null) {
		throw "Storage not found";
	}
	return mounted[longuestMatch];
}

exports.createFilesystem = function(uid) {
	return new O3FS(uid);
};

exports.createStorage = function (type) {
	return require('./storage.js').create(type);
};

exports.browser = require('./browser.js');
exports.api = require('./api.js');
