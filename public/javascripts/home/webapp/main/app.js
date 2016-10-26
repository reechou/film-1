define('main/app', function(require, exports, module) {
    var Vue = require('vue');
    var VueRouter = require('vue-router');
    Vue.use(VueRouter);
    var App = Vue.extend({});
    var router = new VueRouter();


    router.map({
        '/source/list': {
            name: 'source_list',
            component: require('../module/source_list')
        }
    });

    //路由重定向
    router.redirect({
        '/': '/source/list'
    });
    // 现在我们可以启动应用了！
    router.beforeEach(function (transition) {
      transition.next();
    })
    // 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
    router.start(App, '#app');
});
