var express = require('express');
var router = express.Router();
var oauth = require("../common/oauth");
var RedisClient = require('../common/redisclient');
var config = require("../config");
var client = RedisClient.connection();
var signpackage = require('../common/signpackage');
//微信授权开发公众号
router.get('/callback', function(req, res, next) {
    var callback_url = req.query.callback_url;
    var code = req.query.code || '';
    var appid = config.member_config.appid;
    var secret = config.member_config.secret;
    if (code == '' || code == null || code == 'undefined') {
        res.render('error', {});
        return;
    }

    //获取access_token
    oauth.getAuthAccessTokenByCode(code, appid, secret).then(function(ret) {
        //保存cookie
        res.cookie('openid', ret.openid,{ maxAge: 20000,httpOnly:true, path:'/'});//cooike 时长 30 sec
        //获取cookie req.cookies.cookiename
        res.redirect(callback_url);
    }, function(err) {
        res.render('error', {});
        return;
    });
});
module.exports = router;
