<section>
    <h2><strong style="color:grey;">视频采集</strong></h2>
    <ul class="ulColumn2">
        <li>
            <span class="item_name" style="width:120px;">请选择数据源：</span>
            <select class="select" v-model="movie_source.selected">
                  <option value="0">选择数据源</option>
                  <option v-for="option in movie_source.options" v-bind:value="option.id">
                    {{ option.source_name }}
                  </option>
            </select>
        </li>
        <li>
            <span class="item_name" style="width:120px;">请选择视频类型：</span>
            <select class="select" v-model="movie_type.selected">
                  <option value="0">选择视频类型</option>
                  <option v-for="option in movie_type.options" v-bind:value="option.id">
                    {{ option.name }}
                  </option>
            </select>
        </li>
        <li>
            <span class="item_name" style="width:120px;">视频详情url：</span>
            <input type="text" class="textbox textbox_295" v-model="videos.url" placeholder="请输入采集源视频URL地址..." />
            <button class="link_btn" id="showPopTxt" v-on:click="collect()">采集视频</button>
        </li>
        <li>
            <span class="item_name" style="width:120px;">视频标题：</span>
            <input type="text" class="textbox textbox_295" placeholder="视频标题..." v-model="videos.title"/>
            <span class="errorTips">采集时若无法获取请手动填写视频标题</span>
        </li>
        <li>
            <span class="item_name" style="width:120px;">视频封面图：</span>
            <input type="text" class="textbox textbox_295" placeholder="视频封面图地址..." v-model="videos.img" />
            <span class="errorTips">采集时若无法获取请手动填写视频封面图url</span>
        </li>
        <li>
            <span class="item_name" style="width:120px;"></span>
            <input type="button" class="link_btn" value="提交" />
        </li>
    </ul>
</section>
<section class="loading_area" v-bind:style="{display: display}">
    <div class="loading_cont">
        <div class="loading_icon"><i></i><i></i><i></i><i></i><i></i></div>
        <div class="loading_txt">
            <mark>数据采集中....，请稍后！</mark>
        </div>
    </div>
</section>