var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var domain = require('domain');
var routes = require('./routes/index');
var users = require('./routes/users');
var activity = require('./routes/activity');
var film = require('./routes/film');
var sharp = require('./routes/sharp');
var search = require('./routes/search');
var yourjam = require('./routes/yourjam');
var oauth = require('./routes/oauth');
var kuyi = require('./routes/kuyi');

//管理后台页面
var home = require('./routes/home');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') == 'production') {
    app.use(session({
        resave: false,
        saveUninitialized: true,
        store: new RedisStore({
            "host": "120.26.230.235",
            "port": 6379,
            "ttl": 60*60*2,
            "pass": "jianshen!@#",
            "db": 0
        }),
        secret: 'node_film'
    }));
} else {
    app.use(session({
        resave: false,
        saveUninitialized: true,
        store: new RedisStore({
            "host": "120.26.230.235",
            "port": 6379,
            "ttl": 60*60*2,
            "pass": "jianshen!@#",
            "db": 0
        }),
        secret: 'node_film'
    }));
}

app.use('/', routes);
app.use('/users', users);
app.use('/activity', activity);
app.use('/film', film);
app.use('/sharp', sharp);
app.use('/yourjam', yourjam);
app.use('/home', home);
app.use('/search', search);
app.use('/oauth', oauth);
app.use('/kuyi', kuyi);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//引入一个domain的中间件，将每一个请求都包裹在一个独立的domain中
//domain来处理异常
app.use(function (req,res, next) {
  var d = domain.create();
  //监听domain的错误事件
  d.on('error', function (err) {
    logger.error(err);
    res.statusCode = 500;
    res.json({sucess:false, messag: '服务器异常'});
    d.dispose();
  });
  
  d.add(req);
  d.add(res);
  d.run(next);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
