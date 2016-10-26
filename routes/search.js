var express = require('express');
var app = express();
var router = express.Router();
var config = require('../config');
var loldy = require('../model/loldy');
var urlencode = require('urlencode');
var validator = require('validator');
/* GET home page. */
router.get('/', function(req, res, next) {
    var keyword = req.query.keyword || "权";
    var random = Math.random();
    keyword = loldy.filterWord(keyword);
    loldy.searchWeb(keyword).then(function(data) {
        data.random = random;
        res.render("search/movie", data);
    });
});

router.get('/detail', function(req, res, next) {
    var link = req.query.link || "/Aiqingdianying/MRY/";
    var random = Math.random();
    loldy.detailPc(link).then(function(data) {
        data.random = random;
        var reg = /loldytt\.com/g;
        data.director = data.director.replace(reg, 'bbw360.cn');
        data.info = data.info.replace(reg, 'bbw360.cn');
        res.render("search/detail", data);
    });
});
module.exports = router;
