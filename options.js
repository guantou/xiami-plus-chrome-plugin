//默认设置项的值
var default_setting_json = {
	right_menu:1,
	hot_key_l:1,
	hot_key_jk:1,
	search_autocomplete:1,
	lib_search:1,
	song_list_show_logo:1,
	multi_send_to_app:1
};

//保存设置
function saveOptions(){
	var setting_json_item = $("#setting_form").serializeArray();
	var setting_json = {};
	$.each(setting_json_item, function(i, field){
		setting_json[field.name] = parseInt(field.value);
	});

	$.each(default_setting_json, function(key, val){
		if(setting_json[key] == undefined){
			setting_json[key] = 0;
		}
	});

	chrome.storage.sync.set(setting_json, function(){});
	chrome.runtime.reload();
	$("#status").html("保存成功！需要刷新虾米的页面才能生效哦~");
	setTimeout(function() {
		$("#status").html("")
	    window.close();
    }, 1500);
	  
}

//载入设置项的值
function loadOptions(){
	chrome.storage.sync.get(default_setting_json, function(items){
		$.each(default_setting_json, function(key, val){
			var obj = $("input[name="+key+"][value="+items[key]+"]");
			obj.attr("checked", true);
		});
	})
}

$(document).ready(function(){
	loadOptions();
	
	$("#save").click(function(){
		saveOptions();
	})

})