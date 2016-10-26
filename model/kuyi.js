var cheerio = require("cheerio"); //引用cheerio模块,使在服务器端像在客户端上操作DOM,不用正则表达式
var httpHelper = require("../common/httpHelper");
var host = 'http://www.kuyiyuan.cn';
var http = require('http');
var Buffer = require('buffer').Buffer;
var Q = require('q');
var request = require('request');
var validator = require('validator');
var redisClient = require('../common/redisclient');
var client = redisClient.connection();
var Kuyi = {

    index: function() {
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 wechatdevtools/0.7.0 MicroMessenger/6.3.9 Language/zh_CN webview/0',
            'Referer': 'http://www.kuyiyuan.cn/home/index/movielist/type_id/6.html'
        };
        var url = host;
        var options = {
            url: url,
            headers: headers
        };
        var args = {
            status: 0,
            data: {
                rec_mov: [],
                online_mov: [],
                hot_mov: []
            }
        };

        var deferred = Q.defer();
        client.get(url).then(function(redisData) {
            if (redisData) {
                var data = JSON.parse(redisData);
                deferred.resolve(data);
            } else {
                request(options, function(err, response, body) {
                    if (body) {
                        var doc = body.toString();
                        var $ = cheerio.load(doc);

                        //最近              
                        $('.float').eq(1).find('.screem640').find('ul').find('li').each(function() {
                            var list = {};
                            var reg = /\/home\/index\/moviecontent\/id\/(.*?)\.html/g
                            var url = $(this).find('a').attr('href');
                            var match = reg.exec(url);
                            list.id = match[1];
                            list.img = $(this).find('img').attr('src');
                            list.title = $(this).find('img').attr('alt');
                            args.data.rec_mov.push(list);
                        });

                        //上线
                        $('.float').eq(2).find('.screem640').find('ul').find('li').each(function() {
                            var list = {};
                            var reg = /\/home\/index\/moviecontent\/id\/(.*?)\.html/g
                            var url = $(this).find('a').attr('href');
                            var match = reg.exec(url);
                            list.id = match[1];
                            list.img = $(this).find('img').attr('src');
                            list.title = $(this).find('img').attr('alt');
                            args.data.online_mov.push(list);
                        });

                        //最热
                        $('.float').eq(3).find('.screem640').find('ul').find('li').each(function() {
                            var list = {};
                            var reg = /\/home\/index\/moviecontent\/id\/(.*?)\.html/g
                            var url = $(this).find('a').attr('href');
                            var match = reg.exec(url);
                            list.id = match[1];
                            list.img = $(this).find('img').attr('src');
                            list.title = $(this).find('img').attr('alt');
                            args.data.hot_mov.push(list);
                        });
                        if (args.data.rec_mov.length > 0) {
                            client.setex(host, 7200, JSON.stringify(args));
                        }
                        deferred.resolve(args);
                    } else {
                        deferred.resolve(args);
                    }
                });
            }
        });
        return deferred.promise;
    },
    //获取列表
    /**
     * type_id: 3 喜剧，4 恐怖，5 爱情，6 动作，7 科幻，8 战争， 9 犯罪， 10 动画， 11 剧情， 12 古装 13 冒险
     *  14 悬疑， 15 传记， 16 青春 17 灾难
     *  distrit_id: 0 全片 1 内地 2 港台 3 日韩 4 欧美
     */
    //http://www.kuyiyuan.cn/home/index/getmoviebytypeanddistritandkey.html?page=1&type_id=6&distrit_id=5&order=0&key=
    list: function(page, type_id, distrit_id, order) {
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 wechatdevtools/0.7.0 MicroMessenger/6.3.9 Language/zh_CN webview/0',
            'Referer': 'http://www.kuyiyuan.cn/home/index/movielist/type_id/6.html'
        };
        var url = host + '/home/index/getmoviebytypeanddistritandkey.html?page=' + page + '&type_id=' + type_id + "&distrit_id=" + distrit_id + "&order=" + order + "&key=";
        var options = {
            url: url,
            headers: headers
        };
        var args = {
            status: 0,
            data: ""
        };
        var deferred = Q.defer();
        request(options, function(err, response, body) {
            if (body) {
                body = validator.trim(body);
                var reg = /<a href=(.*?)<\\\/a>/g;
                body = body.replace(reg, '');
                args.data = JSON.parse(body);
                deferred.resolve(args);
            } else {
                deferred.resolve(args);
            }
        });
        return deferred.promise;
    },

    //详情
    detail: function(id) {
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 wechatdevtools/0.7.0 MicroMessenger/6.3.9 Language/zh_CN webview/0',
            'Referer': 'http://www.kuyiyuan.cn/home/index/movielist/type_id/6.html'
        };
        var url = host + '/home/index/movieplay/id/' + id + '.html';
        var options = {
            url: url,
            headers: headers
        };
        var args = {
            status: 0,
            data: {
                title: "",
                iframe: ""
            }
        };
        var deferred = Q.defer();
        request(options, function(err, response, body) {
            if (body) {
                var doc = body.toString();
                var $ = cheerio.load(doc);
                var iframe = $('iframe').attr('src');
                args.data.title = $('.detail_top').find('span').text();
                // args.data.iframe = iframe;
                if (iframe.indexOf('http://t.cn') != -1) {
                    options.url = iframe;
                    request(options, function(err, respos, data) {
                        args.data.iframe = 'http://' + respos.req._headers.host + respos.req.path;
                        console.log(args.data.iframe);
                        deferred.resolve(args);
                    });
                } else {
                    args.data.iframe = iframe;
                    deferred.resolve(args);
                }

            } else {
                deferred.resolve(args);
            }
        });
        return deferred.promise;
    },

    //解析
    parse: function(vid) {
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 wechatdevtools/0.7.0 MicroMessenger/6.3.9 Language/zh_CN webview/0',
            'Referer': 'http://www.kuyiyuan.cn/home/index/movieplay/id/629.html'
        };

        var args = {
            type: 1,
            data: ""
        };
        //game.hfghjg.com.cn
        if (vid.indexOf('game.hfghjg.com.cn') != -1) {
            if (vid.indexOf('http://58.218.199.108:8989') != -1) {
                var options = {
                    url: vid,
                    headers: headers
                };
                var deferred = Q.defer();
                request(options, function(err, response, body) {
                    if (body) {
                        var reg = /\$\.post\(\"url\.php\"\, {(.*?)}/g;
                        var real_url = reg.exec(body); //real_url[1];
                        args.type = 3;
                        args.data = '{' + real_url[1] + '}';
                        deferred.resolve(args);
                    } else {
                        deferred.resolve(args);
                    }
                });
                return deferred.promise;
            } else {
                var options = {
                    url: vid,
                    headers: headers
                };
                var deferred = Q.defer();
                request(options, function(err, response, data) {
                    if (data) {
                        var reg = /var(.*?)urlplay(.*?)=(.*?)\'(.*?)\'/g;
                        var api = reg.exec(data);
                        var urlplay = api[4];
                        reg = /var(.*?)tm(.*?)=(.*?)\'(.*?)\'/g;
                        api = reg.exec(data);
                        var tm = api[4];
                        reg = /var(.*?)sign(.*?)=(.*?)\'(.*?)\'/g;
                        api = reg.exec(data);
                        var sign = api[4];
                        reg = /var(.*?)refer(.*?)=(.*?)\'(.*?)\'/g;
                        api = reg.exec(data);
                        var refer = api[4];
                        args.data = '/parse.php?h5url=' + urlplay + '&tm=' + tm + '&sign=' + sign + '&ajax=1&userlink=' + refer;
                        deferred.resolve(args);
                    } else {
                        deferred.resolve(args);
                    }
                });
                return deferred.promise;
            }
        } else {
            var options = {
                url: host + vid,
                headers: headers
            };
            var deferred = Q.defer();
            request(options, function(err, response, body) {
                if (body) {
                    var reg = /\$\.post\(\"api\.php\"\, {(.*?)}/g;
                    var real_url = reg.exec(body); //real_url[1];
                    args.type = 2;
                    args.data = '{' + real_url[1] + '}';
                    deferred.resolve(args);
                } else {
                    deferred.resolve(args);
                }
            });
            return deferred.promise;
        }
    },

    //播放 post
    player: function(params) {
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 wechatdevtools/0.7.0 MicroMessenger/6.3.9 Language/zh_CN webview/0',
            'Referer': 'http://www.kuyiyuan.cn/Public/ydisk/index.php?url=http://www.acfun.tv/v/ac2756643',
            'X-Requested-With': 'XMLHttpRequest'
        };
        var url = 'http://www.kuyiyuan.cn/Public/ydisk/api.php';
        var options = {
            url: url,
            form: JSON.parse(params),
            headers: headers
        };
        var deferred = Q.defer();
        request.post(options, function(err, response, body) {
            if (body) {
                body = validator.trim(body);
                var obj = JSON.parse(body);
                deferred.resolve(obj.url);
            } else {
                deferred.resolve('');
            }
        });
        return deferred.promise;
    },

    //播放type3
    playerType3: function(params){
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 wechatdevtools/0.7.0 MicroMessenger/6.3.9 Language/zh_CN webview/0',
            'Referer': 'http://game.hfghjg.com.cn/movie/index.php?http://58.218.199.108:8989/zdisk/?url=CMzc3NDYzMg==-ykyun',
            'X-Requested-With': 'XMLHttpRequest'
        };
        var url = 'http://game.hfghjg.com.cn/movie/url.php';
        var options = {
            url: url,
            form: JSON.parse(params),
            headers: headers
        };
        var deferred = Q.defer();
        request.post(options, function(err, response, body) {
            if (body) {
                body = validator.trim(body);
                var obj = JSON.parse(body);
                deferred.resolve(obj.url);
            } else {
                deferred.resolve('');
            }
        });
        return deferred.promise;
    },
    //播放get
    player_get: function(params) {
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 wechatdevtools/0.7.0 MicroMessenger/6.3.9 Language/zh_CN webview/0',
            'Referer': 'http://game.hfghjg.com.cn/movie/index.php?http://yunbofang.duapp.com/player.php?vid=3553382~7f363cae.acfun'
        };
        var url = 'http://game.hfghjg.com.cn/movie' + params;
        var options = {
            url: url,
            headers: headers
        };
        var deferred = Q.defer();
        request(options, function(err, response, body) {
            if (body) {
                body = validator.trim(body);
                deferred.resolve(body);
            } else {
                deferred.resolve('');
            }
        });
        return deferred.promise;
    },

    //搜索
    search: function(key){
        //http://www.kuyiyuan.cn/home/index/moviesearchlist?key=
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 wechatdevtools/0.7.0 MicroMessenger/6.3.9 Language/zh_CN webview/0',
            'Referer': 'http://www.kuyiyuan.cn/'
        };
        var options = {
            url: 'http://www.kuyiyuan.cn/home/index/moviesearchlist?key=' + key,
            headers: headers
        };
        var deferred = Q.defer();
        request(options, function(err, response, body){
            if (body) {
                body = validator.trim(body);
                var reg = /<a href=(.*?)<\\\/a>/g;
                body = body.replace(reg, '');
                var obj = JSON.parse(body);
                deferred.resolve(obj);
            }else{
                deferred.resolve([]);
            }
        });
        return deferred.promise;
    },
};
module.exports = Kuyi;
