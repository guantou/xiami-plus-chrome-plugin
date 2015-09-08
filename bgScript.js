/**************************************
* email: wangguanhappy@gmail.com
* 微博： http://weibo.com/twtter
* 虾米： http://www.xiami.com/u/2653771
* 爱虾米，爱音乐
*/
var gourls = 'http://www.xiami.com/search?key=';

chrome.storage.sync.get(default_setting_json, function(items){
	console.log(items);
	//右键菜单同时只能存在一个，否则会变二级分组。这里做减法，默认只留下一首，除非用户开启
	if(items.right_menu ==  1){
		chrome.contextMenus.create({"title": "下一首", "onclick": playNextSong});
	}else{
		chrome.contextMenus.create({"title": "下一首", "onclick": playNextSong});
		chrome.contextMenus.create({"title": "暂停/播放", "onclick": playNextSong});
		chrome.contextMenus.create({"title": "上一首", "onclick": playNextSong});
		chrome.contextMenus.create({"title": "收藏歌曲", "onclick": like});
	}

	//划词搜索仅在选了文字时才有
	chrome.contextMenus.create({"title": "虾米搜索 "+ "：“ %s ”", "contexts":["selection"], "onclick": search});
});

//“搜” 方法
function search(info, tab){
	var selecter=info["selectionText"];
	console.log("selecter " + selecter);
	chrome.tabs.create({"url": gourls+selecter});
	console.log("info: " + JSON.stringify(info));
	console.log("tab: " + JSON.stringify(tab));
}

//下一首
function playNextSong(){
	playerDo("playNextSong");
}

//上一首
function playPreSong(){
	playerDo("playPreSong");
}

//暂停播放
function playPreSong(){
	playerDo("playPreSong");
}

//收藏
function like(){
	playerDo("like");
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

function showNotice(msg){
	alert(msg);
}