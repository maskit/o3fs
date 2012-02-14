var express = require('express');
var config  = require('./lib/config');
var o3fs    = require('./lib/o3fs');
var server  = express.createServer();
server.use(express.logger());
server.use(express.bodyParser());
server.use(express.cookieParser());
server.use(express.session({secret:config['session_secret']}));
server.use('/browser', o3fs.browser);
server.use('/api/V1', o3fs.api.v1);
server.set('view options', {layout: false});
server.get('/', function (req, res) {
	res.render('index.html');
});

server.listen(config.port);