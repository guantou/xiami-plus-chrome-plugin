/**************************************
* email: wangguanhappy@gmail.com
* 微博： http://weibo.com/twtter
* 虾米： http://www.xiami.com/u/2653771
* 爱虾米，爱音乐
*/

//功能：任意网页右键切歌、暂停、收藏
//功能：新增播放器快捷键:L - 收藏

//功能：任意网页右键切歌、暂停、收藏
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	switch(request.requestMsg){
		case "playNextSong":
			playNextSong();
		break;
		case "playPreSong":
			playPreSong();
		break;
		case "pauseOrPlay":
			pauseOrPlay();
		break;
		case "like":
			like();
		break;
	}
});

//功能：播放器快捷键
chrome.storage.sync.get(default_setting_json, function(items){
	$(document).keydown(function(e){
		var tagName = e.target.tagName.toLowerCase();
		if(tagName != "input" && tagName != "textarea" && tagName != "select"){
			var code = e.which || e.keyCode ;
			switch(code){
				case 74:
					if(items.hot_key_jk == 1){
						playNextSong();
					}
				break;
				case 75:
					if(items.hot_key_jk == 1){
						playPreSong();
					}
				break;
				//L键收藏歌曲
				case 76:
					if(items.hot_key_l == 1){
						like();
					}
				break;
			}
		}
	})
});


//下一首
function playNextSong(){
	document.getElementById("J_nextBtn").click();
}

//上一首
function playPreSong(){
	document.getElementById("J_prevBtn").click();
}

//暂停
function pauseOrPlay(){
	document.getElementById("J_playBtn").click();
}

//收藏&取消收藏
function like(){
	//if($("#J_trackFav").attr("title")=="收藏"){
		document.getElementById("J_trackFav").click();
	//}
	return false;
}