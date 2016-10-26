var crypto = require("crypto");
var config = require('../config');
var host = require('../common/host');
var redisClient = require('../common/redisclient');
var client = redisClient.connection();
var urlencode = require("urlencode");
var request = require("request");
var Q = require("q");
var Cswanda = {
    //获取视频详情
    detail: function(url) {
        var api_host = host.getHost();
        var deferred = Q.defer();
        var key = '/cswanda/detail?url=' + url;
        client.get(key).then(function(redisData) {
            if (redisData) {
                var res = JSON.parse(redisData);
                deferred.resolve(res);
            } else {
                request(api_host + key, function(err, response, data) {
                    if (err) {
                        deferred.reject(err);
                    }
                    if (!err && response.statusCode == 200) {
                        try {
                            var res = JSON.parse(data);
                            if (res) {
                                client.setex(key, 7200, data);
                            }
                            deferred.resolve(res);
                        } catch (e) {
                            deferred.reject(err);
                        }
                    }
                });
            }
        }, function(err) {
            deferred.reject(err);
        });

        return deferred.promise;
    },

    //获取播放资格
    playParse: function(playname, vid) {
        var deferred = Q.defer();
        var api_host = host.getHost();
        var key = '/cswanda/parse?playname='+playname+'&vid='+vid;
        client.get(key).then(function(redisData) {
            if (redisData) {
                var res = JSON.parse(redisData);
                deferred.resolve(res);
            } else {
                request(api_host + key, function(err, response, data) {
                    if (err) {
                        deferred.reject(err);
                    }
                    if (!err && response.statusCode == 200) {
                        try {
                            var res = JSON.parse(data);
                            if (res) {
                                client.setex(key, 50, data);
                            }
                            deferred.resolve(res);
                        } catch (e) {
                            deferred.reject(err);
                        }
                    }
                });
            }
        }, function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    //获取更多列表 tv,movie,album
    getList: function(cid) {
        var deferred = Q.defer();
        var api_host = host.getHost();
        var key = '/liuzhu/movie?type=' + cid;
        client.get(key).then(function(redisData) {
            if (redisData) {
                var res = JSON.parse(redisData);
                deferred.resolve(res);
            } else {
                request(api_host + key, function(err, response, data) {
                    if (err) {
                        deferred.reject(err);
                    }
                    if (!err && response.statusCode == 200) {
                        try {
                            var res = JSON.parse(data);
                            if (res.length > 0) {
                                client.setex(key, 7200, data);
                            }
                            deferred.resolve(res);
                        } catch (e) {
                            deferred.reject(err);
                        }
                    }
                });
            }
        }, function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },
};
module.exports = Cswanda;
