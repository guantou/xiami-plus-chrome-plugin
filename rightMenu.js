/**************************************
* email: wangguanhappy@gmail.com
* 微博： http://weibo.com/twtter
* 虾米： http://www.xiami.com/u/2653771
* 爱虾米，爱音乐
*/

//功能：右键搜索
//功能：右键切歌

var gourls = 'http://www.xiami.com/search?key=';
var menu = chrome.contextMenus.create({"title": "下一首", "onclick": playNextSong});
var menu = chrome.contextMenus.create({"title": "暂停/播放", "onclick": playNextSong});
var menu = chrome.contextMenus.create({"title": "上一首", "onclick": playNextSong});
var menu = chrome.contextMenus.create({"title": "虾米搜索 "+ "：“ %s ”", "contexts":["selection"], "onclick": search});

//功能：右键搜索
function search(info, tab){
	var selecter=info["selectionText"];
	console.log("selecter " + selecter);
	chrome.tabs.create({"url": gourls+selecter});
	console.log("info: " + JSON.stringify(info));
	console.log("tab: " + JSON.stringify(tab));
}

//切歌：下一首
function playNextSong(){
	playerDo("playNextSong");
}

//切歌：上一首
function playPreSong(){
	playerDo("playPreSong");
}

//切歌：暂停播放
function playPreSong(){
	playerDo("playPreSong");
}

function playerDo(actionName){
	chrome.tabs.query({url:["http://www.xiami.com/play", "http://www.xiami.com/play*"]}, function(tabs){
		if(tabs.length == 0){
			if(confirm("虾米播放器没有打开嘞，是否打开(自动继续上次播放)？")){
				chrome.tabs.create({url:"http://www.xiami.com/play", active:true, pinned:false});
				return false;
			}
		}
		chrome.tabs.sendRequest(tabs[0].id, {requestMsg: actionName}, function(response) {
			console.log(response);
			showNotice(response.responseMsg)
		});
	});
}

//操作反馈
function showNotice(msg){
	alert(msg);
}