/**************************************
* email: wangguanhappy@gmail.com
* 微博： http://weibo.com/twtter
* 虾米： http://www.xiami.com/u/2653771
* 爱音乐的人不会老
*/

//功能：歌曲列表显示专辑logo
//功能：歌曲列表显示批量推送

var t = null;

chrome.storage.sync.get(default_setting_json, function(items){
	if(items.song_list_show_logo != 1) return false;

	getSongLogo();
	multiSendToApp();
	
});

//各种歌曲列表显示歌曲的专辑logo
function getSongLogo(){
	//专辑详情页不用显示歌曲列表封面
	if(/\/album\/\d+/.test(window.location.href)) return false;

	//处理精选集歌曲列表，歌曲大于50时的多次次加载数据
	if($("#loader").length > 0){
		$('#loader a').click(function(){
			t = setInterval("refreshCollect()", 50);
		});
	}


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
					var td_objs = $(".track_list input[type=checkbox][value="+song_id+"]").parent().siblings('.song_name')
					var td_obj = td_objs.eq(0);
					var td_html = td_obj.html();
					var has_show_zhcn = td_obj.find('.show_zhcn').length > 0;
					var new_html = '<div style="height: 30px;float: left; display: inline; padding-right: 5px; padding: 5px 5px 5px 0; ">'+
										'<a href="http://www.xiami.com/song/'+song_id+'" ><img src="'+logo+'" width=30 height=30 /></a>' +
									'</div>'+
									'<p style="'+ (has_show_zhcn ? '' : 'line-height: 40px;height: 40px;') +'">'+td_html+'</p>'
					td_objs.html(new_html);
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

function multiSendToApp(){
	//查找歌曲列表
	var track_list = $(".track_list");//普通歌曲列表
	var collect_list = $(".quote_song_list");//精选集歌曲列表
	if(track_list.length == 0 && collect_list.length == 0 ) return false;
	var is_collect_page = collect_list.length > 0 ? true : false;
	var list_obj = is_collect_page ? collect_list : track_list;

	var track_list_btn = '<a class="bt_choose" style="margin-left: 10px;" href="javascript:void(0);" title="批量发送" id="xm_plus_multi_send" ><span>批量发送</span></a>';
	var collect_list_btn = '<a class="bt_play" href="javascript:void(0);" title="批量发送" id="xm_plus_multi_send" ><span>批量发送</span></a>';

	//增加批量推送按钮
	$(".ctrl_gears").after(track_list_btn);

	$("#xm_plus_multi_send").click(function(){
		var checked_song_objs = list_obj.find("input[type=checkbox]:checked");
		if(checked_song_objs.length == 0) alert('请先没选择歌曲');
		var song_ids = [];
		checked_song_objs.each(function(){
			song_ids.push($(this).val());
		});

		//触发第一首选择歌曲的“发送到”选项弹层，为后面的铺路
		document.getElementById("track_"+song_ids[0]).getElementsByClassName("song_tel")[0].click();

		//获取选项，发送
	});
}