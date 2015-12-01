/**************************************
* email: wangguanhappy@gmail.com
* 微博： http://weibo.com/twtter
* 虾米： http://www.xiami.com/u/2653771
* 爱音乐的人不会老
*/
var gourls = 'http://www.xiami.com/search?key=';

chrome.storage.sync.get(default_setting_json, function(items){
	//右键菜单同时只能存在一个，否则会变二级分组。这里做减法，默认只留下一首，除非用户开启
	if(items.right_menu ==  1){
		chrome.contextMenus.create({"title": "下一首", "onclick": playNextSong});
	}else{
		chrome.contextMenus.create({"title": "下一首", "onclick": playNextSong});
		chrome.contextMenus.create({"title": "暂停/播放", "onclick": pauseOrPlay});
		chrome.contextMenus.create({"title": "上一首", "onclick": playPreSong});
		chrome.contextMenus.create({"title": "收藏歌曲", "onclick": like});
	}

	//划词搜索仅在选了文字时才有
	chrome.contextMenus.create({"title": "虾米搜索 "+ "：“ %s ”", "contexts":["selection"], "onclick": search});
});

//“搜” 方法
function search(info, tab){
	var selecter=info["selectionText"];
	chrome.tabs.create({"url": gourls+selecter});
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
function pauseOrPlay(){
	playerDo("pauseOrPlay");
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
		});
	});
}


//是否来自虾米播放器
function isFromXiamiPlayer(url){
    return /^http:\/\/www\.xiami\.com\/play/.test(url);
}

//替换虾米的播放器js，调用做过修改的js
//thanks xiamini https://chrome.google.com/webstore/detail/xiamini-%E8%99%BE%E7%B1%B3%E4%BD%A0/kojgbciegmddffhelhohhmgbkelfpojg?spm=0.0.0.0.Hjtuyi&hl=zh-CN
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        return {redirectUrl: chrome.extension.getURL('execScripts/XiamiGlobalAndInit.js')};
    },
    {
        urls: [
            "http://g.tbcdn.cn/de/*/??common/global-min.js,pages/index/page/init-min.js"
        ],
        types: ["script"]
    },
    ["blocking"]
);

//下架歌曲-站外匹配，伪造请求头信息
chrome.webRequest.onBeforeSendHeaders.addListener(function (detail) {
        var newHeaders = [];
        var isXiamiPlayerRefer = true;
        for (var i = 0; i < detail.requestHeaders.length; ++i) {
            if (detail.requestHeaders[i].name === 'Referer') {
                if(!isFromXiamiPlayer(detail.requestHeaders[i].value)){
                    isXiamiPlayerRefer = false;
                    break;
                }

                detail.requestHeaders[i].value = 'http://ting.weibo.com';
            }
            if (detail.requestHeaders[i].name === 'Cookie') {
                detail.requestHeaders[i].value = '';
            }

            if (detail.requestHeaders[i].name === 'X-Requested-With') {
                detail.requestHeaders[i].value = ''
            }
            newHeaders.push(detail.requestHeaders[i]);
        }

        if(!isXiamiPlayerRefer){
            return {
                requestHeaders : detail.requestHeaders
            };
        }
        return {
            requestHeaders : newHeaders
        };
    },
    {
        urls: ["*://ting.weibo.com/*", "*://*.music.126.net/*"]
    },
    ["blocking", "requestHeaders"]
);