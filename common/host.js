var config = require('../config');
module.exports.getHost = function(){
	var host = config.HTTP_HOST;
	var index = Math.floor(Math.random()*host.length);
	return host[index];
};