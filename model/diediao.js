var crypto = require("crypto");
var config = require('../config');
var host = require('../common/host');
var urlencode = require("urlencode");
var request = require("request");
var DieDiao = {
    getHeaders: function() {
        var headers = {
            'Content-Type': 'charset=utf-8'
        };
        return headers;
    },
    //获取首页
    getIndex: function(callback) {
        //默认从缓存中获取数据
        var key = '/diediao/';
        var api_host = host.getHost();
        request(api_host + '/diediao/index', function(err, response, data) {
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
    //获取视频详情
    detail: function(url, callback) {
        var api_host = host.getHost();
        request(api_host + '/diediao/detail?url=' + url, function(err, response, data) {
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

    //获取播放资格
    playParse: function(url, callback) {
        var api_host = host.getHost();
        request(api_host + '/diediao/playparse?url=' + url, function(err, response, data) {
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
    //获取播放地址
    getPlayer: function(vid, playname, callback) {
        var key = 'diediao_' + vid + '_' + playname;
        var api_host = 'http://121.199.22.105:8088';
        request(api_host + '/diediao/getPlayer?playname=' + playname + '&vid=' + vid, function(err, response, data) {
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

    //解析pc播放地址
    getPlayerPc: function(vid, playname, callback){
        var key = 'diediao_' + vid + '_' + playname;
        var api_host = 'http://121.199.22.105:8088';
        request(api_host + '/diediao/getPlayerPc?playname=' + playname + '&vid=' + vid, function(err, response, data) {
            if (err) {
                callback(err, null);
                return;
            }
            if (!err && response.statusCode == 200) {
                try {
                    callback(null, data);
                    return;
                } catch (e) {
                    callback(err, null);
                    return;
                }
            }
        });
    },

    //获取更多列表
    getList: function(cid, callback) {
        var key = '/diediao/list?cid=' + cid;
        var api_host = host.getHost();
        request(api_host + '/diediao/list?cid=' + cid, function(err, response, data) {
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

    //搜索
    search: function(wd, page, callback) {
        var api_host = host.getHost();
        request(api_host + '/diediao/search?wd=' + urlencode(wd) + '&page=' + page, function(err, response, data) {
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

    //获取总榜单
    getTop: function(callback) {
        var key = '/diediao/top';
        var api_host = host.getHost();
        request(api_host + '/diediao/top', function(err, response, data) {
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

    //其它榜单
    otherTop: function(cid, callback) {
        var key = '/diediao/top_' + cid;
        var api_host = host.getHost();
        request(api_host + '/diediao/rank?cid=' + cid, function(err, response, data) {
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
};
module.exports = DieDiao;
