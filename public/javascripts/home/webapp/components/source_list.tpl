
                <section class="pop_bg" v-bind:style="{display: display}">
                    <div class="pop_cont">
                        <!--title-->
                        <h3>添加配置</h3>
                        <!--content-->
                        <div class="pop_cont_input">
                            <ul>
                                <li>
                                    <span>公众号名称</span>
                                    <input v-model="item.nick_name" type="text" placeholder="公众号名称" class="textbox" value="{{item.nick_name}}" />
                                </li>
                                <li>
                                    <span class="ttl">公众号原始ID</span>
                                    <input v-model="item.token" type="text" placeholder="公众号原始ID" value="{{item.token}}" class="textbox" />
                                </li>
                                <li>
                                    <span class="ttl">公众号链接</span>
                                    <input v-model="item.member_url" type="text" placeholder="公众号原始ID" value="{{item.member_url}}" class="textbox" />
                                </li>
                                <li>
                                    <span>联系qq</span>
                                    <input v-model="item.qq" type="text" placeholder="联系qq" class="textbox" value="{{item.qq}}" />
                                </li>
                            </ul>
                        </div>
                        <!--以pop_cont_text分界-->
                        <div class="pop_cont_text">
                            {{error_message}}
                        </div>
                        <!--bottom:operate->button-->
                        <div class="btm_btn">
                            <input type="button" value="确认" class="input_btn trueBtn" v-on:click="addSource()"/>
                            <input type="button" value="关闭" class="input_btn falseBtn" v-on:click="hideSource()"/>
                        </div>
                    </div>
                </section>
                <!--结束：弹出框效果-->
                <section>
                    <h2><strong style="color:grey;"></strong></h2>
                    <div class="page_title">
                        <h2 class="fl">公众号配置列表,你的专属链接为http://{{username}}.bbw360.cn</h2>
                        <a class="fr top_rt_btn" v-on:click="showDialog()">添加来源</a>
                    </div>
                    <table class="table">
                        <tr>
                            <th>编号</th>
                            <th>公众号名称</th>
                            <th>公众号二维码</th>
                            <th>联系qq</th>
                        </tr>
                        <tr v-for="item in source_list">
                            <td>
                                {{item.id}}
                            </td>
                            <td>{{item.nick_name}}</td>
                            <td><img width="60px" height="60px" src="http://open.weixin.qq.com/qr/code/?username={{item.token}}"></td>
                            <td>{{item.qq}}</td>
                            <td>
                                <!-- <a v-on:click="removeSource(item)">删除</a> -->
                                <a v-on:click="modify(item,$index)" class="inner_btn">修改</a>
                            </td>
                        </tr>
                    </table>
                </section>