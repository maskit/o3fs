var fs = require('fs');
var path = require('path');
var env;
var config = {};
try {
	if (process.env.VCAP_APP_PORT) {
		console.log('Environment seems cloudfoundry.');
		env = JSON.parse(fs.readFileSync('./conf/cloudfoundry.json', 'utf-8'));
		env['O3FS_PORT'] = process.env.VCAP_APP_PORT;
	} else if (path.exists('/home/dotcloud/environment.json')) {
		console.log('Environment seems dotcloud.');
		env = JSON.parse(fs.readFileSync('/home/dotcloud/environment.json', 'utf-8'));
		evn['O3FS_WWW_HTTP_URL'] = env['DOTCLOUD_WWW_HTTP_URL'];
	} else {
		console.log('Environment seems localhost.');
		env = JSON.parse(fs.readFileSync('./conf/localhost.json', 'utf-8'));
		console.dir(env);
	}
} catch (e) {
	console.error(e);
}

if (!env) {
	console.error('Failed to load configuration.');
	process.exit(1);
} 

config.port = env['O3FS_PORT'];
config.baseurl = env['O3FS_WWW_HTTP_URL'];
config.session_secret = env['O3FS_SESSION_SECRET'];
config.consumer_info = {
		dropbox: {
			key: env['O3FS_CONSUMER_KEY_DROPBOX'],
			secret: env['O3FS_CONSUMER_SECRET_DROPBOX'],
		}
};
config.yui_version = "3.4.1";
config.db_uri = env['O3FS_DB_URI'];
module.exports = config;
