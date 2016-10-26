var express = require('express');
var app = express();
var router = express.Router();
var config = require('../config');
var kuyi = require('../model/kuyi');
var urlencode = require('urlencode');
var validator = require('validator');
/* GET home page. */
router.get('/', function(req, res, next) {
    var random = req.query.random;
    var site = req.query.site || 1;
    if (typeof(random) == "undefined") {
        random = Math.random();
        res.redirect('/kuyi?random=' + random);return;
    }

    kuyi.index().then(function(args){
    	res.render("kuyi/index", {random: random, obj: args.data, site: site});
    });
});

router.get('/detail', function(req, res, next){
   var random = req.query.random;
   var id = req.query.id;
   var site = req.query.site || 1;
   var qrcode = [
    {"img": "http://7xlqmn.com2.z0.glb.qiniucdn.com/wxdianyin.jpg", "link": "http://t.cn/R4OEgkh"},
    {"img": "http://7xu9c2.com1.z0.glb.clouddn.com/qrcode_site.png", "link": "http://t.cn/R4OEgkh"}
   ];
   kuyi.detail(id).then(function(args){
   	res.render("kuyi/detail", {random: random, obj: args.data, qrcode: qrcode[site - 1]});
   });
});

router.get('/cate', function(req, res, next){
   var random = req.query.random;
   var type_id = req.query.type_id || 3;
   var site = req.query.site || 1;
   var distrit_id = req.query.distrit_id || 0;
   var args = {
   		random: random,
   		type_id: type_id,
   		distrit_id: distrit_id,
      site: site
   };
   res.render("kuyi/cate", args);
});

router.get('/list', function(req, res, next){
   var random = req.query.random;
   var type_id = req.query.type_id || 3;
   var distrit_id = req.query.distrit_id || 0;
   var page = req.query.page || 1;
   var order = req.query.order || 1;
   kuyi.list(page, type_id, distrit_id, order).then(function(args){
   		return res.json(args);
   });
});
//解析播放地址
router.get('/parse', function(req, res, next){
	var url = req.query.url;
	kuyi.parse(url).then(function(args){
		if (args.type == 1) {
			kuyi.player_get(args.data).then(function(url){
				res.render("kuyi/player", {playerurl: url});
			});
		}else if (args.type == 2){
			kuyi.player(args.data).then(function(url){
				res.render("kuyi/player", {playerurl: url});
			});
		}else{
      kuyi.playerType3(args.data).then(function(url){
        res.render("kuyi/player", {playerurl: url});
      });     
    }
	});
});

//搜索r
router.get('/search', function(req, res, next){
  var key = req.query.key || '美国队长';
  kuyi.search(urlencode(key)).then(function(list){
     res.json(list);
  });
});

module.exports = router;