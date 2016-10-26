define('module/profile', function(require, exports, module) {
    var Vue = require('vue');
    var VueRouter = require('vue-router');
    var VueResource = require('vue-resource');
    Vue.use(VueResource);
    Vue.use(VueRouter);
    // 定义组件
    var Profile = Vue.extend({
        name: 'home',
        init: function() {
            console.log(this.$route);
            console.log('init webapp .......');
        },
        created: function() {
            //此处为初始化数据请求
            this.lastName = 'yxzjggjgjgjgjjgjg';
        },
        data: function() {
            return {
                firstName: 'f',
                lastName: 'c',
                alias: 'd',
                items: [
                    {id: 1, name: 'yxz'},
                    {id: 2, name: 'xixioa'}
                ],
                selected: '0'
            }
        },
        route: {
            data: function(transition){
                console.log(transition);
            }  
        },
        template: require('../components/home.tpl'),
        methods: {
            greet: function() {
                this.lastName += 'yxzjggjgjgjgjjgjg';
            },
            btn: function(item){
                this.items.$remove(item);
            }
        }
    });

    module.exports = Profile;
});
