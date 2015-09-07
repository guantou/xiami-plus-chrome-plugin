var default_setting_json = {
	right_menu:1,
	hot_key_l:1,
	hot_key_jk:1,
	search_autocomplete:1,
	lib_search:1,
	song_list_show_logo:1,
	multi_send_to_app:1
};

function saveOptions(){
	var setting_json = $("#setting_form").serializeArray();
	chrome.storage.sync.set(setting_json);
}

function loadOptions(){
	chrome.storage.sync.get(default_setting_json, function(items){
		console.log(items);
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