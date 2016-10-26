                <!--结束：弹出框效果-->
                <section>
                    <h2><strong style="color:grey;">电影来源，目前支持www.jinzidu.com,www.cswanda.com）</strong></h2>
                    <div class="page_title">
                        <h2 class="fl">视频列表</h2>
                    </div>
                    <table class="table">
                        <tr>
                            <th>编号</th>
                            <th>名称</th>
                            <th>来源URL</th>
                            <th>封面图</th>
                            <th>类型</th>
                            <th>创建时间</th>
                            <th>更新时间</th>
                            <th>状态</th>
                        </tr>
                        <tr v-for="item in videos">
                            <td>
                                {{item.id}}
                            </td>
                            <td>{{item.title}}</td>
                            <td>{{item.url}}</td>
                            <td><img src="{{item.img}}" width="90px" height="120px" /></td>
                            <td>{{item.snum}}</td>
                            <td>{{item.ctime}}</td>
                            <td>{{item.mtime}}</td>
                            <td>
                                <a v-on:click="remove(item)">删除</a>
                                <a v-on:click="update(item,$index)" class="inner_btn">更新</a>
                            </td>
                        </tr>
                    </table>
                    <aside class="paging">
                        <a v-on:click="pre()">上一页</a>
                        <a v-on:click="next()">下一页</a>
                    </aside>
                </section>