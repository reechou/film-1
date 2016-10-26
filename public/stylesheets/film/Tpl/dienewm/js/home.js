$(function(){
	$('.selectBtn').toggle(function(){
		$('.selectList').show();
	}, function(){
		$('.selectList').hide();
	});

	$('#data_list').find('img').each(function(){
		if ($(this).attr('src') == 'http://img.bbw360.cn/PIC.php?p=http://tu8.diediao.com/Uploads/vod/2015-10-09/5616a3d827926.jpg') {
			$(this).attr('src', 'http://7xqomp.com2.z0.glb.qiniucdn.com/nopic.jpg');
		}
	});
});

