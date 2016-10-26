var express = require('express');
var app = express();
var router = express.Router();
var config = require('../config');
var dyued = require('../model/dyued');
var redisClient = require('../common/redisclient');
var oauth = require('../common/oauth');
var signpackage = require('../common/signpackage');
var client = redisClient.connection();

/* GET home page. */
router.get('/', function(req, res, next) {
    var random = Math.random();
    var host = req.headers.host;
    switch(host){
        case 'mv.bbw360.cn':
            res.redirect('/sharp?random=' + random);return;
            break;
        case 'film.yourjam.cn':
            res.redirect('/sharp?random=' + random);return;
            break;
        case 'v1.bbw360.cn':
            res.redirect('/kuyi?random=' + random);return;
            break;           
        default:
            res.redirect('/film?random=' + random);return;
    };
    
    //res.redirect("http://film.yourjam.cn/category/index.php");return;
    if (app.get('env') == 'production') {
        var openid = req.session.openid;
        var appid = config.member_config.appid;
        if (!openid) {
            var redirect_url = 'http://' + config.hostname + '/callback';
            redirect_url += '?callback_url=' + req.originalUrl;
            var callback_url = oauth.getAuthorizeURL(redirect_url, appid, 'snsapi_base');
            res.redirect(callback_url);
            return;
        }
    }
    //获取首页推荐
    dyued.getIndex(function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }

        //获取当前分类
        var category = dyued.getCategory(0);
        var args = {
            'member_public': config.member_public,
            'film': data.film,
            'meiju': data.meiju,
            'neidiju': data.neidiju,
            'other': data.other,
            'category': category,
            'recommend': data.recommend
        };
        res.render('index', args);
    });
});


//微信回调
router.get('/callback', function(req, res, next) {
    var callback_url = req.query.callback_url;
    var code = req.query.code || '';
    var appid = config.member_config.appid;
    var secret = config.member_config.secret;
    if (code == '' || code == null || code == 'undefined') {
        res.render('error', {});
        return;
    }
    oauth.getAuthAccessTokenByCode(code, appid, secret, function(err, ret) {
        if (err) {
            res.render('error', {});
            return;
        }

        //保存openid
        req.session.openid = ret.openid;
        req.session.save();
        res.redirect(callback_url);
        return;
    });
});

//美剧
router.get('/meiju', function(req, res, next) {
    var cid = req.query.cid || 1;
    var page = req.query.page || 1;
    //获取首页推荐
    dyued.getList(cid, page, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }

        //获取当前分类
        var category = dyued.getCategory(cid);
        var args = {
            'member_public': config.member_public,
            'film': data.list,
            'recommend': data.recommend,
            'category': category,
            'cid': cid,
            'page': page
        };
        res.render('meiju', args);
    });
});

//电影
router.get('/movie', function(req, res, next) {
    var cid = req.query.cid || 2;
    var page = req.query.page || 1;
    //获取首页推荐
    dyued.getList(cid, page, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }

        //获取当前分类
        var category = dyued.getCategory(cid);
        var args = {
            'member_public': config.member_public,
            'film': data.list,
            'recommend': data.recommend,
            'category': category,
            'cid': cid,
            'page': page
        };
        res.render('movie', args);
    });
});

//电视剧
router.get('/dianshiju', function(req, res, next) {
    var cid = req.query.cid || 3;
    var page = req.query.page || 1;
    //获取首页推荐
    dyued.getList(cid, page, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }

        //获取当前分类
        var category = dyued.getCategory(cid);
        var args = {
            'member_public': config.member_public,
            'film': data.list,
            'recommend': data.recommend,
            'category': category,
            'cid': cid,
            'page': page
        };
        res.render('dianshiju', args);
    });
});

//综艺
router.get('/zongyi', function(req, res, next) {
    var cid = req.query.cid || 4;
    var page = req.query.page || 1;
    //获取首页推荐
    dyued.getList(cid, page, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }

        //获取当前分类
        var category = dyued.getCategory(cid);
        var args = {
            'member_public': config.member_public,
            'film': data.list,
            'recommend': data.recommend,
            'category': category,
            'cid': cid,
            'page': page
        };
        res.render('zongyi', args);
    });
});

//获取微信签名
router.get('/signpackage', function(req, res, next) {
    var path = req.query.pathname;
    var url = 'http://' + config.hostname + '/' + path;
    signpackage.getSignPackage(url, function(err, ret) {
        res.json(ret);
        return;
    });
});

//播放详情
router.get('/detail', function(req, res, next) {
    var url = req.query.url || '';
    var title = req.query.title || '';
    var titleName = req.query.titleName || title;
    var originalUrl = req.originalUrl;
    if (app.get('env') == 'production') {
        var openid = req.session.openid;
        var appid = config.member_config.appid;
        if (!openid) {
            var redirect_url = 'http://' + config.hostname + '/callback';
            redirect_url += '?callback_url=' + originalUrl;
            var callback_url = oauth.getAuthorizeURL(redirect_url, appid, 'snsapi_base');
            res.redirect(callback_url);
            return;
        }

        client.get(url).then(function(redisData) {
            if (redisData) {
                var args = JSON.parse(redisData);
                args.member_public = config.member_public;
                args.title = title;
                args.titleName = titleName;
                args.location_url = 'http://' + config.hostname + originalUrl;
                signpackage.getSignPackage(args.location_url, function(err, ret) {
                    args.wxconfig = ret;
                    res.render('detail', args);
                    return;
                });
            } else {
                //获取首页推荐
                dyued.getDetail(url, function(err, data) {
                    if (err) {
                        res.render('error', {});
                        return;
                    }
                    var args = {
                        'member_public': config.member_public,
                        'titleName': titleName,
                        'title': title,
                        'series': data.series,
                        'info': data.info,
                        'video_url': data.video_url
                    };
                    process.nextTick(function() {
                        client.setex(url, 60, JSON.stringify(args), function(err, redis) {
                            console.log(redis);
                        });
                    });
                    args.location_url = 'http://' + config.hostname + originalUrl;
                    signpackage.getSignPackage(args.location_url, function(err, ret) {
                        args.wxconfig = ret;
                        res.render('detail', args);
                        return;
                    });
                });
            }
        }, function(err) {
            console.log('rediserror====' + err);
            res.render('error', {});
            return;
        });
    } else {
        //获取首页推荐
        dyued.getDetail(url, function(err, data) {
            if (err) {
                res.render('error', {});
                return;
            }
            var args = {
                'member_public': config.member_public,
                'titleName': titleName,
                'title': title,
                'series': data.series,
                'info': data.info,
                'video_url': data.video_url
            };
            res.render('detail', args);
        });
    }

});

//纪录分享次数，分享一次抽奖加一次
router.get('/addRecord', function(req, res, next){
    var openid = req.session.openid;
    var key = config.xunlei_record_num + openid;
    client.incr(key, function(err, data){
        var args = {
            state: 1000,
            message: 'ok',
            data: {}
        };
        res.json(args);return;
    });
});
module.exports = router;
