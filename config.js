var express = require('express');
var app = express();
//全局配置文件
if (app.get('env') == 'production') {
    var Config = {
        'REDIS': {
            'RDS_PORT': '6379',
            'RDS_HOST': '120.26.230.235',
            'RDS_AUTH': 'jianshen!@#'
        },
        HTTP_HOST: [
            'http://api2.gatao.cn',
            'http://121.40.41.198:8088'
        ],
        hostname: 'www.bbw360.cn',
        member_public: {
            title: '免费电影院',
            url: 'http://t.cn/R4OEgkh',
            logo: 'http://7xlqmn.com2.z0.glb.qiniucdn.com/wxdianyin.jpg'
        },
        member_config: {
            appid: 'wxfe19b1624d4e5592',
            secret: 'a3681a17e3ef7853f1f75a79a2fbe181',
            token: 'gh_ef0f320cc58d',
            access_token_prefix: 'access_token_prefix_',
            jsticket: 'jsticket_'
        },
        DB: {
            HOST: 'shanzhuan.mysql.rds.aliyuncs.com',
            USER: 'weiphp',
            PASSWORD: 'weiphp098765',
            PORT: '3306',
            DATABASE: 'movie'
        },
        //转盘中奖概率
        probability: 30,

        //迅雷中奖键
        xunlei_vip_lottery: 'xunlei_vip_lottery_',

        //迅雷账号
        xunlei_vip: 'xunlei_vip',

        //==========抽奖次数==========
        xunlei_record_num: 'xunlei_record_',
    };
} else {
    var Config = {
        'REDIS': {
            'RDS_PORT': '6379',
            'RDS_HOST': '120.26.230.235',
            'RDS_AUTH': 'jianshen!@#'
        },
        HTTP_HOST: [
            'http://api2.gatao.cn',
            'http://121.40.41.198:8088'
        ],
        member_public: {
            title: '免费电影院',
            url: 'http://t.cn/R4OEgkh',
            logo: 'http://7xlqmn.com2.z0.glb.qiniucdn.com/wxdianyin.jpg'
        },
        member_config: {
            appid: 'wxb86df8e64a5ed4cd',
            secret: 'a3681a17e3ef7853f1f75a79a2fbe181',
            token: 'gh_ef0f320cc58d',
            access_token_prefix: 'access_token_prefix_',
            jsticket: 'jsticket_'
        },
        DB: {
            HOST: 'shanzhuan.mysql.rds.aliyuncs.com',
            USER: 'weiphp',
            PASSWORD: 'weiphp098765',
            PORT: '3306',
            DATABASE: 'movie'
        },
        hostname: 'localhost:3002',
        //转盘中奖概率
        probability: 30,
        //迅雷中奖键
        xunlei_vip_lottery: 'xunlei_vip_lottery_',
        //迅雷账号
        xunlei_vip: 'xunlei_vip',
        //==========抽奖次数==========
        xunlei_record_num: 'xunlei_record_',
    };
}
module.exports = Config;
