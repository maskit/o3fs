var fs = require('fs');
var config = {};
try {
	if (process.env.VCAP_APP_PORT) {
		console.log('Environment seems cloudfoundry.');
		env = JSON.parse(fs.readFileSync('./cloudfoundry.json', 'utf-8'));
		env['O3FS_PORT'] = process.env.VCAP_APP_PORT;
	} else {
		console.log('Environment seems dotcloud.');
		env = JSON.parse(fs.readFileSync('/home/dotcloud/environment.json', 'utf-8'));
	}
} catch (e) {
	console.log('Environment seems localhost.');
	env = JSON.parse(fs.readFileSync('./environment.json', 'utf-8'));
}
config.port = env['O3FS_PORT'];
config.baseurl = env['DOTCLOUD_WWW_HTTP_URL'] || env['O3FS_WWW_HTTP_URL'];
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
