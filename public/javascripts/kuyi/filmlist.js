var isEnd=false;

function getNews(type_id,distrit_id,order,recent,key){
	if(isEnd)return;
	var more=document.getElementById("more");
	$("#more").html('信息正在加载中..');
	var page = $("#page").text();
	page     =  parseInt(page)+1;
	$("#page").html(page);
	var url = "/kuyi/list?page="+page+"&type_id="+type_id+"&distrit_id="+distrit_id+"&order="+order+"&isrecent="+recent+"&key="+key;

	$.getJSON(url, function(data){
		var str = '';	
		if(data==null || data==false){
			isEnd=true;
			more.innerHTML="亲，没有电影了!";
			$("#more").click(function(){
				return false;
			});
		}else{
			var dlength = data.length; 		
			for(i=0;i<dlength;i++){
				var img   = "<div class='movieList'><a href='"+URL+"moviecontent.html?id="+data[i].id+"'><img src='\/Uploads\/"+data[i].picture_url+"' /></div>"
				
				var title = "<div class='movieTitle'><a href='"+URL+"moviecontent.html?id="+data[i].id+"'>"+data[i].name+"</a></div>";
				if(data[i].name==''){var title='';}
				
				var bofang = "<a hr";
				bofang =bofang+"ef='"+URL+"moviecontent.html?id="+data[i].id+"' class='movieListPlay'>播放</a>";
				if(data[i].id==''){var bofang='';}
				
				var direct = '<p>导演:<span>'+data[i].director+'</span></p>';
				if(data[i].director==''){var direct='';}
				
				var starring = '<p>主演:<span>'+data[i].actor+'</span></p>';
				if(data[i].actor==''){var starring='';}

				var vmtype = '<p>类型:<span>'+data[i].type_name+'</span></p>';
				if(data[i].type_name==''){var vmtype='';}
				
				var produceyear = "<p>时间:<span>"+data[i].publicdate+"</span></p>";		
				if(data[i].publicdate==''){var produceyear='';}
				
				var hits = "<p>播放:<span>"+data[i].playcount+"</span>次</p>";
				if(data[i].playcount==''){var hits='';}
		
				var str = str+"<div class='movieBlock'>"+img+"<div class='movieDetail float'>"+title+bofang+"<div class='movieDetails'>"+direct+starring+vmtype+produceyear+hits+"</div></div></div>";
	
			}
			
			$("#content").append(str);

			//if(dlength < 1){isEnd=true;}

			if(!isEnd){
				more.innerHTML="加载更多";
			}
			/*else{
				more.innerHTML="已经显示完全部内容!";
				$("#more").click(function(){
					return false;
				});  
			}*/
		}
	});
}