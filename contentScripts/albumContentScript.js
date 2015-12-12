/**************************************
* email: wangguanhappy@gmail.com
* 微博： http://weibo.com/twtter
* 虾米： http://www.xiami.com/u/2653771
* 爱音乐的人不会老
*/

if($('.cd2play').length > 0){
    $(".track_list input[name=recommendids]").attr({"disabled":false, "checked":"checked"});
    $(".cd2play").html('<a onclick="playsongs(\'recommendids\');" title="使用小助手播放" href="javascript:void(0)" >使用小助手播放</a>');
}