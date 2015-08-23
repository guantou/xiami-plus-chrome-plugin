/**************************************
* email: wangguanhappy@gmail.com
* 微博： http://weibo.com/twtter
* 虾米： http://www.xiami.com/u/2653771
* 爱虾米，爱音乐
*/

//功能：主搜索提示。 most of this code copy from xiami's web js

$('.big_search_form').submit(function() {
	if ($('#search_text').val() == '搜索您感兴趣的专辑/歌曲/艺人' || $('#search_text').val() == '') return false;
});

var result_count = 0;
var current_index = -1;
$('#search_text').bind('input propertychange', function() {
	var self = $(this);
	if (self.val()) {
		$.ajax({
			url: 'http://www.xiami.com/ajax/search-index',
			data: {'key':self.val()},
			cache: true,
			success: function(data) {
				result_count = 0;
				current_index = -1;
				if($('#xiami_plus_search').length == 0) {
					$('.search_box').append('<div id="xiami_plus_search"></div>');
				}
				$('#xiami_plus_search').html(data);
				var _trs = $('#xiami_plus_search').find('tr');
				_trs.eq(0).remove();
				_trs.last().remove();
				$('#xiami_plus_search').show();
			}
		});
	}
	else {
		$('#xiami_plus_search').hide();
	}
});

$('#search_text').keydown(function(e) {
	// esc
	if (e.keyCode==27) {
		$('#xiami_plus_search').hide();
	}

	// enter
	if (e.keyCode==13) {
		if (current_index>=0) {
			var li = $('#xiami_plus_search li.result').get(current_index);
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
		if ($('#xiami_plus_search').html().length<1) {
			return false;
		}
		result_count = $('#xiami_plus_search li.result').size();
		if (current_index>=result_count-1) {
			current_index = -1;
		}
		$('#xiami_plus_search li.result').removeClass('selected');
		$($('#xiami_plus_search li.result')[++current_index]).addClass('selected');
	}

	// up arrow
	if (e.keyCode==38) {
		if ($('#xiami_plus_search').html().length<1) {
			return false;
		}
		result_count = $('#xiami_plus_search li.result').size();
		if (current_index<=0) {
			current_index = result_count;
		}
		$('#xiami_plus_search li.result').removeClass('selected');
		$($('#xiami_plus_search li.result')[--current_index]).addClass('selected');
	}
});

$('body').click(function() {
	$('#xiami_plus_search').hide();
});
