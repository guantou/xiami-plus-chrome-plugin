/**************************************
* email: wangguanhappy@gmail.com
* 微博： http://weibo.com/twtter
* 虾米： http://www.xiami.com/u/2653771
* 爱虾米，爱音乐
*/

//功能：歌曲列表显示专辑logo, 歌曲列表显示批量推送

var t = null;

chrome.storage.sync.get(default_setting_json, function(items){
	if(items.song_list_show_logo != 1) return false;
	getSongLogo();

	//处理精选集歌曲列表，歌曲大于50时的多次次加载数据
	if($("#loader").length > 0){
		$('#loader a').click(function(){
			t = setInterval("refreshCollect()", 50);
		});
	}
});

function getSongLogo(){
	var track_list = $(".track_list");//普通歌曲列表
	var collect_list = $(".quote_song_list");//精选集歌曲列表
	if(track_list.length == 0 && collect_list.length == 0 ) return false;
	
	var is_collect_page = collect_list.length > 0 ? true : false;

	var song_ids = [];
	if(!is_collect_page){
		$(".track_list input[type=checkbox]").each(function(){
			song_ids.push($(this).val());
		});
	}else{
		$(".quote_song_list input[type=checkbox]").each(function(){
			//防止歌曲大于50时，二次重复渲染
			if($(this).parent().siblings('.xp_song_logo').length == 0){
				song_ids.push($(this).val());
			}
		});
	}

	if(song_ids.length == 0) return false;

	var json_url = "http://www.xiami.com/song/playlist/id/"+song_ids.join()+"/object_name/default/object_id/0/cat/json";
	$.ajax({
		cache:true,
		type: "GET",
		url: json_url,
		dataType:"json",
		success: function(jsondata){
			if(jsondata.status!=true) return false;
			if(jsondata.data.trackList == undefined || jsondata.data.trackList.length == 0)  {
				return false;
			}
			$.each(jsondata.data.trackList, function(i, item){
				var song_id = item.song_id;
				var logo = item.pic;
				if(/_\d.[a-z]+$/.test(logo)){
					logo = logo.replace(/_\d(.[a-z]+$)/, "_3$1");
				}

				if(!is_collect_page){
					var td_obj = $(".track_list input[type=checkbox][value="+song_id+"]").parent().siblings('.song_name').eq(0)
					var td_html = td_obj.html();
					var new_html = '<div style="height: 30px;float: left; display: inline; padding-right: 5px; padding: 5px 5px 5px 0; ">'+
										'<a href="http://www.xiami.com/song/'+song_id+'" ><img src="'+logo+'" width=30 height=30 /></a>' +
									'</div>'+
									'<div>'+
										'<p style="line-height: 40px;">'+td_html+'</p>'+
									'</div>';
					td_obj.html(new_html);
				}else{
					var td_obj = $(".quote_song_list input[type=checkbox][value="+song_id+"]").parent().siblings('.song_name').eq(0)
					var new_html = '<span class="xp_song_logo" style="padding:5px 5px 5px 0;">'+
										'<a href="http://www.xiami.com/song/'+song_id+'" ><img src="'+logo+'" width=30 height=30 /></a>' +
								   '</span>';
					$(".s_info").css({"height":"40px", "line-height":"40px"});
					td_obj.before(new_html);
				}
			})

		},
		error : function(){
			return false;
		}
	});
}

function refreshCollect(){
	if($(".s_info").length > $(".xp_song_logo").length){
		getSongLogo();
		clearInterval(t);
	}
}
