var dbclient = require('../common/db');
var host = require('../common/host');
var Q = require('q');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var co =require('co');
var Buffer = require('buffer').Buffer;
var Home = {
	//登陆
	login: function(username, password){
		var args = [username, password];
		var deferred = Q.defer();
		var pool = dbclient.connection();
	    var sql = "select * from movie_admin where username = ? and password = ? and status = 0";
	    pool.getConnection(function(err, conn) {
	        conn.query(sql, args, function(err, res) {
	        	pool.end();
	            if (err) {
	            	deferred.reject(err);
	            }
	            deferred.resolve(res);
	        });
	    });	
	    return deferred.promise;		
	},
	common: co.wrap(function*(url, args){
	    var options = {
	        url: url,
	        form: args
	    };
	    var response = yield request.postAsync(options);
	    if (response.statusCode == 200) {
	        return JSON.parse(response.body);
	    }
	    return false;
	}),
	base_64: function(str){
	  var encoded = new Buffer(str).toString('base64');
	  return encoded.replace(/\//g, '_').replace(/\+/g, '-');
	    // var c1, c2, c3;
	    // var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	    // var i = 0,
	    //     len = str.length,
	    //     string = '';
	    // while (i < len) {
	    //     c1 = str.charCodeAt(i++) & 0xff;
	    //     if (i == len) {
	    //         string += base64EncodeChars.charAt(c1 >> 2);
	    //         string += base64EncodeChars.charAt((c1 & 0x3) << 4);
	    //         string += "==";
	    //         break;
	    //     }
	    //     c2 = str.charCodeAt(i++);
	    //     if (i == len) {
	    //         string += base64EncodeChars.charAt(c1 >> 2);
	    //         string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	    //         string += base64EncodeChars.charAt((c2 & 0xF) << 2);
	    //         string += "=";
	    //         break;
	    //     }
	    //     c3 = str.charCodeAt(i++);
	    //     string += base64EncodeChars.charAt(c1 >> 2);
	    //     string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	    //     string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
	    //     string += base64EncodeChars.charAt(c3 & 0x3F)
	    // }
	    // return string;
	}

};
module.exports = Home;