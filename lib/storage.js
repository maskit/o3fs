var Storage = function() {
};

Storage.prototype = {
	onMount : function() {
	},
	onUnmount : function() {
	},

// isVersionable:function () {},
};

exports.baseObject = Storage;
exports.create = function (type) {
	return require('./storage/' + type + '.js').create();
};