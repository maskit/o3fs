var fs = require('fs');
var config = {};
try {
	env = JSON.parse(fs.readFileSync('/home/dotcloud/environment.json', 'utf-8'));
} catch (e) {
	env = JSON.parse(fs.readFileSync('./environment.json', 'utf-8'));
}
config.port = env['O3FS_PORT'];
config.baseurl = env['DOTCLOUD_WWW_HTTP_URL'];
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