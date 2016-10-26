<p v-on:click="greet">{{firstName}} {{lastName}} aka {{alias}}</p>

<p>当前路径: {{$route.path}}</p>
<ul>
	<template v-for="item in items">
	<li>{{item.id}} </li>
	<li>{{item.name}}</li>
	<li><button v-on:click="btn(item)">添加</button></li>
	</template>
</ul>

<select v-model="selected">
  <!-- 对象字面量 -->
  <option v-bind:value="{userid: 1, id: 2}">是</option>
  <option v-bind:value="{userid: 3, id: 4}">否</option>
</select>
{{ selected.id }}
