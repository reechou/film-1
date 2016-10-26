var mysql = require('mysql');
var config = require('../config');

//数据库连接封装
var DbUtil = {
    connection: function() {
        var pool = mysql.createPool({
            host: config.DB.HOST,
            user: config.DB.USER,
            password: config.DB.PASSWORD,
            database: config.DB.DATABASE,
            port: config.DB.port
        });
        return pool;
    },
    close: function(pool){
    	pool.end();
    }
};

module.exports = DbUtil;