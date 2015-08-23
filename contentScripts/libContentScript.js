/**************************************
* email: wangguanhappy@gmail.com
* 微博： http://weibo.com/twtter
* 虾米： http://www.xiami.com/u/2653771
* 爱虾米，爱音乐
*/

//功能：我的音乐库，增加搜索功能。 most of this code copy from xiami's web js

//移除自带的搜索，体验不好（刷新，文案，不自动提示）
//替换为高级搜索框
$(".c265_side_seek").remove();
$(".side_Xalert").remove();
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
	if ($('#xiami_plus_search_key').val() == '歌曲名,专辑名,艺人名,风格' || $('#search_text').val() == '') return false;
});

var result_count = 0;
var current_index = -1;
$('#xiami_plus_search_key').bind('input propertychange', function() {
	var self = $(this);
	if (self.val()) {
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
				list_html = '<table cellspacing="0" cellpadding="0" border="0"><tbody>';

				var song_list = matchSongList(resp);
				list_html += song_list;
				list_html+= '</tbody></table>';

				$('#xiami_plus_search_autocomplate').html(list_html);
				var _trs = $('#xiami_plus_search_autocomplate').find('tr');
				$('#xiami_plus_search_autocomplate').show();
			}
		});
	}
	else {
		$('#xiami_plus_search_autocomplate').hide();
	}
});

$('#xiami_plus_search_autocomplate_key').keydown(function(e) {
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
		list_html += '<li class="result"><a href="'+song_href+'" title="'+song_name+'" class="song_result" >'+song_name+' - <span>'+artist_name+'</span></a></li>';
	}
	return '<tr><th><h3 class="song">歌曲</h3></th><td><ul>'+list_html+'</ul></td></tr>';
}

function matchAlbumList(html){
	
}

function matchArtistList(html){

}