var Promise = require("bluebird");
var request = Promise.promisifyAll(require('request'));
var co = require('co');

function Test(){};
Test.prototype.flv = co.wrap(function*() {
	//视频流解析
    var options = {
        url: "https://yunbofang.duapp.com/parse.php?xmlurl=http%3A%2F%2Fwww.bilibili.com%2Fvideo%2Fav2204542%2F&tm=1467284123&sign=0523ef0a0d85a5c7f4fef5ec37a74110&userlink=http%3A%2F%2Fwww.kb20.cc%2FHorror%2Fmojieqiyue%2Fplayer-2-0.html",
        headers: {
            "Referer": "https://yunbofang.duapp.com/player.php?vid=3612412~21573185.acfun",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
            "X-Requested-With": "ShockwaveFlash/22.0.0.192"
        }
    };
    var response = yield request.getAsync(options);
    return response.body;
});
module.exports = new Test();