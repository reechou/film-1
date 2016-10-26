var express = require('express');
var router = express.Router();
var test = require('../model/test');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('test/player');
});
router.get('/flv', function(req, res, next) {
	res.set({
		"Content-Type": "text/xml; charset=utf-8"
	});
	test.flv().then(function(data){
		return res.send(data);
	});
});
module.exports = router;
