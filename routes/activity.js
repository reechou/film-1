var express = require('express');
var app = express();
var router = express.Router();
var oauth = require('../common/oauth');
var signpackage = require('../common/signpackage');
var config = require('../config');
var redisClient = require('../common/redisclient');
var client = redisClient.connection();
/* GET users listing. */
router.get('/reffle', function(req, res, next) {
    if (app.get('env') == 'production') {
        var openid = req.session.openid;
        if (!openid) {
            var appid = config.member_config.appid;
            var redirect_url = 'http://' + config.hostname + '/callback';
            redirect_url += '?callback_url=' + req.originalUrl;
            var callback_url = oauth.getAuthorizeURL(redirect_url, appid, 'snsapi_base');
            res.redirect(callback_url);
            return;
        }
        var location_url = 'http://' + config.hostname + req.originalUrl;
        signpackage.getSignPackage(location_url, function(err, ret) {
            var args = {};
            args.wxconfig = ret;
            args.location_url = location_url;
            args.record = 0;
            res.render('reffle', args);
            return;
        });
        // var key = config.xunlei_record_num + openid;
        // client.get(key).then(function(redisData){
        //     var location_url = 'http://' + config.hostname + req.originalUrl;
        //     signpackage.getSignPackage(location_url, function(err, ret) {
        //         var args = {};
        //         args.wxconfig = ret;
        //         args.record = redisData;
        //         args.location_url = location_url;
        //         res.render('reffle', args);
        //         return;
        //     });
        // }, function(err){
        //     var location_url = 'http://' + config.hostname + req.originalUrl;
        //     signpackage.getSignPackage(location_url, function(err, ret) {
        //         var args = {};
        //         args.wxconfig = ret;
        //         args.record = 0;
        //         res.render('reffle', args);
        //         return;
        //     });
        // });
    } else {
        var args = {};
        args.wxconfig = {
            appid: 'xxxx',
            timestamp: 'xxxx',
            nonceStr: 'xxxx',
            signature: 'xxxx'
        };
        args.record = 0;
        res.render('reffle', args);
    }

});

//随机抽奖
router.get('/lottery', function(req, res, next) {
    //获取随机中奖概率
    var random_range = Math.floor(Math.random() * 100);
    var lottery = config.probability;
    var endDay = 0;
    if (app.get('env') == 'production') {
        var openid = req.session.openid;
        if (!openid) {
            res.json({
                'state': 1002,
                'message': '不合法的用户',
                'data': ""
            });
            return;
        }
    } else {
        openid = req.sessionID;
    }


    var key = config.xunlei_vip_lottery + openid;
    client.get(key).then(function(redisData) {
        // process.nextTick(function(){
        //     client.decr(config.xunlei_record_num + openid, function(err, data){
        //         console.log(data);
        //     });
        // });

        if (redisData) {
            var parseJson = JSON.parse(redisData);
            res.json({
                'state': 1003,
                'message': '您已经中奖了，给其他人留个机会哦，会员到期以后，可继续抽奖哦!!!',
                'data': {
                    username: parseJson.userName,
                    password: parseJson.userPassWord
                }
            });
            return;
        } else {
            //抽奖
            if (random_range <= lottery) {
                client.rpop(config.xunlei_vip).then(function(vip) {
                    if (!vip) {
                        res.json({
                            'state': 1002,
                            'message': '很遗憾未中奖',
                            'data': ""
                        });
                        return;
                    }

                    var parseJson = JSON.parse(vip);
                    var current_time = parseInt(new Date().getTime() / 1000);
                    var endtime = current_time - parseJson.setTime;
                    console.log(endtime);
                    endDay = Math.ceil(endtime / 60 / 60 / 24);
                    var expireDays = parseJson.expireDays;
                    console.log(endDay);
                    if (expireDays < endDay) {
                        res.json({
                            'state': 1002,
                            'message': '很遗憾未中奖',
                            'data': ""
                        });
                        return;
                    } else {
                        endDay = expireDays - endDay;
                        var args = {
                            state: 1000,
                            message: '恭喜你！！！，中奖了',
                            data: {
                                username: parseJson.userName,
                                password: parseJson.userPassWord,
                                expireDays: endDay
                            }
                        };
                        process.nextTick(function() {
                            console.log('redis in ........' + endDay);
                            client.setex(key, endDay * 60 * 60 * 24, JSON.stringify(parseJson), function(err, ret) {
                                console.log(ret);
                            });
                        });
                        res.json(args);
                        return;
                    }
                }, function(err) {
                    if (err) {
                        res.json({
                            'state': 1002,
                            'message': '网络错误',
                            'data': ""
                        });
                        return;
                    }
                });
            } else {
                res.json({
                    'state': 1002,
                    'message': '很遗憾未中奖',
                    'data': ""
                });
                return;
            }
        }
    }, function(err) {
        res.json({
            'state': 1002,
            'message': '不合法的用户',
            'data': ""
        });
        return;
    });

});
module.exports = router;
