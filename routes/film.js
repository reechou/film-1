var express = require('express');
var app = express();
var router = express.Router();
var config = require('../config');
var diediao = require('../model/diediao');
var redisClient = require('../common/redisclient');
var oauth = require('../common/oauth');
var signpackage = require('../common/signpackage');
var loldy = require('../model/loldy');
var client = redisClient.connection();
var urlencode = require('urlencode');
var home = require('../model/home');

//路由总的方法
router.use(function(req, res, next) {
    //获取域名配置信息
    var host = req.headers.host;
    // var token = host.split('.bbw360.cn');
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    var random = Math.random();
    diediao.getIndex(function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }
        var style = {
            index: 'cur',
            hotDrama: '',
            hotFilm: '',
            hotManga: '',
            hotVariety: '',
            smallfilm: ''
        };
        var args = {
            hotDrama: data.hotDrama,
            hotFilm: data.hotFilm,
            hotManga: data.hotManga,
            hotVariety: data.hotVariety,
            style: style,
            random: random
        };
        res.render('film/index', args);
    });
});


//播放详情
router.get('/detail', function(req, res, next) {
    var random = Math.random();
    var url = req.query.url || '';
    if (url == '' || url == 'undefined') {
        res.render('error', {});
        return;
    }
    diediao.detail(url, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }
        data.src = url;
        var style = {
            index: '',
            hotDrama: '',
            hotFilm: '',
            hotManga: '',
            hotVariety: '',
            smallfilm: ''
        };
        data.style = style;
        data.random = random;
        res.render('film/detail', data);
        return;
    });
});

//打开播放视频
router.get('/playparse', function(req, res, next) {
    var url = req.query.url || '';
    var src = req.query.src || "";
    var random = Math.random();
    diediao.detail(src, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }
        data.src = src;
        var style = {
            index: '',
            hotDrama: '',
            hotFilm: '',
            hotManga: '',
            hotVariety: '',
            smallfilm: ''
        };
        data.style = style;
        data.random = random;
        diediao.playParse(url, function(err, parse) {
            if (err) {
                res.render('error', {});
                return;
            }
            if (!parse) {
                res.render('error', {});
                return;
            }
            data.vid = urlencode(parse.vid);
            data.playname = parse.playname;
            if (data.playname == 'tudou') {
                data.path = parse.path;
            }
            res.render('film/video', data);
            return;
        });
    });
});

router.get('/ppyun', function(req, res, next) {
    res.render('film/ppyun');
});

//获取播放器 视频最长实效时间为600 获取播放参数
router.get('/player', function(req, res, next) {
    var vid = req.query.vid || 0;
    var playname = req.query.playname || '';
    var random = Math.random();
    diediao.getPlayer(vid, playname, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }
        if (typeof(data.playerurl) != "undefined") {
            if (playname == 'newvip') {
                data.playerurl = vid;
            }
        }

        if (typeof(data.playerurl) == "undefined") {
            data.playerurl = '/film/player?vid=' + vid + '&playname=' + playname;
        }
        data.vid = vid;
        data.playname = playname;
        res.render('film/player', data);
        return;
    });
});


//pc播放
router.get('/parsepc', function(req, res, next){
    var vid = req.query.vid || 0;
    var playname = req.query.playname || '';
    res.set({
        "Content-Type": "text/xml; charset=utf-8"
    });
    diediao.getPlayerPc(vid, playname, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }
        return res.send(data);
    });
});


//列表
router.get('/dianshiju', function(req, res, next) {
    var cid = req.query.cid || '/tv/index_';
    var page = req.query.page || '______1';
    var random = Math.random();
    var p = req.query.p || 1;
    if (cid == '' || cid == 'undefined') {
        res.render('error', {});
        return;
    }
    var url = cid + p + page;
    diediao.getList(url, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }
        if (!data) {
            res.render('error', {});
            return;
        }
        var style = {
            index: '',
            hotDrama: 'cur',
            hotFilm: '',
            hotManga: '',
            hotVariety: '',
            smallfilm: ''
        };
        data.p = p;
        data.cid = cid;
        data.page = page;
        data.style = style;
        data.random = random;
        res.render('film/dianshiju', data);
        return;
    });
});

