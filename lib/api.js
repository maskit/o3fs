var o3fs = require('./o3fs');
var express = require('express');
var app = express.createServer();

function getFilesystem(req) {
	var access_token = req.query.at;
	console.log('access token: ' + access_token);
	return o3fs.createFilesystem();
}

var action = {
	alive : function(req, res) {
		res.json({
			status : 0,
			detail : "I'm OK!"
		});
	},
	invalid : function(req, res) {
		res.json({
			status : 1,
			detail : "Invalid request."
		});
	},
	status : function(req, res) {
		var data = {};
		var fs = getFilesystem(req);
		data['status'] = 0;
		data['mounted'] = fs.getMountedStorage();
		res.json(data);
	},
	check_auth : function (req, res, next) {
		req.authorized = false;
		var token = req.query.at;
		if (typeof token !== 'undefined' && token) {
			req.authorized = true;
		}
		next();
	},
	mount : function(req, res) {

	},
	unmount : function(req, res) {

	},
	
	// Files and metadata
	get_files : function (req, res) {
		
	},
	put_files : function (req, res) {
		
	},
	metadata : function (req, res) {
		
		o3fs.createFileSystem();
		res.json({
			path: req.params.path
		});
	}
};



app.get('/alive',	action.alive);
app.get('/status',	action.check_auth, action.status);
app.get('/mount',	action.check_auth, action.mount);
app.get('/unmount',	action.check_auth, action.unmount);

// Files and metadata
app.get('/files/:path',		action.get_files);
app.put('/files/:path',		action.put_files);
app.get('/metadata/:path',	action.metadata);

// OAuth
app.get('/oauth/request_token',	action.oauth_request_token);
app.get('/oauth/authorize',	action.oauth_authorize);
app.get('/oauth/access_token',	action.oauth_access_token);

exports.v1 = app;

