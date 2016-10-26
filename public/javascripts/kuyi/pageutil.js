$(document).ready(function() {
	corver_movie_size();
	$("#btncancle").bind('click', function() {
		$("#search-box").removeClass("m-search-fixed").addClass("hide");
	});
	$(".search").on('click', function() {
		$("#search-box").removeClass("hide").addClass("m-search-fixed");
	});
	$("#txtsearch").on('input', function() {
		$("#clear").css("display", "block");
		$("#btnsearch").css("display", "block");
		$("#btncancle").css("display", "none");
        searchMovies($(this).val());
	}).on('focus',function(){
		$(this).css("opacity","1.0");
	}).on('blur',function(){
		$(this).css("opacity","0.5");
	});
	$("#clear").on('click', function() {
		$("#txtsearch").val('');
		$("#btnsearch").css("display", "none");
		$("#btncancle").css("display", "block");
		$(this).css("display", "none");
		searchMovies("");
	});
	$("#btnsearch").on('click', function() {
		window.location.href = "moviesearch.html?key="+$("#txtsearch").val();
	});
	$(".list-suggest li").each(function(){
		$(this).on('click',function(){
	      var url =  $(this).children('a').prop('href');
	      window.location.href = url;
		});
	});
});
$(window).resize(function() {
	corver_movie_size();
});

function searchMovies(key){
			$.ajax({
			type:"get",
			url: "/kuyi/search",
			data:{key:key},
			success:function(data){
				var html = '';
				$.each(data,function(index,item){
					html +='<li>'+
						'<a href="/kuyi/detail?id='+item.id+'">'+item.name+'</a>'+
					'</li>';
				});
				if(data==""){
					html+='<div class="mod-unResult"><p>抱歉，没有找到"'+key+'"的相关视频。</p>'+
                           '<p>小猴子建议您：缩短关键词  或  更换关键词。</p></div>';
				}
				$(".list-suggest").html(html);
		  $(".list-suggest li").each(function(){
		  $(this).on('click',function(){
	      var url =  $(this).children('a').prop('href');
	      window.location.href = url;
		});
	});
			}
		});
}

function corver_movie_size() {
	//设置影片随宽度变化的比例高度
	var corver_movie = $(".flex_video_thumb");
	var corver_movie_width = corver_movie.width();
	var corver_movie_height = corver_movie.height(corver_movie_width * 1.3);

	var movie_scroll = $(".imgSlideMain");
	var movie_scroll_width = movie_scroll.width();
	var movie_scroll_height = movie_scroll.height(movie_scroll_width * 0.4);
	var movie_scroll_li = $("#imgSlide li");
	movie_scroll_li.height(movie_scroll_width * 0.4);
}