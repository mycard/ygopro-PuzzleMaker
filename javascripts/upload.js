
var patterns = [];
patterns[1] = new RegExp("\\s*Debug\\.SetAIName\\(\\s*\".*\"\\s*\\).*");
patterns[2] = new RegExp("\\s*Debug\\.ReloadFieldBegin\\(.*\\).*");
patterns[3] = new RegExp("\\s*Debug\\.SetPlayerInfo\\(\\s*[01]\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*\\).*");
patterns[4] = new RegExp("\\s*(\\w+\\s*=\\s*)?Debug\\.AddCard\\(\\s*\\d+\\s*,\\s*[01]\\s*,\\s*[01]\\s*,\\s*\\w+\\s*,\\s*\\d\\s*,\\s*\\w+(\\s*,\\s*\\w+)?\\s*\\).*");
patterns[5] = new RegExp("\\s*Debug\\.ReloadFieldEnd\\(\\s*\\).*");
patterns[6] = new RegExp("\\s*Debug\\.ShowHint\\(\\s*\".*\"\\s*\\).*");
patterns[7] = new RegExp("\\s*aux\\.BeginPuzzle\\(\\s*\\).*");
patterns[8] = new RegExp("\\s*--.*");


upload = function(files) {
	//清空之前的残局
	hintMsgs = [];
	var fields = GetAllFields();
	for(var i in fields){
		$(fields[i]).empty();
		var card_list = $.data(fields[i], 'card_list');
		card_list = [];
		$.data(fields[i], 'card_list', card_list);
	}
	if(isIE){
		//var file = document.getElementById("upload").value;
		var file_upl = document.getElementById('upload');
		file_upl.select();
		var file = document.selection.createRange().text;
		if(typeof window.ActiveXObject != 'undefined') {
			var content = "";
			try {
				var fso = new ActiveXObject("Scripting.FileSystemObject");  
				var reader = fso.openTextFile(file, 1);
				while(!reader.AtEndofStream) {
					content += reader.readline();
					content += "\n";
				} 
				reader.close();
			}
			catch (e) { 
				alert("Internet Explore read local file error: \n" + e); 
			}
		
			readPuzzle(content);
			return ;
		}
	}
	if (files.length) {
		var file = files[0]; 
		filename = file.name.slice(0,-4);
		$('#header').children('h1').text(filename);
		var reader = new FileReader(); 
		reader.onload = function() {
			readPuzzle(this.result)
		} 
		reader.readAsText(file); 
	} 
};
function readPuzzle(result){
	var results = result.split('\n'); 
	var cards = [];
	var cards_id = [];
	var non_puzzle = true;
	var use_simple_ai = false;
	var psudo_shuffle = false;
	for(var i =0; i < results.length; i++){
		var tempString = results[i];
		var type = getRegType(tempString);
	//	alert(tempString + '\n' + "type: " + type);
		switch(type){
		case 1://SetAIName
			AI_name = tempString.split("\"")[1];
			break;
		case 2://ReloadFieldBegin(DUEL_ATTACK_FIRST_TURN+DUEL_SIMPLE_AI)
			use_simple_ai = tempString.indexOf("DUEL_SIMPLE_AI") >= 0;
			psudo_shuffle = tempString.indexOf("DUEL_PSEUDO_SHUFFLE") >= 0;
			break;
		case 3://SetPlayerInfo(0,8000,0,0)
			var params = getFuncParams(tempString);
			var player = parseInt(params[0]);
			var lp = parseInt(params[1]);
			var firstTurnDraw = parseInt(params[2]);
			var everyTurnDraw = parseInt(params[3]);
			SetPlayerInfo(player, lp, firstTurnDraw, everyTurnDraw);
			break;
		case 4://AddCard(2561846,1,1,LOCATION_EXTRA,0,POS_FACEUP_ATTACK)
			var params = getFuncParams(tempString);
			var card_id = parseInt(params[0]);
			var owner = parseInt(params[1]);
			var controler = parseInt(params[2]);
			var location = params[3];
			var place = parseInt(params[4]);
			var position = params[5];
			var disable_revivelimit = (params[6] == "true") ? true : false;
			if(location == "LOCATION_DECK"||location =="LOCATION_GRAVE"||location =="LOCATION_REMOVED"
				||location =="LOCATION_EXTRA"||location =="LOCATION_HAND"){
				place = 0;
			}
			if(location == "LOCATION_SZONE" && place == 5){
				location = "LOCATION_FIELD";
				place = 0;
			}
			if(location == "LOCATION_SZONE" && place == 7){
				location = "LOCATION_PZONE_L";
				place = 0;
			}
			if(location == "LOCATION_SZONE" && place == 6){
				location = "LOCATION_PZONE_R";
				place = 0;
			}
			
			if(position == "POS_FACEDOWN"){
				position = "POS_FACEDOWN_ATTACK";
			}
			if(position == "POS_FACEUP"){
				position = "POS_FACEUP_ATTACK";
			}
			cards.push({"card_id":card_id, "owner":owner, "controler":controler, "location":location, "place":place, "position":position, "disable_revivelimit":disable_revivelimit});
			cards_id.push(card_id);
			break;
		case 5://ReloadFieldEnd
			
			break;
		case 6://ShowHint
			var strings = tempString.split("\"");
			hintMsgs.push(strings[1]);
			break;
		case 7://BeginPuzzle
			non_puzzle = false;
			break;
		case 8:
			break;
		}
	}
	document.getElementById("check_shuffle").checked = psudo_shuffle;
	document.getElementById("use_simple_ai").checked = use_simple_ai;
	document.getElementById("non_puzzle").checked = non_puzzle;
	loadCards(cards_id,cards);
}
function getRegType(String){
	for(var i = 1; i < patterns.length; i++){
		if(String.match(patterns[i]))
			return i;
	}
	return -1;
}
function getFuncParams(str){
	var params = str.split(/\(\s*/);
	params = params[1].split(/\s*\)/);
	params = params[0].split(/\s*,\s*/);
	return params;
}
function SetPlayerInfo(player, lp, firstTurnDraw, everyTurnDraw){
	if(player == 0){
		document.getElementById("Player_LP").value = lp;
	//	PlayerFirstTurnDraw = firstTurnDraw;
	//	PlayerEveryTurnDraw = everyTurnDraw;
	}
	else if(player == 1){
		document.getElementById("AI_LP").value = lp;
	//	AIFirstTurnDraw = firstTurnDraw;
	//	AIEveryTurnDraw = everyTurnDraw;
	}
}

