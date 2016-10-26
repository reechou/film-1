var crypto = require("crypto");
var config = require('../config');
var httpHelper = require('../common/httpHelper');
var host = require('../common/host');
var redisClient = require('../common/redisclient');
var client = redisClient.connection();
var request = require("request");
var Dyued = {

	//获取首页
	getIndex: function(callback){
		var key = '/dyued/list?cid=0';
        var api_host = host.getHost();
		client.get(key).then(function(redisData){
			if (redisData) {
				var res = JSON.parse(redisData);
                callback(null, res);
                return;
			}else{
				request(api_host + '/list?cid=0', function(err, response, data) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    if (!err && response.statusCode == 200) {
                        try {
                            var res = JSON.parse(data);
                            client.setex(key, 3600, data);
                            callback(null, res);
                            return;
                        } catch (e) {
                            callback(err, null);
                            return;
                        }
                    }					
				});
			}

		});
	},

	//获取其它分类列表
	getList: function(cid, page, callback){
        var api_host = host.getHost();
		var key = '/dyued/list?cid=' + cid + '&page=' + page;
		client.get(key).then(function(redisData){
			if (redisData) {
				var res = JSON.parse(redisData);
                callback(null, res);
                return;
			}else{
				request(api_host + '/list?cid=' + cid + '&page=' + page, function(err, response, data) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    if (!err && response.statusCode == 200) {
                        try {
                            var res = JSON.parse(data);
                            client.setex(key, 3600, data);
                            callback(null, res);
                            return;
                        } catch (e) {
                            callback(err, null);
                            return;
                        }
                    }					
				});
			}

		});	
	},

	//获取视频详细
	getDetail: function(url, callback){
        var api_host = host.getHost();
		var key = '/dyued/detail?link=' + url;
		client.get(key).then(function(redisData){
			if (redisData) {
				var res = JSON.parse(redisData);
                callback(null, res);
                return;
			}else{
				request(api_host + '/detail?link=' + url, function(err, response, data) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    if (!err && response.statusCode == 200) {
                        try {
                            var res = JSON.parse(data);
                            client.setex(key, 3600, data);
                            callback(null, res);
                            return;
                        } catch (e) {
                            callback(err, null);
                            return;
                        }
                    }					
				});
			}

		});
	},

	//获取真实视频地址
	getRealUrl: function(url, callback){
        var api_host = host.getHost();
		request(api_host + '/realurl?url=' + url, function(err, response, data) {
            if (err) {
                callback(err, null);
                return;
            }
            if (!err && response.statusCode == 200) {
                try {
                    var res = JSON.parse(data);
                    callback(null, res);
                    return;
                } catch (e) {
                    callback(err, null);
                    return;
                }
            }					
		});	
	},

	//获取所有分类
	getCategory: function(cid){
		switch (cid) {
			case '1':
				return '热播美剧';
				break;
			case '2':
				return '热播电影';
				break;
			case '3':
				return '国产剧 ➩ <a href="/yourjam/index?cid=19">其它剧</a>';
				break;
			case '4':
				return '热播综艺';
				break;
			case '5':
				return '以下为搜索结果';
				break;
			case '19':
				return '<a href="/yourjam/index?cid=3">国产剧</a> ➩ 其它剧';
				break;
			default:
				return '热门影片推荐';
				break;
		}
	},

	//搜索
	search: function(keywords, callback){
        var api_host = host.getHost();
		request(api_host + '/search?keywords=' + kewords, function(err, response, data) {
            if (err) {
                callback(err, null);
                return;
            }
            if (!err && response.statusCode == 200) {
                try {
                    var res = JSON.parse(data);
                    callback(null, res);
                    return;
                } catch (e) {
                    callback(err, null);
                    return;
                }
            }					
		});		
	}
};
module.exports = Dyued;