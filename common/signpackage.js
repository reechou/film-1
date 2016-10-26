var redisClient = require('./redisclient');
var client = redisClient.connection();
var https = require("https");
var http = require('http');
var sha1 = require('sha1');
var config = require('../config');
var crypto = require('crypto');
var Q = require('q');
var SignPackage = {
    // 输出数字签名对象
    responseWithJson: function(res, data) {
        // 允许跨域异步获取
        res.set({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET",
            "Access-Control-Allow-Credentials": "true"
        });
        res.json(data);
    },


    // 随机字符串产生函数
    createNonceStr: function() {
        return Math.random().toString(36).substr(2, 15);
    },

    // 时间戳产生函数
    createTimeStamp: function() {
        return parseInt(new Date().getTime() / 1000) + '';
    },
    // 计算签名
    calcSignature: function(ticket, noncestr, ts, url) {
        var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp=' + ts + '&url=' + url;
        var signature = crypto.createHash('sha1').update(str).digest('hex');
        return sha1(str);
    },

    //获取access_token
    getAccessToken: function(appid, secret, callback) {
        //查询缓存是否存在数据
        var key = config.member_config.access_token_prefix + config.member_config.token;
        client.get(key).then(function(redisData) {
            if (redisData) {
                var args = JSON.parse(redisData);
                callback(null, args);
                return;
            } else {
                // 获取微信签名所需的access_token
                https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + secret, function(_res) {
                    var str = '';
                    _res.on('data', function(data) {
                        str += data;
                    });
                    _res.on('end', function() {
                        console.log('return access_token:  ' + str);
                        try {
                            var resp = JSON.parse(str);
                        } catch (e) {
                            callback(null, null);
                        }
                        process.nextTick(function() {
                            client.setex(key, 3600, JSON.stringify(resp), function(err, redis) {
                                console.log(redis);
                            });
                        });
                        callback(null, resp);
                    });
                });
            }
        }, function(err) {
            if (err) {
                callback(err, null);
                return;
            }
        });
    },

    //获取ticket
    getTicket: function(appid, secret, callback) {
        var self = this;
        //查询缓存是否存在数据
        var key = config.member_config.jsticket + config.member_config.token;
        client.get(key).then(function(redisData) {
            if (redisData) {
                var args = JSON.parse(redisData);
                callback(null, args);
                return;
            } else {
                // 获取微信签名所需的ticket
                self.getAccessToken(appid, secret, function(err, ret) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    https.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + ret.access_token + '&type=jsapi', function(_res) {
                        var str = '',
                            resp;
                        _res.on('data', function(data) {
                            str += data;
                        });
                        _res.on('end', function() {
                            console.log('return ticket:  ' + str);
                            try {
                                resp = JSON.parse(str);
                            } catch (e) {
                                callback(null, null);
                            }
                            process.nextTick(function() {
                                client.setex(key, 3600, JSON.stringify(resp), function(err, redis) {
                                    console.log(redis);
                                });
                            });
                            callback(null, resp);
                        });
                    });
                });
            }
        }, function(err) {
            callback(err, null);
            return;
        });
    },

    //获取签名package
    getSignPackage: function(url) {
        var deferred = Q.defer();
        var appid = config.member_config.appid;
        var ts = this.createTimeStamp();
        var nonceStr = this.createNonceStr();
        var self = this;
        //获取ticket
        this.getTicket(appid, config.member_config.secret, function(err, ticket) {
            if (err) {
                deferred.reject(err);
            }
            var signature = self.calcSignature(ticket.ticket, nonceStr, ts, url);
            var package = {
                appid: appid,
                nonceStr: nonceStr,
                timestamp: ts,
                signature: signature,
                url: url
            };
            deferred.resolve(package);
        });
        return deferred.promise;
    },
};
module.exports = SignPackage;