/**************************************
* email: wangguanhappy@gmail.com
* 微博： http://weibo.com/twtter
* 虾米： http://www.xiami.com/u/2653771
* 爱虾米，爱音乐
*/

//功能：我的音乐库，增加搜索功能。 most of this code copy from xiami's web js

//移除自带的搜索，体验不好（刷新，文案，不自动提示）
//替换为高级搜索框
search_html = '<div class="xiami_plus_search_div">'+
					'<form action="/search" id="xiami_plus_search_form" autocomplete="off" >'+
					'<input type="text" class="f_txt grey" name="key" id="xiami_plus_search_key" value="" placeholder="歌曲名,专辑名,艺人名,风格" autocomplete="off" >'+
					'<input type="submit" class="bt_sub2" value="搜 索">'+
					'</form>'+
				'</div>';
$(".pool10").html(search_html);

$('#xiami_plus_search_form').submit(function() {
	if ($('#xiami_plus_search_key').val() == '歌曲名,专辑名,艺人名,风格' || $('#search_text').val() == '') return false;
});

var result_count = 0;
var current_index = -1;
$('#xiami_plus_search_key').bind('input propertychange', function() {
	var self = $(this);
	if (self.val()) {
		$.ajax({
			url: 'http://www.xiami.com/ajax/search-index',
			data: {'key':'我收藏的 '+self.val()},
			cache: false,
			success: function(data) {
				result_count = 0;
				current_index = -1;
				if($('#xiami_plus_search_autocomplate').length == 0) {
					$('.xiami_plus_search_div').append('<div id="xiami_plus_search_autocomplate"></div>');
				}
				$('#xiami_plus_search_autocomplate').html(data);
				var _trs = $('#xiami_plus_search_autocomplate').find('tr');
				_trs.eq(0).remove();
				_trs.last().remove();
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
