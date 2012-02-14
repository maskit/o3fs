var step = require('step');
var o3fs = require('./o3fs');
var db = require('./db');
var openid  = require('openid');
var express = require('express');
var config  = require('./config');

var app = express.createServer();

function createMetadataResponse(metadata, list) {
	var response = {
		size: metadata.bytes + ' bytes',
		rev:  metadata.revision,
		thumb_exists: !!metadata.thumbnail,
		bytes: metadata.bytes,
		modified: metadata.modified,
		path: metadata.path,
		is_dir: ('directory' == metadata.type),
		icon: metadata['is_dir'] ? 'folder' : 'page_white',
		root: 'o3fs' // for compatibility
	};
	if (list) {
		response['contents'] = [];
		metadata.contents.forEach(function (m) {
			response['contents'].push(createMetadataResponse(m));
		});
	}
	return response;
}

var action = {
	alive : function(req, res) {
		res.json({
			status : 200,
			detail : "I'm OK!"
		});
	},
	info : function (req, res) {
		db.findOrCreateUser(req.session.openid, function (err, user) {
			if (user) {
				var data = {};
				data['referral_link'] = ''; // for compatibility
				data['display_name'] = user.display_name;
				data['uid'] = user.uid;
				data['country'] = user.country;
				data['quotea_info'] = user.quota;
				res.json(data);	
			} else {
				action.invalid(req, res);
			}
		});
	},
	invalid : function(req, res) {
		res.json({
			status : 400,
			detail : "Bad request"
		}, 400);
	},
	check_auth : function (req, res, next) {
		if (req.session.openid) {
			next();
		} else {
			res.json({
				status: '403',
				detail: 'Forbidden' 
			}, 403);
		}
	},
	mount : function(req, res) {
		step(
			function () {
				console.log('trying to get filesystem');
				o3fs.getFilesystem(req.session.openid, this);
			},
			function (err, fs) {
				if (err) throw err;
				console.log('trying to mount storage');
				fs.mount(req.params.path, req.params.service, req.params.token, this);	
			},
			function (err) {
				var data = {};
				if (err) {
					console.log(err);
					res.json(data, 400);
				} else {
					res.json(data);
				}
			}
		);
	},
	unmount : function(req, res) {
		step(
			function () {
				console.log('trying to get filesystem');
				o3fs.getFilesystem(req.session.openid, this);
			},
			function (err, fs) {
				if (err) throw err;
				console.log('trying to unmount storage');
				fs.unmount(req.params.path, this);	
			},
			function (err) {
				var data = {};
				if (err) {
					console.log(err);
				res.json(data, 400);
				} else {
					res.json(data);
				}
			}
		);
	},
	
	// Files and metadata
	get_files : function (req, res) {
		
	},
	put_files : function (req, res) {
		
	},
	metadata : function (req, res) {
		step(
			function () {
				console.log('trying to get filesystem');
				o3fs.getFilesystem(req.session.openid, this);
			},
			function (err, fs) {
				if (err) throw err;
				console.log('trying to get metadata');
				if (!req.params.path) {
					req.params.path = '/';
				}
				fs.getMetadata(req.params.path, this);
			},
			function (err, metadata) {
				if (err) {
					console.log(err);
					res.json({}, 400);
				} else {
					res.json(createMetadataResponse(metadata, req.params.list !== 'false'));
				}
			}
		);
	}
};

app.get('/account/info',	action.check_auth, action.info);

app.get('/alive',	action.alive);
app.get('/mount',	action.check_auth, action.mount);
app.get('/unmount',	action.check_auth, action.unmount);

// Files and metadata
app.get('/files/:path',		action.check_auth, action.get_files);
app.put('/files/:path',		action.check_auth, action.put_files);
app.get('/metadata/:path',	action.check_auth, action.metadata);
app.get('/metadata/',		action.check_auth, action.metadata);


// OAuth
app.get('/oauth/request_token',	action.oauth_request_token);
app.get('/oauth/authorize',		action.oauth_authorize);
app.get('/oauth/access_token',	action.oauth_access_token);

exports.v1 = app;

