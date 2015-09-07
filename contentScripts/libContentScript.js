/**************************************
* email: wangguanhappy@gmail.com
* 微博： http://weibo.com/twtter
* 虾米： http://www.xiami.com/u/2653771
* 爱音乐的人不会老
*/

//功能：我的音乐库，增加搜索功能。 most of this code copy from xiami's web js
chrome.storage.sync.get(default_setting_json, function(items){
	if(items.lib_search != 1) return false;

	//仅限自己的音乐库
	if($(".infos a").html()=='回我的主页') {
		//移除自带的搜索，体验不好（刷新，文案，不自动提示）
		$(".c265_side_seek").remove();
		$(".side_Xalert").remove();

		//替换为高级搜索框
		$(".c265_side").prepend('<div class="c265_side_seek pad20 blank30">'+
							'<h3 class="Ptitle">收藏内搜索</h3>'+
							'<div class="pool10">'+
								'<div class="xiami_plus_search_div">'+
									'<form action="/search" id="xiami_plus_search_form" autocomplete="off" >'+
									'<input type="text" class="f_txt grey" name="key" id="xiami_plus_search_key" value="" placeholder="歌曲名,专辑名,艺人名,风格" autocomplete="off" >'+
									'<input type="submit" class="bt_sub2" value="搜 索">'+
									'</form>'+
								'</div>'+
							'</div>'+
							'<div class="seek_keys blank20"></div>'+
						'</div>');

		$('#xiami_plus_search_form').submit(function() {
			if ($('#xiami_plus_search_key').val() == '歌曲名,专辑名,艺人名,风格' || $('#xiami_plus_search_key').val() == '') return false;
			window.location = 'http://www.xiami.com/search?key=我收藏的 '+ $('#xiami_plus_search_key').val();
			return false;
		});

		var result_count = 0;
		var current_index = -1;
		var search_key = '';
		$('#xiami_plus_search_key').bind('input propertychange', function() {
			var self = $(this);
			if (self.val()) {
				search_key = self.val();
				$.ajax({
					url: 'http://www.xiami.com/search',
					data: {'key':'我收藏的 '+self.val()},
					cache: true,
					success: function(resp) {
						result_count = 0;
						current_index = -1;
						if($('#xiami_plus_search_autocomplate').length == 0) {
							$('.xiami_plus_search_div').append('<div id="xiami_plus_search_autocomplate"></div>');
						}

						//从搜索页面html提取为需要的列表
						var list_html = '<table cellspacing="0" cellpadding="0" border="0"><tbody>';
						var path = window.location.pathname;
						var type = /lib\-([^\?\/]*).*/.exec(path)[1];
						switch(type){
							case "song":
								list_html += matchSongList(resp);
							break;
							case "album":
								list_html += matchAlbumList(resp);
							break;
							case "artist":
								list_html += matchArtistList(resp);
							break;
						}
						list_html += '<tr><td><ul><li class="result"><a class="top_more" href="http://www.xiami.com/search?key=我收藏的 '+search_key+'" >更多收藏结果</a></li></ul></td></tr>';
						list_html += '</tbody></table>';
						$('#xiami_plus_search_autocomplate').html(list_html);
						var _trs = $('#xiami_plus_search_autocomplate').find('tr');
						$('#xiami_plus_search_autocomplate').show();
					}
				});
			} else {
				$('#xiami_plus_search_autocomplate').hide();
			}
		});

		$('#xiami_plus_search_key').keydown(function(e) {
			// esc
			if (e.keyCode==27) {
				$('#xiami_plus_search_autocomplate').hide();
			}

			// enter
			if (e.keyCode==13) {
				if (current_index>=0) {
					var li = $('#xiami_plus_search_autocomplate li.result').get(current_index);
					var href = $(li).find('a').attr('href');
					window.location = href;
					return false;
				}
				else {
					return true;
				}
			}

			// down arrow
			if (e.keyCode==40) {
				if ($('#xiami_plus_search_autocomplate').html().length<1) {
					return false;
				}
				result_count = $('#xiami_plus_search_autocomplate li.result').size();
				if (current_index>=result_count-1) {
					current_index = -1;
				}
				$('#xiami_plus_search_autocomplate li.result').removeClass('selected');
				$($('#xiami_plus_search_autocomplate li.result')[++current_index]).addClass('selected');
			}

			// up arrow
			if (e.keyCode==38) {
				if ($('#xiami_plus_search_autocomplate').html().length<1) {
					return false;
				}
				result_count = $('#xiami_plus_search_autocomplate li.result').size();
				if (current_index<=0) {
					current_index = result_count;
				}
				$('#xiami_plus_search_autocomplate li.result').removeClass('selected');
				$($('#xiami_plus_search_autocomplate li.result')[--current_index]).addClass('selected');
			}
		});

		$('body').click(function() {
			$('#xiami_plus_search_autocomplate').hide();
		});

		//下次点击输入框，自动显示上次提示
		$('#xiami_plus_search_key').click(function(){
			if(search_key && $(this).val() == search_key){
				$('#xiami_plus_search_autocomplate').show();
			}
			event.stopPropagation();
			return false;
		})
		
	}
});

