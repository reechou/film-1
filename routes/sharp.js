var express = require('express');
var app = express();
var router = express.Router();
var config = require('../config');
var cswanda = require('../model/cswanda');
var urlencode = require('urlencode');
var validator = require('validator');
/* GET home page. */
router.get('/', function(req, res, next) {
    var random = req.query.random;
    if (typeof(random) == "undefined") {
        random = Math.random();
        res.redirect('/sharp?random=' + random);return;
    }
    res.render("sharp/movie", {random: random});
});

//获取详情
router.get('/detail', function(req, res, next){
    var random = Math.random();
    var url = req.query.url || '';
    cswanda.detail(url).then(function(data){
        data.random = random;
        res.render('sharp/detail', data);return;
    }, function(err){
        res.render('error');return;
    });
});

//获取分类
router.get('/movie', function(req, res, next){
  var type = req.query.type || 'movie';
  var obj = {};
  cswanda.getList(type).then(function(data){
    obj.lists = data;
    res.json(obj);return;
  }, function(err){
    res.json(obj);return;
  });
});

//解析视频地址
router.get('/player', function(req, res, next){
    var vid = req.query.vid || "";
    var playname = req.query.playname || "";
    cswanda.playParse(playname, vid).then(function(data){
        res.render('sharp/player', data);
    },function(err){
        res.render('error');
    });
});
module.exports = router;