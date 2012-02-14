var express = require('express');
var hogan   = require('hogan.js');
var openid  = require('openid');
var config  = require('./config');



var app = express.createServer();
app.use(express.csrf());

app.register('.html', {
	compile: function (str, options) {
		return function (options) {
			return hogan.compile(str).render(options);
		};
	}
});
app.set('view options', {layout: false});
module.exports = app;

function createBasicData(req) {
	return {
		config: config,
		url: {
			top: '/browser',
			login: '/browser/login',
			logout: '/browser/logout',	
		},
		login: req.session.openid,
		csrf_token: req.session._csrf
	};
};

var action = {
		debug : function (req, res) {
			var data = createBasicData(req);
			res.render('debug.html', data);
		},
		root : function (req, res) {
			var data = createBasicData(req);
			res.render('browser.html', data);
		},
		openid_login : function (req,res) {
			var data = createBasicData(req);
			res.render('login.html', data);
		},
		openid_logout : function (req,res) {
			var data = createBasicData(req);
			req.session.destroy(function(err) {
				res.render('logout.html', data);
			});
		},
		openid_authenticate : function (req, res) {
			var identifier = req.body['openid_identifier'];
			rp.authenticate(identifier, false, function (error, authUrl){
				if (error || !authUrl) {
					res.end('Failed.' + error.message);
				} else {
					res.redirect(authUrl);
				}
			});
		},
		openid_verify : function (req,res) {
			rp.verifyAssertion(req, function(error, result) {
				if (error) {
					console.dir(error);
					console.dir(result);
					res.end('failed.');
				} else {
					req.session.regenerate(function(err){
						req.session.openid = result.claimedIdentifier;
						res.redirect('/');
					});
				}
				
			});
		}
};

var rp = new openid.RelyingParty(
		config.baseurl + 'browser/verify',
		config.baseurl,
		false,
		false,
		[]);

app.get('/debug',	action.debug);
app.get('/',		action.root);
app.get('/login',	action.openid_login);
app.post('/login',	action.openid_authenticate);
app.get('/logout',	action.openid_logout);
app.get('/verify',	action.openid_verify);
app.get('/cancel',	action.cancel);
app.use(express.static('./assets'));