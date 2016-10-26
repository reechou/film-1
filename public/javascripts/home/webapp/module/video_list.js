define('module/video_list', function(require, exports, module) {
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
    var VideoList = Vue.extend({
        name: 'video_list',
        init: function() {

        },
        created: function() {
            //此处为初始化数据请求
        },
        ready: function() {
            this.videoList();
        },
        data: function() {
            return {
                page: 1,
                totalpage: 1,
                total: 1,
                videos: [],
                error_message: '错误提示',
                display: 'none',
                index: 0
            }
        },
        template: require('../components/video_list.tpl'),
        methods: {
            //分页加载列表
            videoList: function() {
                var self = this;
                this.$http.get('/home/video_list?page=' + this.page)
                    .then(function(response) {
                        var res = response.data;
                        if (res.state == 1000) {
                            self.$set('videos', res.data.list);
                            self.$set('totalpage', res.data.totalpage);
                            self.$set('total', res.data.total);
                            self.$set('page', res.data.page);
                        }
                    }, function(error) {

                    });
            },
            pre: function() {
                if (this.page > this.totalpage) {
                    return false;
                }
                this.page--;
                this.videoList();
            },
            next: function() {
                if (this.totalpage <= this.page) {
                    return false;
                }
                this.page++;
                this.videoList();
            },
            //更新
            update: function(item, index) {
                var self = this;
                this.$http.post('/home/updateVideo', item, headers)
                    .then(function(response) {
                        var res = response.data;
                        if (res.state == 1000) {
                            item.mtime = res.data;
                            self.videos.$set(index, item);
                        }
                    }, function(error) {
                        console.log(error);
                    });
            },
            //删除
            remove: function(item) {
                var self = this;
                this.$http.post('/home/delVideo', item, headers)
                    .then(function(response) {
                        var res = response.data;
                        if (res.state == 1000) {
                            self.videos.$remove(item);
                        }
                    }, function(error) {

                    });
            }
        }
    });

    module.exports = VideoList;
});
