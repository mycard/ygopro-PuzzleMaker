function settings(){

	var HintMsg = $('#HintMsg');
	HintMsg.empty();
	
	var _AI_name = document.getElementById("AI_name");
	_AI_name.value = AI_name;
	
	for(var i=0; i< hintMsgs.length; i++){
		addHintMsg(hintMsgs[i]);
	}
	$('#setting_dialog').dialog('open');
}
function addHintMsg(msg){
	$("#HintMsg-tmpl").tmpl({
		msg: msg
	}).appendTo($('#HintMsg'));
}function delHintMsg(ev){
	ev         = ev || window.event;
	var target = ev.target || ev.srcElement;
	var div = target.parentNode;
	div.parentNode.removeChild(div);
}
function settingOK(dialog){
	var inputs = dialog.getElementsByClassName("text ui-widget-content ui-corner-all");
	AI_name = inputs[0].value;
	hintMsgs = [];
	for(var i = 1; i < inputs.length; i++){
		hintMsgs[i-1] = inputs[i].value;
	}
}