//从搜索页面提取歌曲列表
function matchSongList(html){
	var list_html = '';
	var songs = html.match(/<tr class=\"[\s\S]*?<div class=\"song_do\"/gm);
	for (var i = 0; i < songs.length; i++) {
		var _html = songs[i];
		var song_info = /class=\"song_name\">[\s\S]*?<a target=\"_blank\" href=\"(.*?)\" title=\"(.*?)\">?/.exec(_html);
		if(!song_info) continue;
		var song_href = song_info[1];
		var song_name = song_info[2];
		var artist_name = /<td class=\"song_artist\">[\s\S]*?<a target=\"_blank\" href=\".*?\" title=\".*?\">[\n\s]+?(.*?)<\/a>/.exec(_html)[1];
		artist_name = artist_name.replace(/<b class=\"key_red\">(.*?)<\/b>/g, "$1");
		list_html += '<li class="result"><a href="'+song_href+'" class="song_result" >'+song_name+' - <span>'+artist_name+'</span></a></li>';
	}
	return '<tr><td><ul>'+list_html+'</ul></td></tr>';
}

//从搜索页面提取专辑列表
function matchAlbumList(html){
	var list_html = '';
	var albums = html.match(/<div class=\"album_item100_block\">[\s\S]*?<p class=\"album_rank clearfix\">/gm);
	for (var i = 0; i < albums.length; i++) {
		var _html = albums[i];
		var album_info = /<a class=\"song\" href=\"(.*?)\" title=\"(.*?)\"/.exec(_html);
		if(!album_info) continue;
		var album_href = album_info[1];
		var album_title = album_info[2];
		var album_logo = /<img src=\"(.*?)\"/.exec(_html)[1];
		var artist_name = /<a class=\"singer\".*?>(.*?)<\/a>/.exec(_html)[1];
		artist_name = artist_name.replace(/<b class=\"key_red\">(.*?)<\/b>/g, "$1");
		list_html +=   '<li class="result">'+
							'<a href="'+album_href+'" class="album_result" >'+
								'<span class="albumCover coverSmall">'+
									'<div class="img">'+
									'<img width="28" height="28" src="'+album_logo+'">'+
									'</div>'+
									'<span class="jewelcase"></span> '+
								'</span>'+ 
								'<strong>'+album_title+'</strong><br>'+artist_name+
							'</a>'+
						'</li>';
	}
	return '<tr><td><ul>'+list_html+'</ul></td></tr>';
}

function matchArtistList(html){
	var list_html = '';
	var artists = html.match(/<div class=\"artist_item100_block\">[\s\S]*?<b class=\"ico_radio/gm);
	window.artists = artists;
	for (var i = 0; i < artists.length; i++) {
		var _html = artists[i];

		var artist_href = /class=\"artist100\" href=\"(.*?)\"/.exec(_html)[1];
		if(!artist_href) continue;
		var artist_logo = /<img\s+src=\"(.*?)\"/.exec(_html)[1];
		var artist_name = /<strong>([\s\S]*?)<\/strong>/.exec(_html)[1];
		artist_name = artist_name.replace(/<b class=\"key_red\">(.*?)<\/b>/g, "$1");
		list_html +=   '<li class="result">'+
							'<a href="'+artist_href+'" class="artist_result">'+
								'<div class="img">'+
									'<span><img width="30" height="30" src="'+artist_logo+'"> </span>'+
								'</div>'+
								'<strong class="artist">'+artist_name+'</strong> '+
							'</a>'+ 
						'</li>';
	}
	return '<tr><td><ul>'+list_html+'</ul></td></tr>';
}