//电影
router.get('/film', function(req, res, next) {
    var cid = req.query.cid || '/movie/index_';
    var page = req.query.page || '______1';
    var random = Math.random();
    page = urlencode(page);
    var p = req.query.p || 1;
    if (cid == '' || cid == 'undefined') {
        res.render('error', {});
        return;
    }
    var url = cid + p + page;
    diediao.getList(url, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }
        if (!data) {
            res.render('error', {});
            return;
        }
        data.p = p;
        var style = {
            index: '',
            hotDrama: '',
            hotFilm: 'cur',
            hotManga: '',
            hotVariety: '',
            smallfilm: ''
        };
        data.cid = cid;
        data.page = page;
        data.style = style;
        data.random = random;
        res.render('film/film', data);
        return;
    });
});

//动漫
router.get('/hotManga', function(req, res, next) {
    var cid = req.query.cid || '/Animation/index_';
    var page = req.query.page || '_______1';
    var random = Math.random();
    var p = req.query.p || 1;
    if (cid == '' || cid == 'undefined') {
        res.render('error', {});
        return;
    }
    var url = cid + p + page;
    diediao.getList(url, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }
        if (!data) {
            res.render('error', {});
            return;
        }
        data.p = p;
        var style = {
            index: '',
            hotDrama: '',
            hotFilm: '',
            hotManga: 'cur',
            hotVariety: '',
            smallfilm: ''
        };
        data.cid = cid;
        data.page = page;
        data.style = style;
        data.random = random;
        res.render('film/hotManga', data);
        return;
    });
});

//综艺
router.get('/hotVariety', function(req, res, next) {
    var cid = req.query.cid || '/Arts/index_';
    var page = req.query.page || '_______1';
    var random = Math.random();
    var p = req.query.p || 1;
    if (cid == '' || cid == 'undefined') {
        res.render('error', {});
        return;
    }
    var url = cid + p + page;
    diediao.getList(url, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }
        if (!data) {
            res.render('error', {});
            return;
        }
        data.p = p;
        var style = {
            index: '',
            hotDrama: '',
            hotFilm: '',
            hotManga: '',
            hotVariety: 'cur',
            smallfilm: ''
        };
        data.cid = cid;
        data.page = page;
        data.style = style;
        data.random = random;
        res.render('film/hotVariety', data);
        return;
    });
});

//微电影
router.get('/smallfilm', function(req, res, next) {
    var cid = req.query.cid || '/microfilm/index_';
    var page = req.query.page || '_______1';
    var random = Math.random();
    var p = req.query.p || 1;
    if (cid == '' || cid == 'undefined') {
        res.render('error', {});
        return;
    }
    var url = cid + p + page;
    diediao.getList(url, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }
        if (!data) {
            res.render('error', {});
            return;
        }
        data.p = p;
        var style = {
            index: '',
            hotDrama: '',
            hotFilm: '',
            hotManga: '',
            hotVariety: '',
            smallfilm: 'cur'
        };
        data.cid = cid;
        data.page = page;
        data.style = style;
        data.random = random;
        res.render('film/smallfilm', data);
        return;
    });
});

//搜索
router.get('/search', function(req, res, next) {
    var wd = req.query.wd || '';
    var page = req.query.page || '1';
    if (wd == '' || wd == 'undefined') {
        res.render('error', {});
        return;
    }
    var keywords = wd;
    var random = Math.random();
    diediao.search(wd, page, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }
        if (!data) {
            res.render('error', {});
            return;
        }
        data.wd = keywords;
        data.page = page;
        var style = {
            index: 'cur',
            hotDrama: '',
            hotFilm: '',
            hotManga: '',
            hotVariety: '',
            smallfilm: ''
        };
        data.style = style;
        data.random = random;
        res.render('film/search', data);
        return;
    });
});