function loadCards(cards_id,cards){
	var locale_url = "http://my-card.in/cards_" + locale;
	var url = locale_url + '?q=' + JSON.stringify({_id: {$in: cards_id}});
    $.getJSON(url,function(result){
		$.getJSON(cards_url + "?q=" + (JSON.stringify({_id: {$in: cards_id}})), function(_cards) {
			for(var i in _cards){
				datas[card._id]=getcarddata(result,_cards[i]);
			}
			for(var i in cards){
				loadCard(cards[i]);
			}
		});
	});
}
function loadCard(card){
	var card_info = new Object();
	var data = datas[card.card_id];
	card_info.card_id = card.card_id;
	card_info.name = data.name
	card_info.position = card.position;
	card_info.disable_revivelimit = card.disable_revivelimit;
	card_info.cn = getCardName();
	card_info.equip_target = [];
	card_info.be_equip_target = [];
	card_info.continuous_target = [];
	card_info.be_continuous_target = [];
	card_info.card_counters = [];
	var location = card.location.toLowerCase();
	var field_id = card.owner + "_" + location + "_" + card.place;
	var field = document.getElementById(field_id);
	addNewCard(field,card_info);
}
function addNewCard(field, card_info){
	var tmplItem = $(field).tmplItem().data;
	var location = tmplItem.location;
	var card_list = $.data(field, 'card_list');
	if(location == "location_szone" || location == "location_field"){ //魔陷区和场地区最多只能有1张卡
		card_list = [];
	}
	if(location == "location_mzone"){
		card_list.unshift(card_info);
	}
	else{
		card_list.push(card_info);
	}
	$.data(field, 'card_list', card_list);
	updateField(field);
}