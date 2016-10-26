define('module/video_collect', function(require, exports, module) {
    var Vue = require('vue');
    var VueRouter = require('vue-router');
    var VueResource = require('vue-resource');
    Vue.use(VueResource);
    Vue.use(VueRouter);
    var headers = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        emulateJSON: true
    };
    // 定义组件
    var VideoCollect = Vue.extend({
        name: 'video_collect',
        ready: function() {
        	this.movieSourceList();
        },
        data: function() {
        	//1表示电影，2表示 美剧，3韩剧，4表示国产剧，5表示综艺，0表示推荐
            return {
                movie_source: {
                    selected: '0',
                    options: [{
                        'source_name': '请选择数据源',
                        'id': '0'
                    }]
                },
                display: 'none',
                movie_type: {
                    selected: '0',
                    options: [
                    	{'name': '电影', 'id': '1'},
                    	{'name': '美剧', 'id': '2'},
                    	{'name': '韩剧', 'id': '3'},
                    	{'name': '国产剧', 'id': '4'},
                    	{'name': '综艺', 'id': '5'},
                    	{'name': '推荐', 'id': '0'},
                    ]
                },
                videos: {
                    id: '',
                    source_id: '',
                    url: '',
                    type: '',
                    title: '',
                    img: '',
                    snum: '',
                    content: ''
                }
            }
        },
        template: require('../components/video_collect.tpl'),
        methods: {
            //数据采集
            collect: function() {
                var self = this;
                var options = {
                	source_id: this.movie_source.selected,
                	url: this.videos.url
                };
                this.display = 'block';
                this.$http.post('/home/collect', options, headers)
                    .then(function(response) {
                        var res = response.data;
                        if (res.state == 1000) {
                        	this.display = 'none';
                        }
                    }, function() {

                    });           	
            },
            //获取采集源地址类型
            movieSourceList: function() {
                this.$http.get('/home/source_list')
                    .then(function(response) {
                        var res = response.data;
                        if (res.state == 1000) {
                            this.$set('movie_source.options', res.data);
                        }
                    }, function() {

                    });
            },
        }
    });

    module.exports = VideoCollect;
});
