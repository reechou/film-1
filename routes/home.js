var express = require('express');
var router = express.Router();
var home = require('../model/home');
var Q = require('q');
var moment = require('moment');
moment.locale('zh-cn'); //使用中文
/* GET users listing. */
router.get('/', function(req, res, next) {
    var user = req.session.user || "";
    if (user == "") {
        return res.redirect('/home/login');
    }
    res.render('home/main', {});
});

//登陆页面
router.get('/login', function(req, res, next) {
    var user = req.session.user || "";
    if (user != "") {
        return res.redirect('/home');
    }
    res.render('home/login', {});
});

router.post('/sign', function(req, res, next) {
    var username = req.body.username || "";
    var password = req.body.password || "";
    var args = {
        state: 1000,
        message: 'success',
        data: ""
    };
    if (username == "" || password == "") {
        args.state = 1001;
        args.message = 'account error';
        res.json(args);
        return;
    }
    var opt = {
        userName: username,
        userPass: password
    };
    home.common('http://vote.paili5.com/index.php?r=token/login', opt)
        .then(function(data) {
            if (data.state == 1000) {
                req.session.user=data.data.userName;
                req.session.userId = data.data.id;
            }
            return res.json(data);
        }, function(error) {
            args.state = 1001;
            args.message = '查询失败';
            res.json(args);
            return;
        });
});

//电影来源列表
router.get('/source_list', function(req, res, next) {
    var username = req.session.user || "";
    var userId = req.session.userId || "";
    var args = {
        state: 1000,
        message: 'success',
        data: ""
    };
    home.common('http://vote.paili5.com/index.php?r=token/get', {userName: username})
        .then(function(data) {
            data.username = username;
            return res.json(data);
        }, function(error) {
            args.state = 1002;
            args.message = '查询失败';
            return res.json(args);
        });
});

//来源添加
router.post('/source_add', function(req, res, next) {
    var userId = req.session.userId || "";
    var nick_name = req.body.nick_name || "";
    var token = req.body.token || "";
    var qq = req.body.qq || "";
    var url = req.body.url || "";
    var member_url = req.body.member_url || "";
    var args = {
        state: 1000,
        message: 'success',
        data: ""
    };

    var opt = {
        nick_name: nick_name,
        token: token,
        qq: qq,
        url: url,
        member_url: member_url,
        userId: userId
    };
    home.common('http://vote.paili5.com/index.php?r=token/add', opt)
        .then(function(data) {
            return res.json(data);
        }, function(error) {
            args.state = 1002;
            args.message = '查询失败';
            return res.json(args);
        });
});

//删除电影源
router.post('/delSource', function(req, res, next) {
    var opt = {
        token: req.body.token
    };
    home.common('http://vote.paili5.com/index.php?r=token/del', opt)
        .then(function(data) {
            return res.json(data);
        }, function(error) {
            args.state = 1002;
            args.message = '查询失败';
            return res.json(args);
        });
});

module.exports = router;
