define('module/source_list', function(require, exports, module) {
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
    var Profile = Vue.extend({
        name: 'source_list',
        init: function() {
            console.log(this.$route);
        },
        created: function() {
            //此处为初始化数据请求
        },
        ready: function() {
            this.$http.get('/home/source_list')
                .then(function(response) {
                    var res = response.data;
                    this.username = res.username;
                    if (res.state == 1000) {
                        this.$set('source_list', res.data);
                    }
                }, function() {

                });
        },
        data: function() {
            return {
                item: {
                    nick_name: "",
                    token: "",
                    qq: "",
                    url: "",
                    member_url: ""
                },
                username: "",
                source_list: [],
                error_message: '错误提示',
                display: 'none',
                index: 0
            }
        },
        route: {
            data: function(transition) {
                // console.log(transition);
            }
        },
        template: require('../components/source_list.tpl'),
        methods: {
            //弹出框
            showDialog: function() {
                this.item.token = "";
                this.display = 'block';
            },
            //隐藏弹窗
            hideSource: function() {
                this.display = 'none';
            },
            //修改
            modify: function(item, index) {
                this.item = item;
                this.index = index;
                this.display = 'block';
            },
            //提交修改
            updateSource: function() {
                var self = this;
                this.$http.post('/home/updateSource', this.item, headers)
                    .then(function(response) {
                        var res = response.data;
                        if (res.state == 1000) {
                            self.item = "";
                            self.source_list.$set(self.index, self.item);
                            self.display = 'none';
                        }
                    }, function() {

                    });
            },
            //删除
            removeSource: function(source) {
                var self = this;
                this.$http.post('/home/delSource', source, headers)
                    .then(function(response) {
                        var res = response.data;
                        if (res.state == 1000) {
                            self.source_list.$remove(source);
                        }
                    }, function(error) {

                    });
            },
            //数据请求
            addSource: function() {
                var self = this;
                if (this.item.nick_name == "") {
                    this.error_message = '来源名称不能为空';
                    return false;
                }
                if (this.item.token == "") {
                    this.error_message = '原始ID不能为空';
                    return false;
                }
                this.item.url = 'http://' + this.item.token + '.bbw360.cn';
                this.$http.post('/home/source_add', this.item, headers)
                    .then(function(response) {
                        var res = response.data;
                        if (res.state == 1000) {
                            self.source_list.push(self.item);
                            self.item = "";
                            self.display = 'none';
                        } else {
                            alert(res.message);
                        }
                    }, function() {

                    });

            },
            greet: function() {
                this.lastName += 'yxzjggjgjgjgjjgjg';
            },
            btn: function(item) {
                this.items.$remove(item);
            }
        }
    });

    module.exports = Profile;
});