//排行榜－－总榜
router.get('/top', function(req, res, next) {
    var random = Math.random();
    diediao.getTop(function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }
        if (!data) {
            res.render('error', {});
            return;
        }
        var style = {
            index: 'cur',
            hotDrama: '',
            hotFilm: '',
            hotManga: '',
            hotVariety: '',
            smallfilm: ''
        };
        data.style = style;
        data.random = random;
        res.render('film/top', data);
        return;
    });
});

//排行榜－－其它榜单
router.get('/rank', function(req, res, next) {
    var cid = req.query.cid || 'mov';
    var random = Math.random();
    diediao.otherTop(cid, function(err, data) {
        if (err) {
            res.render('error', {});
            return;
        }
        if (!data) {
            res.render('error', {});
            return;
        }
        var style = {
            index: '',
            hotDrama: '',
            hotFilm: '',
            hotManga: '',
            hotVariety: '',
            smallfilm: ''
        };
        switch (cid) {
            case 'mov':
                style.hotFilm = 'cur';
                break;
            case 'tv':
                style.hotDrama = 'cur';
                break;
            case 'comic':
                style.hotManga = 'cur';
                break;
            case 'variety':
                style.hotVariety = 'cur';
                break;
            case 'weidy':
                style.smallfilm = 'cur';
                break;
            default:
                style.hotFilm = 'cur';
                break;
        };
        data.style = style;
        data.random = random;
        res.render('film/rank', data);
        return;
    });
});

//获取展示二维码
router.get('/qrcode', function(req, res, next) {
    var host = req.headers.host;
    var token = host.split('.bbw360.cn');
    home.common('http://move.taoyumin.cn/index.php?r=token/get', {
            userName: token[0]
        })
        .then(function(data) {
            var obj = {};
            if (data.state == 1000) {
                obj.nick_name = data.data[0].nick_name;
                var image = 'http://open.weixin.qq.com/qr/code/?username=' + data.data[0].token;
                var name = home.base_64('关注【' + data.data[0].nick_name + '】');
                var token = '&watermark/3/image/' + home.base_64(image) + '/dissolve/100/gravity/West/dx/50/dy/50/ws/0.7/watermark/3/text/' + name + '/font/5a6L5L2T/fontsize/700/fill/I0U5MTAxMA==/dissolve/100/gravity/NorthWest/dx/60/dy/30';
                var random = Math.random();
                obj.img = 'http://7fvit8.com1.z0.glb.clouddn.com/free_pic_guanzhu.jpg?v=' + random + token;
                obj.member_url = data.data[0].member_url;
            } else {
                app.set('nick_name', '免费电影院');
                obj.nick_name = '免费电影院';
                var image = 'http://open.weixin.qq.com/qr/code/?username=gh_53a3e9594c6a';
                var name = home.base_64('关注【免费电影院】');
                var token = '?watermark/3/image/' + home.base_64(image) + '/dissolve/100/gravity/West/dx/50/dy/50/ws/0.7/watermark/3/text/' + name + '/font/5a6L5L2T/fontsize/700/fill/I0U5MTAxMA==/dissolve/100/gravity/NorthWest/dx/60/dy/30';
                obj.img = 'http://7fvit8.com1.z0.glb.clouddn.com/free_pic_guanzhu.jpg' + token;
                obj.member_url = 'http://t.cn/R4OEgkh';
            }
            res.json(obj);

        }, function(error) {
            
        });
});

//分享结果页
router.get('/share', function(req, res, next) {
    var isaccount = req.cookies.account || "";
    var random = Math.random();
    var args = {
        username: "",
        password: ""
    };
    if (isaccount == "") {
        loldy.xunleiAccount().then(function(account) {
            var data = account.data;
            if (parseInt(account.state) == 1000) {
                var obj = JSON.stringify(data);
                res.cookie('account', obj, {
                    maxAge: 20000 * 1000,
                    httpOnly: true,
                    path: '/'
                }); //cooike 时长 30 sec
                args.username = data.name;
                args.password = data.passWord;
            }
            res.render('film/share', args);
        });
    } else {
        var data = JSON.parse(isaccount);
        args.username = data.name;
        args.password = data.passWord;
        res.render('film/share', args);
    }

});
module.exports = router;
