/**************************************
* email: wangguanhappy@gmail.com
* 微博： http://weibo.com/twtter
* 虾米： http://www.xiami.com/u/2653771
* 爱虾米，爱音乐
*/

//功能：右键切歌
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	console.log(request);
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
	}
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

