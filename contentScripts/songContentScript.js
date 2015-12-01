/**************************************
* email: wangguanhappy@gmail.com
* 微博： http://weibo.com/twtter
* 虾米： http://www.xiami.com/u/2653771
* 爱音乐的人不会老
*/

if($('.unpublished').length > 0){
    var song_id = /^http:\/\/www\.xiami\.com\/song\/(\d+)/.exec(window.location.href)[1];

    var html = '<div class="song_info   ">\
                    <div class="player">\
                        <div class="cd2play">\
                    <a onclick="play(\''+song_id+'\');" href="javascript:void(0);" >虾米小助手尝试播放</a>\
                </div>\
                    </div>\
                </div>';
    $('.unpublished').before(html);
}