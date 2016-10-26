// var reg = /p-/;
// var str = "listdir-tv-lz--year--letter--order--area--picm--";
// var res = str.search(reg);
// console.log(res);
// var request = require("request");
// // var options = {
// //   url: 'http://vipnew.kb20.cc:7788/yun/?h=200&vid=http://www.iqiyi.com/v_19rrl14c7g.html',
// //   headers: {
// //     'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53',
// //     'Referer': 'http://m.kb20.cc/SouthKorea/taiyangdehouyi/player-1-3.html'
// //   }
// // };
//     var args = {
//         clientOpendId: 'xxx',
//         fromUserName: 'xxx',
//         userOpenId: 'xxx'
//     };
// var url = 'http://pay.gatao.cn/index.php?r=wxhongbao/userfous';
//                 // request(url, function(err, response, data) {
//                 // 	console.log(data);
//                 // });
// request.post({url:url, form: args}, function(err,httpResponse,data){
//     console.log(data);           
// });
//http://v.youku.com/v_show/id_XMTQ0NTI3Mzk0OA==.html
var kuyi = require('./model/kuyi');
var params ={ time: '1464229966',
  key: '0ce7ae487047e9129d700189b5dfdb6f',
  url: 'http://www.le.com/ptv/vplay/24664041.html',
  type: 'letv_vip' };
// kuyi.parse('http://www.le.com/ptv/vplay/24664041.html&type=letv_vip').then(function(data){
// 	console.log(data);
// });
kuyi.player(params).then(function(data) {
    console.log(data.url);
});
