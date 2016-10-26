var express = require('express');
var app = express();
var router = express.Router();
var config = require('../config');
var dyued = require('../model/dyued');
var urlencode = require('urlencode');

/* GET home page. */
router.get('/', function(req, res, next) {
    var random = Math.random();
    //获取首页推荐
    dyued.getIndex(function(err, data) {
        if (err) {
            res.render('yourjam/error', {random: random});
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
            'recommend': data.recommend,
            'random': random
        };
        res.render('yourjam/index', args);
    });
});

router.get('/search', function(req, res, next) {
    var random = Math.random();
    var keywords = req.query.keywords || "";
    //获取首页推荐
    dyued.search(keywords, function(err, data) {
        if (err) {
            res.render('yourjam/error', {random: random});
            return;
        }
        //获取当前分类
        var category = dyued.getCategory(0);
        var args = {
            'member_public': config.member_public,
            'category': category,
            'list': data.list,
            'random': random
        };
        res.render('yourjam/search', args);
    });
});
//美剧
router.get('/meiju', function(req, res, next) {
    var cid = req.query.cid || 1;
    var page = req.query.page || 1;
    var random = Math.random();
    //获取首页推荐
    dyued.getList(cid, page, function(err, data) {
        if (err) {
            res.render('yourjam/error', {random: random});
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
            'page': page,
            'random': random
        };
        res.render('yourjam/meiju', args);
    });
});

//电影
router.get('/movie', function(req, res, next) {
    var cid = req.query.cid || 2;
    var page = req.query.page || 1;
    var random = Math.random();
    //获取首页推荐
    dyued.getList(cid, page, function(err, data) {
        if (err) {
            res.render('yourjam/error', {random: random});
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
            'page': page,
            'random': random
        };
        res.render('yourjam/movie', args);
    });
});

//电视剧
router.get('/dianshiju', function(req, res, next) {
    var cid = req.query.cid || 3;
    var page = req.query.page || 1;
    var random = Math.random();
    //获取首页推荐
    dyued.getList(cid, page, function(err, data) {
        if (err) {
            res.render('yourjam/error', {random: random});
            return;
        }

        //获取当前分类
        var category = dyued.getCategory(cid);
        var args = {
            'member_public': config.member_public,
            'film': data.list,
            'recommend': data.recommend,
            'category': '电视剧',
            'cid': cid,
            'page': page,
            'random': random
        };
        res.render('yourjam/dianshiju', args);
    });
});

//综艺
router.get('/zongyi', function(req, res, next) {
    var cid = req.query.cid || 4;
    var page = req.query.page || 1;
    var random = Math.random();
    //获取首页推荐
    dyued.getList(cid, page, function(err, data) {
        if (err) {
            res.render('yourjam/error', {random: random});
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
            'page': page,
            'random': random
        };
        res.render('yourjam/zongyi', args);
    });
});

//播放详情
router.get('/detail', function(req, res, next) {
    var random = Math.random();
    var url = req.query.url || '';
    var title = req.query.title || '';
    var titleName = req.query.titleName || title;
    //获取首页推荐
    dyued.getDetail(url, function(err, data) {
        if (err) {
            res.render('yourjam/error', {random: random});
            return;
        }
        var args = {
            'member_public': config.member_public,
            'titleName': titleName,
            'title': title,
            'series': data.series,
            'info': data.info,
            'video_url': urlencode(data.video_url),
            'random': random
        };
        res.render('yourjam/detail', args);
    });

});

//播放
router.get('/player', function(req, res, next){
    var vid = req.query.vid;
    var random = Math.random();
    dyued.getRealUrl(vid, function(err, data){
        if (err) {
            res.render('yourjam/error', {random: random});return;
        }
        res.render('yourjam/player', data);
    });
});
module.exports = router;
